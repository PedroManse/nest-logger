import { Controller, Post, Put, Delete, Body, Param } from "@nestjs/common";
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

	@Put("info/:id")
	updateInfo(
		@User("must") _user: string,
		@Param("id") id: string,
		@Body() info: dto.updateInfoDto
	): Promise<Info> {
		return this.service.updateInfo(info, id);
	}

	@Put("infotwo")
	updateInfoTwo(
		@User("must") user: string,
		@Body() info: dto.updateInfoTwoDto,
	): Promise<InfoTwo> {
		return this.service.updateInfoTwo(info);
	}

	@Delete("info")
	deleteInfo(
		@User("must") user: string,
		@Body() info: dto.deleteInfo
	): Promise<Info> {
		return this.service.deleteInfo(info)
	}

	@Delete("infotwo")
	deleteInfoTwo(
		@User("must") user: string,
		@Body() info: dto.deleteInfoTwo,
	): Promise<InfoTwo> {
		return this.service.deleteInfoTwo(info)
	}
}

