import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@clerk/clerk-react'],
  turbopack: {
    resolveAlias: {
      'swr': 'swr/dist/core/index.mjs',
    },
  },
};

export default nextConfig;