import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  IconHeart,
  IconHeartFilled,
  IconBookmark,
  IconTrash,
} from "@tabler/icons-react";
import { bungieNetOrigin } from "~/bungie/constants";
import { Avatar } from "~/components/Avatar";
import { type EditorState } from "~/components/Editor";
import { IconButton } from "~/components/IconButton";
import { CharacterSockets } from "~/components/loadouts/CharacterSockets";
import { TypographyLarge, TypographySmall } from "~/components/typography";
import { useAuthUser } from "~/hooks/useAuthUser";
import { getServerAuthSession } from "~/server/auth";
import { trpcNext } from "~/utils/api";
import { trpsSSG } from "~/utils/ssg";
import { Button, ButtonLink } from "~/components/Button";
import { cn } from "~/utils/tailwind";
import { CharacterClassIconBackground } from "~/components/destiny/CharacterClassIconBackground";
import { LoadoutTagsList } from "~/components/loadouts/LoadoutTagsList";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";

interface LoadoutPageProps {
  loadoutId: string;
}

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
});

const LoadoutPage: NextPage<LoadoutPageProps> = ({ loadoutId }) => {
  const queryParams = { loadoutId };

  const router = useRouter();
  const trpcCtx = trpcNext.useContext();
  const [authUser] = useAuthUser();

  const { data } = trpcNext.loadouts.getById.useQuery(queryParams);

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getById.cancel(queryParams);

      const prevLoadout = await trpcCtx.loadouts.getById.getData(queryParams);

      trpcCtx.loadouts.getById.setData(queryParams, (old) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { inventoryItems, loadout } = old!;

        return {
          inventoryItems,
          loadout: handleAuthUserLoadoutLike({ loadout, loadoutId, authUser }),
        };
      });

      return { prevLoadout };
    },
    onError: (_, __, ctx) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      trpcCtx.loadouts.getById.setData(queryParams, ctx!.prevLoadout),
    onSettled: () => trpcCtx.loadouts.getById.invalidate(queryParams),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getById.cancel(queryParams);

      const prevLoadout = await trpcCtx.loadouts.getById.getData(queryParams);

      trpcCtx.loadouts.getById.setData(queryParams, (old) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { inventoryItems, loadout } = old!;

        return {
          inventoryItems,
          loadout: handleAuthUserLoadoutBookmark({
            loadout,
            loadoutId,
            authUser,
          }),
        };
      });

      return { prevLoadout };
    },
    onError: (_, __, ctx) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      trpcCtx.loadouts.getById.setData(queryParams, ctx!.prevLoadout),
    onSettled: () => trpcCtx.loadouts.getById.invalidate(queryParams),
  });

  const deleteLoadoutMutation = trpcNext.loadouts.delete.useMutation({
    onSuccess: () => router.push("/"),
  });

  const handleLikeLoadout = () => likeMutation.mutate({ loadoutId });
  const handleSaveLoadout = () => saveMutation.mutate({ loadoutId });

  const handleDeleteLoadout = () => deleteLoadoutMutation.mutate({ loadoutId });

  if (!data) return null;

  const {
    loadout: {
      description,
      items,
      name,
      tags,
      classType,
      likes,
      bookmarks,
      author: {
        bungieAccountProfilePicturePath,
        bungieAccountDisplayName,
        id: authorId,
      },
      _count: { likes: likesCount },
    },
    inventoryItems,
  } = data;

  const isLikedByAuthUser = !!likes.find(
    (like) => like.likedByUserId === authUser?.id
  );

  const isSavedByAuthUser = !!bookmarks.find(
    (like) => like.savedByUserId === authUser?.id
  );

  return (
    <div className="flex flex-col gap-6">
      <CharacterClassIconBackground classType={classType} />
      <div className="sticky top-0 z-10 flex h-fit items-center gap-4 border-b-2 bg-neutral-900 p-4 dark:border-b-neutral-700">
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
        {authUser?.id !== authorId && (
          <div className="border-r-2 border-neutral-700 pr-4 text-lg">
            <Button>Follow</Button>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <TypographyLarge>{name}</TypographyLarge>
          <LoadoutTagsList tags={tags} />
        </div>
        <TypographySmall>{likesCount}</TypographySmall>
        <IconButton
          onClick={handleLikeLoadout}
          icon={isLikedByAuthUser ? IconHeartFilled : IconHeart}
        />
        <IconButton
          className={isSavedByAuthUser ? "invert" : void 0}
          onClick={handleSaveLoadout}
          icon={IconBookmark}
        />
        {authUser && authUser.id === authorId && (
          <IconButton onClick={handleDeleteLoadout} icon={IconTrash} />
        )}
      </div>
      <div
        className={cn("grid grid-cols-1 gap-10", description && "grid-cols-2")}
      >
        {description && (
          <div className="sticky top-24 h-fit">
            <Editor
              initialState={description as unknown as EditorState}
              readOnly
            />
          </div>
        )}
        <div className="flex w-full justify-center">
          <CharacterSockets loadout={{ ...items, inventoryItems }} />
        </div>
      </div>
    </div>
  );
};

// export const getStaticPaths: GetStaticPaths = async () => ({
//   paths: [],
//   fallback: 'blocking'
// })

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   const loadoutId = ctx.params?.loadoutId as string;

//   const session = await getServerAuthSession(ctx);
// }

export const getServerSideProps: GetServerSideProps<LoadoutPageProps> = async (
  ctx
) => {
  const loadoutId = ctx.query.loadoutId as string;

  const session = await getServerAuthSession(ctx);

  const trpc = trpsSSG(session);

  await trpc.loadouts.getById.prefetch({ loadoutId });

  const loadout = await trpc.loadouts.getById.fetch({ loadoutId });

  if (!loadout)
    return {
      notFound: true,
    };

  return {
    props: {
      loadoutId,
    },
  };
};

export default LoadoutPage;
