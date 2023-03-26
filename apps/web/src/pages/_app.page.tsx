import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { AuthProvider } from "~/core/auth/Provider";
import { AppHeader } from "~/core/components/AppHeader";
import { cn } from "~/core/utils";

import "../core/styles/globals.css";
import { TRPCProvider } from "~/core/trpc/TRPCProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  removeLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const CommonRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className={cn(
      "flex h-full flex-col bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50",
      fontSans.variable
    )}
  >
    <AuthProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </AuthProvider>
  </div>
);

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const removeLayout = Component.removeLayout || false;

  if (removeLayout)
    return (
      <CommonRoot>
        <Component {...pageProps} />
      </CommonRoot>
    );

  return (
    <CommonRoot>
      <AppHeader />
      <div className="flex-1 py-4 px-3 pb-20 container">
        <Component {...pageProps} />
      </div>
    </CommonRoot>
  );
}
