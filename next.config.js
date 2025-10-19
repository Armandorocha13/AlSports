/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração de imagens para permitir carregamento de fontes externas
  images: {
    remotePatterns: [
      // Permitir imagens do Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Permitir imagens do Google Drive
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false, // Manter otimização de imagens ativada
  },
  // Configurações experimentais
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'], // Pacotes externos para componentes do servidor
  },
}

module.exports = nextConfig
