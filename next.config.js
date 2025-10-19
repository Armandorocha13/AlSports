/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para export estático (Netlify)
  output: 'export',
  trailingSlash: true,
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
    unoptimized: true, // Desabilitar otimização para export estático
  },
  // Configurações experimentais
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'], // Pacotes externos para componentes do servidor
  },
}

module.exports = nextConfig
