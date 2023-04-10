import { useState, forwardRef } from "react";
import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
} from "@prisma/client";
import { useDebounce } from "use-debounce";
import { Virtuoso, type Components } from "react-virtuoso";
import { type RouterOutputs, trpcNext } from "~/utils/api";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { useAuthUser } from "~/hooks/useAuthUser";
import { Tabs, TabsList, TabsTrigger } from "~/components/Tabs";
import { ToggleGroup, type ToggleGroupOption } from "~/components/ToggleGroup";
import { TypographySmall } from "~/components/typography";
import {
  characterClassIconPathMap,
  characterClassTitleMap,
  damageTypeIconPathMap,
  damageTypeTitleMap,
  damageTypesList,
  destinyCharacterClassTypesList,
  loadoutTagIconsMap,
  loadoutTagTitlesMap,
  loadoutTagsList,
} from "~/constants/loadouts";
import { type NextPageWithLayout } from "./_app.page";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";

const components: Components<RouterOutputs["loadouts"]["feed"]["loadouts"]> = {
  List: forwardRef(({ children, style }, ref) => (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-2 py-4 pl-4 pr-2"
      style={style}
    >
      {children}
    </div>
  )),
};

interface FeedFilter {
  classTypes: DestinyClassType[];
  subclassTypes: DestinyDamageType[];
  tags: LoadoutTag[];
  section: "ALL" | "FOLLOWING";
  sortBy: "LATEST" | "POPULAR";
  popularDuring: "TODAY" | "WEEK" | "MONTH" | "ALL_TIME";
}

const initialFeedFilter: FeedFilter = {
  classTypes: [],
  subclassTypes: [],
  tags: [],
  section: "ALL",
  sortBy: "LATEST",
  popularDuring: "WEEK",
};

const classTypeFilerOptions: ToggleGroupOption[] =
  destinyCharacterClassTypesList.map((type) => ({
    value: type,
    iconPath: characterClassIconPathMap[type],
    title: characterClassTitleMap[type],
  }));

const subclassTypeFilerOptions: ToggleGroupOption[] = damageTypesList.map(
  (type) => ({
    value: type,
    iconPath: damageTypeIconPathMap[type],
    title: damageTypeTitleMap[type],
  })
);

const loadoutTagFilterOptions: ToggleGroupOption[] = loadoutTagsList.map(
  (tag) => ({
    value: tag,
    iconPath: loadoutTagIconsMap[tag],
    title: loadoutTagTitlesMap[tag],
  })
);

const Home: NextPageWithLayout = () => {
  const [authUser] = useAuthUser();

  const [filter, setFilter] = useState(initialFeedFilter);

  const [debouncedFilter] = useDebounce(filter, 500);

  const trpcCtx = trpcNext.useContext();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
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

      trpcCtx.loadouts.feed.setInfiniteData(debouncedFilter, (old) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...old!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pages: old!.pages.map(({ loadouts, ...page }) => ({
          ...page,
          loadouts: loadouts.map((loadout) =>
            handleAuthUserLoadoutLike({ loadout, loadoutId, authUser })
          ),
        })),
      }));

      return { prevFeed };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.feed.setInfiniteData(
        debouncedFilter,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevFeed
      ),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.feed.cancel();

      const prevFeed = await trpcCtx.loadouts.feed.getInfiniteData(
        debouncedFilter
      );

      trpcCtx.loadouts.feed.setInfiniteData(debouncedFilter, (old) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...old!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pages: old!.pages.map(({ loadouts, ...page }) => ({
          ...page,
          loadouts: loadouts.map((loadout) =>
            handleAuthUserLoadoutBookmark({ loadout, loadoutId, authUser })
          ),
        })),
      }));

      return { prevFeed };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.feed.setInfiniteData(
        debouncedFilter,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevFeed
      ),
  });

  const { pages = [] } = data || {};

  const loadouts = pages.map((page) => page.loadouts).flat();
  const inventoryItems = pages.reduce(
    (acc, page) => ({ ...acc, ...page.inventoryItems }),
    {}
  );

  const handleSectionFilter = (section: string) =>
    setFilter((prev) => ({
      ...prev,
      section: section as FeedFilter["section"],
    }));

  const handleSortByFilter = (sortBy: string) =>
    setFilter((prev) => ({ ...prev, sortBy: sortBy as FeedFilter["sortBy"] }));

  const handleClassFilter = (classTypes: string[]) =>
    setFilter((prev) => ({
      ...prev,
      classTypes: classTypes as FeedFilter["classTypes"],
    }));

  const handleSubClassFilter = (subclassTypes: string[]) =>
    setFilter((prev) => ({
      ...prev,
      subclassTypes: subclassTypes as FeedFilter["subclassTypes"],
    }));

  const handleTagsFilter = (tags: string[]) =>
    setFilter((prev) => ({ ...prev, tags: tags as FeedFilter["tags"] }));

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  const handleLoadMoreLoadouts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <Virtuoso
        data={loadouts}
        overscan={15}
        className="col-span-3 mt-3"
        endReached={handleLoadMoreLoadouts}
        style={{ height: "calc(100vh - 15px)" }}
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
      <div className="sticky top-0 flex h-screen flex-col gap-2 border-l border-neutral-700 bg-neutral-900 p-4">
        {authUser && (
          <Tabs value={filter.section} onValueChange={handleSectionFilter}>
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="FOLLOWING">Following</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <Tabs value={filter.sortBy} onValueChange={handleSortByFilter}>
          <TabsList>
            <TabsTrigger value="LATEST">Latest</TabsTrigger>
            <TabsTrigger value="POPULAR">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
        <TypographySmall>Classes:</TypographySmall>
        <ToggleGroup
          selected={filter.classTypes}
          onChange={handleClassFilter}
          options={classTypeFilerOptions}
        />
        <TypographySmall>Subclasses:</TypographySmall>
        <ToggleGroup
          selected={filter.subclassTypes}
          onChange={handleSubClassFilter}
          options={subclassTypeFilerOptions}
          disableSolid
        />
        <TypographySmall>Tags:</TypographySmall>
        <ToggleGroup
          selected={filter.tags}
          onChange={handleTagsFilter}
          options={loadoutTagFilterOptions}
          disableSolid
        />
      </div>
    </div>
  );
};

Home.disableContainer = true;

export default Home;
