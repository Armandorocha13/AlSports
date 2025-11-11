import { publicApiService, type ProductApi } from '@/lib/services/publicApiService'
import { useEffect, useState } from 'react'

/**
 * Hook para buscar produtos da API com atualização automática
 */
export function useProducts(filters?: {
  category_id?: string
  subcategory_id?: string
  is_active?: boolean
  is_featured?: boolean
  limit?: number
}) {
  const [products, setProducts] = useState<ProductApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await publicApiService.getProducts(filters)
        
        if (mounted) {
          setProducts(data)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Erro ao carregar produtos')
          setProducts([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    // Revalidar a cada 30 segundos
    const interval = setInterval(() => {
      if (mounted) {
        loadProducts()
      }
    }, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [
    filters?.category_id,
    filters?.subcategory_id,
    filters?.is_active,
    filters?.is_featured,
    filters?.limit
  ])

  return { products, loading, error, refetch: () => publicApiService.clearCache() }
}

/**
 * Hook para buscar um produto específico
 */
export function useProduct(id: string) {
  const [product, setProduct] = useState<ProductApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let mounted = true

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await publicApiService.getProductById(id)
        
        if (mounted) {
          setProduct(data)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Erro ao carregar produto')
          setProduct(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      mounted = false
    }
  }, [id])

  return { product, loading, error, refetch: () => publicApiService.clearCache() }
}

