import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gt-engine.com',
        pathname: '/gt7/tracks/images/**',
      },
    ],
  },
};

export default nextConfig;
