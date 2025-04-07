import { BeforeCommit, DuringCommit, FinishCommit } from "src/logger.interceptor"
import { PrismaService } from "src/prisma"
import { Info } from "@prisma/client"

export const commitURL = "PUT/info";
export type CommitURL = typeof commitURL;
export type commitInfo = Info;

export async function before(ctx: BeforeCommit<CommitURL>, prisma: PrismaService): Promise<DuringCommit<CommitURL>> {
	const info = await prisma.info.findFirstOrThrow({
		where: {
			id: ctx.req.body["id"],
		}
	});
	return {
		...ctx,
		commitId: ~~(Math.random()*10_000),
		commitInfo: info,
	}
}

export async function after(ctx: FinishCommit<CommitURL>, _prisma: PrismaService): Promise<void> {
	console.log(ctx.commitInfo, ctx.commitId, ctx.req.body)
	console.log("user:", ctx.userId)
}

