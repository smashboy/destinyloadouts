import { useState } from "react";
import dynamic from "next/dynamic";
import { type LoadoutTag } from "@prisma/client";
import { Button } from "~/components/Button";
import { type EditorState } from "~/components/Editor";
import { Input } from "~/components/Input";
import { SelectTagsDialog } from "./SelectTagsDialog";
import { SetStatsPriorityDialog } from "./SetStatsPriorityDialog";
import { type LoadoutStatType } from "~/constants/loadouts";

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
});

export interface LoadoutInfoFormValues {
  name: string;
  tags: LoadoutTag[];
  description: EditorState | undefined;
  statsPriority: LoadoutStatType[];
}

interface LoadoutInfoFormProps {
  onSubmit: (args: LoadoutInfoFormValues) => void;
  isLoading: boolean;
  initialValues?: LoadoutInfoFormValues;
}

export const LoadoutInfoForm: React.FC<LoadoutInfoFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const {
    name: initialName = "",
    tags: initialTags = [],
    description: initialDescription,
    statsPriority: initialStatsPriority = [],
  } = initialValues || {};

  const [name, setName] = useState(initialName);
  const [tags, setTags] = useState<LoadoutTag[]>(initialTags);
  const [statsPriority, setStatsPriority] =
    useState<LoadoutStatType[]>(initialStatsPriority);
  const [description, setDescription] = useState<EditorState>();

  const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleCreateLoadout = () =>
    onSubmit({
      name,
      tags,
      description,
      statsPriority,
    });

  return (
    <div className="sticky top-4 flex h-fit flex-col space-y-2">
      <Input
        label="Loadout name"
        value={name}
        onChange={handleNameInput}
        autoComplete="off"
      />
      <div className="grid grid-cols-2 gap-2">
        <SelectTagsDialog selected={tags} onSave={setTags} />
        <SetStatsPriorityDialog
          selected={statsPriority}
          onChange={setStatsPriority}
        />
        <Button
          variant="subtle"
          className="col-span-2"
          size="lg"
          onClick={handleCreateLoadout}
          disabled={
            !!(!name || (statsPriority.length && statsPriority.length !== 6))
          }
          isLoading={isLoading}
        >
          Share
        </Button>
      </div>
      <Editor
        onChange={setDescription}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        initialState={initialDescription!}
        placeholder="You can leave description for your loadout here..."
      />
    </div>
  );
};
