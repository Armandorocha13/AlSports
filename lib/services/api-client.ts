/**
 * Cliente HTTP genérico para comunicação com a API do Strapi
 * Inclui tratamento de erros, retry logic e interceptors
 */

import { strapiConfig } from '@/lib/config/strapi'
import { ApiError } from '@/lib/types/api'

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = strapiConfig.apiUrl
  }

  /**
   * Faz uma requisição HTTP com tratamento de erros e retry
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = strapiConfig.timeout,
      retries = 3,
      ...fetchOptions
    } = options

    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      ...strapiConfig.getHeaders(),
      ...fetchOptions.headers,
    }

    let lastError: Error | null = null

    // Tentar a requisição com retry
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ApiError(
            errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData
          )
        }

        const data = await response.json()
        return data as T
      } catch (error: any) {
        lastError = error

        // Se for erro de aborto (timeout) ou erro de rede, tentar novamente
        if (
          (error.name === 'AbortError' || error.name === 'TypeError') &&
          attempt < retries
        ) {
          // Esperar antes de tentar novamente (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          )
          continue
        }

        // Se for erro de API (4xx, 5xx), não tentar novamente
        if (error instanceof ApiError) {
          throw error
        }

        // Se não for o último attempt, continuar tentando
        if (attempt < retries) {
          continue
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    throw lastError || new Error('Request failed after all retries')
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * Constrói query string para filtros do Strapi
   */
  buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, String(v)))
        } else {
          queryParams.append(key, String(value))
        }
      }
    })

    return queryParams.toString()
  }
}

export const apiClient = new ApiClient()

