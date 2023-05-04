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
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={`${bungieNetOrigin}/${colorImagePath}`}
      alt="Loadout icon color"
      className="absolute inset-0"
    />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={`${bungieNetOrigin}/${iconImagePath}`}
      alt="Loadout icon"
      className="absolute inset-0"
    />
  </div>
);
