import Link from "next/link";
import { signOut } from "next-auth/react";
import { bungieNetOrigin } from "~/bungie/constants";
import { useAuthUser } from "~/hooks/useAuthUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./Menu";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export const AuthUserMenu = () => {
  const [authUser] = useAuthUser();

  const handleSignout = () => signOut();

  if (!authUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="md:w-full" asChild>
        <Button className="md:w-full" variant="ghost">
          <Avatar
            src={`${bungieNetOrigin}/${authUser.bungieAccountProfilePicturePath}`}
            fallback={authUser.bungieAccountDisplayName}
            className="md:mr-3"
            size="xxs"
          />
          <span className="hidden md:block">
            {authUser.bungieAccountDisplayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/user/${authUser.id}`}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <DropdownMenuItem onClick={handleSignout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
