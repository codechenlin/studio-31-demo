import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Salida optimizada para despliegues en Docker
  output: 'standalone',

  // Configuración de compilación
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuración de imágenes externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fanton.cloud',
        pathname: '/**',
      },
    ],
  },

  // Configuración de server actions
  serverActions: {
    bodySizeLimit: '10mb',
  },
};

export default nextConfig;
