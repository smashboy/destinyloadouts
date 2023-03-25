"use client";

import { Button } from "@/core/components/Button";
import { signIn } from "next-auth/react";

export const LoginButton = () => {
  const handleLogin = () => signIn("bungie");

  return <Button onClick={handleLogin}>Login with bungie account</Button>;
};
