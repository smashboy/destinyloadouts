import Image from "next/image";
import { TypographySmall } from "./typography";

export const DiscordBanner = () => (
  <a
    href="https://discord.gg/RB52SnqztN"
    target="_blank"
    rel="noopener noreferrer"
    className="sticky top-0 z-50 flex h-8 w-full items-center justify-center bg-[#5865F2] p-2"
  >
    <Image
      src="/discord-icon.png"
      width={24}
      height={24}
      alt="Discord logo, invite link"
      className="mr-2"
    />
    <TypographySmall>Join our discord server</TypographySmall>
  </a>
);
