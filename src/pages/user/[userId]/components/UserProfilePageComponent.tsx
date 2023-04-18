import { forwardRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import {
  VirtuosoGrid,
  type Components,
  type GridComponents,
  Virtuoso,
} from "react-virtuoso";
import { LoadoutPreviewCard } from "~/components/loadouts/LoadoutPreviewCard";
import { Tabs } from "~/components/Tabs";
import { trpcNext } from "~/utils/api";
import { useAuthUser } from "~/hooks/useAuthUser";
import {
  handleAuthUserLoadoutBookmark,
  handleAuthUserLoadoutLike,
} from "~/utils/loadout";
import { type UserProfilePageProps } from "../index.page";
import { AccountHeader } from "./AccountHeader";
import { FooterLoader } from "~/components/FooterLoader";
import { DataContainer } from "~/components/DataContainer";

interface UserProfilePageComponentProps extends UserProfilePageProps {
  onlyLiked?: boolean;
}

export const UserProfilePageComponent: React.FC<
  UserProfilePageComponentProps
> = (props) => {
  const {
    user: { id: userId },
    onlyLiked,
  } = props;

  const router = useRouter();
  const trpcCtx = trpcNext.useContext();
  const [authUser] = useAuthUser();

  const isMD = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const queryParams = {
    userId,
    onlyLiked,
  };

  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    trpcNext.loadouts.getByUserId.useInfiniteQuery(queryParams, {
      getNextPageParam: (page) => page.nextPage,
    });

  const { pages = [] } = data || {};

  const loadouts = pages.map((page) => page.loadouts).flat();
  const inventoryItems = pages.reduce(
    (acc, page) => ({ ...acc, ...page.inventoryItems }),
    {}
  );

  const likeMutation = trpcNext.loadouts.like.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getByUserId.cancel(queryParams);

      const prevData = await trpcCtx.loadouts.getByUserId.getInfiniteData(
        queryParams
      );

      trpcCtx.loadouts.getByUserId.setInfiniteData(
        queryParams,

        (old) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...old!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pages: old!.pages.map(({ loadouts, ...page }) => ({
            ...page,
            loadouts: loadouts.map((loadout) =>
              handleAuthUserLoadoutLike({ loadout, loadoutId, authUser })
            ),
          })),
        })
      );

      return { prevData };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getByUserId.setInfiniteData(
        queryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevData
      ),
  });

  const saveMutation = trpcNext.loadouts.bookmark.useMutation({
    onMutate: async ({ loadoutId }) => {
      await trpcCtx.loadouts.getByUserId.cancel(queryParams);

      const prevData = await trpcCtx.loadouts.getByUserId.getInfiniteData(
        queryParams
      );

      trpcCtx.loadouts.getByUserId.setInfiniteData(queryParams, (old) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...old!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pages: old!.pages.map(({ loadouts, ...page }) => ({
          ...page,
          loadouts: loadouts.map((loadout) =>
            handleAuthUserLoadoutBookmark({ loadout, loadoutId, authUser })
          ),
        })),
      }));

      return { prevData };
    },
    onError: (_, __, ctx) =>
      trpcCtx.loadouts.getByUserId.setInfiniteData(
        queryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevData
      ),
  });

  const VirtualGridComponents: GridComponents = useMemo(
    () => ({
      List: forwardRef(({ children, style }, ref) => (
        <div
          ref={ref}
          className="grid grid-cols-1 gap-2 md:grid-cols-2"
          style={style}
        >
          {children}
        </div>
      )),
      Footer: () => <FooterLoader hasNextPage={hasNextPage} />,
    }),
    [hasNextPage]
  );

  const VirtualListComponents: Components<typeof loadouts> = useMemo(
    () => ({
      List: forwardRef(({ children, style }, ref) => (
        <div ref={ref} className="grid grid-cols-1 gap-2" style={style}>
          {children}
        </div>
      )),
      Footer: () => <FooterLoader hasNextPage={hasNextPage} />,
    }),
    [hasNextPage]
  );

  const handleLikeLoadout = (loadoutId: string) =>
    likeMutation.mutate({ loadoutId });

  const handleSaveLoadout = (loadoutId: string) =>
    saveMutation.mutate({ loadoutId });

  const handleLoadMoreLoadouts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const list = isMD ? (
    <VirtuosoGrid
      data={loadouts}
      components={VirtualGridComponents}
      // style={{ height: "calc(100vh - 500px)" }}
      useWindowScroll
      endReached={handleLoadMoreLoadouts}
      itemContent={(_, loadout) => (
        <LoadoutPreviewCard
          key={loadout.id}
          loadout={loadout}
          inventoryItems={inventoryItems}
          authUser={authUser}
          onLike={handleLikeLoadout}
          onSave={handleSaveLoadout}
        />
      )}
    />
  ) : (
    <Virtuoso
      data={loadouts}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      components={VirtualListComponents}
      endReached={handleLoadMoreLoadouts}
      useWindowScroll
      itemContent={(_, loadout) => (
        <LoadoutPreviewCard
          key={loadout.id}
          loadout={loadout}
          inventoryItems={inventoryItems}
          authUser={authUser}
          onLike={handleLikeLoadout}
          onSave={handleSaveLoadout}
        />
      )}
    />
  );

  return (
    <Tabs
      value={router.route.endsWith("/liked") ? "LIKED" : "PERSONAL"}
      className="flex h-full flex-col gap-4"
    >
      <AccountHeader {...props} />
      <DataContainer
        isLoading={isLoading}
        showMessage={loadouts.length === 0}
        title="Loadouts not found"
        description="This user has no loadouts, please come back later."
      >
        {list}
      </DataContainer>
    </Tabs>
  );
};
