import { BeforeCommit, DuringCommit, FinishCommit } from "src/logger.interceptor"
import { PrismaService } from "src/prisma"
import { DiffType, Info } from "@prisma/client"
import { updateInfoDto } from "src/dto";

export const commitURL = "PUT/info/:id";
export type CommitURL = typeof commitURL;
export type commitInfo = Info;

export async function before(ctx: BeforeCommit<CommitURL>, prisma: PrismaService): Promise<DuringCommit<CommitURL>> {
	if (ctx.userId === undefined) {
		throw new Error("Can't update info without user")
	}
	const info = await prisma.info.findFirstOrThrow({
		where: {
			id: ctx.req.body["id"],
		}
	});
	const commit = await prisma.logCommit.create({
		data: {
			table: "info",
			diffType: DiffType.update,
			ownerId: ctx.userId,
		}
	})
	return {
		...ctx,
		commitId: commit.id,
		commitInfo: info,
	}
}

export async function after(ctx: FinishCommit<CommitURL>, prisma: PrismaService): Promise<void> {
	const body = ctx.req.body as updateInfoDto;
	const update = (column: string, was: string, is: string) =>
		prisma.logDiff.create({
			data: {
				commitId: ctx.commitId,
				column,
				was,
				is,
			}
		})
		;
	if (body.status !== undefined) {
		await update("status", ctx.commitInfo.status, body.status)
	}
	if (body.v1 !== undefined) {
		await update("v1", ctx.commitInfo.v1.toString(), body.v1.toString())
	}
	if (body.v2 !== undefined) {
		await update("v2", ctx.commitInfo.v2, body.v2)
	}
}

