import { redirect } from "next/navigation";
import { isAuthenticatedServer } from "@/core/auth/utils";
import { LoginButton } from "./LoginButton";

export default async function LoginPage() {
  const isAuthenticated = await isAuthenticatedServer();

  if (isAuthenticated) redirect("/me");

  return <LoginButton />;
}
