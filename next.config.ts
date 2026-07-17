import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow local dev origins (fixes blocked cross-origin dev resource warnings)
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.100.78"],
};

export default nextConfig;
