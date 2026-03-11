/*
  Warnings:

  - The values [UNBELIEVER] on the enum `SoulState` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterEnum
ALTER TYPE "ChurchMembership" ADD VALUE 'BOTH_TLAC_AND_KSOD';

-- AlterEnum
BEGIN;
CREATE TYPE "SoulState_new" AS ENUM ('NEW_CONVERT', 'UNCHURCHED_BELIEVER', 'HUNGRY_BELIEVER');
ALTER TABLE "Lead" ALTER COLUMN "soulState" TYPE "SoulState_new" USING ("soulState"::text::"SoulState_new");
ALTER TYPE "SoulState" RENAME TO "SoulState_old";
ALTER TYPE "SoulState_new" RENAME TO "SoulState";
DROP TYPE "SoulState_old";
COMMIT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';
