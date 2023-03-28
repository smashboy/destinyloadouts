import { forwardRef } from "react";
import { Label } from "./Label";
import { cn } from "~/utils/tailwind";

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={label}>{label}</Label>
      <input
        id={label}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
);
