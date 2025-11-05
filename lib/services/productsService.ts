import { createClient } from '@/lib/supabase-client'
import { Category } from './categoriesService'
import { Subcategory } from './subcategoriesService'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  subcategory_id: string | null
  base_price: number
  price?: number // Compatibilidade
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
  category?: Category
  subcategory?: Subcategory
  images?: string[]
}

export interface CreateProductDto {
  name: string
  description?: string
  category_id?: string
  subcategory_id?: string
  price: number
  stock_quantity: number
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  is_active?: boolean
  is_featured?: boolean
  is_on_sale?: boolean
  min_stock?: number
  max_stock?: number
  weight?: number
  sku?: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  category_id?: string
  subcategory_id?: string
  price?: number
  stock_quantity?: number
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  is_active?: boolean
  is_featured?: boolean
  is_on_sale?: boolean
  min_stock?: number
  max_stock?: number
  weight?: number
  sku?: string
}

class ProductsService {
  private supabase = createClient()

  /**
   * Gera slug a partir do nome
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * Busca todos os produtos
   */
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar produtos:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return []
      }

      // Buscar imagens e categorias para cada produto
      const productsWithDetails = await Promise.all(
        data.map(async (product: any) => {
          // Buscar imagens do produto usando a estrutura images + product_image_relations
          let images: string[] = []
          try {
            const { data: relationsData, error: relationsError } = await this.supabase
              .from('product_image_relations')
              .select('image_id, is_primary')
              .eq('product_id', product.id)
              .order('is_primary', { ascending: false })

            if (!relationsError && relationsData && relationsData.length > 0) {
              const imageIds = relationsData.map((rel: any) => rel.image_id)
              const { data: imagesData, error: imagesError } = await this.supabase
                .from('images')
                .select('id, image_url')
                .in('id', imageIds)

              if (!imagesError && imagesData && imagesData.length > 0) {
                const sortedImages = relationsData.map((rel: any) => {
                  const img = imagesData.find((i: any) => i.id === rel.image_id)
                  return img ? img.image_url : null
                }).filter(Boolean) as string[]
                images = sortedImages
              }
            }

            // Fallback: tentar buscar da tabela antiga product_images
            if (images.length === 0) {
              const { data: oldImagesData, error: oldImagesError } = await this.supabase
                .from('product_images')
                .select('image_url')
                .eq('product_id', product.id)
                .order('is_primary', { ascending: false })

              if (!oldImagesError && oldImagesData) {
                images = oldImagesData.map((img: any) => img.image_url).filter(Boolean)
              }
            }
          } catch (error: any) {
            console.warn(`Erro ao buscar imagens do produto ${product.id}:`, error.message)
            images = []
          }

          // Buscar categoria
          let category = null
          if (product.category_id) {
            const categoryIdNum = parseInt(product.category_id)
            if (!isNaN(categoryIdNum)) {
              const { data: catData } = await this.supabase
                .from('categorias')
                .select('id, nome')
                .eq('id', categoryIdNum)
                .maybeSingle()

              if (catData) {
                category = {
                  id: catData.id.toString(),
                  name: catData.nome,
                  slug: this.generateSlug(catData.nome),
                  description: null,
                  image_url: null,
                  banner_url: null,
                  is_active: true,
                  sort_order: 0
                }
              }
            }
          }

          // Buscar subcategoria
          let subcategory = null
          if (product.subcategory_id) {
            const subcategoryIdNum = parseInt(product.subcategory_id)
            if (!isNaN(subcategoryIdNum)) {
              const { data: subData } = await this.supabase
                .from('subcategorias')
                .select('id, nome, id_categoria')
                .eq('id', subcategoryIdNum)
                .maybeSingle()

              if (subData) {
                subcategory = {
                  id: subData.id.toString(),
                  name: subData.nome,
                  slug: this.generateSlug(subData.nome),
                  category_id: subData.id_categoria.toString(),
                  description: null,
                  image_url: null,
                  is_active: true,
                  sort_order: 0
                }
              }
            }
          }

          return {
            ...product,
            price: product.base_price || product.price || 0, // Compatibilidade
            images,
            category,
            subcategory
          }
        })
      )

      return productsWithDetails
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }
  }

  /**
   * Busca um produto por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      if (!data) {
        return null
      }

      // Buscar imagens
      let images: string[] = []
      try {
        const { data: relationsData } = await this.supabase
          .from('product_image_relations')
          .select('image_id, is_primary')
          .eq('product_id', id)
          .order('is_primary', { ascending: false })

        if (relationsData && relationsData.length > 0) {
          const imageIds = relationsData.map((rel: any) => rel.image_id)
          const { data: imagesData } = await this.supabase
            .from('images')
            .select('id, image_url')
            .in('id', imageIds)

          if (imagesData && imagesData.length > 0) {
            images = relationsData.map((rel: any) => {
              const img = imagesData.find((i: any) => i.id === rel.image_id)
              return img ? img.image_url : null
            }).filter(Boolean) as string[]
          }
        }
      } catch (error: any) {
        console.warn(`Erro ao buscar imagens do produto ${id}:`, error.message)
      }

      // Buscar categoria e subcategoria (mesmo código do getProducts)
      let category = null
      if (data.category_id) {
        const categoryIdNum = parseInt(data.category_id)
        if (!isNaN(categoryIdNum)) {
          const { data: catData } = await this.supabase
            .from('categorias')
            .select('id, nome')
            .eq('id', categoryIdNum)
            .maybeSingle()

          if (catData) {
            category = {
              id: catData.id.toString(),
              name: catData.nome,
              slug: this.generateSlug(catData.nome),
              description: null,
              image_url: null,
              banner_url: null,
              is_active: true,
              sort_order: 0
            }
          }
        }
      }

      let subcategory = null
      if (data.subcategory_id) {
        const subcategoryIdNum = parseInt(data.subcategory_id)
        if (!isNaN(subcategoryIdNum)) {
          const { data: subData } = await this.supabase
            .from('subcategorias')
            .select('id, nome, id_categoria')
            .eq('id', subcategoryIdNum)
            .maybeSingle()

          if (subData) {
            subcategory = {
              id: subData.id.toString(),
              name: subData.nome,
              slug: this.generateSlug(subData.nome),
              category_id: subData.id_categoria.toString(),
              description: null,
              image_url: null,
              is_active: true,
              sort_order: 0
            }
          }
        }
      }

      return {
        ...data,
        price: data.base_price || data.price || 0,
        images,
        category,
        subcategory
      }
    } catch (error: any) {
      console.error('Erro ao buscar produto:', error)
      throw error
    }
  }

  /**
   * Cria um novo produto
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      if (!data.name || !data.name.trim()) {
        throw new Error('O nome do produto é obrigatório')
      }

      if (!data.price || isNaN(parseFloat(data.price.toString()))) {
        throw new Error('O preço é obrigatório e deve ser um número válido')
      }

      const slug = this.generateSlug(data.name)

      // Verificar se slug já existe
      let finalSlug = slug
      const { data: existing } = await this.supabase
        .from('produtos')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (existing) {
        let counter = 1
        let slugExists = true
        while (slugExists) {
          finalSlug = `${slug}-${counter}`
          const { data: check } = await this.supabase
            .from('produtos')
            .select('id')
            .eq('slug', finalSlug)
            .maybeSingle()
          if (!check) {
            slugExists = false
          } else {
            counter++
          }
        }
      }

      const productData: any = {
        name: data.name.trim(),
        slug: finalSlug,
        base_price: parseFloat(data.price.toString()),
        stock_quantity: data.stock_quantity || 0,
        min_stock: data.min_stock || 0,
        is_active: data.is_active !== undefined ? data.is_active : true,
        is_featured: data.is_featured || false,
        is_on_sale: data.is_on_sale || false,
        description: data.description?.trim() || null,
        category_id: data.category_id || null,
        subcategory_id: data.subcategory_id || null,
        wholesale_price: null,
        sizes: data.sizes && data.sizes.length > 0 ? data.sizes.filter(s => s && s.trim()).map(s => s.trim()) : [],
        colors: data.colors && data.colors.length > 0 ? data.colors : [],
        materials: data.materials && data.materials.length > 0 ? data.materials : [],
        weight: data.weight || null,
        sku: data.sku || null,
        max_stock: data.max_stock || null
      }

      const { data: newProduct, error } = await this.supabase
        .from('produtos')
        .insert(productData)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        ...newProduct,
        price: newProduct.base_price || newProduct.price || 0,
        images: [],
        category: undefined,
        subcategory: undefined
      }
    } catch (error: any) {
      console.error('Erro ao criar produto:', error)
      throw error
    }
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (data.name !== undefined) {
        updateData.name = data.name.trim()
        updateData.slug = this.generateSlug(data.name.trim())
      }
      if (data.description !== undefined) {
        updateData.description = data.description.trim() || null
      }
      if (data.category_id !== undefined) {
        updateData.category_id = data.category_id || null
      }
      if (data.subcategory_id !== undefined) {
        updateData.subcategory_id = data.subcategory_id || null
      }
      if (data.price !== undefined) {
        updateData.base_price = parseFloat(data.price.toString())
      }
      if (data.stock_quantity !== undefined) {
        updateData.stock_quantity = data.stock_quantity
      }
      if (data.min_stock !== undefined) {
        updateData.min_stock = data.min_stock
      }
      if (data.max_stock !== undefined) {
        updateData.max_stock = data.max_stock || null
      }
      if (data.sizes !== undefined) {
        updateData.sizes = data.sizes.filter(s => s && s.trim()).map(s => s.trim())
      }
      if (data.colors !== undefined) {
        updateData.colors = data.colors
      }
      if (data.materials !== undefined) {
        updateData.materials = data.materials
      }
      if (data.is_active !== undefined) {
        updateData.is_active = data.is_active
      }
      if (data.is_featured !== undefined) {
        updateData.is_featured = data.is_featured
      }
      if (data.is_on_sale !== undefined) {
        updateData.is_on_sale = data.is_on_sale
      }
      if (data.weight !== undefined) {
        updateData.weight = data.weight || null
      }
      if (data.sku !== undefined) {
        updateData.sku = data.sku || null
      }

      const { data: updatedProduct, error } = await this.supabase
        .from('produtos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Buscar produto atualizado com relacionamentos
      const product = await this.getProductById(id)
      return product!
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }
  }

  /**
   * Exclui um produto
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('produtos')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      // Verificar se foi realmente excluído
      const { data: checkData } = await this.supabase
        .from('produtos')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (checkData) {
        throw new Error('O produto não foi excluído. Verifique as permissões ou se há dependências.')
      }
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error)
      throw error
    }
  }
}

export const productsService = new ProductsService()

