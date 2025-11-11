import { createClient } from '@/lib/supabase-client'
import { Category } from './categoriesService'

export interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  category?: Category
  productCount?: number
}

export interface CreateSubcategoryDto {
  name: string
  category_id: string
  slug?: string
  description?: string
  image_url?: string
  is_active?: boolean
}

export interface UpdateSubcategoryDto {
  name?: string
  category_id?: string
  slug?: string
  description?: string
  image_url?: string
  is_active?: boolean
}

class SubcategoriesService {
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
   * Busca todas as subcategorias
   */
  async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    try {
      let query = this.supabase
        .from('subcategorias')
        .select('id, nome, id_categoria, data_criacao')

      if (categoryId) {
        const categoryIdNum = parseInt(categoryId)
        if (!isNaN(categoryIdNum)) {
          query = query.eq('id_categoria', categoryIdNum)
        }
      }

      const { data, error } = await query.order('id', { ascending: true })

      if (error) {
        console.error('Erro ao buscar subcategorias:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return []
      }

      // Buscar informações das categorias
      const categoryIds = [...new Set(data.map((sub: any) => {
        const catId = sub.id_categoria
        return typeof catId === 'number' ? catId.toString() : String(catId)
      }).filter(Boolean))]

      let categoriesMap = new Map()
      if (categoryIds.length > 0) {
        const categoryIdsNumeric = categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id))

        if (categoryIdsNumeric.length > 0) {
          const { data: categoriesData } = await this.supabase
            .from('categorias')
            .select('id, nome')
            .in('id', categoryIdsNumeric)

          if (categoriesData) {
            categoriesData.forEach((cat: any) => {
              const catId = typeof cat.id === 'number' ? cat.id.toString() : String(cat.id)
              categoriesMap.set(catId, {
                id: catId,
                name: cat.nome
              })
            })
          }
        }
      }

      // Mapear subcategorias
      const subcategoriesWithCount = await Promise.all(
        data.map(async (sub: any) => {
          const subId = typeof sub.id === 'number' ? sub.id.toString() : String(sub.id)
          const catId = sub.id_categoria
          const catIdStr = typeof catId === 'number' ? catId.toString() : String(catId)
          const category = categoriesMap.get(catIdStr)

          // Contar produtos
          const { count: productCount } = await this.supabase
            .from('produtos')
            .select('*', { count: 'exact', head: true })
            .eq('subcategory_id', subId)

          return {
            id: subId,
            category_id: catIdStr,
            name: sub.nome || '',
            slug: this.generateSlug(sub.nome || ''),
            description: null,
            image_url: null,
            is_active: true,
            sort_order: 0,
            category: category ? {
              id: category.id,
              name: category.name,
              slug: this.generateSlug(category.name),
              description: null,
              image_url: null,
              banner_url: null,
              is_active: true,
              sort_order: 0
            } : undefined,
            productCount: productCount || 0
          }
        })
      )

