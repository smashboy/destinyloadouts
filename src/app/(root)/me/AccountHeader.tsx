import { Avatar } from "@/core/components/Avatar";
import { TypographyLarge } from "@/core/components/typography";

export const AccountHeader = () => (
  <div className="p-4 border border-slate-200 rounded">
    <div className="flex flex-col items-center space-y-4">
      <Avatar
        src="https://www.bungie.net/img/profile/avatars/default_avatar.gif"
        fallback="SmashBoy"
        size="sm"
      />
      <TypographyLarge>SmashBoy#6862</TypographyLarge>
    </div>
  </div>
);
