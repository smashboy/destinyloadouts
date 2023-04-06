import Image from "next/image";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "~/utils/tailwind";

export interface ItemSocketProps {
  bgIconPath?: string;
  children?: React.ReactNode;
  href?: string;
  isSelected?: boolean;
  isGoldBorder?: boolean;
  isSm?: boolean;
}

const rootVariants = cva(
  "rounded relative transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-4 hover:ring-2 hover:ring-slate-300 hover:ring-offset-4",
  {
    variants: {
      size: {
        default: "w-20 h-20",
        sm: "w-12 h-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const ItemSocket: React.FC<ItemSocketProps> = ({
  bgIconPath,
  children,
  href,
  isSelected,
  isGoldBorder,
  isSm = false,
}) => {
  const rootStyles = cn(
    rootVariants({ size: isSm ? "sm" : "default" }),
    isSelected &&
      "ring-2 ring-offset-4 ring-sky-300 focus:ring-inherit hover:ring-inherit"
  );

  const RootElement = href ? Link : "div";

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <RootElement href={href!} className={rootStyles}>
      <span
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden rounded p-0.5 ring-2 ring-slate-300",
          isGoldBorder && "ring-[#eade8b]"
        )}
      >
        {bgIconPath && !children && (
          <Image
            src={bgIconPath}
            width={32}
            height={32}
            alt="Item socket slot icon"
            className="opacity-40 invert"
          />
        )}
        {children}
      </span>
    </RootElement>
  );
};
