import { Button } from "~/components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import { IconFilterSolid } from "~/icons";
import {
  FeedToggleFilters,
  type FeedToggleFiltersProps,
} from "./FeedToggleFilters";
import { type FeedTabFiltersProps, FeedTabFilters } from "./FeedTabFilters";

export const FeedMobileFiltersDialog: React.FC<
  FeedToggleFiltersProps & FeedTabFiltersProps
> = (props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button iconLeft={IconFilterSolid}>Filters</Button>
      </DialogTrigger>
      <DialogContent className="h-[75vh] p-0">
        <DialogHeader className="pt-6">
          <DialogTitle>Select filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 overflow-auto p-6">
          <FeedTabFilters {...props} />
          <FeedToggleFilters {...props} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
