import Image from "next/image";
import { LoadoutTag } from "@prisma/client";
import { Button } from "~/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import {
  LoadoutTagIconsMap,
  LoadoutTagTitlesMap,
  LoadoutTagsList,
} from "~/constants/loadouts";
import { TypographyLarge } from "~/components/typography";
import { cn } from "~/utils/tailwind";

interface SelectTagItemProps {
  selected: LoadoutTag[];
  value: LoadoutTag;
  onSelect: (tags: LoadoutTag[]) => void;
}

interface SelectTagsDialogProps {
  selected: LoadoutTag[];
  onSave: (tags: LoadoutTag[]) => void;
}

const SelectTagItem: React.FC<SelectTagItemProps> = ({
  value,
  selected,
  onSelect,
}) => {
  const icon = LoadoutTagIconsMap[value];
  const title = LoadoutTagTitlesMap[value];

  const isSelected = selected.includes(value);

  const hanleSelect = () => {
    if (selected.includes(value))
      return onSelect(selected.filter((tag) => tag !== value));

    onSelect([...selected, value]);
  };

  return (
    <Button variant={isSelected ? "subtle" : "ghost"} onClick={hanleSelect}>
      <span className="flex items-center gap-4">
        {icon && (
          <Image
            src={icon}
            width={24}
            height={24}
            alt="Loadout tag icon"
            className={cn(
              "dark:invert",
              value === LoadoutTag.DUNGEON && "scale-[2.5]"
            )}
          />
        )}
        <TypographyLarge>{title}</TypographyLarge>
      </span>
    </Button>
  );
};

export const SelectTagsDialog: React.FC<SelectTagsDialogProps> = ({
  onSave,
  selected,
}) => (
  <Dialog>
    <DialogTrigger>
      <Button variant="subtle" size="lg" className="w-full">
        Add tags +
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Select loadout tags</DialogTitle>
        <DialogDescription>
          Loadout tags make it easier for users to find the specific loadouts
          they are looking for.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-2">
        {LoadoutTagsList.map((tag) => (
          <SelectTagItem
            key={tag}
            value={tag}
            selected={selected}
            onSelect={onSave}
          />
        ))}
      </div>
      <DialogFooter>
        <DialogClose>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
