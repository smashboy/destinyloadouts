import { cn } from "~/utils/tailwind";
import { TypographySmall } from "../typography";

interface ArmorEnergyProps {
  energyUsed: number;
}

const energyCapacity = 10;

export const ArmorEnergy: React.FC<ArmorEnergyProps> = ({ energyUsed }) => {
  return (
    <div className="flex flex-col space-y-2">
      <TypographySmall>{energyUsed} ENERGY</TypographySmall>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: energyCapacity }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-6 bg-slate-400 dark:bg-slate-500",
              index < energyUsed && "bg-slate-800 dark:bg-slate-50"
            )}
          />
        ))}
      </div>
    </div>
  );
};
