import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: false, // desativa o Turbopack
  },
};

export default nextConfig;
