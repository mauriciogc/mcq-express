import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    // Esto hace tree-shaking agresivo para @phosphor-icons/react
    optimizePackageImports: ['@phosphor-icons/react'],
  },
};

export default nextConfig;
