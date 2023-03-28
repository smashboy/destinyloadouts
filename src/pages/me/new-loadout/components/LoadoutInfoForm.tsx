import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";

export const LoadoutInfoForm = () => {
  return (
    <div className="sticky top-4 flex h-fit flex-col space-y-2">
      <Input label="Loadout name" />
      <Textarea label="Description" style={{ resize: "none" }} />
      <Button variant="subtle" size="lg">
        Add tag +
      </Button>
      <Button variant="subtle" size="lg">
        Share
      </Button>
    </div>
  );
};
