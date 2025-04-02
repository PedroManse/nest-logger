/*
  Warnings:

  - Added the required column `diffType` to the `LogDiff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiffType" AS ENUM ('create', 'update', 'delete');

-- AlterTable
ALTER TABLE "LogDiff" ADD COLUMN     "diffType" "DiffType" NOT NULL,
ALTER COLUMN "was" DROP NOT NULL,
ALTER COLUMN "is" DROP NOT NULL;
