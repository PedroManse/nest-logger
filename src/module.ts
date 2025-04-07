import { Module } from "@nestjs/common";
import { AppController } from "./controller";
import { AppService } from "./service";
import { PrismaService } from "./prisma";
import { LoggingInterceptor } from "./logger.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
	imports: [],
	controllers: [AppController],
	providers: [
		AppService,
		PrismaService,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		}
	],
})
export class AppModule { }
