import Link from "next/link";
import Image from "next/image";
import { TypographyLarge } from "~/core/components/typography";
import { ButtonLink } from "~/core/components/Button";
import { useSession } from "next-auth/react";

export const AppHeader = () => {
  const session = useSession();

  const isAuthenticated = session.status === "authenticated";

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
          <ButtonLink href="/me">Profile</ButtonLink>
        ) : (
          <ButtonLink href="/login">Login</ButtonLink>
        )}
      </div>
    </header>
  );
};
