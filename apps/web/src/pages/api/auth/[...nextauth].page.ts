import NextAuth from "next-auth";
import { authConfig } from "@/core/auth/config";

export default NextAuth(authConfig);
