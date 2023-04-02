import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { type User } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { AccountHeader } from "./components/AccountHeader";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { Tabs } from "~/components/Tabs";
import { trpcNext } from "~/utils/api";
import { useAuthUser } from "~/hooks/useAuthUser";

type UserLoadoutType = "PERSONAL" | "LIKED" | "SAVED" | undefined;

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

  const router = useRouter();
  const trpcCtx = trpcNext.useContext();
  const [authUser] = useAuthUser();

  const queryParams = { userId, type: userLoadoutType };

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
        loadouts: old!.loadouts.map(({ _count, id, likes, ...loadout }) => {
          const isLikedByAuthUser =
            id === loadoutId &&
            likes.find((like) => like.likedByUserId === authUser?.id);

          return {
            ...loadout,
            id,
            likes: isLikedByAuthUser
              ? likes.filter((like) => like.likedByUserId !== authUser?.id)
              : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              id === loadoutId
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [...likes, { likedByUserId: authUser!.id }]
              : [...likes],
            _count: {
              ..._count,
              likes: isLikedByAuthUser
                ? _count.likes - 1
                : id === loadoutId
                ? _count.likes + 1
                : _count.likes,
            },
          };
        }),
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

  const saveLoadoutMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getByUserId.cancel(queryParams);

      const prevLoadouts = await trpcCtx.loadouts.getByUserId.getData(
        queryParams
      );

      trpcCtx.loadouts.getByUserId.setData(queryParams, (old) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inventoryItems: old!.inventoryItems,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        loadouts: old!.loadouts.map(({ id, bookmarks, ...loadout }) => {
          const isSaveddByAuthUser =
            id === loadoutId &&
            bookmarks.find(
              (bookmark) => bookmark.savedByUserId === authUser?.id
            );

          return {
            ...loadout,
            id,
            bookmarks: isSaveddByAuthUser
              ? bookmarks.filter(
                  (bookmark) => bookmark.savedByUserId !== authUser?.id
                )
              : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              id === loadoutId
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                [...bookmarks, { savedByUserId: authUser!.id }]
              : [...bookmarks],
          };
        }),
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

  if (!data) return null;

  const { loadouts, inventoryItems } = data;

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveLoadoutMutation.mutate({ loadoutId });

  return (
    <Tabs
      value={(router.query?.type as string) || "PERSONAL"}
      className="grid grid-cols-1 gap-4"
    >
      <AccountHeader {...props} isAuthUserPage />
      <div className="grid grid-cols-2 gap-2">
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

  const userLoadoutType = ctx.query.type as
    | "LIKED"
    | "SAVED"
    | "PERSONAL"
    | undefined;

  await trpc.loadouts.getByUserId.prefetch({
    userId,
    type: userLoadoutType,
  });

  return {
    props: { ...userResponse, userLoadoutType, trpcState: trpc.dehydrate() },
  };
};

export default AuthUserProfilePage;
