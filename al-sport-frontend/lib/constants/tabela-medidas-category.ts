import { Category } from '@/lib/types'

/**
 * Categoria fixa de Tabela de Medidas
 * Esta categoria não depende do Strapi e está sempre disponível
 */
export const TABELA_MEDIDAS_CATEGORY: Category = {
  id: 'tabela-medidas-fixed',
  name: 'Tabela de Medidas',
  slug: 'tabela-medidas',
  image: '/images/placeholder.jpg', // Pode adicionar uma imagem específica depois
  description: 'Consulte as medidas dos nossos produtos tailandeses',
  subcategories: []
}

