import { notFound } from "next/navigation";
import { getBungieNetUserById } from "bungie-api-ts/user";
import { getAuthSessionServer } from "@/core/auth/utils";
import { AccountHeader } from "./AccountHeader";
import { ButtonLink } from "@/core/components/Button";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import { trpcClient } from "@/core/trpc/client";
import { ConsoleLog } from "@/core/components/ConsoleLog";

export default async function AuthUserProfilePage() {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  const { user } = session;

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const profile = await getBungieNetUserById(fetchHelper, {
    id: user.id,
  });

  const test = await trpcClient.destiny.manifest.latest.getTable.query({
    name: "DestinyLoadoutIconDefinition",
    locale: "en",
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <ConsoleLog test={test} />
      <AccountHeader profile={profile.Response} />
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
