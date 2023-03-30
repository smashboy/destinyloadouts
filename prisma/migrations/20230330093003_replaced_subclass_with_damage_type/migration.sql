/*
  Warnings:

  - Changed the type of `subclassType` on the `Loadout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DestinyDamageType" AS ENUM ('SOLAR', 'ARC', 'VOID', 'STRAND', 'STATIS');

-- AlterTable
ALTER TABLE "Loadout" DROP COLUMN "subclassType",
ADD COLUMN     "subclassType" "DestinyDamageType" NOT NULL;

-- DropEnum
DROP TYPE "DestinySublcassType";
