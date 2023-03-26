import Link from "next/link";
import Image from "next/image";
import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import {
  bungieNetOrigin,
  characterRaceTypeTitleMap,
  characterClassIconPathMap,
} from "@destiny/shared/constants";
import { TypographyLarge, TypographySmall } from "~/core/components/typography";
import { cn } from "~/core/utils";
import { useRouter } from "next/router";

interface DestinyCharacterBannerProps {
  character: DestinyCharacterComponent;
}

export const DestinyCharacterBanner: React.FC<DestinyCharacterBannerProps> = ({
  character: { emblemBackgroundPath, classType, raceType, characterId, light },
}) => {
  const router = useRouter();

  const { characterId: selectedCharacterId } = router.query;

  const characterRaceTypeTitle =
    characterRaceTypeTitleMap[
      raceType as keyof typeof characterRaceTypeTitleMap
    ];

  const characterIconPath =
    characterClassIconPathMap[
      classType as keyof typeof characterClassIconPathMap
    ];

  const isSelected = selectedCharacterId === characterId;

  const searchParams = new URLSearchParams();
  searchParams.set("characterId", characterId);

  return (
    <Link
      href={`/me/new-loadout?${searchParams.toString()}`}
      className={cn(
        "w-full h-[124px] p-0.5 rounded transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2",
        isSelected &&
          "ring-2 ring-sky-300 ring-offset-2 focus:ring-inherit hover:ring-inherit"
      )}
    >
      <span className="relative block w-full h-full overflow-hidden rounded">
        <span
          className="absolute inset-0 bg-no-repeat bg-cover"
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
        <span className="relative z-10 flex w-full h-full pl-24 md:pl-32 items-center">
          <span className="flex space-x-2">
            {characterRaceTypeTitle && (
              <TypographyLarge className="text-slate-50 text-2xl md:text-3xl">
                {characterRaceTypeTitle}
              </TypographyLarge>
            )}
          </span>
        </span>
      </span>
    </Link>
  );
};
