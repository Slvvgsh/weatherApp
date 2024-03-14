/*@type {import('next').NextConfig}*/ 
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/weatherApp",
  output:'export',
  images:{
    unoptimized: true,
    formats:["image/svg"],
    domains: [
      "images.unsplash.com"
    ],
  },
};
module.exports=nextConfig

