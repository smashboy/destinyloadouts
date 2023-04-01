import { type Icon } from "@tabler/icons-react";
import { forwardRef } from "react";
import { cn } from "~/utils/tailwind";

export type IconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  icon: Icon;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon: Icon, ...props }) => (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-transparent p-1 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-neutral-500  dark:hover:text-slate-100 dark:focus:ring-slate-400",
        className
      )}
      {...props}
    >
      <Icon />
    </button>
  )
);
