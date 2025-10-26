/**
 * Utilitários de performance para otimização do projeto AlSports
 */

/**
 * Debounce function para limitar chamadas de função
 * @param func - Função a ser executada
 * @param wait - Tempo de espera em ms
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para limitar execução de função
 * @param func - Função a ser executada
 * @param limit - Limite de tempo em ms
 * @returns Função com throttle aplicado
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Lazy loading para imagens
 * @param src - URL da imagem
 * @param alt - Texto alternativo
 * @param className - Classes CSS
 * @returns Elemento de imagem com lazy loading
 */
export function createLazyImage(
  src: string,
  alt: string,
  className?: string
): HTMLImageElement {
  const img = new Image()
  img.src = src
  img.alt = alt
  if (className) img.className = className
  img.loading = 'lazy'
  return img
}

/**
 * Memoização simples para funções custosas
 * @param fn - Função a ser memoizada
 * @returns Função memoizada
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): T {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Intersection Observer para lazy loading
 * @param callback - Callback a ser executado quando elemento entra na viewport
 * @param options - Opções do Intersection Observer
 * @returns Intersection Observer
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  })
}

/**
 * Preload de recursos críticos
 * @param resources - Array de URLs de recursos
 */
export function preloadResources(resources: string[]): void {
  resources.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    
    if (url.endsWith('.css')) {
      link.as = 'style'
    } else if (url.endsWith('.js')) {
      link.as = 'script'
    } else if (url.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image'
    }
    
    document.head.appendChild(link)
  })
}

/**
 * Otimização de imagens com WebP
 * @param src - URL da imagem original
 * @param fallback - URL da imagem de fallback
 * @returns URL otimizada ou fallback
 */
export function getOptimizedImage(src: string, fallback?: string): string {
  // Verificar suporte a WebP
  if (typeof window !== 'undefined' && window.HTMLCanvasElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      // Suporte a WebP detectado
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      return webpSrc
    }
  }
  
  return fallback || src
}

/**
 * Compressão de dados para localStorage
 * @param data - Dados a serem comprimidos
 * @returns Dados comprimidos em base64
 */
export function compressData(data: any): string {
  try {
    const jsonString = JSON.stringify(data)
    // Simulação de compressão (em produção, usar biblioteca como pako)
    return btoa(jsonString)
  } catch (error) {
    console.error('Erro ao comprimir dados:', error)
    return JSON.stringify(data)
  }
}

/**
 * Descompressão de dados do localStorage
 * @param compressedData - Dados comprimidos
 * @returns Dados originais
 */
export function decompressData(compressedData: string): any {
  try {
    const jsonString = atob(compressedData)
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Erro ao descomprimir dados:', error)
    return null
  }
}

/**
 * Cache simples em memória
 */
export class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number }>()
  private maxSize: number
  private defaultTTL: number

  constructor(maxSize: number = 100, defaultTTL: number = 300000) { // 5 minutos
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  set(key: string, value: any, ttl?: number): void {
    // Limpar cache se exceder tamanho máximo
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  get(key: string): any {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

/**
 * Instância global do cache
 */
export const globalCache = new MemoryCache(200, 600000) // 10 minutos

