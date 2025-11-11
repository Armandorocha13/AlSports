/**
 * Serviço para gerenciar categorias via API do Strapi
 */

import { Category } from '@/lib/types'
import { StrapiCategory, StrapiResponse } from '@/lib/types/strapi'
import { transformStrapiCategories, transformStrapiCategory } from '@/lib/utils/strapi-transformers'
import { apiClient } from './api-client'

class CategoriesService {
  /**
   * Busca todas as categorias
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const queryParams = {
        'populate[subcategories][populate][ImagemDaSubcategoria]': '*',
        'populate[image]': '*',
        'filters[active][$eq]': true,
        'sort[0]': 'order:asc',
      }

      const queryString = apiClient.buildQueryString(queryParams)
      const response = await apiClient.get<StrapiResponse<StrapiCategory[]>>(
        `/categories?${queryString}`
      )

      const categories = Array.isArray(response.data) ? response.data : []
      return transformStrapiCategories(categories)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      // Retornar array vazio em caso de erro para não quebrar a aplicação
      return []
    }
  }

  /**
   * Busca categoria por slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const queryParams = {
        'populate[subcategories][populate][ImagemDaSubcategoria]': '*',
        'populate[image]': '*',
        'filters[slug][$eq]': slug,
        'filters[active][$eq]': true,
      }

      const queryString = apiClient.buildQueryString(queryParams)
      const response = await apiClient.get<StrapiResponse<StrapiCategory[]>>(
        `/categories?${queryString}`
      )

      const categories = Array.isArray(response.data) ? response.data : []
      const category = categories[0] || null

      if (!category) {
        return null
      }

      return transformStrapiCategory(category)
    } catch (error) {
      console.error('Erro ao buscar categoria:', error)
      return null
    }
  }

  /**
   * Busca subcategorias por categoria
   */
  async getSubcategoriesByCategory(categorySlug: string): Promise<Category['subcategories']> {
    try {
      const category = await this.getCategoryBySlug(categorySlug)
      return category?.subcategories || []
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error)
      return []
    }
  }
}

export const categoriesService = new CategoriesService()
export default categoriesService

