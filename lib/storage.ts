import { supabase } from './supabase'

// Configurações do Storage
export const STORAGE_BUCKETS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  AVATARS: 'avatars',
  TEMP: 'temp'
} as const

// Função para fazer upload de imagem
export async function uploadImage(
  file: File,
  bucket: string,
  path: string,
  options?: {
    upsert?: boolean
    cacheControl?: string
  }
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false
      })

    if (error) {
      throw error
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: error
    }
  }
}

// Função para deletar imagem
export async function deleteImage(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    return {
      success: false,
      error: error
    }
  }
}

// Função para obter URL pública
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// Função para redimensionar imagem no cliente
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height)

      // Converter para blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Função para validar tipo de arquivo
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Máximo 5MB.'
    }
  }

  return { valid: true }
}

// Função para gerar nome único para arquivo
export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const name = originalName.split('.').slice(0, -1).join('.')
  
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${prefix ? `${prefix}-` : ''}${cleanName}-${timestamp}-${random}.${extension}`
}
