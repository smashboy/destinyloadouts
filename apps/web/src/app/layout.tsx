import { Inter as FontSans } from "next/font/google";
import { AuthProvider } from "@/core/auth/Provider";
import { cn } from "@/core/utils";

import "../core/styles/globals.css";

interface EntryLayoutProps {
  children: React.ReactNode;
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function EntryLayout({ children }: EntryLayoutProps) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          "flex h-full flex-col bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50",
          fontSans.variable
        )}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
