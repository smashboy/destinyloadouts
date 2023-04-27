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

type LoadoutItem = [number, number[]] | null | undefined;

declare global {
  namespace PrismaJson {
    type LoadoutDBItems = {
      helmet: LoadoutItem;
      gauntlets: LoadoutItem;
      chest: LoadoutItem;
      legs: LoadoutItem;
      class: LoadoutItem;
      kinetic: LoadoutItem;
      energy: LoadoutItem;
      power: LoadoutItem;
      subclass: LoadoutItem;
    };
  }
}
