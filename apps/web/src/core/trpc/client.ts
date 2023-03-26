import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@services/api/src/web";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://0.0.0.0:4001/trpc",
    }),
  ],
});
