// ========================================================================
// STORAGE UTILITIES - FUNÇÕES PARA UPLOAD E GERENCIAMENTO DE IMAGENS
// ========================================================================

export const STORAGE_BUCKETS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  USERS: 'users'
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

// Função básica de upload (placeholder)
export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<ImageUploadResult> {
  // Implementação básica para evitar erros de build
  return {
    url: URL.createObjectURL(file),
    path: `${bucket}/${path}`,
    size: file.size,
    width: 0,
    height: 0
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

// URL pública (placeholder)
export function getPublicUrl(bucket: string, path: string): string {
  return `/${bucket}/${path}`
}