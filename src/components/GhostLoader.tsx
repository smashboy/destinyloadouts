import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { IconLoaderSolid } from "~/icons";

export const GhostLoader = () => (
  <div className="flex h-full w-full items-center justify-center pt-24 md:pt-8">
    <div className="relative">
      <Image
        src="/destiny-icons/ghost.svg"
        width={48}
        height={48}
        alt="Ghost loading indicator"
        className="dark:invert"
      />
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <FontAwesomeIcon
          icon={IconLoaderSolid}
          className="animate-spin"
          size="6x"
        />
      </div>
    </div>
  </div>
);
