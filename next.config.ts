import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Esto hace tree-shaking agresivo para @phosphor-icons/react
    optimizePackageImports: ['@phosphor-icons/react'],
  },
};

export default nextConfig;
