/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Disable typedRoutes to allow query-string router.replace in App Router
    typedRoutes: false
  },
  webpack: (config) => {
    // Work around optional WebGPU/TSL imports in three-globe / three
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'three/webgpu': false,
      'three/tsl': false
    };
    return config;
  }
};

export default nextConfig;
