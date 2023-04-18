import Link from "next/link";
import Image from "next/image";
import { TypographySmall } from "./typography";
import { APP_NAME } from "~/constants/app";
import { useAuthUser } from "~/hooks/useAuthUser";
import { ButtonLink } from "./Button";
import { AuthUserMenu } from "./AuthUserMenu";

export const AppMobileHeader = () => {
  const [authUser] = useAuthUser();

  return (
    <div className="sticky top-8 z-30 flex h-16 w-full items-center justify-between border-b bg-neutral-900/50 p-4 backdrop-blur dark:border-b-neutral-700 md:hidden">
      <Link href="/" className="flex items-center">
        <Image
          src="/destiny-icons/black-armory.svg"
          width={24}
          height={24}
          alt="App logo"
          className="mr-2 dark:invert"
        />
        <TypographySmall>{APP_NAME}</TypographySmall>
      </Link>
      <AuthUserMenu />
      {!authUser && <ButtonLink href="/login">Login</ButtonLink>}
    </div>
  );
};
