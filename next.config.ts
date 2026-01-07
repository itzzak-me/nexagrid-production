import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

// 1. Initialize PWA Wrapper
const withPWA = withPWAInit({
  dest: "public", // Output directory for service worker
  cacheOnFrontEndNav: true, // Instant navigation
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  // swcMinify: true, <--- REMOVED (This caused the error)
  disable: process.env.NODE_ENV === "development", // Disable in dev to prevent caching issues while coding
  workboxOptions: {
    disableDevLogs: true,
  },
});

// 2. Define Next.js Config
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // You can add swcMinify here if you really want, but it's default true.
};

// 3. Export Wrapped Config
export default withPWA(nextConfig);