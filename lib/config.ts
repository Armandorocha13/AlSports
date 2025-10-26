/**
 * Configurações centralizadas do projeto AlSports
 */

// Configurações de ambiente
export const ENV_CONFIG = {
  // URLs e endpoints
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // APIs externas
  SUPERFRETE_API_KEY: process.env.NEXT_PUBLIC_SUPERFRETE_API_KEY || '',
  VIA_CEP_API: 'https://viacep.com.br/ws',
  
  // Configurações do WhatsApp
  WHATSAPP_PHONE: '5521994595532',
  
  // URLs de produção
  PRODUCTION_URL: process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://alsports.com.br',
  
  // Configurações de desenvolvimento
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const

// Configurações de cache
export const CACHE_CONFIG = {
  // Tempo de cache para dados estáticos (em segundos)
  STATIC_DATA_TTL: 3600, // 1 hora
  
  // Tempo de cache para dados dinâmicos (em segundos)
  DYNAMIC_DATA_TTL: 300, // 5 minutos
  
  // Tempo de cache para imagens (em segundos)
  IMAGES_TTL: 86400, // 24 horas
  
  // Tamanho máximo do cache (em MB)
  MAX_CACHE_SIZE: 50,
} as const

// Configurações de paginação
export const PAGINATION_CONFIG = {
  // Itens por página padrão
  DEFAULT_PAGE_SIZE: 12,
  
  // Tamanhos de página disponíveis
  PAGE_SIZES: [12, 24, 48, 96],
  
  // Máximo de itens por página
  MAX_PAGE_SIZE: 100,
} as const

// Configurações de frete
export const SHIPPING_CONFIG = {
  // CEP de origem (Rio de Janeiro)
  ORIGIN_ZIPCODE: '20000-000',
  
  // Configurações de frete grátis
  FREE_SHIPPING_THRESHOLD: 50, // peças
  FREE_SHIPPING_VALUE: 0,
  
  // Configurações de frete reduzido
  REDUCED_SHIPPING_THRESHOLD: 20, // peças
  REDUCED_SHIPPING_VALUE: 8.00,
  
  // Frete padrão
  DEFAULT_SHIPPING_VALUE: 15.00,
  
  // Tempo de entrega padrão (dias úteis)
  DEFAULT_DELIVERY_TIME: '3-5',
} as const

// Configurações de desconto
export const DISCOUNT_CONFIG = {
  // Desconto mínimo para atacado
  MIN_WHOLESALE_DISCOUNT: 0.1, // 10%
  
  // Desconto máximo permitido
  MAX_DISCOUNT: 0.5, // 50%
  
  // Quantidade mínima para desconto
  MIN_QUANTITY_FOR_DISCOUNT: 5,
} as const

// Configurações de validação
export const VALIDATION_CONFIG = {
  // Tamanhos de arquivo (em bytes)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  
  // Formatos de arquivo permitidos
  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
  ALLOWED_DOCUMENT_FORMATS: ['pdf', 'doc', 'docx'],
  
  // Tamanhos de imagem
  IMAGE_SIZES: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  },
} as const

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  // Tempo de exibição de notificações (em ms)
  DISPLAY_DURATION: 5000,
  
  // Tipos de notificação
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  
  // Posições de notificação
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
  },
} as const

// Configurações de SEO
export const SEO_CONFIG = {
  // Título padrão do site
  DEFAULT_TITLE: 'AL Sports - Mundo da Bola | Loja de Atacado de Roupas Esportivas',
  
  // Descrição padrão
  DEFAULT_DESCRIPTION: 'Especializada na venda por atacado de roupas esportivas. Futebol, NBA, Roupas de Treino, Conjuntos Infantis, Acessórios e muito mais.',
  
  // Palavras-chave
  DEFAULT_KEYWORDS: 'roupas esportivas, atacado, futebol, NBA, treino, infantil, acessórios, AL Sports, mundo da bola',
  
  // URL da imagem padrão
  DEFAULT_IMAGE: '/images/Logo/Logo.png',
  
  // Configurações de Open Graph
  OPEN_GRAPH: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'AL Sports',
  },
} as const

// Configurações de analytics
export const ANALYTICS_CONFIG = {
  // Google Analytics (se configurado)
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
  
  // Facebook Pixel (se configurado)
  FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  
  // Eventos personalizados
  EVENTS: {
    PRODUCT_VIEW: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    CHECKOUT_START: 'checkout_start',
    PURCHASE: 'purchase',
  },
} as const

// Configurações de erro
export const ERROR_CONFIG = {
  // Códigos de erro personalizados
  CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
  },
  
  // Mensagens de erro padrão
  MESSAGES: {
    GENERIC_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    VALIDATION_ERROR: 'Dados inválidos. Verifique os campos preenchidos.',
    AUTH_ERROR: 'Erro de autenticação. Faça login novamente.',
  },
} as const

// Configurações de rate limiting
export const RATE_LIMIT_CONFIG = {
  // Limite de requisições por minuto
  REQUESTS_PER_MINUTE: 60,
  
  // Limite de requisições por hora
  REQUESTS_PER_HOUR: 1000,
  
  // Tempo de bloqueio (em minutos)
  BLOCK_DURATION: 15,
} as const

// Função para validar configurações
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!ENV_CONFIG.SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL não configurado')
  }
  
  if (!ENV_CONFIG.SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY não configurado')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Função para obter configuração por ambiente
export function getConfigByEnvironment() {
  if (ENV_CONFIG.IS_PRODUCTION) {
    return {
      ...ENV_CONFIG,
      CACHE_TTL: CACHE_CONFIG.STATIC_DATA_TTL,
      DEBUG: false,
    }
  }
  
  return {
    ...ENV_CONFIG,
    CACHE_TTL: 60, // 1 minuto em desenvolvimento
    DEBUG: true,
  }
}

