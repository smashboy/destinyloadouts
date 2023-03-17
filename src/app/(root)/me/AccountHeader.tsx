import { GeneralUser } from "bungie-api-ts/user";
import { bungieNetOrigin } from "@/core/bungie-api/consants";
import { Avatar } from "@/core/components/Avatar";
import { TypographyLarge } from "@/core/components/typography";
import { AccountCounter } from "./AccountCounter";

interface AccountHeaderProps {
  profile: GeneralUser;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  profile: { uniqueName, displayName, profilePicturePath },
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
        <AccountCounter title="Followers" count={0} />
        <AccountCounter title="Likes" count={0} />
        <AccountCounter title="Loadouts" count={0} />
      </div>
    </div>
  </div>
);
