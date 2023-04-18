import type { NextPage } from "next";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { AppMobileHeader } from "~/components/AppMobileHeader";
import { AppMobileNavigation } from "~/components/AppMobileNavigation";
import { DiscordBanner } from "~/components/DiscordBanner";
import { AppSidebar } from "~/components/AppSidebar";
import { cn } from "~/utils/tailwind";
import { trpcNext } from "~/utils/api";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "~/styles/globals.css";

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
        "flex h-full flex-col bg-white font-sans text-slate-900 antialiased dark:bg-neutral-900 dark:text-slate-50 md:flex-row",
        fontSans.variable
      )}
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
      <AppMobileHeader />
      <div
        className={cn(
          "flex-1",
          !disableContainer && "container h-full px-3 pt-4 pb-48 md:pb-0"
        )}
      >
        <Component {...pageProps} />
      </div>
      <AppMobileNavigation />
    </CommonRoot>
  );
};

export default trpcNext.withTRPC(MyApp);
