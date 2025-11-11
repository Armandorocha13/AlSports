// ========================================================================
// STORAGE UTILITIES - FUNÇÕES PARA UPLOAD E GERENCIAMENTO DE IMAGENS
// ========================================================================

export const STORAGE_BUCKETS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  USERS: 'users',
  LOGOS: 'logos'
} as const

export interface ImageUploadResult {
  url: string
  path: string
  size: number
  width: number
  height: number
}

export interface ImageResizeOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

// Função de upload para Supabase Storage
export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<ImageUploadResult> {
  const { createClient } = await import('./supabase-client')
  const supabase = createClient()

  // Fazer upload no Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Erro ao fazer upload:', error)
    throw new Error(`Erro ao fazer upload: ${error.message}`)
  }

  // Obter URL pública
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  // Obter dimensões da imagem (assíncrono, não bloqueia)
  let width = 0
  let height = 0
  try {
    const img = new Image()
    img.src = urlData.publicUrl
    await new Promise((resolve, reject) => {
      img.onload = () => {
        width = img.width
        height = img.height
        resolve(null)
      }
      img.onerror = reject
      setTimeout(() => resolve(null), 1000) // Timeout de 1s
    })
  } catch {
    // Ignorar erro de dimensões
  }

  return {
    url: urlData.publicUrl,
    path: data.path,
    size: file.size,
    width,
    height
  }
}

// Função básica de redimensionamento (placeholder)
export async function resizeImage(
  file: File,
  options: ImageResizeOptions = {}
): Promise<File> {
  // Implementação básica para evitar erros de build
  return file
}

// Validação básica de arquivo
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande. Máximo 5MB.' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não suportado.' }
  }
  
  return { valid: true }
}

// Geração de nome de arquivo
export function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}

// URL pública do Supabase Storage
export function getPublicUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}