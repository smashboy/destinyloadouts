import fs from "fs/promises";
import path from "path";
import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
  type LoadoutStatus,
  prisma,
} from "./client";
import { fileNameMap } from "./fetchDB";

interface UserJson {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string | null;
  bungieAccountId: string;
  bungieAccountDisplayName: string;
  bungieAccountProfilePicturePath: string;
}

interface FollowJson {
  createdAt: string;
  updatedAt: string;
  followingUserId: string;
  followerUserId: string;
}

interface LoadoutJson {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: LoadoutStatus;
  classType: DestinyClassType;
  subclassType: DestinyDamageType;
  tags: LoadoutTag[];
  description: JSON | null;
  items: JSON;
  authorId: string;
}

interface LikeJson {
  createdAt: string;
  likedByUserId: string;
  loadoutId: string;
}

interface BookmarksJson {
  createdAt: string;
  savedByUserId: string;
  loadoutId: string;
}

export const migrate = async () => {
  !process.env.SKIP_ENV_VALIDATION && (await import("../src/env.mjs"));

  console.log("Loading data...");

  const [usersData, followersData, loadoutsData, likesData, bookmarksData] = (
    await Promise.all(
      Object.values(fileNameMap).map((filename) =>
        fs.readFile(path.join(__dirname, ".data", filename), {
          encoding: "utf-8",
        })
      )
    )
  ).map((data) => JSON.parse(data));

  console.log("DB data loaded successfully!");
  console.log("Storing users...");

  await prisma.user.createMany({
    data: (usersData as UserJson[]).map((user) => user),
  });

  console.log("Users stored successfully!");
  console.log("Storing follows...");

  await prisma.$transaction(
    (followersData as FollowJson[]).map(
      ({ followerUserId, followingUserId, ...data }) =>
        prisma.userFollower.create({
          data: {
            ...data,
            following: {
              connect: {
                id: followingUserId,
              },
            },
            follower: {
              connect: {
                id: followerUserId,
              },
            },
          },
        })
    )
  );

  console.log("Follows stored successfully!");
  console.log("Storing loadouts...");

  await prisma.$transaction(
    (loadoutsData as LoadoutJson[]).map(
      ({ authorId, tags, description, ...data }) =>
        prisma.loadout.create({
          data: {
            ...data,
            description: description ?? void 0,
            tags: {
              createMany: {
                data: tags.map((tag) => ({ tag })),
              },
            },
            author: {
              connect: {
                id: authorId,
              },
            },
          },
        })
    )
  );

  console.log("Loadouts stored successfully!");
  console.log("Storing likes...");

  await prisma.$transaction(
    (likesData as LikeJson[]).map(({ loadoutId, likedByUserId, ...data }) =>
      prisma.loadoutLike.create({
        data: {
          ...data,
          loadout: {
            connect: {
              id: loadoutId,
            },
          },
          likedBy: {
            connect: {
              id: likedByUserId,
            },
          },
        },
      })
    )
  );

  console.log("Likes stored successfully!");
  console.log("Storing bookmarks...");

  await prisma.$transaction(
    (bookmarksData as BookmarksJson[]).map(
      ({ loadoutId, savedByUserId, ...data }) =>
        prisma.loadoutBookmark.create({
          data: {
            ...data,
            loadout: {
              connect: {
                id: loadoutId,
              },
            },
            savedBy: {
              connect: {
                id: savedByUserId,
              },
            },
          },
        })
    )
  );

  console.log("Bookmarks stored successfully!");
  console.log("Data migration completed successfully!");
};

migrate();
