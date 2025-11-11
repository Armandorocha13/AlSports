/**
 * API Client para comunicação com Strapi CMS
 * Funções helper para buscar dados do Strapi
 */

import {
  StrapiMedia,
  StrapiResponse,
  StrapiProduto,
  StrapiBanner,
  StrapiConteudosDoSite,
  StrapiCategoria,
  StrapiDataItem,
} from './types'

// ========================================================================
// CONFIGURAÇÃO
// ========================================================================

/**
 * URL base da API do Strapi
 */
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337'

// ========================================================================
// TIPOS E INTERFACES
// ========================================================================

/**
 * Opções para fetchAPI
 */
export interface FetchAPIOptions {
  revalidate?: number | false
  cache?: RequestCache
  headers?: Record<string, string>
}

// ========================================================================
// FUNÇÕES AUXILIARES
// ========================================================================

/**
 * Obtém a URL completa de uma mídia do Strapi
 * @param media - Objeto de mídia do Strapi ou null
 * @returns URL completa da imagem ou string vazia se não houver mídia
 */
export function getStrapiMediaUrl(media: StrapiMedia | null | undefined | any): string {
  if (!media) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('getStrapiMediaUrl - Media é null ou undefined')
    }
    return ''
  }

  // Debug: log da estrutura do media
  if (process.env.NODE_ENV === 'development') {
    console.log('getStrapiMediaUrl - Media recebido:', {
      hasAttributes: !!media.attributes,
      hasUrl: !!media.url,
      attributesUrl: media.attributes?.url,
      directUrl: media.url,
      keys: Object.keys(media)
    })
  }

  // Strapi 5 pode retornar a URL diretamente no objeto ou dentro de attributes
  let url: string | undefined

  if (media.attributes?.url) {
    // Formato com attributes (Strapi 4)
    url = media.attributes.url
  } else if (media.url) {
    // Formato direto (Strapi 5)
    url = media.url
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('getStrapiMediaUrl - Nenhuma URL encontrada no media:', media)
    }
    return ''
  }

  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('getStrapiMediaUrl - URL é vazia')
    }
    return ''
  }

  // Se a URL já é completa (começa com http), retornar como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('getStrapiMediaUrl - URL completa retornada:', url)
    }
    return url
  }

  // Se a URL começa com /, remover a barra inicial
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url

  // Construir URL completa
  const baseUrl = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL
  const finalUrl = `${baseUrl}/${cleanUrl}`
  
  if (process.env.NODE_ENV === 'development') {
    console.log('getStrapiMediaUrl - URL construída:', finalUrl)
  }
  
  return finalUrl
}

/**
 * Normaliza um item do Strapi para o formato padrão com attributes
 * Compatível com Strapi 4 e 5
 */
function normalizeStrapiItem<T>(item: any): StrapiDataItem<T> | null {
  if (!item) {
    return null
  }

  // Se já tem attributes, retornar como está
  if (item.attributes) {
    return item as StrapiDataItem<T>
  }

  // Se não tem attributes, mas tem campos diretamente (Strapi 5 formato)
  // Criar estrutura com attributes
  const { id, documentId, createdAt, updatedAt, publishedAt, ...campos } = item
  return {
    id,
    documentId,
    attributes: campos as T,
    createdAt,
    updatedAt,
    publishedAt,
  }
}

/**
 * Normaliza um array de itens do Strapi
 */
function normalizeStrapiArray<T>(items: any[]): StrapiDataItem<T>[] {
  return items
    .map((item) => normalizeStrapiItem<T>(item))
    .filter((item): item is StrapiDataItem<T> => {
      if (item === null) {
        return false
      }
      const isValid = Boolean(item.attributes && (item.id || item.documentId))
      if (!isValid && process.env.NODE_ENV === 'development') {
        console.warn('Item inválido filtrado:', item)
      }
      return isValid
    })
}

/**
 * Extrai dados de uma resposta do Strapi (pode ser array ou objeto único)
 */
