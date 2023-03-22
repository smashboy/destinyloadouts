import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import cors from "@fastify/cors";
import { appRouter } from "./router";
import { createContext } from "./trpc";

const server = fastify({
  logger: true,
  maxParamLength: 5000,
});

// server.register(cors, {
//   origin: process.env.APP_ORIGIN,
// });

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

export const initServer = () =>
  server.listen({
    port: process.env.SERVER_PORT as unknown as number,
    host: "0.0.0.0",
  });

export const logServerError = (err: unknown) => server.log.error(err);
