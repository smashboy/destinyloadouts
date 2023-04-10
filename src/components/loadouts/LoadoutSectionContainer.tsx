import { cn } from "~/utils/tailwind";

interface LoadoutSectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const LoadoutSectionContainer: React.FC<
  LoadoutSectionContainerProps
> = ({ children, className }) => (
  <div
    className={cn(
      "rounded border-2 border-neutral-400 bg-neutral-700 p-4",
      className
    )}
  >
    {children}
  </div>
);