function extractStrapiData<T>(response: any): T | T[] | null {
  if (!response) {
    return null
  }

  // Se já é um array, retornar diretamente
  if (Array.isArray(response)) {
    return response
  }

  // Se tem estrutura StrapiResponse, extrair o data
  if (typeof response === 'object' && 'data' in response) {
    return response.data ?? null
  }

  // Se é um objeto único com id e attributes, retornar diretamente
  if (typeof response === 'object' && 'id' in response && 'attributes' in response) {
    return response
  }

  return null
}

/**
 * Função auxiliar para gerar slug a partir de um nome
 */
function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ========================================================================
// FETCH API
// ========================================================================

/**
 * Função genérica para fazer requisições à API do Strapi
 * @param endpoint - Endpoint da API (ex: /api/produtos)
 * @param options - Opções de fetch (revalidate, cache, headers)
 * @returns Dados da resposta do Strapi
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: FetchAPIOptions = {}
): Promise<T> {
  const { revalidate, cache = 'no-store', headers = {} } = options

  // Construir URL completa
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${STRAPI_URL}${cleanEndpoint}`

  // Configurar headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Adicionar token de autenticação se disponível
  const apiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
  if (apiToken) {
    requestHeaders['Authorization'] = `Bearer ${apiToken}`
  }

  // Configurar opções de fetch
  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
    cache,
    ...(revalidate !== undefined && { next: { revalidate } }),
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro ao buscar dados do Strapi: ${response.status} ${response.statusText}. ${errorText}`
      )
    }

    const json = await response.json()

    // Retornar apenas o campo 'data' se existir, senão retornar o JSON completo
    return (json.data !== undefined ? json.data : json) as T
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error)
    throw error
  }
}

/**
 * Função para fazer POST/PUT/DELETE na API do Strapi
 * @param endpoint - Endpoint da API (ex: /api/pedidos)
 * @param method - Método HTTP (POST, PUT, DELETE)
 * @param data - Dados para enviar
 * @returns Dados da resposta do Strapi
 */
export async function postToStrapi<T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  data?: any
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${STRAPI_URL}${cleanEndpoint}`

  // Configurar headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Adicionar token de autenticação se disponível
  const apiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
  if (apiToken) {
    requestHeaders['Authorization'] = `Bearer ${apiToken}`
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...(data && { body: JSON.stringify({ data }) }),
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro ao enviar dados para Strapi: ${response.status} ${response.statusText}. ${errorText}`
      )
    }

    const json = await response.json()
    return (json.data !== undefined ? json.data : json) as T
  } catch (error) {
    console.error(`Erro ao enviar ${method} para ${endpoint}:`, error)
    throw error
  }
}

// ========================================================================
// FUNÇÕES DE BUSCA - PRODUTOS
// ========================================================================

/**
 * Busca todos os produtos do Strapi
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Array de produtos do Strapi
 */