      return subcategoriesWithCount
    } catch (error: any) {
      console.error('Erro ao buscar subcategorias:', error)
      throw error
    }
  }

  /**
   * Busca uma subcategoria por ID
   */
  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    try {
      const subcategoryIdNum = parseInt(id)
      if (isNaN(subcategoryIdNum)) {
        return null
      }

      const { data, error } = await this.supabase
        .from('subcategorias')
        .select('id, nome, id_categoria, data_criacao')
        .eq('id', subcategoryIdNum)
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

      // Buscar categoria
      const catIdNum = typeof data.id_categoria === 'number' ? data.id_categoria : parseInt(data.id_categoria)
      const { data: categoryData } = await this.supabase
        .from('categorias')
        .select('id, nome')
        .eq('id', catIdNum)
        .single()

      // Contar produtos
      const { count: productCount } = await this.supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true })
        .eq('subcategory_id', id)

      return {
        id: data.id.toString(),
        category_id: data.id_categoria.toString(),
        name: data.nome || '',
        slug: this.generateSlug(data.nome || ''),
        description: null,
        image_url: null,
        is_active: true,
        sort_order: 0,
        category: categoryData ? {
          id: categoryData.id.toString(),
          name: categoryData.nome,
          slug: this.generateSlug(categoryData.nome),
          description: null,
          image_url: null,
          banner_url: null,
          is_active: true,
          sort_order: 0
        } : undefined,
        productCount: productCount || 0
      }
    } catch (error: any) {
      console.error('Erro ao buscar subcategoria:', error)
      throw error
    }
  }

  /**
   * Cria uma nova subcategoria
   */
  async createSubcategory(data: CreateSubcategoryDto): Promise<Subcategory> {
    try {
      if (!data.name || !data.name.trim()) {
        throw new Error('O nome da subcategoria é obrigatório')
      }

      if (!data.category_id) {
        throw new Error('A categoria é obrigatória')
      }

      const categoryIdNum = parseInt(data.category_id)
      if (isNaN(categoryIdNum)) {
        throw new Error('ID de categoria inválido')
      }

      const subcategoryData: any = {
        nome: data.name.trim(),
        id_categoria: categoryIdNum,
        data_criacao: new Date().toISOString()
      }

      const { data: newSubcategory, error } = await this.supabase
        .from('subcategorias')
        .insert(subcategoryData)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      // Buscar categoria para incluir no retorno
      const { data: categoryData } = await this.supabase
        .from('categorias')
        .select('id, nome')
        .eq('id', categoryIdNum)
        .single()

      return {
        id: newSubcategory.id.toString(),
        category_id: data.category_id,
        name: newSubcategory.nome || data.name,
        slug: this.generateSlug(newSubcategory.nome || data.name),
        description: null,
        image_url: null,
        is_active: true,
        sort_order: 0,
        category: categoryData ? {
          id: categoryData.id.toString(),
          name: categoryData.nome,
          slug: this.generateSlug(categoryData.nome),
          description: null,
          image_url: null,
          banner_url: null,
          is_active: true,
          sort_order: 0
        } : undefined,
        productCount: 0
      }
    } catch (error: any) {
      console.error('Erro ao criar subcategoria:', error)
      throw error
    }
  }

  /**
   * Atualiza uma subcategoria existente
   */
  async updateSubcategory(id: string, data: UpdateSubcategoryDto): Promise<Subcategory> {
    try {
      const subcategoryIdNum = parseInt(id)
      if (isNaN(subcategoryIdNum)) {
        throw new Error('ID de subcategoria inválido')
      }

      const updateData: any = {}
      if (data.name !== undefined) {
        updateData.nome = data.name.trim()
      }
      if (data.category_id !== undefined) {
        const categoryIdNum = parseInt(data.category_id)
        if (isNaN(categoryIdNum)) {
          throw new Error('ID de categoria inválido')
        }
        updateData.id_categoria = categoryIdNum
      }

      const { data: updatedSubcategory, error } = await this.supabase
        .from('subcategorias')
        .update(updateData)
        .eq('id', subcategoryIdNum)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      // Buscar dados atualizados
      const subcategory = await this.getSubcategoryById(id)
      return subcategory!
    } catch (error: any) {
      console.error('Erro ao atualizar subcategoria:', error)
      throw error
    }
  }

  /**
   * Exclui uma subcategoria
   */
  async deleteSubcategory(id: string): Promise<void> {
    try {
      const subcategoryIdNum = parseInt(id)
      if (isNaN(subcategoryIdNum)) {
        throw new Error('ID de subcategoria inválido')
      }

      const { error } = await this.supabase
        .from('subcategorias')
        .delete()
        .eq('id', subcategoryIdNum)

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('Erro ao excluir subcategoria:', error)
      throw error
    }
  }
}

export const subcategoriesService = new SubcategoriesService()

