import { forwardRef } from "react";

interface TypographyCommonProps {
  children?: React.ReactNode;
}

export const TypographyLarge = forwardRef<
  HTMLDivElement,
  TypographyCommonProps
>(({ children }, ref) => (
  <div
    ref={ref}
    className="text-lg font-semibold text-slate-900 dark:text-slate-50"
  >
    {children}
  </div>
));
