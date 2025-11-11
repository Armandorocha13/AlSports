/**
 * Tipos TypeScript para estruturas de dados do Strapi
 */

// Estrutura de resposta padrão do Strapi
export interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Estrutura de dados com atributos do Strapi
export interface StrapiEntity<T> {
  id: number
  documentId: string
  attributes: T
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// Media do Strapi
export interface StrapiMedia {
  id: number
  documentId: string
  attributes: {
    name: string
    alternativeText?: string
    caption?: string
    width: number
    height: number
    formats?: {
      thumbnail?: StrapiMediaFormat
      small?: StrapiMediaFormat
      medium?: StrapiMediaFormat
      large?: StrapiMediaFormat
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl?: string
    provider: string
    provider_metadata?: any
    createdAt: string
    updatedAt: string
  }
}

export interface StrapiMediaFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  path?: string
  url: string
}

// Product do Strapi
export interface StrapiProductAttributes {
  name: string
  slug: string
  price: number
  wholesalePrice?: number
  description: string
  sizes: string[] | string // JSON string ou array
  featured: boolean
  onSale: boolean
  priceRanges: string | Array<{ min: number; max?: number; price: number }> // JSON string ou array
  stock?: number
  active: boolean
  images?: {
    data: StrapiMedia[]
  }
  category?: {
    data: StrapiCategory | null
  }
  subcategory?: {
    data: StrapiSubcategory | null
  }
}

export type StrapiProduct = StrapiEntity<StrapiProductAttributes>

// Category do Strapi
export interface StrapiCategoryAttributes {
  name: string
  slug: string
  description?: string
  active: boolean
  order?: number
  image?: {
    data: StrapiMedia | null
  }
  subcategories?: {
    data: StrapiSubcategory[]
  }
}

export type StrapiCategory = StrapiEntity<StrapiCategoryAttributes>

// Subcategory do Strapi
export interface StrapiSubcategoryAttributes {
  name?: string
  Nome?: string // Campo em português do Strapi
  slug?: string
  active?: boolean
  order?: number
  image?: {
    data: StrapiMedia | null
  }
  ImagemDaSubcategoria?: {
    data: StrapiMedia | null
  } | StrapiMedia | null
  category?: {
    data: StrapiCategory | null
  }
}

export type StrapiSubcategory = StrapiEntity<StrapiSubcategoryAttributes>

