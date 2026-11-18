import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  cacheComponents: true, // Enable Cache Components
  typedRoutes: true,
  experimental: {
    // Adopted by the Next.js security upgrade agent (16.4.2 -> 16.4.6).
    agentUpgrade: "security",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    // Only the qualities the UI actually requests: 50 (portfolio grid),
    // 75 (the default) and 80 (heroes / masonry). Every extra entry becomes a
    // separate transformation + cache entry for every image.
    qualities: [50, 75, 80],
    // Upload filenames are unique (name-timestamp-random) and never rewritten,
    // so optimized output can be cached for a year instead of the 4h default.
    minimumCacheTTL: 31536000,
    // Trimmed srcset ladder. The widest surface is a full-bleed hero, so 1920
    // covers it; 2048/3840 only produced upscales of smaller source files.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [256, 384],
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
        protocol: "https",
        hostname: "www.exquisitephoto.co.za",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
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
