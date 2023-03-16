"use client";

import { signIn } from "next-auth/react";

export const LoginButton = () => {
  const handleLogin = () => signIn("bungie");

  return <button onClick={handleLogin}>Login with bungie account</button>;
};
