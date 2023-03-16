import { notFound } from "next/navigation";
import { getAuthSessionServer } from "@/core/auth/utils";
import { Account } from "./Account";

export default async function AuthUserProfilePage() {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  return <Account session={session} />;
}
