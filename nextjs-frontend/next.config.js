/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://72.60.81.203:5000',
  },
};

module.exports = nextConfig;


