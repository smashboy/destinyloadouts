import { forwardRef, useState } from "react";
import { type NextPage } from "next";
import Image from "next/image";
import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
} from "@prisma/client";
import { VirtuosoGrid, type Components } from "react-virtuoso";
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
} from "~/constants/loadouts";

const components: Components = {
  List: forwardRef(({ children, style }, ref) => (
    <div ref={ref} className="grid grid-cols-2 gap-2 pr-4" style={style}>
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

const Home: NextPage = () => {
  const [authUser] = useAuthUser();

  const [filter, setFilter] = useState(initialFeedFilter);

  const { data } = trpcNext.loadouts.feed.useInfiniteQuery({ ...filter });

  if (!data) return null;

  const loadouts = data.pages.map((page) => page.loadouts).flat();
  const inventoryItems = data.pages.reduce(
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

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="sticky top-0 z-10 flex h-fit items-center gap-2 border-b-2 border-neutral-700 bg-neutral-900 p-4">
        <Tabs
          value={filter.section}
          onValueChange={handleSectionFilter}
          className="border-r border-neutral-700 pr-2"
        >
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="FOLLOWING">Following</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          value={filter.sortBy}
          onValueChange={handleSortByFilter}
          className="border-r border-neutral-700 pr-2"
        >
          <TabsList>
            <TabsTrigger value="LATEST">Latest</TabsTrigger>
            <TabsTrigger value="POPULAR">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
        <TypographySmall>Class:</TypographySmall>
        <ToggleGroup
          className="border-r border-neutral-700 pr-2"
          selected={filter.classTypes}
          onChange={handleClassFilter}
          options={classTypeFilerOptions}
        />
        <TypographySmall>Subclass:</TypographySmall>
        <ToggleGroup
          selected={filter.subclassTypes}
          onChange={handleSubClassFilter}
          options={subclassTypeFilerOptions}
        />
      </div>
      <VirtuosoGrid
        data={loadouts}
        overscan={15}
        // className="pr-4"
        style={{ height: "calc(100vh - 110px)" }}
        components={components}
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
    </div>
  );
};

export default Home;
