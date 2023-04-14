import {
  type DestinyClassType,
  type DestinyDamageType,
  type LoadoutTag,
} from "@prisma/client";
import { ToggleGroup, type ToggleGroupOption } from "~/components/ToggleGroup";
import { TypographySmall } from "~/components/typography";
import {
  characterClassIconPathMap,
  characterClassTitleMap,
  damageTypeIconPathMap,
  damageTypeTitleMap,
  damageTypesList,
  destinyCharacterClassTypesList,
  loadoutTagIconsMap,
  loadoutTagTitlesMap,
  loadoutTagsList,
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
  destinyCharacterClassTypesList.map((type) => ({
    value: type,
    iconPath: characterClassIconPathMap[type],
    title: characterClassTitleMap[type],
  }));

const subclassTypeFilerOptions: ToggleGroupOption[] = damageTypesList.map(
  (type) => ({
    value: type,
    iconPath: damageTypeIconPathMap[type],
    title: damageTypeTitleMap[type],
  })
);

const loadoutTagFilterOptions: ToggleGroupOption[] = loadoutTagsList.map(
  (tag) => ({
    value: tag,
    iconPath: loadoutTagIconsMap[tag],
    title: loadoutTagTitlesMap[tag],
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
