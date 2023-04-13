import fs from "fs/promises";
import path from "path";
import * as dotenv from "dotenv";
import { prisma } from "./client.js";
import { env } from "../src/env.mjs";

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        path.join(__dirname, ".data", fileNameMap[index]),
        JSON.stringify(data)
      )
    )
  );
};

// fetchDB();
