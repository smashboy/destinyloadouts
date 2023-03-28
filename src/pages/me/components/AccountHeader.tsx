import { type GeneralUser } from "bungie-api-ts/user";
import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { TypographyLarge } from "~/components/typography";
import { AccountCounter } from "./AccountCounter";
import { type User } from "@prisma/client";

interface AccountHeaderProps {
  bungieNetUser: GeneralUser;
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  bungieNetUser: { uniqueName, displayName, profilePicturePath },
  user,
  loadoutsCount,
  likesCount,
  followersCount,
}) => (
  <div className="rounded border border-slate-200 p-4">
    <div className="flex flex-col items-center space-y-4">
      <Avatar
        src={`${bungieNetOrigin}/${profilePicturePath}`}
        fallback={displayName}
        size="sm"
      />
      <TypographyLarge>{uniqueName}</TypographyLarge>
      <div className="grid grid-cols-3 gap-4">
        <AccountCounter title="Followers" count={followersCount} />
        <AccountCounter title="Likes" count={likesCount} />
        <AccountCounter title="Loadouts" count={loadoutsCount} />
      </div>
    </div>
  </div>
);
