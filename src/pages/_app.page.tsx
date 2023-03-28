import type { NextPage } from "next";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import { AppHeader } from "~/components/AppHeader";
import { cn } from "~/utils/tailwind";
import { trpcNext } from "~/utils/api";

import "~/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  removeLayout?: boolean;
};

type AppPropsWithLayout = AppProps<{
  session: Session | null;
}> & {
  Component: NextPageWithLayout;
};

const CommonRoot: React.FC<{
  children: React.ReactNode;
  session: Session | null;
}> = ({ children, session }) => (
  <div
    className={cn(
      "flex h-full flex-col bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50",
      fontSans.variable
    )}
  >
    <SessionProvider session={session}>{children}</SessionProvider>
  </div>
);

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const removeLayout = Component.removeLayout || false;

  if (removeLayout)
    return (
      <CommonRoot session={session}>
        <Component {...pageProps} />
      </CommonRoot>
    );

  return (
    <CommonRoot session={session}>
      <AppHeader />
      <div className="container flex-1 py-4 px-3 pb-20">
        <Component {...pageProps} />
      </div>
    </CommonRoot>
  );
};

export default trpcNext.withTRPC(MyApp);
