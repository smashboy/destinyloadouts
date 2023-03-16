import Image from "next/image";
import { TypographyLarge } from "@/core/components/typography";
import { ButtonLink } from "@/core/components/Button";

interface AppHeaderProps {
  isAuthenticated: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ isAuthenticated }) => (
  <header className="w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
    <div className="container flex h-16 items-center px-6">
      <div className="flex flex-1">
        <Image
          src="/destiny-icons/engram.svg"
          width={32}
          height={32}
          alt="App logo"
          className="mr-2"
        />
        <TypographyLarge>Destiny Loadouts</TypographyLarge>
      </div>
      {isAuthenticated ? (
        <ButtonLink href="/me">Profile</ButtonLink>
      ) : (
        <ButtonLink href="/login">Login</ButtonLink>
      )}
    </div>
  </header>
);
