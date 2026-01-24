import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
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
      {
        protocol: "https",
        hostname: "exquisitephoto.co.za",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
    // dangerouslyAllowSVG: true,
    // unoptimized: process.env.NODE_ENV === "development",
    // loaderFile: undefined,
  },
  // turbopack: {
  //   rules: {
  //     "**/node_modules/**/*.exe": {
  //       loaders: [path.resolve(process.cwd(), "loaders/ignore-loader.cjs")],
  //       as: "*.js",
  //     },
  //     "**/node_modules/**/*.md": {
  //       loaders: [path.resolve(process.cwd(), "loaders/ignore-loader.cjs")],
  //       as: "*.js",
  //     },
  //   },
  // },

  // Configure webpack to handle .md and other asset files properly
};

export default withPayload(nextConfig);
