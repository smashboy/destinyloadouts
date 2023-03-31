import { forwardRef } from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { TypographyLarge, TypographySmall } from "../typography";
import { TypographySubtle } from "../typography";

interface ItemHoverCardProps {
  // modTypeIcon: string; local icon path
  item: DestinyInventoryItemDefinition;
}

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const ItemHoverCard = forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  ItemHoverCardProps
>(({ item }, ref) => {
  const {
    displayProperties: { name, description },
    itemTypeDisplayName,
  } = item;

  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align="center"
      side="top"
      sideOffset={15}
      className="z-50 w-64 overflow-hidden rounded-md border border-slate-100 bg-white shadow-md outline-none dark:border-neutral-600 dark:bg-neutral-800"
    >
      <div className="bg-slate-200 py-2 px-4 dark:bg-neutral-600">
        <TypographyLarge>{name}</TypographyLarge>
        <TypographySubtle className="text-slate-600">
          {itemTypeDisplayName}
        </TypographySubtle>
      </div>
      {description && (
        <div className="p-4">
          {description && (
            <TypographySmall className="whitespace-pre-wrap">
              {description}
            </TypographySmall>
          )}
        </div>
      )}
    </HoverCardPrimitive.Content>
  );
});

export { HoverCard, HoverCardTrigger, ItemHoverCard };
