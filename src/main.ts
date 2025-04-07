import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module";
import { loggedRequestUrls, RequestUrl } from "./logger.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT ?? 3000);

	const server = app.getHttpAdapter().getInstance();
	const router = server.router;
	const availableRoutes: string[] = router.stack
		.map((layer: any) => {
			if (layer.route) {
				const path = layer.route?.path;
				const method = layer.route?.stack[0].method;
				return `${method.toUpperCase()}${path}`
			}
		})
		.filter((req: string | undefined) => req !== undefined)
		.filter((req:string) => !req.startsWith("GET"));

	const allRoutesNotLogged = availableRoutes.filter( req => !loggedRequestUrls.includes(req as RequestUrl) );
	if (allRoutesNotLogged.length !== 0) {
		throw new Error(`Routes [${allRoutesNotLogged.join(', ')}] arent logged`);
	}
}
bootstrap();
