/*
  Warnings:

  - The values [NIGHTFALL] on the enum `LoadoutTag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoadoutTag_new" AS ENUM ('PVE', 'PVP', 'GAMBIT', 'RAID', 'CRUCIBLE', 'DUNGEON', 'VANGUARD', 'TRIALS', 'FASHION');
ALTER TABLE "Loadout" ALTER COLUMN "tags" TYPE "LoadoutTag_new"[] USING ("tags"::text::"LoadoutTag_new"[]);
ALTER TYPE "LoadoutTag" RENAME TO "LoadoutTag_old";
ALTER TYPE "LoadoutTag_new" RENAME TO "LoadoutTag";
DROP TYPE "LoadoutTag_old";
COMMIT;
