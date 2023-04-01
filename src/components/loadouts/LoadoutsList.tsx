import { type Loadout } from "@prisma/client";
import { Virtuoso, type Components } from "react-virtuoso";
import { cn } from "~/utils/tailwind";
import { forwardRef } from "react";
import { cx } from "class-variance-authority";

interface LoadoutsListProps {
  loadouts: Loadout[];
  className: string;
  hasMore: boolean;
  isLoading: boolean;
  onFetchMore: () => void;
}

const components: Components = {
  List: forwardRef(({ style, children }, listRef) => {
    return (
      <div className="flex flex-col gap-3" ref={listRef} style={style}>
        {children}
      </div>
    );
  }),
  Item: ({ children, ...props }) => {
    return (
      <div
        // hover:ring-2 hover:ring-slate-300 hover:ring-offset-4 focus:ring-2 focus:ring-slate-300 focus:ring-offset-4
        className="relative w-full overflow-hidden rounded transition duration-300 ease-out dark:bg-neutral-800 hover:dark:bg-neutral-700"
        {...props}
        style={{ margin: 0 }}
      >
        {children}
      </div>
    );
  },
};

export const LoadoutsList: React.FC<LoadoutsListProps> = ({
  hasMore,
  loadouts,
  className,
  isLoading,
  onFetchMore,
}) => {
  const handleLoadMore = () => {
    if (hasMore && !isLoading) onFetchMore();
  };

  // return (
  //   <div className={cn("flex flex-col gap-2", className)}>
  //     {loadouts.map((loadout) => (
  //       <LoadoutPreviewCard key={loadout.id} loadout={loadout} />
  //     ))}
  //   </div>
  // );

  return (
    <Virtuoso
      className={className}
      style={{ height: 300 }}
      data={loadouts}
      endReached={handleLoadMore}
      components={components}
      useWindowScroll
    />
  );
};
