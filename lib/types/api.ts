/**
 * Tipos para respostas de API e erros
 */

export interface ApiErrorData {
  message: string
  status?: number
  details?: any
}

// Classe de erro customizada
export class ApiError extends Error implements ApiErrorData {
  status?: number
  details?: any

  constructor(message: string, status?: number, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
}

// Tipos para queries e filtros
export interface ProductFilters {
  category?: string
  subcategory?: string
  featured?: boolean
  onSale?: boolean
  search?: string
  active?: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

