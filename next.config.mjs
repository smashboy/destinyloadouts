/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { withSuperjson } from "next-superjson";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { env } from "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ["page.tsx", "page.ts"],
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "www.bungie.net",
  //       port: "",
  //       pathname: "/**",
  //     },
  //   ],
  // },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};
// export default withSuperjson()(withBundleAnalyzer()(config));

export default withSuperjson()(
  withBundleAnalyzer({ enabled: env.ANALYZE === "true" })(config)
);
