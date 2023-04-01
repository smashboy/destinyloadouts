import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { type User, type Loadout } from "@prisma/client";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { AccountHeader } from "./components/AccountHeader";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { Tabs } from "~/components/Tabs";

interface AuthUserProfilePageProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
  feed: {
    loadouts: Loadout[];
    inventoryItems: Record<string, DestinyInventoryItemDefinition>;
  };
}

const AuthUserProfilePage: NextPage<AuthUserProfilePageProps> = ({
  feed: { loadouts, inventoryItems },
  ...props
}) => {
  const router = useRouter();

  return (
    <Tabs
      value={router.query?.liked ? "liked" : "personal"}
      className="grid grid-cols-1 gap-4"
    >
      <AccountHeader {...props} isAuthUserPage />
      {/* <LoadoutsList
        className="col-span-2 flex flex-col gap-4"
        loadouts={feed.loadouts}
        onFetchMore={() => {}}
        hasMore={false}
        isLoading={false}
      /> */}
      <div className="grid grid-cols-2 gap-2">
        {loadouts.map((loadout) => (
          <LoadoutPreviewCard
            key={loadout.id}
            loadout={loadout}
            inventoryItems={inventoryItems}
          />
        ))}
      </div>
    </Tabs>
  );
};

export const getServerSideProps: GetServerSideProps<
  AuthUserProfilePageProps
> = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const {
    user: { id: bungieAccountId },
  } = session;

  const trpc = trpsSSG(session);

  const userResponse = await trpc.users.getByBungieAccountId.fetch({
    bungieAccountId,
  });

  if (!userResponse)
    return {
      notFound: true,
    };

  const { id: userId } = userResponse.user;

  const loadouts = await trpc.loadouts.getByUserId.fetch({
    userId,
    onlyLikedLoadouts: !!ctx.query.liked,
  });

  return {
    props: { ...userResponse, feed: loadouts },
  };
};

export default AuthUserProfilePage;
