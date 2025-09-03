import path from 'node:path';

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
      // Force a single Three.js instance
      'three': path.resolve(process.cwd(), 'node_modules/three'),
      // Stub optional modules referenced by globe.gl/three-globe toolchain
      'three/webgpu$': path.resolve(process.cwd(), 'stubs/three-webgpu.js'),
      'three/tsl$': path.resolve(process.cwd(), 'stubs/three-tsl.js')
    };
    return config;
  }
};

export default nextConfig;
