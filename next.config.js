/*@type {import('next').NextConfig}*/ 
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/",
  output:'export',
  images:{
    unoptimized: true,
    domains: [
      "images.unsplash.com"
    ],
  },
};
module.exports=nextConfig

