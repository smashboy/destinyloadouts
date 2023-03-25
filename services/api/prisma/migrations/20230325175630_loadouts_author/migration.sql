/*
  Warnings:

  - Added the required column `userId` to the `Loadout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loadout" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Loadout" ADD CONSTRAINT "Loadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
