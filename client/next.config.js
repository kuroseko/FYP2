/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: ['images.unsplash.com','encrypted-tbn0.gstatic.com','ipfs.io']

  }
};

module.exports = nextConfig;
