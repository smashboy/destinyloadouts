import Link from "next/link";
import Image from "next/image";
import { TypographyLarge } from "~/components/typography";
import { ButtonLink } from "~/components/Button";
import { signOut } from "next-auth/react";
import { Avatar } from "./Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./Menu";
import { bungieNetOrigin } from "~/bungie/constants";
import { useAuthUser } from "~/hooks/useAuthUser";

export const AppHeader = () => {
  const [authUser] = useAuthUser();

  const handleSignout = () => signOut();

  return (
    <header className="sticky top-0 z-10 h-full w-1/6 border-r border-b-slate-200 bg-white dark:border-r-neutral-700 dark:bg-neutral-900">
      <div className="container flex h-16 items-center px-6">
        <Link href="/" className="flex flex-1 items-center">
          <Image
            src="/destiny-icons/black-armory.svg"
            width={32}
            height={32}
            alt="App logo"
            className="mr-2 dark:invert"
          />
          <TypographyLarge>Black Armory</TypographyLarge>
        </Link>
        {authUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                src={`${bungieNetOrigin}/${authUser.bungieAccountProfilePicturePath}`}
                fallback={authUser.bungieAccountDisplayName ?? "User avatar"}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`/user/${authUser.id}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <DropdownMenuItem onClick={handleSignout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <ButtonLink href="/login">Login</ButtonLink>
        )}
      </div>
    </header>
  );
};
