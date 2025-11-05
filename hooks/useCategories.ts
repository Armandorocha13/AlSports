import { publicApiService } from '@/lib/services/publicApiService'
import { useEffect, useState } from 'react'

export interface CategoryApi {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  banner_url: string | null
  is_active: boolean
  sort_order: number
  productCount?: number
  subcategoryCount?: number
  subcategories?: any[]
}

/**
 * Hook para buscar categorias da API com atualização automática
 */
export function useCategories(filters?: {
  is_active?: boolean
  include_subcategories?: boolean
}) {
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await publicApiService.getCategories(filters)
        
        if (mounted) {
          setCategories(data)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Erro ao carregar categorias')
          setCategories([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadCategories()

    // Revalidar a cada 30 segundos
    const interval = setInterval(() => {
      if (mounted) {
        loadCategories()
      }
    }, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [filters?.is_active, filters?.include_subcategories])

  return { categories, loading, error, refetch: () => publicApiService.clearCache() }
}

/**
 * Hook para buscar uma categoria específica por slug
 */
export function useCategoryBySlug(slug: string, includeSubcategories: boolean = false) {
  const [category, setCategory] = useState<CategoryApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let mounted = true

    const loadCategory = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await publicApiService.getCategoryBySlug(slug, includeSubcategories)
        
        if (mounted) {
          setCategory(data)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Erro ao carregar categoria')
          setCategory(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadCategory()

    return () => {
      mounted = false
    }
  }, [slug, includeSubcategories])

  return { category, loading, error, refetch: () => publicApiService.clearCache() }
}

/**
 * Hook para buscar subcategorias
 */
export function useSubcategories(categoryId?: string) {
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSubcategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await publicApiService.getSubcategories({
          category_id: categoryId,
          is_active: true
        })
        
        if (mounted) {
          setSubcategories(data)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Erro ao carregar subcategorias')
          setSubcategories([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSubcategories()

    // Revalidar a cada 30 segundos
    const interval = setInterval(() => {
      if (mounted) {
        loadSubcategories()
      }
    }, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [categoryId])

  return { subcategories, loading, error, refetch: () => publicApiService.clearCache() }
}

