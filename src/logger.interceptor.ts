import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Req } from "./user";
import { Omit, Record } from "@prisma/client/runtime/library";
import { Info, InfoTwo } from "@prisma/client"
import { PrismaService } from "./prisma";
export { Req };
import * as info from "./logger/info";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly prisma: PrismaService) { }

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

		const req: Req = context.switchToHttp().getRequest();
		const userId = req.headers["authorization"];
		const requrl = makeReqUrl(req.url, req.method);
		if (requrl === undefined) {
			return next.handle();
		}

		const [before_commit, after_commit] = delegateUrls[requrl];
		const ctx = await before_commit({ req, url: requrl, userId }, this.prisma);
		async function after() {
			const rsp: Response = context.switchToHttp().getResponse();
			await after_commit({ ...ctx, rsp }, this.prisma);
		}
		return next.handle().pipe(tap({ next: after.bind(this) }));
	}
}

function makeReqUrl(url: string, method: string): RequestUrl | undefined {
	const parts = (method + url).split("/");
	const compatibleRoutes = loggedSplitReqs.filter((rqs) =>
		rqs.parts.filter((part, i) =>
			parts[i] === part
		).length === rqs.parts.length
	);

	// either one or zero routes found
	if (compatibleRoutes.length <= 1) {
		return compatibleRoutes[0]?.joint;
	}

	const sorted = compatibleRoutes.sort((a, b) => {
		return a.paramCount - b.paramCount
	})
	return sorted[0].joint;
}

export const loggedRequestUrls = [
	"POST/user"
	, "POST/info"
	, "POST/infotwo"
	, "PUT/info/:id"
	, "PUT/infotwo"
	, "DELETE/info"
	, "DELETE/infotwo"
] as const;

const loggedSplitReqs = loggedRequestUrls.map(joint => {
	const parts = joint.split("/");
	const paramCount = parts.reduce((a, b) => a + (+b.startsWith(':')), 0);
	return {parts, paramCount, joint};
});

export type RequestUrl = typeof loggedRequestUrls[number];

const delegateUrls: Record<RequestUrl, [CommitFuncBefore<RequestUrl>, CommitFuncAfter<RequestUrl>]> = {
	"POST/user": [commit_before, post_user_commit],

	"POST/info": [commit_before, commit_after],
	"PUT/info/:id": [info.put.before, info.put.after],
	"DELETE/info": [commit_before, commit_after],

	"POST/infotwo": [commit_before, commit_after],
	"PUT/infotwo": [commit_before, commit_after],
	"DELETE/infotwo": [commit_before, commit_after],
}

// initiate commit
type CommitFuncBefore<URL extends RequestUrl> = (ctx: BeforeCommit<URL>, prisma: PrismaService) => Promise<DuringCommit<URL>>;
// finalize commit
type CommitFuncAfter<URL extends RequestUrl> = (ctx: FinishCommit<URL>, prisma: PrismaService) => Promise<void>;

export type BeforeCommit<URL extends RequestUrl> = {
	req: Req,
	url: URL,
	userId: string | undefined,
};

export type DuringCommit<URL extends RequestUrl, TableInfo = TableInfoFromURL<URL>> = BeforeCommit<URL> & {
	commitId: number,
	commitInfo: TableInfo,
}

export type FinishCommit<URL extends RequestUrl> = DuringCommit<URL> & { rsp: Response };

type TableInfoFromURL<URL extends RequestUrl> = {
	[info.put.commitURL]: info.put.commitInfo,
	"POST/user": null,
	"POST/info": null,
	"POST/infotwo": null,
	"PUT/infotwo": InfoTwo,
	"DELETE/info": Info,
	"DELETE/infotwo": InfoTwo,
}[URL];

async function commit_before(ctx: BeforeCommit<"POST/user" | "POST/info" | "POST/infotwo">): Promise<DuringCommit<"POST/user" | "POST/info" | "POST/infotwo">> {
	console.log("before", ctx.url);
	return { ...ctx, commitId: 0, commitInfo: null }
}

async function commit_after(ctx: FinishCommit<Omit<RequestUrl, "POST/user">>): Promise<void> {
	console.log("after", ctx.url);
}

async function post_user_commit(ctx: FinishCommit<"POST/user">, _prisma: PrismaService): Promise<void> {
	console.log(ctx.userId)
}
