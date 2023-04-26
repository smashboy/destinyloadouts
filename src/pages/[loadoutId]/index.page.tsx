import { type NextPage, type GetStaticPaths, type GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { type EditorState } from "~/components/Editor";
import { CharacterSockets } from "~/components/loadouts/CharacterSockets";
import { type RouterOutputs } from "~/utils/api";
import { trpsSSG } from "~/utils/ssg";
import { cn } from "~/utils/tailwind";
import { CharacterClassIconBackground } from "~/components/destiny/CharacterClassIconBackground";
import { LoadoutHeader } from "./components/LoadoutHeader";
import { Seo } from "~/components/Seo";
import { PUBLIC_URL } from "~/constants/app";
import { Tabs, TabsList, TabsTrigger } from "~/components/Tabs";
import { TabsContent } from "@radix-ui/react-tabs";

interface LoadoutPageProps {
  loadoutId: string;
  loadout: NonNullable<RouterOutputs["loadouts"]["getById"]>;
}

const REVALIDATE_TIME = 60 * 10;

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
});

const LoadoutPage: NextPage<LoadoutPageProps> = ({ loadout: pageProps }) => {
  const { loadout, inventoryItems, perkItems } = pageProps;

  const {
    id: loadoutId,
    name,
    description,
    items,
    author: { bungieAccountDisplayName },
    classType,
  } = loadout;

  return (
    <>
      <Seo
        title={`${bungieAccountDisplayName}'s loadout: ${name}`}
        canonical={`${PUBLIC_URL}/${loadoutId}`}
      />
      <div className="flex flex-col gap-6">
        <CharacterClassIconBackground classType={classType} />
        <LoadoutHeader loadout={loadout} />
        {/* MOBILE VIEW */}
        <Tabs
          defaultValue="loadout"
          className="grid grid-cols-1 gap-4 md:hidden"
        >
          {description && (
            <TabsList>
              <TabsTrigger value="loadout">Loadout</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="loadout">
            <CharacterSockets
              loadout={{ ...items, inventoryItems, perkItems }}
            />
          </TabsContent>
          <TabsContent value="description">
            <Editor
              initialState={description as unknown as EditorState}
              readOnly
            />
          </TabsContent>
        </Tabs>
        {/* DESKTOP VIEW */}
        <div
          className={cn(
            "hidden grid-cols-1 gap-10 md:grid",
            description && "grid-cols-5"
          )}
        >
          {description && (
            <div className="sticky top-32 col-span-2 h-fit">
              <Editor
                initialState={description as unknown as EditorState}
                readOnly
              />
            </div>
          )}
          <div
            className={cn(
              "flex w-full justify-center",
              description && "col-span-3",
              !description && "container md:max-w-6xl"
            )}
          >
            <CharacterSockets
              loadout={{ ...items, inventoryItems, perkItems }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<LoadoutPageProps> = async (ctx) => {
  const loadoutId = ctx.params?.loadoutId as string;

  const trpc = trpsSSG();

  const loadout = await trpc.loadouts.getById.fetch({ loadoutId });

  if (!loadout)
    return {
      notFound: true,
      revalidate: REVALIDATE_TIME,
    };

  return {
    props: {
      loadoutId,
      loadout,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export default LoadoutPage;
