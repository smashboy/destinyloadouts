-- CreateTable
CREATE TABLE "UserFollower" (
    "followingUserId" TEXT NOT NULL,
    "followerUserId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFollower_followingUserId_followerUserId_key" ON "UserFollower"("followingUserId", "followerUserId");

-- AddForeignKey
ALTER TABLE "UserFollower" ADD CONSTRAINT "UserFollower_followingUserId_fkey" FOREIGN KEY ("followingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollower" ADD CONSTRAINT "UserFollower_followerUserId_fkey" FOREIGN KEY ("followerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
