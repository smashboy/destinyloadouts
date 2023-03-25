import { PrismaClient } from "./.prisma";

export const prisma = new PrismaClient();

export * from "@prisma/client";
