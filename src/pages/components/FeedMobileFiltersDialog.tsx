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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select filters</DialogTitle>
        </DialogHeader>
        <FeedTabFilters {...props} />
        <FeedToggleFilters {...props} />
      </DialogContent>
    </Dialog>
  );
};
