/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["page.tsx", "page.ts"],
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
