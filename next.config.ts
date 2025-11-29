import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions: {
      bodySizeLimit: '20mb',
    }
  },
  cacheComponents: true, // Enable Cache Components 
  typedRoutes: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    qualities: [25, 50, 70, 75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6c1050288c7041a9a3c730794fa669ba.r2.dev",
      },
    ],
  },

  // Configure webpack to handle .md and other asset files properly


};

export default withPayload(nextConfig);
