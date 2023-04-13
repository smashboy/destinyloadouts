import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { type DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import {
  bungieNetOrigin,
  characterClassIconPathMap,
  characterRaceTypeTitleMap,
} from "~/bungie/constants";
import { cn } from "~/utils/tailwind";
import { TypographyLarge, TypographySmall } from "~/components/typography";

interface DestinyCharacterBannerProps {
  character: DestinyCharacterComponent;
  basePath: string;
}

export const DestinyCharacterBanner: React.FC<DestinyCharacterBannerProps> = ({
  character: { emblemBackgroundPath, classType, raceType, characterId, light },
  basePath,
}) => {
  const router = useRouter();

  const { characterId: selectedCharacterId, ...queryProps } = router.query;

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
  Object.entries(queryProps).forEach(([key, prop]) =>
    searchParams.set(key, prop as string)
  );
  searchParams.set("characterId", characterId);

  return (
    <Link
      href={`${basePath}?${searchParams.toString()}`}
      className={cn(
        "h-[124px] w-full rounded p-0.5 transition duration-300 ease-out hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
        isSelected &&
          "ring-2 ring-sky-300 ring-offset-2 hover:ring-inherit focus:ring-inherit"
      )}
    >
      <span className="relative block h-full w-full overflow-hidden rounded">
        <span
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${bungieNetOrigin}/${emblemBackgroundPath})`,
          }}
        />

        <div className="absolute top-2 right-2">
          <div className="flex items-center space-x-1 rounded border bg-slate-200/70 p-1">
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
            <div className="rounded border bg-slate-200/70 p-1">
              <Image
                src={characterIconPath}
                width={24}
                height={24}
                alt="Destiny character class type"
              />
            </div>
          </div>
        )}
        <span className="relative z-10 flex h-full w-full items-center pl-24 md:pl-32">
          <span className="flex space-x-2">
            {characterRaceTypeTitle && (
              <TypographyLarge className="text-2xl text-slate-50 md:text-3xl">
                {characterRaceTypeTitle}
              </TypographyLarge>
            )}
          </span>
        </span>
      </span>
    </Link>
  );
};
