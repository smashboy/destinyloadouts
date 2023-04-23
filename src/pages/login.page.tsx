import { type GetServerSideProps } from "next";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { type NextPageWithLayout } from "./_app.page";
import { Button, ButtonLink } from "~/components/Button";
import { TypographyLarge } from "~/components/typography";
import { getServerAuthSession } from "~/server/auth";
import { IconChevronLeftSolid } from "~/icons";
import { APP_NAME, PUBLIC_URL } from "~/constants/app";
import { Seo } from "~/components/Seo";

const LoginPage: NextPageWithLayout = () => {
  const handleLogin = () => signIn("bungie");

  return (
    <>
      <Seo title="Login" canonical={`${PUBLIC_URL}/login`} />
      <div
        className="w-full py-6 px-2 md:px-12"
        style={{ height: "calc(100vh - 48px)" }}
      >
        <ButtonLink href="/" variant="ghost" iconLeft={IconChevronLeftSolid}>
          Back
        </ButtonLink>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/destiny-icons/black-armory.svg"
              width={64}
              height={64}
              className="dark:invert"
              alt="App logo"
            />
            <TypographyLarge>Welcome to {APP_NAME}</TypographyLarge>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Button onClick={handleLogin}>Login with Bungie account</Button>
          </div>
        </div>
      </div>
    </>
  );
};

LoginPage.removeLayout = true;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default LoginPage;
