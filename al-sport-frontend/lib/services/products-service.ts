/**
 * Serviço para gerenciar produtos via API do Strapi
 */

import { Product } from '@/lib/types'
import { PaginationParams, ProductFilters } from '@/lib/types/api'
import { StrapiProduct, StrapiResponse } from '@/lib/types/strapi'
import { transformStrapiProduct, transformStrapiProducts } from '@/lib/utils/strapi-transformers'
import { apiClient } from './api-client'

class ProductsService {
  /**
   * Busca todos os produtos
   */
  async getAllProducts(filters?: ProductFilters, pagination?: PaginationParams): Promise<Product[]> {
    try {
      const queryParams: Record<string, any> = {
        'populate[category]': '*',
        'populate[subcategory]': '*',
        'populate[images]': '*',
      }

      // Aplicar filtros
      if (filters?.category) {
        queryParams['filters[category][slug][$eq]'] = filters.category
      }

      if (filters?.subcategory) {
        queryParams['filters[subcategory][slug][$eq]'] = filters.subcategory
      }

      if (filters?.featured !== undefined) {
        queryParams['filters[featured][$eq]'] = filters.featured
      }

      if (filters?.onSale !== undefined) {
        queryParams['filters[onSale][$eq]'] = filters.onSale
      }

      if (filters?.active !== undefined) {
        queryParams['filters[active][$eq]'] = filters.active
      } else {
        // Por padrão, buscar apenas produtos ativos
        queryParams['filters[active][$eq]'] = true
      }

      // Aplicar paginação
      if (pagination?.page) {
        queryParams['pagination[page]'] = pagination.page
      }

      if (pagination?.pageSize) {
        queryParams['pagination[pageSize]'] = pagination.pageSize
      }

      const queryString = apiClient.buildQueryString(queryParams)
      const response = await apiClient.get<StrapiResponse<StrapiProduct[]>>(
        `/products?${queryString}`
      )

      const products = Array.isArray(response.data) ? response.data : []
      return transformStrapiProducts(products)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }
  }

  /**
   * Busca produto por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const queryParams = {
        'populate[category]': '*',
        'populate[subcategory]': '*',
        'populate[images]': '*',
      }

      const queryString = apiClient.buildQueryString(queryParams)
      
      // Tentar buscar por documentId primeiro
      const response = await apiClient.get<StrapiResponse<StrapiProduct>>(
        `/products/${id}?${queryString}`
      ).catch(async () => {
        // Se falhar, tentar buscar por slug
        return apiClient.get<StrapiResponse<StrapiProduct[]>>(
          `/products?filters[slug][$eq]=${id}&${queryString}`
        )
      })

      let product: StrapiProduct | null = null

      if (Array.isArray(response.data)) {
        product = response.data[0] || null
      } else {
        product = response.data || null
      }

      if (!product) {
        return null
      }

      return transformStrapiProduct(product)
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      return null
    }
  }

  /**
   * Busca produtos por categoria
   */
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    return this.getAllProducts({ category: categorySlug, active: true })
  }

  /**
   * Busca produtos por subcategoria
   */
  async getProductsBySubcategory(subcategorySlug: string): Promise<Product[]> {
    return this.getAllProducts({ subcategory: subcategorySlug, active: true })
  }

  /**
   * Busca produtos em destaque
   */
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const products = await this.getAllProducts({ featured: true, active: true })
    return limit ? products.slice(0, limit) : products
  }

  /**
   * Busca produtos em destaque limitados (2 por subcategoria, máximo 8)
   */
  async getFeaturedProductsLimited(): Promise<Product[]> {
    const featuredProducts = await this.getFeaturedProducts()
    
    // Agrupar por subcategoria
    const productsBySubcategory: { [key: string]: Product[] } = {}
    
    featuredProducts.forEach(product => {
      const subcategory = product.subcategory
      if (!productsBySubcategory[subcategory]) {
        productsBySubcategory[subcategory] = []
      }
      productsBySubcategory[subcategory].push(product)
    })
    
    // Limitar a 2 produtos por subcategoria
    const limitedProducts: Product[] = []
    Object.values(productsBySubcategory).forEach(subcategoryProducts => {
      limitedProducts.push(...subcategoryProducts.slice(0, 2))
    })
    
    // Limitar o total a 8 produtos
    return limitedProducts.slice(0, 8)
  }

  /**
   * Busca produtos por termo de pesquisa
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const queryParams: Record<string, any> = {
        'populate[category]': '*',
        'populate[subcategory]': '*',
        'populate[images]': '*',
        'filters[active][$eq]': true,
        'filters[$or][0][name][$containsi]': query,
        'filters[$or][1][description][$containsi]': query,
      }

      const queryString = apiClient.buildQueryString(queryParams)
      const response = await apiClient.get<StrapiResponse<StrapiProduct[]>>(
        `/products?${queryString}`
      )

      const products = Array.isArray(response.data) ? response.data : []
      return transformStrapiProducts(products)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      return []
    }
  }
}

export const productsService = new ProductsService()
export default productsService

