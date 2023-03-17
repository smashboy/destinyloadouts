/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
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
