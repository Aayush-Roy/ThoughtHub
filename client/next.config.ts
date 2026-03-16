import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
   images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // sabhi https images allow
    ],
  },
};

export default nextConfig;
