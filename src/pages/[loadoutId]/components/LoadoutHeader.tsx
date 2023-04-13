import { useRouter } from "next/router";
import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { TypographyLarge, TypographySmall } from "~/components/typography";
import { IconButton } from "~/components/IconButton";
import { ButtonLink } from "~/components/Button";
import { LoadoutTagsList } from "~/components/loadouts/LoadoutTagsList";
import { FollowButton } from "~/components/FollowButton";
import { cn } from "~/utils/tailwind";
import { useAuthUser } from "~/hooks/useAuthUser";
import { type RouterOutputs, trpcNext } from "~/utils/api";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";
import {
  IconBookmarkRegular,
  IconBookmarkSolid,
  IconHeartRegular,
  IconHeartSolid,
  IconPenToSqueareSolid,
  IconTrashSolid,
} from "~/icons";

interface LoadoutHeaderProps {
  loadout: NonNullable<RouterOutputs["loadouts"]["getById"]>["loadout"];
}

export const LoadoutHeader: React.FC<LoadoutHeaderProps> = ({
  loadout: {
    id: loadoutId,
    name: loadoutName,
    tags,
    author: {
      bungieAccountDisplayName,
      bungieAccountProfilePicturePath,
      id: authorId,
    },
  },
}) => {
  const loadoutLikesQueryParams = { loadoutId };

  const router = useRouter();
  const trpcCtx = trpcNext.useContext();
  const [authUser] = useAuthUser();

  const { data: likesData } = trpcNext.loadouts.getLoadoutLikes.useQuery(
    loadoutLikesQueryParams
  );

  const { data: canEdit = false } = trpcNext.loadouts.canEdit.useQuery(
    { loadoutId },
    {
      enabled: authUser?.id === authorId,
    }
  );

  const deleteLoadoutMutation = trpcNext.loadouts.delete.useMutation({
    onSuccess: () => router.push("/"),
  });

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getLoadoutLikes.cancel(loadoutLikesQueryParams);

      const prevData = await trpcCtx.loadouts.getLoadoutLikes.getData(
        loadoutLikesQueryParams
      );

      trpcCtx.loadouts.getLoadoutLikes.setData(
        loadoutLikesQueryParams,
        (loadout) =>
          handleAuthUserLoadoutLike({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            loadout: loadout!,
            loadoutId,
            authUser,
          })
      );

      return { prevData };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getLoadoutLikes.setData(
        loadoutLikesQueryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevData
      ),
    onSettled: () =>
      trpcCtx.loadouts.getLoadoutLikes.invalidate(loadoutLikesQueryParams),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getLoadoutLikes.cancel(loadoutLikesQueryParams);

      const prevData = await trpcCtx.loadouts.getLoadoutLikes.getData(
        loadoutLikesQueryParams
      );

      trpcCtx.loadouts.getLoadoutLikes.setData(
        loadoutLikesQueryParams,
        (loadout) =>
          handleAuthUserLoadoutBookmark({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            loadout: loadout!,
            loadoutId,
            authUser,
          })
      );

      return { prevData };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getLoadoutLikes.setData(
        loadoutLikesQueryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevData
      ),
    onSettled: () =>
      trpcCtx.loadouts.getLoadoutLikes.invalidate(loadoutLikesQueryParams),
  });

  const handleDeleteLoadout = () => deleteLoadoutMutation.mutate({ loadoutId });

  const handleLikeLoadout = () => {
    if (authUser) return likeMutation.mutate({ loadoutId });
    router.push("/login");
  };

  const handleSaveLoadout = () => {
    if (authUser) return saveMutation.mutate({ loadoutId });
    router.push("/login");
  };

  const { likes = [], bookmarks = [] } = likesData || {};

  const likesCount = likesData?._count.likes || 0;

  const isLikedByAuthUser = !!likes.find(
    (like) => like.likedByUserId === authUser?.id
  );

  const isSavedByAuthUser = !!bookmarks.find(
    (like) => like.savedByUserId === authUser?.id
  );

  return (
    <div className="sticky top-0 z-10 flex h-fit items-center gap-4 border-b-2 bg-neutral-900/50 p-4 backdrop-blur dark:border-b-neutral-700">
      <Avatar
        src={`${bungieNetOrigin}/${bungieAccountProfilePicturePath}`}
        fallback={bungieAccountDisplayName}
        size="xs"
      />
      <ButtonLink
        href={`/user/${authorId}`}
        variant="link"
        className={cn(
          "text-lg",
          authUser?.id === authorId &&
            "rounded-none border-r-2 border-neutral-700 pr-4"
        )}
      >
        {bungieAccountDisplayName}
      </ButtonLink>
      <FollowButton authUser={authUser} followUserId={authorId} />
      <div className="flex flex-1 flex-col justify-center gap-2">
        <TypographyLarge>{loadoutName}</TypographyLarge>
        {tags.length > 0 && (
          <LoadoutTagsList tags={tags.map(({ tag }) => tag)} />
        )}
      </div>
      <TypographySmall>{likesCount}</TypographySmall>
      <IconButton
        onClick={handleLikeLoadout}
        icon={isLikedByAuthUser ? IconHeartSolid : IconHeartRegular}
      />
      <IconButton
        onClick={handleSaveLoadout}
        icon={isSavedByAuthUser ? IconBookmarkSolid : IconBookmarkRegular}
      />
      {canEdit && (
        <IconButton href={`${loadoutId}/edit`} icon={IconPenToSqueareSolid} />
      )}
      {authUser && authUser.id === authorId && (
        <IconButton onClick={handleDeleteLoadout} icon={IconTrashSolid} />
      )}
    </div>
  );
};
