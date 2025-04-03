import { Status } from '@prisma/client';
import * as d from 'class-validator';

export class createUserDto {
  @d.IsString()
  name: string;
}

export class createInfoDto {
	@d.IsEnum(Status)
  status: Status;

	@d.IsNumber()
	v1: number;

	@d.IsString()
	v2: string;
}

export class createInfoTwoDto {
	@d.IsEnum(Status)
  status: Status;

	@d.IsUUID()
	attachedId: string
}

export class updateInfoDto {
	@d.IsUUID()
	id: string;

	@d.IsOptional()
	@d.IsEnum(Status)
  status: Status;

	@d.IsOptional()
	@d.IsNumber()
	v1: number;

	@d.IsOptional()
	@d.IsString()
	v2: string;
}

export class updateInfoTwoDto {
	@d.IsUUID()
	id: string;

	@d.IsOptional()
	@d.IsEnum(Status)
  status: Status;

	@d.IsOptional()
	@d.IsUUID()
	attachedId: string
}

export class deleteInfo {
	@d.IsUUID()
	id: string;
}

export class deleteInfoTwo {
	@d.IsUUID()
	id: string;
}
