import Image from "next/image";
import {
  LoadoutStatIconsMap,
  type LoadoutStatsListType,
} from "~/constants/loadouts";
import { TypographyLarge, TypographySmall } from "../typography";
import { LoadoutSectionContainer } from "./LoadoutSectionContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconArrowRight } from "~/icons";

interface LoadoutStatsPriorityListProps {
  stats: LoadoutStatsListType;
}

export const LoadoutStatsPriorityList: React.FC<
  LoadoutStatsPriorityListProps
> = ({ stats }) => (
  <div className="flex flex-col gap-2">
    <TypographyLarge>Stats priority</TypographyLarge>
    <LoadoutSectionContainer className="flex gap-2">
      {stats.map((stat, index) => (
        <div key={stat} className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={LoadoutStatIconsMap[stat]}
              width={26}
              height={26}
              alt="Loadout stat priority icon"
              className="dark:invert"
            />
            <TypographySmall className="absolute -bottom-1.5 -right-1.5">
              {index + 1}
            </TypographySmall>
          </div>
          {index < stats.length - 1 && (
            <FontAwesomeIcon icon={IconArrowRight} />
          )}
        </div>
      ))}
    </LoadoutSectionContainer>
  </div>
);
