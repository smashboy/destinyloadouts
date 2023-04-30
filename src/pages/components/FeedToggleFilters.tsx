import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
} from "@prisma/client";
import { ToggleGroup, type ToggleGroupOption } from "~/components/ToggleGroup";
import { TypographySmall } from "~/components/typography";
import {
  CharacterClassIconPathMap,
  CharacterClassTitleMap,
  DamageTypeIconPathMap,
  DamageTypeTitleMap,
  DamageTypesList,
  DestinyCharacterClassTypesList,
  LoadoutTagIconsMap,
  LoadoutTagTitlesMap,
  LoadoutTagsList,
} from "~/constants/loadouts";

export interface FeedToggleFiltersProps {
  classTypes: DestinyClassType[];
  subclassTypes: DestinyDamageType[];
  tags: LoadoutTag[];
  onClassFilterChange: (classTypes: DestinyClassType[]) => void;
  onSubClassFilterChange: (classTypes: DestinyDamageType[]) => void;
  onTagsFilterChange: (classTypes: LoadoutTag[]) => void;
}

const classTypeFilerOptions: ToggleGroupOption[] =
  DestinyCharacterClassTypesList.map((type) => ({
    value: type,
    iconPath: CharacterClassIconPathMap[type],
    title: CharacterClassTitleMap[type],
  }));

const subclassTypeFilerOptions: ToggleGroupOption[] = DamageTypesList.map(
  (type) => ({
    value: type,
    iconPath: DamageTypeIconPathMap[type],
    title: DamageTypeTitleMap[type],
  })
);

const loadoutTagFilterOptions: ToggleGroupOption[] = LoadoutTagsList.map(
  (tag) => ({
    value: tag,
    iconPath: LoadoutTagIconsMap[tag],
    title: LoadoutTagTitlesMap[tag],
  })
);

export const FeedToggleFilters: React.FC<FeedToggleFiltersProps> = ({
  classTypes,
  subclassTypes,
  tags,
  onClassFilterChange,
  onSubClassFilterChange,
  onTagsFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <TypographySmall>Classes:</TypographySmall>
      <ToggleGroup
        selected={classTypes}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={onClassFilterChange}
        options={classTypeFilerOptions}
      />
      <TypographySmall>Subclasses:</TypographySmall>
      <ToggleGroup
        selected={subclassTypes}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={onSubClassFilterChange}
        options={subclassTypeFilerOptions}
        disableSolid
      />
      <TypographySmall>Tags:</TypographySmall>
      <ToggleGroup
        selected={tags}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={onTagsFilterChange}
        options={loadoutTagFilterOptions}
        disableSolid
      />
    </div>
  );
};