export async function getProdutos(
  options: FetchAPIOptions = {}
): Promise<StrapiProduto[]> {
  try {
    // Populate específico para garantir que Imagem1 e Destaque sejam populados
    // IMPORTANTE: Adicionar publicationState=live para buscar apenas produtos publicados
    // NOTA: Tentar sem publicationState primeiro, pois pode não funcionar em todas as versões do Strapi
    let response
    try {
      response = await fetchAPI<StrapiResponse<StrapiProduto[]> | StrapiProduto[]>(
        '/api/produtos?populate[Imagem1]=*&populate[Imagem2]=*&populate[Variacao]=*&populate[categoria]=*&populate[subcategoria]=*',
        options
      )
    } catch (error) {
      console.warn('Erro ao buscar com populate específico, tentando populate=*:', error)
      // Fallback: tentar com populate=* simples
      response = await fetchAPI<StrapiResponse<StrapiProduto[]> | StrapiProduto[]>(
        '/api/produtos?populate=*',
        options
      )
    }

    const data = extractStrapiData(response)
    if (!data) {
      console.warn('getProdutos - Nenhum dado retornado do Strapi')
      return []
    }

    const produtosArray = Array.isArray(data) ? data : [data]
    const produtosNormalizados = normalizeStrapiArray<StrapiProduto['attributes']>(produtosArray) as StrapiProduto[]
    
    // Debug: verificar se o campo Destaque está presente nos produtos
    console.log('📦 getProdutos - Produtos retornados do Strapi:', produtosNormalizados.length)
    produtosNormalizados.forEach((produto, index) => {
      const attrs = produto.attributes as any
      console.log(`📦 Produto ${index + 1}:`, {
        id: produto.documentId || produto.id,
        nome: attrs?.Nome,
        temDestaque: 'Destaque' in (attrs || {}),
        valorDestaque: attrs?.Destaque,
        publicado: produto.publishedAt !== null
      })
    })
    
    return produtosNormalizados
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

/**
 * Busca um produto específico por ID do Strapi
 * @param id - ID do produto (documentId)
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Produto do Strapi ou null se não encontrado
 */
export async function getProdutoById(
  id: string,
  options: FetchAPIOptions = {}
): Promise<StrapiProduto | null> {
  try {
    // Populate específico para garantir que Imagem1 seja populado
    const response = await fetchAPI<StrapiResponse<StrapiProduto> | StrapiProduto>(
      `/api/produtos/${id}?populate[Imagem1]=*&populate[Imagem2]=*&populate[Variacao]=*&populate[categoria]=*&populate[subcategoria]=*`,
      options
    )

    const data = extractStrapiData(response)
    if (!data) {
      return null
    }

    const produto = Array.isArray(data) ? data[0] : data
    return normalizeStrapiItem<StrapiProduto['attributes']>(produto) as StrapiProduto | null
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error)
    return null
  }
}

// ========================================================================
// FUNÇÕES DE BUSCA - BANNERS
// ========================================================================

/**
 * Busca todos os banners do Strapi
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Array de banners do Strapi
 */
export async function getBanners(
  options: FetchAPIOptions = {}
): Promise<StrapiBanner[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiBanner[]> | StrapiBanner[]>(
      '/api/banners?populate=*',
      options
    )

    // Debug: log da resposta
    if (process.env.NODE_ENV === 'development') {
      console.log('getBanners - Resposta do Strapi:', JSON.stringify(response, null, 2).substring(0, 1000))
    }

    const data = extractStrapiData(response)
    if (!data) {
      console.warn('getBanners - Nenhum dado extraído da resposta')
      return []
    }

    const bannersArray = Array.isArray(data) ? data : [data]
    const normalizedBanners = normalizeStrapiArray<StrapiBanner['attributes']>(bannersArray) as StrapiBanner[]
    
    // Debug: log dos banners normalizados
    if (process.env.NODE_ENV === 'development') {
      console.log('getBanners - Banners normalizados:', normalizedBanners.length, normalizedBanners.map(b => ({
        id: b.id,
        documentId: b.documentId,
        local: b.attributes?.Local,
        publishedAt: b.publishedAt,
        hasImagemDesktop: !!b.attributes?.ImagemDesktop,
        hasImagemMobile: !!b.attributes?.ImagemMobile
      })))
    }
    
    return normalizedBanners
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    return []
  }
}

// ========================================================================
// FUNÇÕES DE BUSCA - CATEGORIAS
// ========================================================================

/**
 * Busca todas as categorias do Strapi
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Array de categorias do Strapi
 */
export async function getCategorias(
  options: FetchAPIOptions = {}
): Promise<StrapiCategoria[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiCategoria[]> | StrapiCategoria[]>(
      '/api/categorias?populate=*',
      options
    )

    // Debug: log da resposta para entender a estrutura
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'getCategorias - Resposta do Strapi:',
        JSON.stringify(response, null, 2).substring(0, 500)
      )
    }

    const data = extractStrapiData(response)
    if (!data) {
      return []
    }

    const categoriasArray = Array.isArray(data) ? data : [data]
    return normalizeStrapiArray<StrapiCategoria['attributes']>(
      categoriasArray
    ) as StrapiCategoria[]
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

/**
 * Busca uma categoria específica por slug do Strapi
 * @param slug - Slug da categoria
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Categoria do Strapi ou null se não encontrado
 */
export async function getCategoriaBySlug(
  slug: string,
  options: FetchAPIOptions = {}
): Promise<StrapiCategoria | null> {
  try {
    // Buscar todas as categorias e filtrar por slug
    const categorias = await getCategorias(options)
    const categoria = categorias.find((cat) => {
      const catSlug = cat.attributes?.slug || generateSlugFromName(cat.attributes?.Nome || '')
      return catSlug === slug
    })

    return categoria || null
  } catch (error) {
    console.error(`Erro ao buscar categoria por slug ${slug}:`, error)
    return null
  }
}

