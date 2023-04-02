-- DropForeignKey
ALTER TABLE "LoadoutBookmark" DROP CONSTRAINT "LoadoutBookmark_loadoutId_fkey";

-- DropForeignKey
ALTER TABLE "LoadoutLike" DROP CONSTRAINT "LoadoutLike_loadoutId_fkey";

-- AddForeignKey
ALTER TABLE "LoadoutLike" ADD CONSTRAINT "LoadoutLike_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadoutBookmark" ADD CONSTRAINT "LoadoutBookmark_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
