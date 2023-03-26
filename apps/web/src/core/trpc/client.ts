import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import type { AppRouter } from "@services/api/src/web";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: "http://0.0.0.0:4001/trpc",
    }),
  ],
});
