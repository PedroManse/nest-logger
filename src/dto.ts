import { Status } from '@prisma/client';
import * as d from 'class-validator';

export class createUserDto {
  @d.IsString()
  name: string;
}

export class createInfoDto {
	@d.IsEnum(Status)
  status: Status;

	@d.IsUUID()
	ownerId: string

	@d.IsNumber()
	v1: number;

	@d.IsString()
	v2: string;
}

export class createInfoTwoDto {
	@d.IsEnum(Status)
  status: Status;

	@d.IsUUID()
	ownerId: string

	@d.IsUUID()
	attachedId: string
}
