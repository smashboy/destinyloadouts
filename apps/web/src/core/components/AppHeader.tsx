import Link from "next/link";
import Image from "next/image";
import { TypographyLarge } from "~/core/components/typography";
import { ButtonLink } from "~/core/components/Button";
import { useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./Menu";

export const AppHeader = () => {
  const session = useSession();

  const isAuthenticated = session.status === "authenticated";

  const { user } = session.data || {};

  return (
    <header className="w-full border-b border-b-slate-200 z-10 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container flex h-16 items-center px-6">
        <Link href="/" className="flex flex-1 items-center">
          <Image
            src="/destiny-icons/black-armory.svg"
            width={32}
            height={32}
            alt="App logo"
            className="mr-2"
          />
          <TypographyLarge>Black Armory</TypographyLarge>
        </Link>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                src={user?.image}
                fallback={user?.name ?? "User avatar"}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/me">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <ButtonLink href="/login">Login</ButtonLink>
        )}
      </div>
    </header>
  );
};
