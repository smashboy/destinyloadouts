import Link from "next/link";
import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { TypographyLarge } from "~/components/typography";
import { AccountCounter } from "./AccountCounter";
import { type User } from "@prisma/client";
import { ButtonLink } from "~/components/Button";
import { TabsList, TabsTrigger } from "~/components/Tabs";
import { useAuthUser } from "~/hooks/useAuthUser";

interface AccountHeaderProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  user: {
    bungieAccountDisplayName,
    bungieAccountProfilePicturePath,
    id: userId,
  },
  loadoutsCount,
  likesCount,
  followersCount,
}) => {
  const [authUser] = useAuthUser();

  const baseLink = `/user/${userId}`;

  const personalRoute = `${baseLink}?type=PERSONAL`;
  const likedRoute = `${baseLink}?type=LIKED`;
  const savedRoute = `${baseLink}?type=SAVED`;

  return (
    <div className="sticky top-0 z-10 flex h-fit flex-col gap-4 border-b-2 bg-neutral-900 p-4 dark:border-b-neutral-700">
      <div className="flex items-center gap-6">
        <Avatar
          src={`${bungieNetOrigin}/${bungieAccountProfilePicturePath}`}
          fallback={bungieAccountDisplayName}
          size="sm"
        />
        <TypographyLarge className="border-r-2 border-neutral-700 pr-4">
          {bungieAccountDisplayName}
        </TypographyLarge>
        {/* <div className="h-full py-2">
    <Separator orientation="vertical" />
  </div> */}
        <div className="flex w-full flex-1 gap-4">
          <AccountCounter title="Followers" count={followersCount} />
          <AccountCounter title="Likes" count={likesCount} />
          <AccountCounter title="Loadouts" count={loadoutsCount} />
        </div>

        {userId === authUser?.id && (
          <ButtonLink href="/new-loadout" size="lg">
            New Loadout +
          </ButtonLink>
        )}
      </div>
      <TabsList>
        <Link href={personalRoute}>
          <TabsTrigger value="PERSONAL">Personal</TabsTrigger>
        </Link>
        <Link href={likedRoute}>
          <TabsTrigger value="LIKED">Liked</TabsTrigger>
        </Link>
        {userId === authUser?.id && (
          <Link href={savedRoute}>
            <TabsTrigger value="SAVED">Saved</TabsTrigger>
          </Link>
        )}
      </TabsList>
    </div>
  );
};
