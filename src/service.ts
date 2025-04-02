import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import { User, Info, InfoTwo, LogDiff, LogCommit, Status } from '@prisma/client';
import * as dto from './dto';
type UserId = string;

@Injectable()
export class AppService {
	constructor(
		private readonly prisma: PrismaService
	) { }

	createUser({ name }: dto.createUserDto): Promise<User> {
		return this.prisma.user.create({
			data: { name }
		})
	}

	createInfo(
		{ status, ownerId, v1, v2 }: dto.createInfoDto
	): Promise<Info> {
		return this.prisma.info.create({
			data: {
				status,
				ownerId,
				v1,
				v2,
			}
		})
	}

	createBigInfo(
		{ status, ownerId, attachedId }: dto.createInfoTwoDto
	): Promise<InfoTwo> {
		return this.prisma.infoTwo.create({
			data: {
				status,
				ownerId,
				attachedId,
			}
		})
	}
}
