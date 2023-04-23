import { useMemo, forwardRef } from "react";
import { type NextPage } from "next";
import { Virtuoso, type Components } from "react-virtuoso";
import { TypographyLarge } from "~/components/typography";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { useAuthUser } from "~/hooks/useAuthUser";
import { trpcNext } from "~/utils/api";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";
import { Seo } from "~/components/Seo";
import { DataContainer } from "~/components/DataContainer";
import { FooterLoader } from "~/components/FooterLoader";

const BookmarksPage: NextPage = () => {
  const [authUser] = useAuthUser();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpcNext.loadouts.getAuthBookmarked.useInfiniteQuery(
      {},
      {
        getNextPageParam: (page) => page.nextPage,
      }
    );

  const trpcCtx = trpcNext.useContext();

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getAuthBookmarked.cancel();

      const prevLoadouts =
        await trpcCtx.loadouts.getAuthBookmarked.getInfiniteData();

      trpcCtx.loadouts.getAuthBookmarked.setInfiniteData({}, (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map(({ loadouts, ...page }) => ({
            ...page,
            loadouts: loadouts.map((loadout) =>
              handleAuthUserLoadoutLike({ loadout, loadoutId, authUser })
            ),
          })),
        };
      });

      return { prevLoadouts };
    },
    onError: (_, __, ctx) => {
      if (ctx)
        trpcCtx.loadouts.getAuthBookmarked.setInfiniteData(
          {},
          ctx.prevLoadouts
        );
    },
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getAuthBookmarked.cancel();

      const prevLoadouts =
        await trpcCtx.loadouts.getAuthBookmarked.getInfiniteData();

      trpcCtx.loadouts.getAuthBookmarked.setInfiniteData({}, (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map(({ loadouts, ...page }) => ({
            ...page,
            loadouts: loadouts.map((loadout) =>
              handleAuthUserLoadoutBookmark({ loadout, loadoutId, authUser })
            ),
          })),
        };
      });

      return { prevLoadouts };
    },
    onError: (_, __, ctx) => {
      if (ctx)
        trpcCtx.loadouts.getAuthBookmarked.setInfiniteData(
          {},
          ctx.prevLoadouts
        );
    },
  });

  const { pages = [] } = data || {};

  const loadouts = pages.map((page) => page.loadouts).flat();
  const inventoryItems = pages.reduce(
    (acc, page) => ({ ...acc, ...page.inventoryItems }),
    {}
  );

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  const handleLoadMoreLoadouts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const components: Components<typeof loadouts> = useMemo(
    () => ({
      List: forwardRef(({ children, style }, ref) => (
        <div
          ref={ref}
          className="grid grid-cols-1 gap-2 py-4 pl-2 pr-3 md:pr-2 md:pl-4"
          style={style}
        >
          {children}
        </div>
      )),
      Footer: () => <FooterLoader hasNextPage={hasNextPage} />,
    }),
    [hasNextPage]
  );

  return (
    <>
      <Seo
        title="Bookmarks"
        description="Saved loadouts page."
        noindex
        nofollow
      />
      <div className="grid grid-cols-1 gap-2">
        <TypographyLarge>Saved loadouts</TypographyLarge>
        <DataContainer
          isLoading={isLoading}
          showMessage={loadouts.length === 0}
          title="You don't have saved loadouts."
          description="Checkout available loadouts and bookmark some of them."
        >
          <Virtuoso
            data={loadouts}
            endReached={handleLoadMoreLoadouts}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            components={components}
            itemContent={(_, loadout) => (
              <LoadoutPreviewCard
                key={loadout.id}
                loadout={loadout}
                inventoryItems={inventoryItems}
                authUser={authUser}
                onLike={handleLikeLoadout}
                onSave={handleSaveLoadout}
              />
            )}
            useWindowScroll
          />
        </DataContainer>
      </div>
    </>
  );
};

export default BookmarksPage;
