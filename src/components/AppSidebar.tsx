import Link from "next/link";
import Image from "next/image";
import { TypographyLarge } from "~/components/typography";
import { ButtonLink } from "~/components/Button";

import { useAuthUser } from "~/hooks/useAuthUser";
import { SidebarNavLink } from "./SidebarNavLink";
import {
  IconBookmarkSolid,
  IconHomeSolid,
  IconSackDollarSolid,
  IconUserSolid,
} from "~/icons";
import { APP_NAME } from "~/constants/app";
import { AuthUserMenu } from "./AuthUserMenu";

export const AppSidebar = () => {
  const [authUser] = useAuthUser();

  return (
    <div
      className="sticky top-8 z-10 hidden w-60 border-r border-b-slate-200 bg-white py-4 dark:border-r-neutral-700 dark:bg-neutral-900 md:block"
      style={{ height: "calc(100vh - 32px)" }}
    >
      <div className="container flex h-full flex-col items-start px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/destiny-icons/black-armory.svg"
            width={32}
            height={32}
            alt="App logo"
            className="mr-2 dark:invert"
          />
          <TypographyLarge>{APP_NAME}</TypographyLarge>
        </Link>
        <div className="mt-10 flex h-full w-full flex-col gap-4">
          <SidebarNavLink href="/" label="Home" icon={IconHomeSolid} />
          {authUser && (
            <>
              <SidebarNavLink
                href={`/user/${authUser.id}`}
                label="Profile"
                icon={IconUserSolid}
              />
              <SidebarNavLink
                href="/bookmarks"
                label="Bookmarks"
                icon={IconBookmarkSolid}
              />
            </>
          )}
          <SidebarNavLink
            href="https://www.buymeacoffee.com/smashboy"
            label="Support project"
            target="_blank"
            rel="noopener noreferrer"
            icon={IconSackDollarSolid}
          />
        </div>
        {authUser ? (
          <div className="flex w-full flex-col space-y-4">
            <ButtonLink href="/new-loadout" size="lg">
              New Loadout +
            </ButtonLink>
            <AuthUserMenu />
          </div>
        ) : (
          <ButtonLink href="/login" className="w-full">
            Login
          </ButtonLink>
        )}
      </div>
    </div>
  );
};

// {authUser ? (
//   <DropdownMenu>
//     <DropdownMenuTrigger>
//       <Avatar
//         src={`${bungieNetOrigin}/${authUser.bungieAccountProfilePicturePath}`}
//         fallback={authUser.bungieAccountDisplayName ?? "User avatar"}
//       />
//     </DropdownMenuTrigger>
//     <DropdownMenuContent>
//       <Link href={`/user/${authUser.id}`}>
//         <DropdownMenuItem>Profile</DropdownMenuItem>
//       </Link>
//       <DropdownMenuItem>Settings</DropdownMenuItem>
//       {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
//       <DropdownMenuItem onClick={handleSignout}>
//         Log out
//       </DropdownMenuItem>
//     </DropdownMenuContent>
//   </DropdownMenu>
// ) : (
//   <ButtonLink href="/login">Login</ButtonLink>
// )}
