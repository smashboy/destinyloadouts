import { forwardRef } from "react";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { cn } from "~/utils/tailwind";

export type IconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  icon: IconProp;
  iconProps?: Omit<FontAwesomeIconProps, "icon">;
  iconClassName?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, iconClassName, iconProps, ...props }) => (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-transparent p-1 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-neutral-500  dark:hover:text-slate-100 dark:focus:ring-slate-400",
        className
      )}
      {...props}
    >
      <FontAwesomeIcon
        className={iconClassName}
        size="lg"
        {...iconProps}
        icon={icon}
      />
    </button>
  )
);
