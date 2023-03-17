import { getDestinyManifest } from "bungie-api-ts/destiny2";
import { isAuthenticatedServer } from "@/core/auth/utils";
import { ConsoleLog } from "@/core/components/ConsoleLog";
import { DestinyManifestProvider } from "@/core/stores/DestinyManifestContext";
import { AppHeader } from "./components/AppHeader";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const fetchHelper = bungieApiFetchHelper();

  const [isAuthenticated, destinyManifest] = await Promise.all([
    isAuthenticatedServer(),
    getDestinyManifest(fetchHelper),
  ]);

  return (
    <DestinyManifestProvider value={destinyManifest.Response}>
      <ConsoleLog destinyManifest={destinyManifest} />
      <AppHeader isAuthenticated={isAuthenticated} />
      <div className="flex-1 py-4 px-3 pb-20 container">{children}</div>
    </DestinyManifestProvider>
  );
}
