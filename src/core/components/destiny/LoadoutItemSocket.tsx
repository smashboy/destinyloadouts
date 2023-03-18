import { LoadoutItem } from "@/core/bungie-api/types";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutItemIcon } from "./LoadoutItemIcon";

interface LoadoutItemSocketProps extends ItemSocketProps {
  item: LoadoutItem;
}

export const LoadoutItemSocket: React.FC<LoadoutItemSocketProps> = ({
  item,
  ...props
}) => {
  if (!item) return <ItemSocket {...props} />;

  const [, inventoryItem] = item;

  return (
    <ItemSocket {...props}>
      <LoadoutItemIcon inventoryItem={inventoryItem} />
    </ItemSocket>
  );
};
