/**
 * Configuração do Strapi
 * Centraliza todas as configurações relacionadas à API do Strapi
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

export const strapiConfig = {
  baseUrl: STRAPI_URL,
  apiUrl: `${STRAPI_URL}/api`,
  apiToken: STRAPI_API_TOKEN,
  
  // Headers padrão para requisições
  getHeaders: () => ({
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  }),

  // Configurações de populate padrão
  populate: {
    product: {
      category: '*',
      subcategory: '*',
      images: '*',
    },
    category: {
      subcategories: '*',
      image: '*',
    },
  },

  // Timeout para requisições (em ms)
  timeout: 30000,
}

export default strapiConfig

