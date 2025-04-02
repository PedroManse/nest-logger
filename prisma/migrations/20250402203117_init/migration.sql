-- CreateEnum
CREATE TYPE "Status" AS ENUM ('S1', 'S2', 'S3', 'S4');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "v1" INTEGER NOT NULL,
    "v2" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfoTwo" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "attachedId" TEXT NOT NULL,

    CONSTRAINT "InfoTwo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogCommit" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedEntity" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "LogCommit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogDiff" (
    "id" INTEGER NOT NULL,
    "table" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "was" TEXT NOT NULL,
    "is" TEXT NOT NULL,
    "commitId" INTEGER NOT NULL,

    CONSTRAINT "LogDiff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Info" ADD CONSTRAINT "Info_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfoTwo" ADD CONSTRAINT "InfoTwo_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfoTwo" ADD CONSTRAINT "InfoTwo_attachedId_fkey" FOREIGN KEY ("attachedId") REFERENCES "Info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogCommit" ADD CONSTRAINT "LogCommit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogDiff" ADD CONSTRAINT "LogDiff_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "LogCommit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
