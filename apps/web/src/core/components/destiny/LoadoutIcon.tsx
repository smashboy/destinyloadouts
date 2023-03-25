import { bungieNetOrigin } from "@destiny/shared/constants";
import Image from "next/image";

export interface LoadoutIconProps {
  iconImagePath: string;
  colorImagePath: string;
}

export const LoadoutIcon: React.FC<LoadoutIconProps> = ({
  iconImagePath,
  colorImagePath,
}) => (
  <div className="relative rounded overflow-hidden w-full h-full">
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
