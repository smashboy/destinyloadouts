import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { type NextPageWithLayout } from "./_app.page";
import { Button, ButtonLink } from "~/components/Button";
import { TypographyLarge } from "~/components/typography";

const LoginPage: NextPageWithLayout = () => {
  const handleLogin = () => signIn("bungie");

  return (
    <div className="h-full px-12 py-6">
      <ButtonLink href="/" variant="ghost" iconLeft={ChevronLeft}>
        Back
      </ButtonLink>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/destiny-icons/black-armory.svg"
            width={64}
            height={64}
            alt="App logo"
          />
          <TypographyLarge>Welcome to Black Armory</TypographyLarge>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onClick={handleLogin}>Login with bungie account</Button>
        </div>
      </div>
    </div>
  );
};

LoginPage.removeLayout = true;

export default LoginPage;
