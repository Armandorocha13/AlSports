import { STORAGE_BUCKETS, generateFileName, uploadImage } from '@/lib/storage'
import { createClient } from '@/lib/supabase-client'

export interface ProductImage {
  id: string
  image_url: string
  is_primary: boolean
  sort_order: number
}

class ImagesService {
  private supabase = createClient()

  /**
   * Faz upload de uma imagem para o Supabase Storage e salva referência no banco
   */
  async uploadProductImage(
    file: File,
    productId: string,
    isPrimary: boolean = false
  ): Promise<ProductImage | null> {
    try {
      // Gerar nome único para o arquivo
      const fileName = generateFileName(file.name)
      const path = `products/${productId}/${fileName}`

      // Fazer upload para Supabase Storage
      const uploadResult = await uploadImage(file, STORAGE_BUCKETS.PRODUCTS, path)

      // Salvar referência na tabela images
      const { data: imageData, error: imageError } = await this.supabase
        .from('images')
        .insert({
          image_url: uploadResult.url
        })
        .select('id, image_url')
        .single()

      if (imageError) {
        // Se falhar ao salvar no banco, tentar remover do storage
        try {
          await this.supabase.storage
            .from(STORAGE_BUCKETS.PRODUCTS)
            .remove([path])
        } catch (removeError) {
          console.error('Erro ao remover imagem do storage após falha:', removeError)
        }
        throw imageError
      }

      // Criar relação produto-imagem
      await this.createProductImageRelation(productId, imageData.id, isPrimary)

      // Buscar contagem de imagens para determinar sort_order
      const { count } = await this.supabase
        .from('product_image_relations')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId)

      return {
        id: imageData.id,
        image_url: imageData.image_url,
        is_primary: isPrimary,
        sort_order: (count || 0) - 1
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload de imagem:', error)
      throw error
    }
  }

  /**
   * Busca todas as imagens de um produto
   */
  async getProductImages(productId: string): Promise<ProductImage[]> {
    try {
      const { data: relations, error: relationsError } = await this.supabase
        .from('product_image_relations')
        .select('image_id, is_primary')
        .eq('product_id', productId)
        .order('is_primary', { ascending: false })
        .order('id', { ascending: true })

      if (relationsError) {
        throw relationsError
      }

      if (!relations || relations.length === 0) {
        return []
      }

      const imageIds = relations.map((r: any) => r.image_id)
      const { data: images, error: imagesError } = await this.supabase
        .from('images')
        .select('id, image_url')
        .in('id', imageIds)

      if (imagesError) {
        throw imagesError
      }

      if (!images) {
        return []
      }

      return relations.map((rel: any, index: number) => {
        const image = images.find((img: any) => img.id === rel.image_id)
        return {
          id: image?.id || '',
          image_url: image?.image_url || '',
          is_primary: rel.is_primary || false,
          sort_order: index
        }
      }).filter(img => img.image_url)
    } catch (error: any) {
      console.error('Erro ao buscar imagens do produto:', error)
      return []
    }
  }

  /**
   * Remove uma imagem do produto e do storage
   */
  async deleteImage(imageId: string, imagePath: string): Promise<boolean> {
    try {
      // Remover relação produto-imagem
      const { error: relationError } = await this.supabase
        .from('product_image_relations')
        .delete()
        .eq('image_id', imageId)

      if (relationError) {
        console.error('Erro ao remover relação:', relationError)
        // Continuar mesmo se falhar
      }

      // Remover do banco de imagens
      const { error: imageError } = await this.supabase
        .from('images')
        .delete()
        .eq('id', imageId)

      if (imageError) {
        console.error('Erro ao remover imagem do banco:', imageError)
        // Continuar mesmo se falhar
      }

      // Remover do storage
      try {
        // Extrair path do storage a partir da URL ou do path fornecido
        const path = imagePath || this.extractPathFromUrl(imageId)
        if (path) {
          await this.supabase.storage
            .from(STORAGE_BUCKETS.PRODUCTS)
            .remove([path])
        }
      } catch (storageError) {
        console.error('Erro ao remover imagem do storage:', storageError)
        // Não bloquear se falhar no storage
      }

      return true
    } catch (error: any) {
      console.error('Erro ao excluir imagem:', error)
      return false
    }
  }

  /**
   * Extrai o path do storage a partir de uma URL
   */
  private extractPathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      const storageIndex = pathParts.findIndex(p => p === 'storage')
      if (storageIndex !== -1 && pathParts[storageIndex + 3]) {
        // Formato: /storage/v1/object/public/bucket/path
        return pathParts.slice(storageIndex + 4).join('/')
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Define uma imagem como principal
   */
  async setPrimaryImage(productId: string, imageId: string): Promise<boolean> {
    try {
      // Remover primary de todas as imagens do produto
      await this.supabase
        .from('product_image_relations')
        .update({ is_primary: false })
        .eq('product_id', productId)

      // Definir a imagem selecionada como primary
      const { error } = await this.supabase
        .from('product_image_relations')
        .update({ is_primary: true })
        .eq('product_id', productId)
        .eq('image_id', imageId)

      if (error) {
        throw error
      }

      return true
    } catch (error: any) {
      console.error('Erro ao definir imagem principal:', error)
      return false
    }
  }

  /**
   * Cria uma relação produto-imagem
   */
  private async createProductImageRelation(
    productId: string,
    imageId: string,
    isPrimary: boolean = false
  ): Promise<void> {
    try {
      // Se esta é a primeira imagem, definir como primary automaticamente
      if (isPrimary) {
        // Remover primary de outras imagens
        await this.supabase
          .from('product_image_relations')
          .update({ is_primary: false })
          .eq('product_id', productId)
      }

      const { error } = await this.supabase
        .from('product_image_relations')
        .insert({
          product_id: productId,
          image_id: imageId,
          is_primary: isPrimary
        })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('Erro ao criar relação produto-imagem:', error)
      throw error
    }
  }
}

export const imagesService = new ImagesService()

