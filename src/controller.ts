import { Controller, Post, Put, Delete, Body } from "@nestjs/common";
import { AppService } from "./service";
import { Info, InfoTwo, User as UserType } from "@prisma/client";
import * as dto from "./dto";
import { User } from "./user";

@Controller()
export class AppController {
	constructor(private readonly service: AppService) { }

	@Post("user")
	createUser(@Body() user: dto.createUserDto): Promise<UserType> {
		return this.service.createUser(user);
	}

	@Post("info")
	createInfo(
		@User("must") user: string,
		@Body() info: dto.createInfoDto
	): Promise<Info> {
		return this.service.createInfo(info, user);
	}

	@Post("infotwo")
	createInfoTwo(
		@User("must") user: string,
		@Body() info: dto.createInfoTwoDto,
	): Promise<InfoTwo> {
		return this.service.createInfoTwo(info, user);
	}

	@Put("info")
	updateInfo(@Body() info: dto.updateInfoDto): Promise<Info> {
		return this.service.updateInfo(info);
	}

	@Put("infotwo")
	updateInfoTwo(@Body() info: dto.updateInfoTwoDto): Promise<InfoTwo> {
		return this.service.updateInfoTwo(info);
	}

	@Delete("info")
	deleteInfo(@Body() info: dto.deleteInfo): Promise<Info> {
		return this.service.deleteInfo(info)
	}

	@Delete("infotwo")
	deleteInfoTwo(@Body() info: dto.deleteInfoTwo): Promise<InfoTwo> {
		return this.service.deleteInfoTwo(info)
	}
}

