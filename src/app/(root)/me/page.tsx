import { notFound } from "next/navigation";
import { getAuthSessionServer } from "@/core/auth/utils";
import { destinyClient } from "@/core/bungie-api/client";
import { AccountHeader } from "./AccountHeader";
import { ButtonLink } from "@/core/components/Button";

export default async function AuthUserProfilePage() {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  const { user } = session;

  const profile = await destinyClient.profile.getById(user.id);

  return (
    <div className="grid grid-cols-3 gap-4">
      <AccountHeader profile={profile} />
      <div className="col-span-2">
        <ButtonLink
          href="/me/new-loadout"
          variant="outline"
          className="w-full"
          size="lg"
        >
          New Loadout +
        </ButtonLink>
      </div>
    </div>
  );
}
