/*
  Warnings:

  - You are about to drop the `LogCommit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogDiff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LogCommit" DROP CONSTRAINT "LogCommit_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "LogDiff" DROP CONSTRAINT "LogDiff_commitId_fkey";

-- DropTable
DROP TABLE "LogCommit";

-- DropTable
DROP TABLE "LogDiff";

-- DropEnum
DROP TYPE "DiffType";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "queryParams" JSONB,
    "urlParams" JSONB,
    "body" JSONB,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
