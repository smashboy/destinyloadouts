import type { NextPage } from "next";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import { AppSidebar } from "~/components/AppSidebar";
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
  disableContainer?: boolean;
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
      "flex h-screen overflow-hidden bg-white font-sans text-slate-900 antialiased dark:bg-neutral-900 dark:text-slate-50",
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
  const disableContainer = Component.disableContainer ?? false;

  typeof document !== "undefined" &&
    document.documentElement.classList.add("dark");

  if (removeLayout)
    return (
      <CommonRoot session={session}>
        <Component {...pageProps} />
      </CommonRoot>
    );

  return (
    <CommonRoot session={session}>
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className={cn(!disableContainer && "container px-3 pt-4")}>
          <Component {...pageProps} />
        </div>
      </div>
    </CommonRoot>
  );
};

export default trpcNext.withTRPC(MyApp);
