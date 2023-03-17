import {
  DestinyItemSocket,
  DestinyItemSocketProps,
} from "../DestinyItemSocket";
import { LoadoutIcon, LoadoutIconProps } from "./LoadoutIcon";

interface LoadoutSocketProps extends LoadoutIconProps, DestinyItemSocketProps {}

export const LoadoutSocket: React.FC<LoadoutSocketProps> = ({
  iconImagePath,
  colorImagePath,
  ...props
}) => (
  <DestinyItemSocket {...props}>
    <LoadoutIcon {...{ iconImagePath, colorImagePath }} />
  </DestinyItemSocket>
);
