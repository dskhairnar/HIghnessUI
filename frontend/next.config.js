/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.miraiyantra.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
