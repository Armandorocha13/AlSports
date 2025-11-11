import { createClient } from '@/lib/supabase-client'

export interface Category {
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
}

export interface CreateCategoryDto {
  name: string
  slug?: string
  description?: string
  image_url?: string
  banner_url?: string
  is_active?: boolean
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string
  image_url?: string
  banner_url?: string
  is_active?: boolean
}

class CategoriesService {
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
   * Busca todas as categorias
   */
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await this.supabase
        .from('categorias')
        .select('id, nome, data_criacao')
        .order('id', { ascending: true })

      if (error) {
        console.error('Erro ao buscar categorias:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return []
      }

      // Mapear e buscar contagens
      const categoriesWithCount = await Promise.all(
        data.map(async (cat: any) => {
          const categoryId = typeof cat.id === 'number' ? cat.id.toString() : String(cat.id)
          const categoryIdNum = typeof cat.id === 'number' ? cat.id : parseInt(cat.id)

          // Contar subcategorias
          const { count: subcategoryCount } = await this.supabase
            .from('subcategorias')
            .select('*', { count: 'exact', head: true })
            .eq('id_categoria', categoryIdNum)

          // Contar produtos
          let productCount = 0
          const { count: countByCategory } = await this.supabase
            .from('produtos')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryId)

          if (countByCategory) {
            productCount += countByCategory
          }

          // Contar produtos das subcategorias
          if (subcategoryCount && subcategoryCount > 0) {
            const { data: subcategories } = await this.supabase
              .from('subcategorias')
              .select('id')
              .eq('id_categoria', categoryIdNum)

            if (subcategories && subcategories.length > 0) {
              const subcategoryIds = subcategories.map((sub: any) => sub.id.toString())
              const { count: countBySub } = await this.supabase
                .from('produtos')
                .select('*', { count: 'exact', head: true })
                .in('subcategory_id', subcategoryIds)

              if (countBySub) {
                productCount += countBySub
              }
            }
          }

          return {
            id: categoryId,
            name: cat.nome || '',
            slug: this.generateSlug(cat.nome || ''),
            description: null,
            image_url: null,
            banner_url: null,
            is_active: true,
            sort_order: 0,
            productCount,
            subcategoryCount: subcategoryCount || 0
          }
        })
      )

      return categoriesWithCount
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }
  }

  /**
   * Busca uma categoria por ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categoryIdNum = parseInt(id)
      if (isNaN(categoryIdNum)) {
        return null
      }

      const { data, error } = await this.supabase
        .from('categorias')
        .select('id, nome, data_criacao')
        .eq('id', categoryIdNum)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Não encontrado
        }
        throw error
      }

      if (!data) {
        return null
      }

      // Buscar contagens
      const { count: subcategoryCount } = await this.supabase
        .from('subcategorias')
        .select('*', { count: 'exact', head: true })
        .eq('id_categoria', categoryIdNum)

      const { count: productCount } = await this.supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id)

      return {
        id: data.id.toString(),
        name: data.nome || '',
        slug: this.generateSlug(data.nome || ''),
        description: null,
        image_url: null,
        banner_url: null,
        is_active: true,
        sort_order: 0,
        productCount: productCount || 0,
        subcategoryCount: subcategoryCount || 0
      }
    } catch (error: any) {
      console.error('Erro ao buscar categoria:', error)
      throw error
    }
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      if (!data.name || !data.name.trim()) {
        throw new Error('O nome da categoria é obrigatório')
      }

      const categoryData: any = {
        nome: data.name.trim()
      }

      const { data: newCategory, error } = await this.supabase
        .from('categorias')
        .insert(categoryData)
        .select('id, nome, data_criacao')
        .single()

      if (error) {
        throw error
      }

      return {
        id: newCategory.id.toString(),
        name: newCategory.nome,
        slug: this.generateSlug(newCategory.nome),
        description: null,
        image_url: null,
        banner_url: null,
        is_active: true,
        sort_order: 0,
        productCount: 0,
        subcategoryCount: 0
      }
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error)
      throw error
    }
  }

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    try {
      const categoryIdNum = parseInt(id)
      if (isNaN(categoryIdNum)) {
        throw new Error('ID de categoria inválido')
      }

      const updateData: any = {}
      if (data.name !== undefined) {
        updateData.nome = data.name.trim()
      }

      const { data: updatedCategory, error } = await this.supabase
        .from('categorias')
        .update(updateData)
        .eq('id', categoryIdNum)
        .select('id, nome, data_criacao')
        .single()

      if (error) {
        throw error
      }

      // Buscar contagens atualizadas
      const category = await this.getCategoryById(id)
      return category!
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error)
      throw error
    }
  }

  /**
   * Exclui uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      const categoryIdNum = parseInt(id)
      if (isNaN(categoryIdNum)) {
        throw new Error('ID de categoria inválido')
      }

      const { error } = await this.supabase
        .from('categorias')
        .delete()
        .eq('id', categoryIdNum)

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error)
      throw error
    }
  }
}

export const categoriesService = new CategoriesService()

