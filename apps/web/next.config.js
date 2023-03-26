/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts"],
  transpilePackages: ["@services/api", "@destiny/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bungie.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
