import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { IconLoaderSolid } from "~/icons";

export const Loader: React.FC<Omit<FontAwesomeIconProps, "icon">> = ({
  size = "lg",
  ...props
}) => (
  <FontAwesomeIcon
    icon={IconLoaderSolid}
    className="animate-spin"
    size={size}
    {...props}
  />
);
