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
import { PrismaService } from "./prisma";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly prisma: PrismaService) { }

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

		async function after(prisma: PrismaService) {
			const {method, url, query, params, body, user}: Req = context.switchToHttp().getRequest();
			const rsp: Response = context.switchToHttp().getResponse();

			prisma.log.create({
				data: {
					service:"Teste",
					method,
					url,
					queryParams: query,
					urlParams: params,
					body,
					ownerId:user,
				}
			})
		}
		return next.handle().pipe(tap({ next: ()=>after(this.prisma) }));
	}
}
