/**
 * Serviço público para consumir APIs do front-end
 * Cache leve com revalidação automática
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
}

export interface ProductApi {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  subcategory_id: string | null
  base_price: number
  price?: number
  wholesale_price: number | null
  cost_price: number | null
  sku: string | null
  barcode: string | null
  weight: number | null
  height: number | null
  width: number | null
  length: number | null
  dimensions: any
  sizes: string[]
  colors: string[]
  materials: string[]
  is_active: boolean
  is_featured: boolean
  is_on_sale: boolean
  stock_quantity: number
  min_stock: number
  max_stock: number | null
  category?: any
  subcategory?: any
  images?: string[]
}

class PublicApiService {
  private baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 30 * 1000 // 30 segundos

  /**
   * Limpa cache expirado
   */
  private cleanCache() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Busca dados com cache
   */
  private async fetchWithCache<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    this.cleanCache()

    // Verificar cache
    const cached = this.cache.get(url)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as ApiResponse<T>
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        cache: 'no-store' // Sempre buscar dados frescos
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Salvar no cache
      this.cache.set(url, {
        data,
        timestamp: Date.now()
      })

      return data
    } catch (error: any) {
      console.error('Erro ao buscar dados da API:', error)
      return {
        success: false,
        error: error.message || 'Erro ao buscar dados'
      }
    }
  }

  /**
   * GET /api/produtos
   * Lista todos os produtos
   */
  async getProducts(filters?: {
    category_id?: string
    subcategory_id?: string
    is_active?: boolean
    is_featured?: boolean
    limit?: number
  }): Promise<ProductApi[]> {
    const params = new URLSearchParams()
    
    if (filters?.category_id) params.append('category_id', filters.category_id)
    if (filters?.subcategory_id) params.append('subcategory_id', filters.subcategory_id)
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active))
    if (filters?.is_featured) params.append('is_featured', 'true')
    if (filters?.limit) params.append('limit', String(filters.limit))

    const url = `${this.baseUrl}/api/produtos${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await this.fetchWithCache<ProductApi[]>(url)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return []
  }

  /**
   * GET /api/produtos/[id]
   * Busca um produto específico
   */
  async getProductById(id: string): Promise<ProductApi | null> {
    const url = `${this.baseUrl}/api/produtos/${id}`
    
    const response = await this.fetchWithCache<ProductApi>(url)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return null
  }

  /**
   * POST /api/produtos
   * Cria um novo produto (apenas admin)
   */
  async createProduct(data: any): Promise<ProductApi | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success && result.data) {
        // Invalidar cache
        this.cache.clear()
        return result.data
      }

      return null
    } catch (error: any) {
      console.error('Erro ao criar produto:', error)
      return null
    }
  }

  /**
   * PUT /api/produtos/[id]
   * Atualiza um produto (apenas admin)
   */
  async updateProduct(id: string, data: any): Promise<ProductApi | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success && result.data) {
        // Invalidar cache
        this.cache.clear()
        return result.data
      }

      return null
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error)
      return null
    }
  }

  /**
   * DELETE /api/produtos/[id]
   * Remove um produto (apenas admin)
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/produtos/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        // Invalidar cache
        this.cache.clear()
        return true
      }

      return false
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error)
      return false
    }
  }

  /**
   * GET /api/categorias
   * Lista todas as categorias
   */
  async getCategories(filters?: {
    is_active?: boolean
    include_subcategories?: boolean
  }): Promise<any[]> {
    const params = new URLSearchParams()
    
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active))
    if (filters?.include_subcategories) params.append('include_subcategories', 'true')

    const url = `${this.baseUrl}/api/categorias${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await this.fetchWithCache<any[]>(url)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return []
  }

  /**
   * GET /api/categorias/[id]
   * Busca uma categoria específica
   */
  async getCategoryById(id: string, includeSubcategories: boolean = false): Promise<any | null> {
    const url = `${this.baseUrl}/api/categorias/${id}${includeSubcategories ? '?include_subcategories=true' : ''}`
    
    const response = await this.fetchWithCache<any>(url)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return null
  }

  /**
   * GET /api/categorias/slug/[slug]
   * Busca uma categoria por slug
   */
  async getCategoryBySlug(slug: string, includeSubcategories: boolean = false): Promise<any | null> {
    const url = `${this.baseUrl}/api/categorias/slug/${slug}${includeSubcategories ? '?include_subcategories=true' : ''}`
    
    const response = await this.fetchWithCache<any>(url)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return null
  }

  /**
   * GET /api/subcategorias
   * Lista todas as subcategorias
   */
  async getSubcategories(filters?: {
    category_id?: string
    is_active?: boolean
  }): Promise<any[]> {
    const params = new URLSearchParams()
    
    if (filters?.category_id) params.append('category_id', filters.category_id)
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active))

    const url = `${this.baseUrl}/api/subcategorias${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await this.fetchWithCache<any[]>(url)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return []
  }

  /**
   * Limpa o cache manualmente
   */
  clearCache() {
    this.cache.clear()
  }
}

export const publicApiService = new PublicApiService()

