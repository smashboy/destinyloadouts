import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

export const getDestinyItemActiveWatermarkIcon = ({
  quality,
  iconWatermark,
  iconWatermarkShelved,
}: DestinyInventoryItemDefinition) =>
  quality?.displayVersionWatermarkIcons?.[quality?.currentVersion] ||
  iconWatermark ||
  iconWatermarkShelved;
