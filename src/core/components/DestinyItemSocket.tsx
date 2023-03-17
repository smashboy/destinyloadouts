import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils";

export interface DestinyItemSocketProps {
  bgIconPath?: string;
  children?: React.ReactNode;
  href?: string;
  isSelected?: boolean;
}

export const DestinyItemSocket: React.FC<DestinyItemSocketProps> = ({
  bgIconPath,
  children,
  href,
  isSelected,
}) => {
  const rootStyles = cn(
    "w-16 h-16 rounded relative transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-4 hover:ring-2 hover:ring-slate-300 hover:ring-offset-4",
    isSelected &&
      "ring-2 ring-offset-4 ring-sky-300 focus:ring-inherit hover:ring-inherit"
  );

  const RootElement = href ? Link : "button";

  return (
    <RootElement href={href!} className={rootStyles}>
      <span className="ring-2 rounded w-full h-full ring-slate-300 flex items-center overflow-hidden justify-center p-0.5">
        {bgIconPath && (
          <Image
            src={bgIconPath}
            width={32}
            height={32}
            alt="Item socket slot icon"
            className="opacity-40"
          />
        )}
        {children}
      </span>
    </RootElement>
  );
};
