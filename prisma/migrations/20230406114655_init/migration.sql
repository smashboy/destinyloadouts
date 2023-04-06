-- CreateEnum
CREATE TYPE "LoadoutStatus" AS ENUM ('PUBLISHED', 'DRAFT');

-- CreateEnum
CREATE TYPE "DestinyClassType" AS ENUM ('HUNTER', 'TITAN', 'WARLOCK');

-- CreateEnum
CREATE TYPE "DestinyDamageType" AS ENUM ('SOLAR', 'ARC', 'VOID', 'STRAND', 'STATIS');

-- CreateEnum
CREATE TYPE "LoadoutTag" AS ENUM ('PVE', 'PVP', 'GAMBIT', 'RAID', 'CRUCIBLE', 'DUNGEON', 'VANGUARD', 'TRIALS', 'FASHION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "bungieAccountId" TEXT NOT NULL,
    "bungieAccountDisplayName" TEXT NOT NULL,
    "bungieAccountProfilePicturePath" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollower" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "followingUserId" TEXT NOT NULL,
    "followerUserId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Loadout" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "LoadoutStatus" NOT NULL DEFAULT 'DRAFT',
    "name" TEXT NOT NULL,
    "classType" "DestinyClassType" NOT NULL,
    "subclassType" "DestinyDamageType" NOT NULL,
    "tags" "LoadoutTag"[],
    "description" JSONB,
    "items" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Loadout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadoutLike" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likedByUserId" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LoadoutBookmark" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedByUserId" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DestinyManifest" (
    "version" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DestinyManifestTablesByLocale" (
    "locale" TEXT NOT NULL,
    "manifestVersion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DestinyManifestTable" (
    "name" TEXT NOT NULL,
    "localeName" TEXT NOT NULL,
    "manifestVersion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DestinyManifestTableComponent" (
    "hashId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "tableName" TEXT NOT NULL,
    "localeName" TEXT NOT NULL,
    "manifestVersion" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_bungieAccountId_key" ON "User"("bungieAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollower_followingUserId_followerUserId_key" ON "UserFollower"("followingUserId", "followerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "LoadoutLike_likedByUserId_loadoutId_key" ON "LoadoutLike"("likedByUserId", "loadoutId");

-- CreateIndex
CREATE UNIQUE INDEX "LoadoutBookmark_savedByUserId_loadoutId_key" ON "LoadoutBookmark"("savedByUserId", "loadoutId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifest_version_key" ON "DestinyManifest"("version");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifestTablesByLocale_locale_manifestVersion_key" ON "DestinyManifestTablesByLocale"("locale", "manifestVersion");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifestTable_name_localeName_manifestVersion_key" ON "DestinyManifestTable"("name", "localeName", "manifestVersion");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifestTableComponent_hashId_tableName_localeName_m_key" ON "DestinyManifestTableComponent"("hashId", "tableName", "localeName", "manifestVersion");

-- AddForeignKey
ALTER TABLE "UserFollower" ADD CONSTRAINT "UserFollower_followingUserId_fkey" FOREIGN KEY ("followingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollower" ADD CONSTRAINT "UserFollower_followerUserId_fkey" FOREIGN KEY ("followerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loadout" ADD CONSTRAINT "Loadout_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadoutLike" ADD CONSTRAINT "LoadoutLike_likedByUserId_fkey" FOREIGN KEY ("likedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadoutLike" ADD CONSTRAINT "LoadoutLike_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadoutBookmark" ADD CONSTRAINT "LoadoutBookmark_savedByUserId_fkey" FOREIGN KEY ("savedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadoutBookmark" ADD CONSTRAINT "LoadoutBookmark_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinyManifestTablesByLocale" ADD CONSTRAINT "DestinyManifestTablesByLocale_manifestVersion_fkey" FOREIGN KEY ("manifestVersion") REFERENCES "DestinyManifest"("version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinyManifestTable" ADD CONSTRAINT "DestinyManifestTable_localeName_manifestVersion_fkey" FOREIGN KEY ("localeName", "manifestVersion") REFERENCES "DestinyManifestTablesByLocale"("locale", "manifestVersion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinyManifestTableComponent" ADD CONSTRAINT "DestinyManifestTableComponent_tableName_localeName_manifes_fkey" FOREIGN KEY ("tableName", "localeName", "manifestVersion") REFERENCES "DestinyManifestTable"("name", "localeName", "manifestVersion") ON DELETE RESTRICT ON UPDATE CASCADE;
