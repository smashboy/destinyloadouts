import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { isAuthenticatedServer } from "@/core/auth/utils";
import { LoginButton } from "./LoginButton";
import { TypographyLarge } from "@/core/components/typography";
import { Button, ButtonLink } from "@/core/components/Button";

export default async function LoginPage() {
  const isAuthenticated = await isAuthenticatedServer();

  if (isAuthenticated) redirect("/me");

  return (
    <div className="h-full px-12 py-6">
      <ButtonLink href="/" variant="ghost" iconLeft={ChevronLeft}>
        Back
      </ButtonLink>
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/destiny-icons/engram.svg"
            width={64}
            height={64}
            alt="App logo"
          />
          <TypographyLarge>Destiny Loadouts</TypographyLarge>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
