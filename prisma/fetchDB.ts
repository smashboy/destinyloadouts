import fs from "fs/promises";
import path from "path";
import * as dotenv from "dotenv";
import { prisma } from "./client.js";

dotenv.config();

export const fileNameMap = {
  0: "users.json",
  1: "followers.json",
  2: "loadouts.json",
  3: "likes.json",
  4: "bookmarks.json",
} as const;

export const fetchDB = async () => {
  !process.env.SKIP_ENV_VALIDATION && (await import("../src/env.mjs"));

  const list = await prisma.$transaction([
    prisma.user.findMany(),
    prisma.userFollower.findMany(),
    prisma.loadout.findMany(),
    prisma.loadoutLike.findMany(),
    prisma.loadoutBookmark.findMany(),
  ]);

  await Promise.all(
    list.map((data, index) =>
      fs.writeFile(
        path.join(
          __dirname,
          ".data",
          fileNameMap[index as keyof typeof fileNameMap]
        ),
        JSON.stringify(data)
      )
    )
  );
};

// fetchDB();
