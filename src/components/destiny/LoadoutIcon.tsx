import Image from "next/image";
import { bungieNetOrigin } from "~/bungie/constants";

export interface LoadoutIconProps {
  iconImagePath: string;
  colorImagePath: string;
}

export const LoadoutIcon: React.FC<LoadoutIconProps> = ({
  iconImagePath,
  colorImagePath,
}) => (
  <div className="relative h-full w-full overflow-hidden rounded">
    <Image
      src={`${bungieNetOrigin}/${colorImagePath}`}
      alt="Loadout icon color"
      fill
    />
    <Image
      src={`${bungieNetOrigin}/${iconImagePath}`}
      alt="Loadout icon"
      fill
    />
  </div>
);
