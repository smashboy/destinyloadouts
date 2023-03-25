import { isAuthenticatedServer } from "@/core/auth/utils";
import { AppHeader } from "./components/AppHeader";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const revalidate = 0;

export default async function RootLayout({ children }: RootLayoutProps) {
  const isAuthenticated = await isAuthenticatedServer();

  return (
    <>
      <AppHeader isAuthenticated={isAuthenticated} />
      <div className="flex-1 py-4 px-3 pb-20 container">{children}</div>
    </>
  );
}
