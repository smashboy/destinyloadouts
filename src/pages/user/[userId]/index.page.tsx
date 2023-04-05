import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { type User } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { AccountHeader } from "../components/AccountHeader";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { Tabs } from "~/components/Tabs";
import { trpcNext } from "~/utils/api";
import { useAuthUser } from "~/hooks/useAuthUser";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";

type UserLoadoutType = "PERSONAL" | "LIKED" | undefined;

interface AuthUserProfilePageProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
  userLoadoutType: UserLoadoutType;
  // feed: {
  //   loadouts: Array<Loadout & { _count: { likes: number } }>;
  //   inventoryItems: Record<string, DestinyInventoryItemDefinition>;
  // };
}

const AuthUserProfilePage: NextPage<AuthUserProfilePageProps> = (props) => {
  const {
    user: { id: userId },
    userLoadoutType,
  } = props;
  const queryParams = { userId, type: userLoadoutType };

  const router = useRouter();
  const trpcCtx = trpcNext.useContext();
  const [authUser] = useAuthUser();

  const { data } = trpcNext.loadouts.getByUserId.useQuery(queryParams);

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getByUserId.cancel(queryParams);

      const prevLoadouts = await trpcCtx.loadouts.getByUserId.getData(
        queryParams
      );

      trpcCtx.loadouts.getByUserId.setData(queryParams, (old) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inventoryItems: old!.inventoryItems,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        loadouts: old!.loadouts.map((loadout) =>
          handleAuthUserLoadoutLike({ loadout, loadoutId, authUser })
        ),
      }));

      return { prevLoadouts };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getByUserId.setData(
        queryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevLoadouts
      ),
    onSettled: () => trpcCtx.loadouts.getByUserId.invalidate(queryParams),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getByUserId.cancel(queryParams);

      const prevLoadouts = await trpcCtx.loadouts.getByUserId.getData(
        queryParams
      );

      trpcCtx.loadouts.getByUserId.setData(queryParams, (old) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inventoryItems: old!.inventoryItems,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        loadouts: old!.loadouts.map((loadout) =>
          handleAuthUserLoadoutBookmark({ loadout, loadoutId, authUser })
        ),
      }));

      return { prevLoadouts };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getByUserId.setData(
        queryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevLoadouts
      ),
    onSettled: () => trpcCtx.loadouts.getByUserId.invalidate(queryParams),
  });

  const { loadouts, inventoryItems } = data || {};

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  return (
    <Tabs
      value={(router.query?.type as string) || "PERSONAL"}
      className="grid grid-cols-1 gap-4"
    >
      <AccountHeader {...props} />
      {loadouts && inventoryItems && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {loadouts.map((loadout) => (
            <LoadoutPreviewCard
              key={loadout.id}
              loadout={loadout}
              inventoryItems={inventoryItems}
              onLike={handleLikeLoadout}
              onSave={handleSaveLoadout}
              authUser={authUser}
            />
          ))}
        </div>
      )}
    </Tabs>
  );
};

export const getServerSideProps: GetServerSideProps<
  AuthUserProfilePageProps
> = async (ctx) => {
  const userId = ctx.query.userId as string;

  const session = await getServerAuthSession(ctx);

  const trpc = trpsSSG(session);

  const userResponse = await trpc.users.getById.fetch({
    userId,
  });

  if (!userResponse)
    return {
      notFound: true,
    };

  const userLoadoutType = ctx.query.type as "LIKED" | "PERSONAL" | undefined;

  await trpc.loadouts.getByUserId.prefetch({
    userId,
    type: userLoadoutType,
  });

  return {
    props: { ...userResponse, userLoadoutType, trpcState: trpc.dehydrate() },
  };
};

export default AuthUserProfilePage;
