/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
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
