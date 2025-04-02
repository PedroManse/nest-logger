import { Module } from "@nestjs/common";
import { AppController } from "./controller";
import { AppService } from "./service";
import { PrismaService } from "./prisma";

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule { }
