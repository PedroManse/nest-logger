import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { Request } from 'express';
export type Req = Request & { user?: string };

export const User = createParamDecorator(
	(must: "must" | void, ctx: ExecutionContext) => {
		const request: Req = ctx.switchToHttp().getRequest();
		if (must && request.headers["authorization"] === undefined) {
			throw new HttpException("", 400);
		}
		return request.user = request.headers["authorization"];
	},
);

