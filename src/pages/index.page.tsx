import { useState } from "react";
import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
} from "@prisma/client";
import { useDebounce } from "use-debounce";
import { Virtuoso } from "react-virtuoso";
import { trpcNext } from "~/utils/api";
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

// const components: Components = {
//   List: forwardRef(({ children, style }, ref) => (
//     <div ref={ref} className="grid grid-cols-2 gap-2 pr-4" style={style}>
//       {children}
//     </div>
//   )),
// };

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
  popularDuring: "TODAY",
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

  const { data } = trpcNext.loadouts.feed.useInfiniteQuery({
    ...debouncedFilter,
  });

  const { pages = [] } = data || {};

  const loadouts = pages.map((page) => page.loadouts).flat();
  const inventoryItems = pages.reduce(
    (acc, page) => ({ ...acc, ...page.inventoryItems }),
    {}
  );

  const handleSectionFilter = (section: FeedFilter["section"]) =>
    setFilter((prev) => ({ ...prev, section }));

  const handleSortByFilter = (sortBy: FeedFilter["sortBy"]) =>
    setFilter((prev) => ({ ...prev, sortBy }));

  const handleClassFilter = (classTypes: FeedFilter["classTypes"]) =>
    setFilter((prev) => ({ ...prev, classTypes }));

  const handleSubClassFilter = (subclassTypes: FeedFilter["subclassTypes"]) =>
    setFilter((prev) => ({ ...prev, subclassTypes }));

  const handleTagsFilter = (tags: FeedFilter["tags"]) =>
    setFilter((prev) => ({ ...prev, tags }));

  return (
    <div className="grid grid-cols-4 gap-2">
      <Virtuoso
        data={loadouts}
        overscan={15}
        className="col-span-3"
        // style={{ height: "calc(100vh - 110px)" }}
        // components={components}
        useWindowScroll
        itemContent={(_, loadout) => (
          <LoadoutPreviewCard
            key={loadout.id}
            loadout={loadout}
            inventoryItems={inventoryItems}
            authUser={authUser}
            onLike={() => {}}
            onSave={() => {}}
          />
        )}
      />
      <div className="sticky top-4 z-10 flex h-fit flex-col gap-2 rounded border-2 border-neutral-700 bg-neutral-900 p-4">
        <Tabs value={filter.section} onValueChange={handleSectionFilter}>
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="FOLLOWING">Following</TabsTrigger>
          </TabsList>
        </Tabs>
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
