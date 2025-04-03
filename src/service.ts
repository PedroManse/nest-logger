import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import { User, Info, InfoTwo, LogDiff, LogCommit, Status } from '@prisma/client';
import * as dto from './dto';

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

	updateInfo(
		{ id, status, ownerId, v1, v2	}: dto.updateInfoDto
	): Promise<Info> {
		return this.prisma.info.update({
			where: { id },
			data: {
				status,
				ownerId,
				v1,
				v2,
			}
		})

	}

	createInfoTwo(
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

	updateInfoTwo(
		{ id, status, ownerId, attachedId }: dto.updateInfoTwoDto
	): Promise<InfoTwo> {
		return this.prisma.infoTwo.update({
			where: {id},
			data: {
				status,
				ownerId,
				attachedId,
			}
		})
	}

	deleteInfo(
		where: dto.deleteInfo
	): Promise<Info> {
		return this.prisma.info.delete({where})
	}

	deleteInfoTwo(
		where: dto.deleteInfoTwo
	): Promise<InfoTwo> {
		return this.prisma.infoTwo.delete({where})
	}
}
