/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Disable typedRoutes to allow query-string router.replace in App Router
    typedRoutes: false
  }
};

export default nextConfig;
