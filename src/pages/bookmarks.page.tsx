import { type NextPage, type GetServerSideProps } from "next";
import { TypographyLarge } from "~/components/typography";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { useAuthUser } from "~/hooks/useAuthUser";
import { trpcNext } from "~/utils/api";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";
import { Seo } from "~/components/Seo";
import { APP_NAME } from "~/constants/app";

export const BookmarksPage: NextPage = () => {
  const [authUser] = useAuthUser();

  const { data } = trpcNext.loadouts.getAuthBookmarked.useQuery();

  const trpcCtx = trpcNext.useContext();

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getAuthBookmarked.cancel();

      const prevLoadouts = await trpcCtx.loadouts.getAuthBookmarked.getData();

      trpcCtx.loadouts.getAuthBookmarked.setData(void 0, (old) => ({
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
      trpcCtx.loadouts.getAuthBookmarked.setData(
        void 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevLoadouts
      ),
    onSettled: () => trpcCtx.loadouts.getAuthBookmarked.invalidate(),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getAuthBookmarked.cancel();

      const prevLoadouts = await trpcCtx.loadouts.getAuthBookmarked.getData();

      trpcCtx.loadouts.getAuthBookmarked.setData(void 9, (old) => ({
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
      trpcCtx.loadouts.getAuthBookmarked.setData(
        void 0,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevLoadouts
      ),
    onSettled: () => trpcCtx.loadouts.getAuthBookmarked.invalidate(),
  });

  const { loadouts, inventoryItems } = data || {};

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  return (
    <>
      <Seo
        title={`Bookmarks | ${APP_NAME}`}
        description="Saved loadouts page."
        noindex
        nofollow
      />
      <div className="grid grid-cols-1 gap-2">
        <TypographyLarge>Saved loadouts</TypographyLarge>
        {loadouts &&
          inventoryItems &&
          loadouts.map((loadout) => (
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const trpc = trpsSSG(session);

  await trpc.loadouts.getAuthBookmarked.prefetch();

  return {
    props: {},
  };
};

export default BookmarksPage;
