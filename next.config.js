/*@type {import('next').NextConfig}*/ 
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/",
  output:'standalone',
  images:{
    unoptimized: true,
    domains: [
      "images.unsplash.com"
    ],
  },
};
module.exports=nextConfig

