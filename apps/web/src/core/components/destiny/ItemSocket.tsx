import Image from "next/image";
import Link from "next/link";
import { cn } from "../../utils";

export interface ItemSocketProps {
  bgIconPath?: string;
  children?: React.ReactNode;
  href?: string;
  isSelected?: boolean;
  isGoldBorder?: boolean;
}

export const ItemSocket: React.FC<ItemSocketProps> = ({
  bgIconPath,
  children,
  href,
  isSelected,
  isGoldBorder,
}) => {
  const rootStyles = cn(
    "w-20 h-20 rounded relative transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-4 hover:ring-2 hover:ring-slate-300 hover:ring-offset-4",
    isSelected &&
      "ring-2 ring-offset-4 ring-sky-300 focus:ring-inherit hover:ring-inherit"
  );

  const RootElement = href ? Link : "button";

  return (
    <RootElement href={href!} className={rootStyles}>
      <span
        className={cn(
          "ring-2 rounded w-full h-full ring-slate-300 flex items-center overflow-hidden justify-center p-0.5",
          isGoldBorder && "ring-[#eade8b]"
        )}
      >
        {bgIconPath && !children && (
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
