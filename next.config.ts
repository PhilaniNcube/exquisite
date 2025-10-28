import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // Empty turbopack config to silence the warning
  cacheComponents: true, // Enable Cache Components - Temporarily disabled due to Payload CMS admin compatibility
  typedRoutes: true,
  images: {
    qualities: [25, 50, 70, 75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6c1050288c7041a9a3c730794fa669ba.r2.dev",
      },
    ],
  },
};

export default withPayload(nextConfig);
