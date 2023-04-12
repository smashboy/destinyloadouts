import { useRouter } from "next/router";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { Tabs } from "~/components/Tabs";
import { trpcNext } from "~/utils/api";
import { useAuthUser } from "~/hooks/useAuthUser";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";
import { type UserProfilePageProps } from "../index.page";
import { AccountHeader } from "./AccountHeader";
import { MessageContainer } from "~/components/MessageContainer";

interface UserProfilePageComponentProps extends UserProfilePageProps {
  onlyAuthUserLikedLoadouts?: boolean;
}

export const UserProfilePageComponent: React.FC<
  UserProfilePageComponentProps
> = ({
  loadouts: { loadouts, inventoryItems },
  user,
  // onlyAuthUserLikedLoadouts = false,
}) => {
  const { id: userId } = user;

  const router = useRouter();
  const trpcCtx = trpcNext.useContext();
  const [authUser] = useAuthUser();

  const loadoutIds = loadouts.map((loadout) => loadout.id);

  const likesListQueryParams = { loadoutIds };

  const { data: likes = {} } = trpcNext.loadouts.getLoadoutLikesList.useQuery(
    likesListQueryParams,
    {
      enabled: loadoutIds.length > 0,
    }
  );

  const loadoutsWithLikes = loadouts.map((loadout) => ({
    ...loadout,
    ...likes[loadout.id],
  }));
  // .filter((loadout) =>
  //   onlyAuthUserLikedLoadouts
  //     ? loadout.likes?.find((like) => like.likedByUserId === authUser?.id)
  //     : true
  // );

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getLoadoutLikesList.cancel(likesListQueryParams);

      const prevLikes = await trpcCtx.loadouts.getLoadoutLikesList.getData(
        likesListQueryParams
      );

      trpcCtx.loadouts.getLoadoutLikesList.setData(
        likesListQueryParams,
        (loadouts) => {
          const updatedLoadouts = loadouts ? { ...loadouts } : {};

          for (const [id, loadout] of Object.entries(updatedLoadouts)) {
            updatedLoadouts[id] = handleAuthUserLoadoutLike({
              loadout,
              loadoutId,
              authUser,
            });
          }

          return updatedLoadouts;
        }
      );

      return { prevLikes };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getLoadoutLikesList.setData(
        likesListQueryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevLikes
      ),
    onSettled: () =>
      Promise.all([
        trpcCtx.loadouts.getLoadoutLikesList.invalidate(likesListQueryParams),
        trpcCtx.users.getGeneralStats.invalidate({ userId }),
      ]),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getLoadoutLikesList.cancel(likesListQueryParams);

      const prevLikes = await trpcCtx.loadouts.getLoadoutLikesList.getData(
        likesListQueryParams
      );

      trpcCtx.loadouts.getLoadoutLikesList.setData(
        likesListQueryParams,
        (loadouts) => {
          const updatedLoadouts = loadouts ? { ...loadouts } : {};

          for (const [id, loadout] of Object.entries(updatedLoadouts)) {
            updatedLoadouts[id] = handleAuthUserLoadoutBookmark({
              loadout,
              loadoutId,
              authUser,
            });
          }

          return updatedLoadouts;
        }
      );

      return { prevLikes };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getLoadoutLikesList.setData(
        likesListQueryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevLikes
      ),
    onSettled: () =>
      trpcCtx.loadouts.getLoadoutLikesList.invalidate(likesListQueryParams),
  });

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  return (
    <Tabs
      value={router.route.endsWith("/liked") ? "LIKED" : "PERSONAL"}
      className="grid grid-cols-1 gap-4"
    >
      <AccountHeader user={user} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {loadoutsWithLikes.length === 0 ? (
          <MessageContainer
            title="Loadouts not found"
            description="This user has no loadouts, please come back later."
          />
        ) : (
          loadoutsWithLikes.map((loadout) => (
            <LoadoutPreviewCard
              key={loadout.id}
              loadout={loadout}
              inventoryItems={inventoryItems}
              onLike={handleLikeLoadout}
              onSave={handleSaveLoadout}
              authUser={authUser}
            />
          ))
        )}
      </div>
    </Tabs>
  );
};
