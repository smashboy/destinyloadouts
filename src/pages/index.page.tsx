import { useState, forwardRef, useMemo } from "react";
import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
} from "@prisma/client";
import { useDebounce } from "use-debounce";
import { useMediaQuery } from "react-responsive";
import { Virtuoso, type Components } from "react-virtuoso";
import { type RouterOutputs, trpcNext } from "~/utils/api";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { useAuthUser } from "~/hooks/useAuthUser";
import { type NextPageWithLayout } from "./_app.page";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";
import { PUBLIC_URL } from "~/constants/app";
import { Seo } from "~/components/Seo";
import { DataContainer } from "~/components/DataContainer";
import {
  type FeedSectionFilter,
  FeedTabFilters,
  type FeedSortByFilter,
} from "./components/FeedTabFilters";
import { FeedToggleFilters } from "./components/FeedToggleFilters";
import { FeedMobileFiltersDialog } from "./components/FeedMobileFiltersDialog";
import { FooterLoader } from "~/components/FooterLoader";

export interface FeedFilter {
  classTypes: DestinyClassType[];
  subclassTypes: DestinyDamageType[];
  tags: LoadoutTag[];
  section: FeedSectionFilter;
  sortBy: FeedSortByFilter;
  popularDuring: "TODAY" | "WEEK" | "MONTH" | "ALL_TIME";
}

const initialFeedFilter: FeedFilter = {
  classTypes: [],
  subclassTypes: [],
  tags: [],
  section: "ALL",
  sortBy: "LATEST",
  popularDuring: "MONTH",
};

const Home: NextPageWithLayout = () => {
  const [authUser] = useAuthUser();

  const isMD = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const [filter, setFilter] = useState(initialFeedFilter);

  const [debouncedFilter] = useDebounce(filter, 500);

  const trpcCtx = trpcNext.useContext();

  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    trpcNext.loadouts.feed.useInfiniteQuery(
      {
        ...debouncedFilter,
      },
      {
        getNextPageParam: (page) => page.nextPage,
      }
    );

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.feed.cancel();

      const prevFeed = await trpcCtx.loadouts.feed.getInfiniteData(
        debouncedFilter
      );

      trpcCtx.loadouts.feed.setInfiniteData(debouncedFilter, (prev) => {
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

      return { prevFeed };
    },
    onError: (_, __, ctx) => {
      if (ctx)
        trpcCtx.loadouts.feed.setInfiniteData(debouncedFilter, ctx.prevFeed);
    },
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.feed.cancel();

      const prevFeed = await trpcCtx.loadouts.feed.getInfiniteData(
        debouncedFilter
      );

      trpcCtx.loadouts.feed.setInfiniteData(debouncedFilter, (prev) => {
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

      return { prevFeed };
    },
    onError: (_, __, ctx) => {
      if (ctx)
        trpcCtx.loadouts.feed.setInfiniteData(debouncedFilter, ctx.prevFeed);
    },
  });

  const { pages = [] } = data || {};

  const loadouts = pages.map((page) => page.loadouts).flat();
  const inventoryItems = pages.reduce(
    (acc, page) => ({ ...acc, ...page.inventoryItems }),
    {}
  );

  const handleSectionFilter = (section: FeedFilter["section"]) =>
    setFilter((prev) => ({
      ...prev,
      section,
    }));

  const handleSortByFilter = (sortBy: FeedFilter["sortBy"]) =>
    setFilter((prev) => ({ ...prev, sortBy }));

  const handleClassFilter = (classTypes: FeedFilter["classTypes"]) =>
    setFilter((prev) => ({
      ...prev,
      classTypes,
    }));

  const handleSubClassFilter = (subclassTypes: FeedFilter["subclassTypes"]) =>
    setFilter((prev) => ({
      ...prev,
      subclassTypes,
    }));

  const handleTagsFilter = (tags: FeedFilter["tags"]) =>
    setFilter((prev) => ({ ...prev, tags }));

  const handlePopularDuring = (popularDuring: FeedFilter["popularDuring"]) =>
    setFilter((prev) => ({ ...prev, popularDuring }));

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  const handleLoadMoreLoadouts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const components: Components<RouterOutputs["loadouts"]["feed"]["loadouts"]> =
    useMemo(
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
        title="Home"
        description="Share your destiny 2 in game loadouts with other players."
        canonical={PUBLIC_URL}
      />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <div className="flex gap-2 px-2 pt-2 md:hidden">
          <FeedMobileFiltersDialog
            classTypes={filter.classTypes}
            subclassTypes={filter.subclassTypes}
            tags={filter.tags}
            section={filter.section}
            sortBy={filter.sortBy}
            popularDuring={filter.popularDuring}
            onPopularDuringChange={handlePopularDuring}
            onSectionChange={handleSectionFilter}
            onSortByChange={handleSortByFilter}
            onClassFilterChange={handleClassFilter}
            onSubClassFilterChange={handleSubClassFilter}
            onTagsFilterChange={handleTagsFilter}
          />
        </div>
        <div className="md:col-span-3 md:mt-3">
          <DataContainer
            title="Loadouts not found"
            description="Try changing filters to get better results."
            isLoading={isLoading}
            showMessage={loadouts.length === 0}
          >
            <Virtuoso
              data={loadouts}
              endReached={handleLoadMoreLoadouts}
              style={{ height: `calc(100vh - ${isMD ? 45 : 195}px)` }}
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
            />
          </DataContainer>
        </div>
        <div
          className="sticky top-0 hidden flex-col gap-2 border-l border-neutral-700 bg-neutral-900 p-4 md:flex"
          style={{ height: "calc(100vh - 32px)" }}
        >
          <FeedTabFilters
            section={filter.section}
            sortBy={filter.sortBy}
            popularDuring={filter.popularDuring}
            onPopularDuringChange={handlePopularDuring}
            onSectionChange={handleSectionFilter}
            onSortByChange={handleSortByFilter}
          />
          <FeedToggleFilters
            classTypes={filter.classTypes}
            subclassTypes={filter.subclassTypes}
            tags={filter.tags}
            onClassFilterChange={handleClassFilter}
            onSubClassFilterChange={handleSubClassFilter}
            onTagsFilterChange={handleTagsFilter}
          />
        </div>
      </div>
    </>
  );
};

Home.disableContainer = true;

export default Home;
