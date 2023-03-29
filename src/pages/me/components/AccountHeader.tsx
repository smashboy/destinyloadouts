import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { TypographyLarge } from "~/components/typography";
import { AccountCounter } from "./AccountCounter";
import { type User } from "@prisma/client";

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
  <div className="rounded border border-slate-200 p-4">
    <div className="flex flex-col items-center space-y-4">
      <Avatar
        src={`${bungieNetOrigin}/${bungieAccountProfilePicturePath}`}
        fallback={bungieAccountDisplayName}
        size="sm"
      />
      <TypographyLarge>{bungieAccountDisplayName}</TypographyLarge>
      <div className="grid grid-cols-3 gap-4">
        <AccountCounter title="Followers" count={followersCount} />
        <AccountCounter title="Likes" count={likesCount} />
        <AccountCounter title="Loadouts" count={loadoutsCount} />
      </div>
    </div>
  </div>
);
