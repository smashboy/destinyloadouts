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
CREATE UNIQUE INDEX "DestinyManifest_version_key" ON "DestinyManifest"("version");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifestTablesByLocale_locale_manifestVersion_key" ON "DestinyManifestTablesByLocale"("locale", "manifestVersion");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifestTable_name_localeName_manifestVersion_key" ON "DestinyManifestTable"("name", "localeName", "manifestVersion");

-- CreateIndex
CREATE UNIQUE INDEX "DestinyManifestTableComponent_hashId_tableName_localeName_m_key" ON "DestinyManifestTableComponent"("hashId", "tableName", "localeName", "manifestVersion");

-- AddForeignKey
ALTER TABLE "DestinyManifestTablesByLocale" ADD CONSTRAINT "DestinyManifestTablesByLocale_manifestVersion_fkey" FOREIGN KEY ("manifestVersion") REFERENCES "DestinyManifest"("version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinyManifestTable" ADD CONSTRAINT "DestinyManifestTable_localeName_manifestVersion_fkey" FOREIGN KEY ("localeName", "manifestVersion") REFERENCES "DestinyManifestTablesByLocale"("locale", "manifestVersion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinyManifestTableComponent" ADD CONSTRAINT "DestinyManifestTableComponent_tableName_localeName_manifes_fkey" FOREIGN KEY ("tableName", "localeName", "manifestVersion") REFERENCES "DestinyManifestTable"("name", "localeName", "manifestVersion") ON DELETE RESTRICT ON UPDATE CASCADE;
