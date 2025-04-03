import { Controller, Get, Post, Put, Delete } from "@nestjs/common";
import { AppService } from "./service";
import { Info, InfoTwo, User } from "@prisma/client";
import * as dto from "./dto";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Post("user")
	createUser(user: dto.createUserDto): Promise<User> {
		return this.appService.createUser(user);
	}

	@Post("info")
	createInfo(info: dto.createInfoDto): Promise<Info> {
		return this.appService.createInfo(info);
	}

	@Post("infotwo")
	createInfoTwo(info: dto.createInfoTwoDto): Promise<InfoTwo> {
		return this.appService.createInfoTwo(info);
	}

	@Put("info")
	updateInfo(info: dto.updateInfoDto): Promise<Info> {
		return this.appService.updateInfo(info);
	}

	@Put("infotwo")
	updateInfoTwo(info: dto.updateInfoTwoDto): Promise<InfoTwo> {
		return this.appService.updateInfoTwo(info);
	}

	@Delete("info")
	deleteInfo(info: dto.deleteInfo): Promise<Info> {
		return this.appService.deleteInfo(info)
	}

	@Delete("infotwo")
	deleteInfoTwo(info: dto.deleteInfoTwo): Promise<InfoTwo> {
		return this.appService.deleteInfoTwo(info)
	}
}

