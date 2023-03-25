import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button, ButtonLink } from "@/core/components/Button";
import { TypographyLarge } from "@/core/components/typography";
import { NextPageWithLayout } from "./_app.page";

const LoginPage: NextPageWithLayout = () => {
  const handleLogin = () => signIn("bungie");

  return (
    <div className="h-full px-12 py-6">
      <ButtonLink href="/" variant="ghost" iconLeft={ChevronLeft}>
        Back
      </ButtonLink>
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/destiny-icons/black-armory.svg"
            width={64}
            height={64}
            alt="App logo"
          />
          <TypographyLarge>Welcome to Black Armory</TypographyLarge>
          <Button onClick={handleLogin}>Login with bungie account</Button>
        </div>
      </div>
    </div>
  );
};

LoginPage.removeLayout = true;

export default LoginPage;
