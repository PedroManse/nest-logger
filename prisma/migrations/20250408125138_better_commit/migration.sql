/*
  Warnings:

  - You are about to drop the column `modifiedEntity` on the `LogCommit` table. All the data in the column will be lost.
  - You are about to drop the column `diffType` on the `LogDiff` table. All the data in the column will be lost.
  - You are about to drop the column `table` on the `LogDiff` table. All the data in the column will be lost.
  - Added the required column `diffType` to the `LogCommit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table` to the `LogCommit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogCommit" DROP COLUMN "modifiedEntity",
ADD COLUMN     "diffType" "DiffType" NOT NULL,
ADD COLUMN     "table" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LogDiff" DROP COLUMN "diffType",
DROP COLUMN "table";
