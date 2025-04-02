import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req: Request = context.switchToHttp().getRequest();
		const rsp: Response = context.switchToHttp().getResponse();
		console.log("Before req");
		const now = Date.now();
		function after() {
			console.log(req);
			console.log(rsp);
			console.log(`After req | executed in ${Date.now() - now}`);
		}

		return next.handle().pipe(tap({ next: after }));
	}
}

type CommitRequest<T> = Omit<CommitContext<T>, "commitId">;

type CommitContext<TableInfo> = {
	commitId: number;
	table: string;
	user: string; // uuid
	tableInfo: TableInfo;
};

async function genCommit<TableInfo>(req: CommitRequest<TableInfo>) { }

async function genDiff<TableInfo>(ctx: CommitContext<TableInfo>) { }
