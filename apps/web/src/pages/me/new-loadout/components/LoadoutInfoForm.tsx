import { Button } from "~/core/components/Button";
import { Input } from "~/core/components/Input";
import { Textarea } from "~/core/components/Textarea";

export const LoadoutInfoForm = () => {
  return (
    <div className="flex flex-col space-y-2 sticky top-4 h-fit">
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
