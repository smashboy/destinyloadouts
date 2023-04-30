import Image from "next/image";
import { LoadoutTag } from "@prisma/client";
import { TypographySmall } from "../typography";
import { Separator } from "../Separator";
import { LoadoutTagIconsMap, LoadoutTagTitlesMap } from "~/constants/loadouts";
import { cn } from "~/utils/tailwind";

interface LoadoutTagsListProps {
  tags: LoadoutTag[];
}

export const LoadoutTagsList: React.FC<LoadoutTagsListProps> = ({ tags }) => (
  <span className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span key={tag} className="flex items-center gap-2">
        {LoadoutTagIconsMap[tag] && (
          <Image
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            src={LoadoutTagIconsMap[tag]!}
            width={18}
            height={18}
            alt="Loadout tag icon"
            className={cn(
              "dark:invert",
              tag === LoadoutTag.DUNGEON && "scale-[2.5]"
            )}
          />
        )}
        <TypographySmall>{LoadoutTagTitlesMap[tag]}</TypographySmall>
        <Separator orientation="vertical" />
      </span>
    ))}
  </span>
);
