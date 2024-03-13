/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  assetPrefix: "/",
  images:{
    unoptimized: true,
    domains: [
      "images.unsplash.com"
    ],
  },
};

export default nextConfig;
