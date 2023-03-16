import { forwardRef } from "react";
import { cn } from "../utils";

type TypographyCommonProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode;
};

export const TypographyLarge = forwardRef<
  HTMLDivElement,
  TypographyCommonProps
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-lg font-semibold text-slate-900 dark:text-slate-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

export const TypographySmall = forwardRef<
  HTMLDivElement,
  TypographyCommonProps
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-slate-900 dark:text-slate-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

export const TypographySubtle = forwardRef<
  HTMLDivElement,
  TypographyCommonProps
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  >
    {children}
  </div>
));
