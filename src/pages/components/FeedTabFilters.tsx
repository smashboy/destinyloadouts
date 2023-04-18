import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/Select";
import { Tabs, TabsList, TabsTrigger } from "~/components/Tabs";
import { useAuthUser } from "~/hooks/useAuthUser";

export type FeedSectionFilter = "ALL" | "FOLLOWING";
export type FeedSortByFilter = "LATEST" | "POPULAR";
export type PopularDuring = "TODAY" | "WEEK" | "MONTH" | "ALL_TIME";

export interface FeedTabFiltersProps {
  section: FeedSectionFilter;
  sortBy: FeedSortByFilter;
  popularDuring: PopularDuring;
  onSectionChange: (section: FeedSectionFilter) => void;
  onSortByChange: (sortBy: FeedSortByFilter) => void;
  onPopularDuringChange: (sortBy: PopularDuring) => void;
}

export const FeedTabFilters: React.FC<FeedTabFiltersProps> = ({
  section,
  sortBy,
  popularDuring,
  onSectionChange,
  onSortByChange,
  onPopularDuringChange,
}) => {
  const [authUser] = useAuthUser();

  return (
    <div className="flex flex-col gap-2">
      {authUser && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Tabs value={section} onValueChange={onSectionChange}>
          <TabsList className="w-full md:w-fit">
            <TabsTrigger className="w-full md:w-fit" value="ALL">
              All
            </TabsTrigger>
            <TabsTrigger className="w-full md:w-fit" value="FOLLOWING">
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      <Tabs
        value={sortBy}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onValueChange={onSortByChange}
      >
        <TabsList className="w-full md:w-fit">
          <TabsTrigger className="w-full md:w-fit" value="LATEST">
            Latest
          </TabsTrigger>
          <TabsTrigger className="w-full md:w-fit" value="POPULAR">
            Popular
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {sortBy === "POPULAR" && (
        <Select value={popularDuring} onValueChange={onPopularDuringChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL_TIME">All Time</SelectItem>
            <SelectItem value="MONTH">This Month</SelectItem>
            <SelectItem value="WEEK">This Week</SelectItem>
            <SelectItem value="TODAY">Today</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
