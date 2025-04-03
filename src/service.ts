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
		{ status, v1, v2 }: dto.createInfoDto,
		ownerId: string,
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
		{ id, status, v1, v2 }: dto.updateInfoDto,
	): Promise<Info> {
		return this.prisma.info.update({
			where: { id },
			data: {
				status,
				v1,
				v2,
			}
		})

	}

	createInfoTwo(
		{ status, attachedId }: dto.createInfoTwoDto,
		ownerId: string,
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
		{ id, status, attachedId }: dto.updateInfoTwoDto
	): Promise<InfoTwo> {
		return this.prisma.infoTwo.update({
			where: {id},
			data: {
				status,
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
