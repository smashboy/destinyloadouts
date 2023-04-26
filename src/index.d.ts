import { type DestinyCharacterLoadout } from "./bungie/types";

declare module "@editorjs/header" {
  import Header from "@editorjs/header";
  export = Header;
}

declare module "@editorjs/list" {
  import List from "@editorjs/list";
  export = List;
}

declare module "@editorjs/checklist" {
  import Checklist from "@editorjs/checklist";
  export = Checklist;
}

declare module "@editorjs/quote" {
  import Quote from "@editorjs/quote";
  export = Quote;
}

declare module "@editorjs/simple-image" {
  import SimpleImage from "@editorjs/simple-image";
  export = SimpleImage;
}

declare module "@editorjs/embed" {
  import Embed from "@editorjs/embed";
  export = Embed;
}

declare global {
  namespace PrismaJson {
    type LoadoutDBItems = Omit<
      DestinyCharacterLoadout,
      "inventoryItems" | "perkItems"
    >;
  }
}
