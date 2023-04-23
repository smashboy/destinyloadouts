// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import fs from "fs";
import os from "os";
import path from "path";

import {
  DestinyItemSubType,
  DestinyItemType,
  DestinyComponentType,
  DestinyClass,
  DamageType,
  DestinyRace,
  DestinyAmmunitionType,
  ItemPerkVisibility,
} from "bungie-api-ts/destiny2";

const constants = [
  ["DestinyItemSubType", DestinyItemSubType],
  ["DestinyItemType", DestinyItemType],
  ["DestinyComponentType", DestinyComponentType],
  ["DestinyClass", DestinyClass],
  ["DamageType", DamageType],
  ["DestinyRace", DestinyRace],
  ["DestinyAmmunitionType", DestinyAmmunitionType],
  ["ItemPerkVisibility", ItemPerkVisibility],
];

const generate = () => {
  const list: string[] = [];

  for (const [name, constant] of constants) {
    const constString = `
      export const ${name} = {
        ${Object.entries(constant)
          .map(([key, value]) => `${key}: ${value},`)
          .join(os.EOL)}
      } as const

      export type ${name}Const = typeof ${name}
    `;

    list.push(constString);
  }

  fs.writeFileSync(
    path.join(__dirname, "../src/bungie/__generated.ts"),
    list.join(os.EOL)
  );
};

generate();
