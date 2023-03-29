/*
  Warnings:

  - Added the required column `bungieAccountDisplayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bungieAccountProfilePicturePath` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bungieAccountDisplayName" TEXT NOT NULL,
ADD COLUMN     "bungieAccountProfilePicturePath" TEXT NOT NULL;
