import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev to save resources
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC minifier for faster builds

  // Compiler Optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.log in prod
  },

  // Optimized Image Handling
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow external AI images/avatars
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats
  },

  // Tree-shaking for heavy libraries (Speeds up mobile load)
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // Build settings
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default withPWA(nextConfig);