import { type DestinyCharacterLoadout } from "~/bungie/types";
import { TypographyLarge } from "~/components/typography";
import { LoadoutSubclassItem } from "~/components/destiny/LoadoutSubclassItem";
import { LoadoutWeaponItem } from "~/components/destiny/LoadoutWeaponItem";
import { LoadoutArmorItem } from "~/components/destiny/LoadoutArmorItem";
import { LoadoutSectionContainer } from "./LoadoutSectionContainer";
import { LoadoutStatsPriorityList } from "./LoadoutStatsPriorityList";
import { LoadoutStatsList } from "~/constants/loadouts";

interface CharacterSocketsProps {
  loadout: DestinyCharacterLoadout;
}

export const CharacterSockets: React.FC<CharacterSocketsProps> = ({
  loadout: {
    kinetic,
    energy,
    power,
    helmet,
    gauntlets,
    chest,
    legs,
    class: classItem,
    subclass,
    inventoryItems,
    perkItems = {},
  },
}) => (
  <div className="grid grid-cols-1 gap-4">
    <LoadoutStatsPriorityList stats={LoadoutStatsList} />
    <LoadoutSubclassItem
      item={subclass}
      inventoryItems={inventoryItems}
      perkItems={perkItems}
    />
    <TypographyLarge>Weapons</TypographyLarge>
    <div className="grid grid-cols-1 gap-4">
      <LoadoutSectionContainer>
        <LoadoutWeaponItem
          item={kinetic}
          inventoryItems={inventoryItems}
          socketProps={{
            bgIconPath: "/destiny-icons/weapons/kinetic.svg",
          }}
        />
      </LoadoutSectionContainer>
      <LoadoutSectionContainer>
        <LoadoutWeaponItem
          item={energy}
          inventoryItems={inventoryItems}
          socketProps={{
            bgIconPath: "/destiny-icons/weapons/energy.svg",
          }}
        />
      </LoadoutSectionContainer>
      <LoadoutSectionContainer>
        <LoadoutWeaponItem
          item={power}
          inventoryItems={inventoryItems}
          socketProps={{
            bgIconPath: "/destiny-icons/weapons/power.svg",
          }}
        />
      </LoadoutSectionContainer>
    </div>
    <div className="flex flex-col space-y-4">
      <TypographyLarge>Armor</TypographyLarge>
      <div className="grid grid-cols-1 gap-4">
        <LoadoutSectionContainer>
          <LoadoutArmorItem
            item={helmet}
            inventoryItems={inventoryItems}
            perkItems={perkItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/helmet.svg",
            }}
          />
        </LoadoutSectionContainer>
        <LoadoutSectionContainer>
          <LoadoutArmorItem
            item={gauntlets}
            inventoryItems={inventoryItems}
            perkItems={perkItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/gloves.svg",
            }}
          />
        </LoadoutSectionContainer>
        <LoadoutSectionContainer>
          <LoadoutArmorItem
            item={chest}
            inventoryItems={inventoryItems}
            perkItems={perkItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/chest.svg",
            }}
          />
        </LoadoutSectionContainer>
        <LoadoutSectionContainer>
          <LoadoutArmorItem
            item={legs}
            inventoryItems={inventoryItems}
            perkItems={perkItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/boots.svg",
            }}
          />
        </LoadoutSectionContainer>
        <LoadoutSectionContainer>
          <LoadoutArmorItem
            item={classItem}
            inventoryItems={inventoryItems}
            perkItems={perkItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/class.svg",
            }}
          />
        </LoadoutSectionContainer>
      </div>
    </div>
  </div>
);
