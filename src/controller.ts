import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./service";
import { Info, InfoTwo, User } from "@prisma/client";
import * as dto from "./dto";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Post()
	createUser(user: dto.createUserDto): Promise<User> {
		return this.appService.createUser(user);
	}

	@Post("info")
	createInfo(info: dto.createInfoDto): Promise<Info> {
		return this.appService.createInfo(info);
	}

	@Post("infotwo")
	createInfoTwo(info: dto.createInfoTwoDto): Promise<InfoTwo> {
		return this.appService.createBigInfo(info);
	}


	// TODO update info, update info2, delete info, delete info2
}

