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
import { throws } from "assert";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req: Req = context.switchToHttp().getRequest();
		const requrl = makeReqUrl(req.url, req.method);
		console.log(requrl);
		const _: Response = context.switchToHttp().getResponse();
		console.log("Before req");
		console.log(`By: ${req.user}`);
		const now = Date.now();
		function after() {
			console.log(`After req | executed in ${Date.now() - now}`);
		}

		return next.handle().pipe(tap({ next: after }));
	}
}

function makeReqUrl(url: string, method: string): RequestUrl {
	const joint = `${method}${url}`;
	if (requestUrls.includes(joint as RequestUrl)) {
		return joint as RequestUrl;
	} else {
		throw new Error(`${method} on ${url} not logged`)
	}
}

const requestUrls =[
	"POST/user"
	, "POST/info"
	, "POST/infotwo"
	, "PUT/info"
	, "PUT/infotwo"
	, "DELETE/info"
	, "DELETE/infotwo"
] as const;

export type RequestUrl = typeof requestUrls[number];

type CommitRequest<URL extends RequestUrl> = Omit<CommitContext<URL>, "commitId">;

type CommitContext<URL extends RequestUrl> = {
	url: URL,
	commitId: number;
	table: string;
	user: string; // uuid
	tableInfo: TableInfoFromURL<URL>
};

type TableInfoFromURL<URL extends RequestUrl> = URL extends "POST:user" ?
	{a: number} :
	{b: string}

async function genCommit<URL extends RequestUrl, TableInfo=TableInfoFromURL<URL>>(req: CommitRequest<URL>) {
	console.log(req);
	const commitId = 0;
	genDiff({...req, commitId});
}

async function genDiff<URL extends RequestUrl, TableInfo=TableInfoFromURL<URL>>(ctx: CommitContext<URL>) {
}
