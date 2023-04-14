import type { NextPage } from "next";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import { AppSidebar } from "~/components/AppSidebar";
import { cn } from "~/utils/tailwind";
import { trpcNext } from "~/utils/api";

import "~/styles/globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AppMobileHeader } from "~/components/AppMobileHeader";
import { AppMobileNavigation } from "~/components/AppMobileNavigation";
import { DiscordBanner } from "~/components/DiscordBanner";
config.autoAddCss = false;

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
  <>
    <DiscordBanner />
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 antialiased dark:bg-neutral-900 dark:text-slate-50 md:flex-row",
        fontSans.variable
      )}
      style={{ height: "calc(100vh - 32px)" }}
    >
      <SessionProvider session={session}>{children}</SessionProvider>
      <Analytics />
    </div>
  </>
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
        <AppMobileHeader />
        <div
          className={cn(
            !disableContainer && "container px-3 pt-4 pb-48 md:pb-0"
          )}
        >
          <Component {...pageProps} />
        </div>
        <AppMobileNavigation />
      </div>
    </CommonRoot>
  );
};

export default trpcNext.withTRPC(MyApp);
