import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { TypographyLarge } from "~/components/typography";
import { AccountCounter } from "./AccountCounter";
import { type User } from "@prisma/client";
import { ButtonLink } from "~/components/Button";
import { Separator } from "~/components/Separator";

interface AccountHeaderProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  user: { bungieAccountDisplayName, bungieAccountProfilePicturePath },
  loadoutsCount,
  likesCount,
  followersCount,
}) => (
  <div className="flex items-center gap-6 p-4">
    <Avatar
      src={`${bungieNetOrigin}/${bungieAccountProfilePicturePath}`}
      fallback={bungieAccountDisplayName}
      size="sm"
    />
    <TypographyLarge>{bungieAccountDisplayName}</TypographyLarge>
    <div className="h-full py-2">
      <Separator orientation="vertical" />
    </div>
    <div className="flex w-full flex-1 gap-4">
      <AccountCounter title="Followers" count={followersCount} />
      <AccountCounter title="Likes" count={likesCount} />
      <AccountCounter title="Loadouts" count={loadoutsCount} />
    </div>

    <ButtonLink href="/me/new-loadout" size="lg">
      New Loadout +
    </ButtonLink>
  </div>
);
