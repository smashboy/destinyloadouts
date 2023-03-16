import Image from "next/image";
import { bungieNetOrigin } from "../bungie-api/consants";
import { DestinyCharacter } from "../bungie-api/types";
import { TypographyLarge } from "./typography";

interface DestinyCharacterBannerProps {
  character: DestinyCharacter;
}

const characterIconPathMap = {
  0: "/destiny-icons/classes/titan.svg",
  1: "/destiny-icons/classes/hunter.svg",
  2: "/destiny-icons/classes/warlock.svg",
};

const characterGenderTypeTitleMap = {
  0: "Human",
  1: "Awoken",
  2: "Exo",
};

export const DestinyCharacterBanner: React.FC<DestinyCharacterBannerProps> = ({
  character: { emblemBackgroundPath, classType },
}) => {
  const characterGenderTypeTitle =
    characterGenderTypeTitleMap[
      classType as keyof typeof characterGenderTypeTitleMap
    ];

  const characterIconPath =
    characterIconPathMap[classType as keyof typeof characterIconPathMap];

  return (
    <button className="w-full h-[124px] p-0.5 rounded transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2">
      <span className="relative block w-full h-full overflow-hidden rounded">
        <span
          className="absolute inset-0 bg-no-repeat bg-cover -z-10"
          style={{
            backgroundImage: `url(${bungieNetOrigin}/${emblemBackgroundPath})`,
          }}
        />
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
    </button>
  );
};
