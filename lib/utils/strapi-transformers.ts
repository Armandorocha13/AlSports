/**
 * Funções para transformar dados do Strapi para o formato interno do frontend
 */

import { Category, Product } from '@/lib/types'
import {
    StrapiCategory,
    StrapiMedia,
    StrapiProduct
} from '@/lib/types/strapi'

/**
 * Extrai URL da imagem do Strapi Media
 */
function getImageUrl(media: StrapiMedia | null | undefined): string {
  if (!media) return '/images/placeholder.jpg'
  
  // Se for um objeto com data (array)
  if ('data' in media && Array.isArray(media.data) && media.data.length > 0) {
    return media.data[0].attributes?.url || '/images/placeholder.jpg'
  }
  
  // Se for um objeto com data (single)
  if ('data' in media && media.data && !Array.isArray(media.data)) {
    const data = media.data as any
    return data.attributes?.url || data.url || '/images/placeholder.jpg'
  }
  
  // Se for direto o objeto de atributos
  if ('attributes' in media) {
    return media.attributes.url || '/images/placeholder.jpg'
  }
  
  return '/images/placeholder.jpg'
}

/**
 * Transforma produto do Strapi para formato interno
 */
export function transformStrapiProduct(strapiProduct: StrapiProduct): Product {
  const attrs = strapiProduct.attributes || (strapiProduct as any)
  
  // Processar sizes
  let sizes: string[] = []
  if (attrs.sizes) {
    if (typeof attrs.sizes === 'string') {
      try {
        sizes = JSON.parse(attrs.sizes)
      } catch {
        sizes = []
      }
    } else if (Array.isArray(attrs.sizes)) {
      sizes = attrs.sizes
    }
  }

  // Processar priceRanges
  let priceRanges: Array<{ min: number; max?: number; price: number }> = []
  if (attrs.priceRanges) {
    if (typeof attrs.priceRanges === 'string') {
      try {
        priceRanges = JSON.parse(attrs.priceRanges)
      } catch {
        priceRanges = []
      }
    } else if (Array.isArray(attrs.priceRanges)) {
      priceRanges = attrs.priceRanges
    }
  }

  // Extrair imagem
  const image = getImageUrl(attrs.images as any)

  // Extrair categoria e subcategoria
  const categoryData = attrs.category as any
  const categorySlug = 
    categoryData?.data?.attributes?.slug ||
    categoryData?.data?.slug ||
    categoryData?.slug ||
    ''
  
  const subcategoryData = attrs.subcategory as any
  const subcategorySlug = 
    subcategoryData?.data?.attributes?.slug ||
    subcategoryData?.data?.slug ||
    subcategoryData?.slug ||
    ''

  return {
    id: strapiProduct.documentId || strapiProduct.id.toString(),
    name: attrs.name,
    price: attrs.price,
    wholesalePrice: attrs.wholesalePrice || attrs.price,
    image,
    description: attrs.description || '',
    sizes,
    category: categorySlug,
    subcategory: subcategorySlug,
    featured: attrs.featured || false,
    onSale: attrs.onSale || false,
    priceRanges,
  }
}

/**
 * Transforma categoria do Strapi para formato interno
 */
export function transformStrapiCategory(strapiCategory: StrapiCategory): Category {
  const attrs = strapiCategory.attributes || (strapiCategory as any)
  
  // Extrair imagem
  const image = getImageUrl(attrs.image as any)

  // Transformar subcategorias
  const subcategoriesData = attrs.subcategories as any
  const subcategories = (subcategoriesData?.data || []).map((sub: any) => {
    const subAttrs = sub.attributes || sub
    return {
      id: sub.documentId || sub.id?.toString() || '',
      name: subAttrs.name || '',
      slug: subAttrs.slug || '',
      image: getImageUrl(subAttrs.image),
    }
  })

  return {
    id: strapiCategory.documentId || strapiCategory.id.toString(),
    name: attrs.name,
    slug: attrs.slug,
    image,
    description: attrs.description || '',
    subcategories,
  }
}

/**
 * Transforma array de produtos do Strapi
 */
export function transformStrapiProducts(strapiProducts: StrapiProduct[]): Product[] {
  return strapiProducts.map(transformStrapiProduct)
}

/**
 * Transforma array de categorias do Strapi
 */
export function transformStrapiCategories(strapiCategories: StrapiCategory[]): Category[] {
  return strapiCategories.map(transformStrapiCategory)
}

