import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
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
		function after(_resp: any) {
			console.log(req);
			console.log(rsp);
			console.log(`After req | executed in ${Date.now() - now}`);
		}

		return next.handle().pipe(tap({ next: after }));
	}
}
