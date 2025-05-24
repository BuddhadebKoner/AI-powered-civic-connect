import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "images.pexels.com",
      "img.clerk.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      }
    ],
  },
};

export default nextConfig;
