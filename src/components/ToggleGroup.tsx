import Image from "next/image";
import { LoadoutTag } from "@prisma/client";
import { cn } from "~/utils/tailwind";
import { Button } from "./Button";
import { LoadoutTagIconsMap } from "~/constants/loadouts";

export type ToggleGroupOption = {
  value: string;
  title: string;
  iconPath: string | null | undefined;
};

export type ToggleGroupProps = {
  options: ToggleGroupOption[];
  selected: string[];
  onChange: (options: string[]) => void;
  className?: string;
  disableSolid?: boolean;
};

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  selected,
  onChange,
  className,
  disableSolid = false,
}) => {
  const handleChange = (option: ToggleGroupOption) => () => {
    if (selected.includes(option.value))
      return onChange(selected.filter((value) => value !== option.value));

    return onChange([...selected, option.value]);
  };

  return (
    <div className={cn("flex", disableSolid && "flex-wrap gap-2", className)}>
      {options.map((option) => {
        const { iconPath, title, value } = option;

        const isSelected = selected.includes(value);

        return (
          <Button
            key={value}
            variant={isSelected ? "default" : "subtle"}
            className={cn(
              !disableSolid &&
                "rounded-none first:rounded-l-md last:rounded-r-md"
            )}
            onClick={handleChange(option)}
          >
            <span className="flex gap-1">
              {iconPath && (
                <Image
                  src={iconPath}
                  alt={title}
                  width={18}
                  height={18}
                  className={cn(
                    !isSelected && "invert",
                    iconPath === LoadoutTagIconsMap[LoadoutTag.DUNGEON] &&
                      "scale-[2.5]"
                  )}
                />
              )}
              <span>{title}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
};
