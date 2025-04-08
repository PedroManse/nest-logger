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
		if (requrl === null) {
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

function makeReqUrl(url: string, method: string): RequestUrl | null {
	const joint = (method + url).split("/");
	// get compatible URLs based on path part and URL param (':' prefix)
	const comp = loggedSplitReqs.map((rq, idx) => {
		if (rq.filter((p, i) => {
			return joint[i] === p || p.startsWith(":")
		}).length === rq.length) {
			return loggedRequestUrls[idx]
		}
		return null
	}).filter(a => a !== null);

	if (comp.length === 1) {
		return comp[0];
	} else if (comp.length === 0) {
		return null;
	}

	// comp[idx]'s param Count = paramCount[idx] 
	const paramCount: number[] = comp.map(r => r.split("/").reduce((a, b) => a + (+b.startsWith(':')), 0))

	// sort compatible URLs by param count
	const sorted = comp.map((route, idx) => ({ route, idx })).sort((a, b) => {
		return paramCount[a.idx] - paramCount[b.idx]
	})
	return sorted[0].route;
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
const loggedSplitReqs = loggedRequestUrls.map(rq => rq.split("/"));
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
