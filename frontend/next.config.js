/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cms.miraiyantra.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.miraiyantra.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
