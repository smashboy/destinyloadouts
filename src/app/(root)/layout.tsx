import { isAuthenticatedServer } from "@/core/auth/utils";
import { destinyClient } from "@/core/bungie-api/client";
import { ConsoleLog } from "@/core/components/ConsoleLog";
import { DestinyManifestProvider } from "@/core/stores/DestinyManifestContext";
import { AppHeader } from "./components/AppHeader";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const isAuthenticated = await isAuthenticatedServer();

  const destinyManifest = await destinyClient.manifest.get();

  return (
    <DestinyManifestProvider value={destinyManifest}>
      <ConsoleLog destinyManifest={destinyManifest} />
      <AppHeader isAuthenticated={isAuthenticated} />
      <div className="flex-1 py-4 px-3 pb-20 container">{children}</div>
    </DestinyManifestProvider>
  );
}
