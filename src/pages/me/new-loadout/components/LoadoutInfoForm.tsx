import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "~/components/Button";
import { type EditorState } from "~/components/Editor";
import { Input } from "~/components/Input";

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
});

export const LoadoutInfoForm = () => {
  const [, setDescription] = useState<EditorState>();

  return (
    <div className="sticky top-4 flex h-fit flex-col space-y-2">
      <Input label="Loadout name" />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="subtle" size="lg">
          Add tag +
        </Button>
        <Button variant="subtle" size="lg" disabled>
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
