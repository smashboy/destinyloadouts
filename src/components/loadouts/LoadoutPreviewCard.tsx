import Link from "next/link";
import Image from "next/image";
import { type Loadout, DestinyDamageType } from "@prisma/client";
import {
  characterClassIconPathMap,
  damageTypeIconPathMap,
  damageTypesColorMap,
} from "~/constants/loadouts";
import { TypographyLarge, TypographySmall } from "../typography";
import { Separator } from "../Separator";

interface LoadoutPreviewCardProps {
  loadout: Loadout;
}

export const LoadoutPreviewCard: React.FC<LoadoutPreviewCardProps> = ({
  loadout: { authorId, id, classType, subclassType, tags, name },
}) => {
  const loadoutLink = `${authorId}/${id}`;

  const classIcon = characterClassIconPathMap[classType];
  const subclassIcon = damageTypeIconPathMap[subclassType];

  return (
    <Link href={loadoutLink}>
      {/* <span
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          backgroundColor: damageTypesColorMap[DestinyDamageType.ARC],
          // opacity: 0.3,
          boxShadow: "rgba(121, 187, 232, 1) -20px 0px 20px 20px",
        }}
      /> */}
      <span className="flex flex-col gap-2 rounded-md border-2 border-solid border-slate-300 p-3">
        <span className="flex items-center gap-4">
          <Image
            src={classIcon}
            alt="Destiny character class type icon"
            width={64}
            height={64}
            className="dark:invert"
          />
          <span className="flex flex-col gap-2">
            <TypographyLarge>{name}</TypographyLarge>
            <span className="flex gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex space-x-2">
                  <TypographySmall>{tag}</TypographySmall>
                  <Separator orientation="vertical" />
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
};
