import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow RSS parser on server (it uses some node APIs)
  serverExternalPackages: ['rss-parser'],
};

export default nextConfig;
