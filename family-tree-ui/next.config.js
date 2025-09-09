/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbopack: {
      // Silence root warning by setting explicit root
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
