import { useAuthUser } from "~/hooks/useAuthUser";
import { IconButton } from "~/components/IconButton";
import {
  IconBookmarkSolid,
  IconHomeSolid,
  IconPlusSolid,
  IconUserSolid,
} from "~/icons";

export const AppMobileNavigation = () => {
  const [authUser] = useAuthUser();

  if (!authUser) return null;

  return (
    <div className="fixed bottom-0 z-30 flex h-16 w-full items-center justify-around gap-4 border-t bg-neutral-800 p-4 dark:border-t-neutral-700 md:hidden">
      <IconButton href="/" icon={IconHomeSolid} />
      <IconButton href="/new-loadout" icon={IconPlusSolid} />
      <IconButton href="/bookmarks" icon={IconBookmarkSolid} />
      <IconButton href={`/user/${authUser.id}`} icon={IconUserSolid} />
    </div>
  );
};
