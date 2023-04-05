import { type NextPage, type GetServerSideProps } from "next";
import { type Loadout, type User } from "@prisma/client";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { TypographyLarge } from "~/components/typography";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { useAuthUser } from "~/hooks/useAuthUser";

interface BookmarksPage {
  loadouts: Array<
    Loadout & {
      _count: { likes: number };
      likes: {
        likedByUserId: string;
      }[];
      bookmarks: {
        savedByUserId: string;
      }[];
      author: User;
    }
  >;
  inventoryItems: Record<string, DestinyInventoryItemDefinition>;
}

export const BookmarksPage: NextPage<BookmarksPage> = ({
  loadouts,
  inventoryItems,
}) => {
  const [authUser] = useAuthUser();

  return (
    <div className="grid grid-cols-1 gap-2">
      <TypographyLarge>Saved loadouts</TypographyLarge>
      {loadouts.map((loadout) => (
        <LoadoutPreviewCard
          key={loadout.id}
          loadout={loadout}
          inventoryItems={inventoryItems}
          onLike={() => {}}
          onSave={() => {}}
          authUser={authUser}
        />
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const trpc = trpsSSG(session);

  const response = await trpc.loadouts.getAuthBookmarked.fetch();

  return {
    props: response,
  };
};

export default BookmarksPage;
