/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable strict mode for React
  reactStrictMode: false,
  // Disable image optimization for now
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
