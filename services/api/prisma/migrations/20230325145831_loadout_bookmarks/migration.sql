-- CreateTable
CREATE TABLE "LoadoutBookmark" (
    "savedByUserId" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LoadoutBookmark_savedByUserId_loadoutId_key" ON "LoadoutBookmark"("savedByUserId", "loadoutId");

-- AddForeignKey
ALTER TABLE "LoadoutBookmark" ADD CONSTRAINT "LoadoutBookmark_savedByUserId_fkey" FOREIGN KEY ("savedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadoutBookmark" ADD CONSTRAINT "LoadoutBookmark_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
