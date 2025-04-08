-- AlterTable
CREATE SEQUENCE logcommit_id_seq;
ALTER TABLE "LogCommit" ALTER COLUMN "id" SET DEFAULT nextval('logcommit_id_seq');
ALTER SEQUENCE logcommit_id_seq OWNED BY "LogCommit"."id";

-- AlterTable
CREATE SEQUENCE logdiff_id_seq;
ALTER TABLE "LogDiff" ALTER COLUMN "id" SET DEFAULT nextval('logdiff_id_seq');
ALTER SEQUENCE logdiff_id_seq OWNED BY "LogDiff"."id";
