import Link from "next/link";
import Image from "next/image";
import { TypographyLarge } from "~/components/typography";
import { ButtonLink } from "~/components/Button";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./Menu";
import { bungieNetOrigin } from "~/bungie/constants";

export const AppHeader = () => {
  const session = useSession();

  const isAuthenticated = session.status === "authenticated";

  const { user } = session.data || {};

  const handleSignout = () => signOut();

  return (
    <header className="z-10 w-full border-b border-b-slate-200 bg-white dark:border-b-neutral-700 dark:bg-neutral-900">
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
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                src={`${bungieNetOrigin}/${user!.image}`}
                fallback={user?.name ?? "User avatar"}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/user/me">
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
