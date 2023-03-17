import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutIcon, LoadoutIconProps } from "./LoadoutIcon";

interface LoadoutSocketProps extends LoadoutIconProps, ItemSocketProps {}

export const LoadoutSocket: React.FC<LoadoutSocketProps> = ({
  iconImagePath,
  colorImagePath,
  ...props
}) => (
  <ItemSocket {...props}>
    <LoadoutIcon {...{ iconImagePath, colorImagePath }} />
  </ItemSocket>
);
