import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  images:{
    qualities: [25, 50, 70, 75, 80, 85, 90, 95, 100]
  }
};

export default nextConfig;
