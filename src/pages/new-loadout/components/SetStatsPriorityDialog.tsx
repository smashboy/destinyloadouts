import Image from "next/image";
import { Button } from "~/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/components/Select";
import { TypographySmall } from "~/components/typography";
import {
  LoadoutStatIconsMap,
  LoadoutStatsList,
  LoadoutStatTitleMap,
  type LoadoutStatType,
} from "~/constants/loadouts";

interface StatSelectProps {
  selected: LoadoutStatType[];
  priority: number;
  onSelect: (priority: number, stat: string) => void;
}

const statsAmountList = Array.from({ length: 6 });

const StatSelect: React.FC<StatSelectProps> = ({
  selected,
  priority,
  onSelect,
}) => {
  const handleSelect = (value: string) => onSelect(priority, value);

  const selectedValue = selected[priority];

  return (
    <div className="flex flex-col gap-1.5">
      <TypographySmall>{priority + 1}.</TypographySmall>
      <Select
        value={selectedValue?.toString() || ""}
        onValueChange={handleSelect}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LoadoutStatsList.map((stat) => (
            <SelectItem key={stat} value={stat.toString()}>
              <span className="flex gap-1">
                <Image
                  src={LoadoutStatIconsMap[stat]}
                  width={18}
                  height={18}
                  alt="Loadout stat priority icon"
                  className="dark:invert"
                />
                {LoadoutStatTitleMap[stat]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface SetStatsPriorityDialogProps {
  selected: LoadoutStatType[];
  onChange: (stats: LoadoutStatType[]) => void;
}

export const SetStatsPriorityDialog: React.FC<SetStatsPriorityDialogProps> = ({
  selected,
  onChange,
}) => {
  const handleChange = (priority: number, stat: string) => {
    const newStat = Number(stat) as LoadoutStatType;
    const updatedSelected = selected.includes(newStat)
      ? selected.filter((stat) => stat !== newStat)
      : [...selected];

    updatedSelected[priority] = newStat;

    onChange(updatedSelected);
  };

  const handleResetStats = () => onChange([]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="subtle" size="lg" className="w-full">
          Stats priority
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set stats priority</DialogTitle>
          <DialogDescription>
            Set which stats should be prioritized. You need to select all 6
            stats in order to publish loadout.
          </DialogDescription>
        </DialogHeader>
        {statsAmountList.map((_, index) => (
          <StatSelect
            key={index}
            priority={index}
            selected={selected}
            onSelect={handleChange}
          />
        ))}
        <DialogFooter>
          <Button onClick={handleResetStats}>Reset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
