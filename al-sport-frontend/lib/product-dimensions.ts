// Dimensões padrão de produtos por categoria para cálculo de frete

export interface ProductDimensions {
  width: number // Largura em cm
  height: number // Altura em cm
  length: number // Comprimento em cm
  weight: number // Peso em kg
}

export interface CategoryDimensions {
  [category: string]: ProductDimensions
}

/**
 * Dimensões padrão por categoria de produto
 * Dimensões padrão: 15cm x 15cm x 15cm, 300g por peça
 */
export const PRODUCT_DIMENSIONS: CategoryDimensions = {
  // Camisas e uniformes de futebol
  'futebol': {
    width: 15, // cm
    height: 15, // cm
    length: 15, // cm
    weight: 0.3 // kg (300g)
  },
  
  // Camisas e uniformes NBA
  'nba': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  },
  
  // Camisas e uniformes NFL
  'nfl': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  },
  
  // Roupas de treino (camisetas, shorts, calças)
  'roupas-treino': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  },
  
  // Conjuntos infantis
  'conjuntos-infantis': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  },
  
  // Acessórios (bonés, meias, etc)
  'acessorios': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  },
  
  // Bermudas e shorts
  'bermudas-shorts': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  },
  
  // Categoria padrão (fallback)
  'default': {
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3
  }
}

/**
 * Obtém as dimensões de um produto baseado na categoria
 * @param category Categoria do produto
 * @returns Dimensões do produto
 */
export function getProductDimensions(category: string): ProductDimensions {
  const normalizedCategory = category.toLowerCase().trim()
  
  // Buscar categoria exata
  if (PRODUCT_DIMENSIONS[normalizedCategory]) {
    return PRODUCT_DIMENSIONS[normalizedCategory]
  }
  
  // Buscar por palavras-chave
  const categoryKeys = Object.keys(PRODUCT_DIMENSIONS)
  const matchingCategory = categoryKeys.find(key => 
    normalizedCategory.includes(key) || key.includes(normalizedCategory)
  )
  
  if (matchingCategory) {
    return PRODUCT_DIMENSIONS[matchingCategory]
  }
  
  // Retornar dimensões padrão
  return PRODUCT_DIMENSIONS.default
}

/**
 * Mapeia itens do carrinho para formato de produtos do SuperFrete
 * com dimensões individuais
 */
export function mapCartItemsToSuperFreteProducts(
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    category?: string
    size?: string
    color?: string
  }>
): Array<{
  quantity: number
  height: number
  length: number
  width: number
  weight: number
}> {
  return items.map(item => {
    // Tentar extrair categoria do item ou usar padrão
    const category = item.category || 'default'
    const dimensions = getProductDimensions(category)
    
    return {
      quantity: item.quantity,
      height: dimensions.height,
      length: dimensions.length,
      width: dimensions.width,
      weight: dimensions.weight
    }
  })
}

