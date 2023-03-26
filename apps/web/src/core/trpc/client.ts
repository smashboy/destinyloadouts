import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";
import type { AppRouter } from "@services/api/src/web";
import { apiUrl } from "./config";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiUrl,
    }),
  ],
});

export const trpcReact = createTRPCReact<AppRouter>();
