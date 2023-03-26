import { GeneralUser } from "bungie-api-ts/user";
import { User } from "@services/api/src/web";
import { bungieNetOrigin } from "@destiny/shared/constants";
import { Avatar } from "~/core/components/Avatar";
import { TypographyLarge } from "~/core/components/typography";
import { AccountCounter } from "./AccountCounter";

interface AccountHeaderProps {
  profile: GeneralUser;
  user: {
    user: User;
    loadoutsCount: number;
    followersCount: number;
    likesCount: number;
  };
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  profile: { uniqueName, displayName, profilePicturePath },
  user: { user, loadoutsCount, likesCount, followersCount },
}) => (
  <div className="p-4 border border-slate-200 rounded">
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
