import Link from "next/link";
import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { TypographyLarge } from "~/components/typography";
import { AccountCounter } from "./AccountCounter";
import { type User } from "@prisma/client";
import { ButtonLink } from "~/components/Button";
import { TabsList, TabsTrigger } from "~/components/Tabs";

interface AccountHeaderProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
  isAuthUserPage?: boolean;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  user: { bungieAccountDisplayName, bungieAccountProfilePicturePath, id },
  loadoutsCount,
  likesCount,
  followersCount,
  isAuthUserPage = false,
}) => {
  const baseLink = isAuthUserPage ? "/me" : `/${id}`;

  const params = new URLSearchParams();
  params.append("liked", "true");

  const likedRoute = `${baseLink}?${params.toString()}`;

  return (
    <div className="sticky top-0 z-10 flex h-fit flex-col gap-4 border-b-2 bg-neutral-900 p-4 dark:border-b-neutral-700">
      <div className="flex items-center gap-6">
        <Avatar
          src={`${bungieNetOrigin}/${bungieAccountProfilePicturePath}`}
          fallback={bungieAccountDisplayName}
          size="sm"
        />
        <TypographyLarge>{bungieAccountDisplayName}</TypographyLarge>
        {/* <div className="h-full py-2">
    <Separator orientation="vertical" />
  </div> */}
        <div className="flex w-full flex-1 gap-4">
          <AccountCounter title="Followers" count={followersCount} />
          <AccountCounter title="Likes" count={likesCount} />
          <AccountCounter title="Loadouts" count={loadoutsCount} />
        </div>

        <ButtonLink href="/me/new-loadout" size="lg">
          New Loadout +
        </ButtonLink>
      </div>
      <TabsList>
        <Link href={baseLink}>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </Link>
        <Link href={likedRoute}>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </Link>
      </TabsList>
    </div>
  );
};
