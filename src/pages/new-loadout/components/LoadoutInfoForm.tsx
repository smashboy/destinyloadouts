import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { type LoadoutTag } from "@prisma/client";
import { Button } from "~/components/Button";
import { type EditorState } from "~/components/Editor";
import { Input } from "~/components/Input";
import { SelectTagsDialog } from "./SelectTagsDialog";

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
});

export interface LoadoutInfoFormSubmitProps {
  name: string;
  tags: LoadoutTag[];
  description: EditorState | undefined;
}

interface LoadoutInfoFormProps {
  onSubmit: (args: LoadoutInfoFormSubmitProps) => void;
  isLoading: boolean;
}

export const LoadoutInfoForm: React.FC<LoadoutInfoFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [tags, setTags] = useState<LoadoutTag[]>([]);
  const [description, setDescription] = useState<EditorState>();

  useEffect(() => {
    setTags([]);
  }, [router.query]);

  const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleCreateLoadout = () => onSubmit({ name, tags, description });

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
        <Button
          variant="subtle"
          size="lg"
          onClick={handleCreateLoadout}
          disabled={!name}
          isLoading={isLoading}
        >
          Share
        </Button>
      </div>
      <Editor
        onChange={setDescription}
        placeholder="You can leave description for your loadout here..."
      />
    </div>
  );
};
