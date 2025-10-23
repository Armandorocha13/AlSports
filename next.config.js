/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração de imagens otimizada
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'], // Formatos otimizados
    minimumCacheTTL: 60, // Cache de 1 minuto
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Tamanhos otimizados
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tamanhos para ícones
  },
  // Compressão e otimizações
  compress: true,
  poweredByHeader: false, // Remover header X-Powered-By
  // Configurações experimentais
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
  // Headers de cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