// ========================================================================
// FUNÇÕES DE BUSCA - SUBCATEGORIAS
// ========================================================================

/**
 * Busca todas as subcategorias do Strapi
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Array de subcategorias do Strapi
 */
export async function getSubcategorias(
  options: FetchAPIOptions = {}
): Promise<any[]> {
  try {
    const response = await fetchAPI<StrapiResponse<any[]> | any[]>(
      '/api/subcategorias?populate=*',
      options
    )

    const data = extractStrapiData(response)
    if (!data) {
      return []
    }

    const subcategoriasArray = Array.isArray(data) ? data : [data]
    return normalizeStrapiArray(subcategoriasArray)
  } catch (error) {
    console.error('Erro ao buscar subcategorias:', error)
    return []
  }
}

// ========================================================================
// FUNÇÕES DE BUSCA - CONTEÚDOS DO SITE
// ========================================================================

/**
 * Busca os conteúdos do site (informações de contato) do Strapi
 * @param options - Opções de fetch (revalidate, cache)
 * @returns Conteúdos do site ou null se não encontrado
 */
export async function getConteudosDoSite(
  options: FetchAPIOptions = {}
): Promise<StrapiConteudosDoSite | null> {
  try {
    // Tentar primeiro com o endpoint plural (conteudos-do-sites)
    // Se não funcionar, tentar singular (conteudos-do-site)
    let response
    try {
      response = await fetchAPI<
        | StrapiResponse<StrapiConteudosDoSite | StrapiConteudosDoSite[]>
        | StrapiConteudosDoSite
        | StrapiConteudosDoSite[]
      >('/api/conteudos-do-sites?populate=*', options)
    } catch (error) {
      // Se falhar, tentar endpoint singular
      if (process.env.NODE_ENV === 'development') {
        console.log('getConteudosDoSite - Tentando endpoint singular...')
      }
      response = await fetchAPI<
        | StrapiResponse<StrapiConteudosDoSite | StrapiConteudosDoSite[]>
        | StrapiConteudosDoSite
        | StrapiConteudosDoSite[]
      >('/api/conteudos-do-site?populate=*', options)
    }

    // Debug: log da resposta
    if (process.env.NODE_ENV === 'development') {
      console.log('getConteudosDoSite - Resposta do Strapi:', JSON.stringify(response, null, 2).substring(0, 1000))
    }

    const data = extractStrapiData(response)
    if (!data) {
      console.warn('getConteudosDoSite - Nenhum dado extraído da resposta')
      return null
    }

    // Se data é um array, filtrar apenas publicados e pegar o primeiro
    let conteudo
    if (Array.isArray(data)) {
      // Filtrar apenas conteúdos publicados
      const publicados = data.filter((item: any) => {
        const normalized = normalizeStrapiItem<StrapiConteudosDoSite['attributes']>(item)
        return normalized && normalized.publishedAt !== null
      })
      conteudo = publicados.length > 0 ? publicados[0] : data[0]
    } else {
      conteudo = data
    }

    const normalized = normalizeStrapiItem<StrapiConteudosDoSite['attributes']>(
      conteudo
    ) as StrapiConteudosDoSite | null

    // Verificar se está publicado
    if (normalized && normalized.publishedAt === null) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getConteudosDoSite - Conteúdo encontrado mas não está publicado:', normalized.documentId || normalized.id)
      }
      return null
    }

    // Debug: log do conteúdo normalizado
    if (process.env.NODE_ENV === 'development') {
      console.log('getConteudosDoSite - Conteúdo normalizado:', {
        id: normalized?.id,
        documentId: normalized?.documentId,
        publishedAt: normalized?.publishedAt,
        hasAttributes: !!normalized?.attributes,
        telefone: normalized?.attributes?.TelefoneWhatsapp,
        email: normalized?.attributes?.EmailContato,
        endereco: normalized?.attributes?.EnderecoFisico
      })
    }

    return normalized
  } catch (error) {
    console.error('Erro ao buscar conteúdos do site:', error)
    return null
  }
}

