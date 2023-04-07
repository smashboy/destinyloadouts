import { IconLoader2 } from "@tabler/icons-react";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  size?: LoaderSize;
}

const sizMap: Record<LoaderSize, number> = {
  sm: 14,
  md: 24,
  lg: 32,
};

export const Loader: React.FC<LoaderProps> = ({ size = "md" }) => (
  <IconLoader2 className="animate-spin" size={sizMap[size]} />
);
