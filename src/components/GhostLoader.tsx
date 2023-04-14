import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { IconLoaderSolid } from "~/icons";

export const GhostLoader = () => (
  <div className="mt-24 flex h-full w-full items-center justify-center md:mt-0">
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
