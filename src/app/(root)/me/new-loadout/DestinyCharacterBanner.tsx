"use client";
import Link from "next/link";
import Image from "next/image";
import { DestinyCharacter } from "@/core/bungie-api/types";
import {
  bungieNetOrigin,
  characterGenderTypeTitleMap,
  characterClassIconPathMap,
} from "@/core/bungie-api/consants";
import { TypographyLarge, TypographySmall } from "@/core/components/typography";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/core/utils";

interface DestinyCharacterBannerProps {
  character: DestinyCharacter;
}

export const DestinyCharacterBanner: React.FC<DestinyCharacterBannerProps> = ({
  character: { emblemBackgroundPath, classType, characterId, light },
}) => {
  const segment = useSelectedLayoutSegment();

  const characterGenderTypeTitle =
    characterGenderTypeTitleMap[
      classType as keyof typeof characterGenderTypeTitleMap
    ];

  const characterIconPath =
    characterClassIconPathMap[
      classType as keyof typeof characterClassIconPathMap
    ];

  const isSelected = segment === characterId;

  return (
    <Link
      href={`/me/new-loadout/${characterId}`}
      className={cn(
        "w-full h-[124px] p-0.5 rounded transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2",
        isSelected &&
          "ring-2 ring-sky-300 ring-offset-2 focus:ring-inherit hover:ring-inherit"
      )}
    >
      <span className="relative block w-full h-full overflow-hidden rounded">
        <span
          className="absolute inset-0 bg-no-repeat bg-cover -z-10"
          style={{
            backgroundImage: `url(${bungieNetOrigin}/${emblemBackgroundPath})`,
          }}
        />
        <div className="absolute top-2 right-2">
          <div className="p-1 border flex rounded bg-slate-200/70 items-center space-x-1">
            <Image
              src="/destiny-icons/power.svg"
              width={16}
              height={16}
              alt="Character power icon"
            />
            <TypographySmall>{light}</TypographySmall>
          </div>
        </div>
        {characterIconPath && (
          <div className="absolute bottom-2 right-2">
            <div className="p-1 border rounded bg-slate-200/70">
              <Image
                src={characterIconPath}
                width={24}
                height={24}
                alt="Destiny character class type"
              />
            </div>
          </div>
        )}
        <span className="flex w-full h-full pl-24 md:pl-32 items-center">
          <span className="flex space-x-2">
            {characterGenderTypeTitle && (
              <TypographyLarge className="text-slate-50 text-2xl md:text-3xl">
                {characterGenderTypeTitle}
              </TypographyLarge>
            )}
          </span>
        </span>
      </span>
    </Link>
  );
};
