import { LoadoutItem } from "@/core/bungie-api/types";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutItemIcon } from "./LoadoutItemIcon";

interface LoadoutItemSocketProps extends ItemSocketProps {
  item: LoadoutItem;
}

export const LoadoutItemSocket: React.FC<LoadoutItemSocketProps> = ({
  item: loadoutItem,
  ...props
}) => {
  if (!loadoutItem) return <ItemSocket {...props} />;

  const { item } = loadoutItem;

  const isMasterworked = item.instance.data?.energy?.energyCapacity === 10;

  return (
    <ItemSocket isGoldBorder={isMasterworked} {...props}>
      <LoadoutItemIcon item={loadoutItem} />
    </ItemSocket>
  );
};
