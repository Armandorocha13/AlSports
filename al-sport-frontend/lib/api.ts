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
  useToken?: boolean // Se true, usa token de API. Se false (padrão), faz requisição pública
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

  // Debug: log da estrutura do media (sempre logar para diagnóstico)
  console.log('🖼️ getStrapiMediaUrl - Media recebido:', {
    hasAttributes: !!media.attributes,
    hasUrl: !!media.url,
    attributesUrl: media.attributes?.url,
    directUrl: media.url,
    keys: Object.keys(media).slice(0, 10)
  })

  // Strapi 5 pode retornar a URL diretamente no objeto ou dentro de attributes
  let url: string | undefined

  // Tentar diferentes formatos de URL
  if (media.attributes?.url) {
    // Formato com attributes (Strapi 4)
    url = media.attributes.url
    console.log('🖼️ getStrapiMediaUrl - URL encontrada em media.attributes.url:', url)
  } else if (media.url) {
    // Formato direto (Strapi 5)
    url = media.url
    console.log('🖼️ getStrapiMediaUrl - URL encontrada em media.url:', url)
  } else if ((media as any).data?.attributes?.url) {
    // Formato aninhado: { data: { attributes: { url: ... } } }
    url = (media as any).data.attributes.url
    console.log('🖼️ getStrapiMediaUrl - URL encontrada em media.data.attributes.url:', url)
  } else if ((media as any).data?.url) {
    // Formato aninhado: { data: { url: ... } }
    url = (media as any).data.url
    console.log('🖼️ getStrapiMediaUrl - URL encontrada em media.data.url:', url)
  } else {
    console.warn('⚠️ getStrapiMediaUrl - Nenhuma URL encontrada no media:', {
      mediaKeys: Object.keys(media),
      mediaStructure: JSON.stringify(media).substring(0, 300)
    })
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

  // Se já tem attributes, retornar como está (formato Strapi 4)
  if (item.attributes) {
    return item as StrapiDataItem<T>
  }

  // Se não tem attributes, mas tem campos diretamente (Strapi 5 formato)
  // Criar estrutura com attributes
  const { id, documentId, createdAt, updatedAt, publishedAt, ...campos } = item
  
  const normalized = {
    id,
    documentId,
    attributes: campos as T,
    createdAt,
    updatedAt,
    publishedAt,
  }

  return normalized
}

/**
 * Normaliza um array de itens do Strapi
 */
function normalizeStrapiArray<T>(items: any[]): StrapiDataItem<T>[] {
  if (items.length === 0) {
    return []
  }

  const normalized = items
    .map((item) => normalizeStrapiItem<T>(item))
    .filter((item): item is StrapiDataItem<T> => {
      if (item === null) {
        return false
      }
      const isValid = Boolean(item.attributes && (item.id || item.documentId))
      if (!isValid) {
        console.warn('⚠️ normalizeStrapiArray - Item inválido filtrado:', {
          hasId: !!item.id,
          hasDocumentId: !!item.documentId,
          hasAttributes: !!item.attributes
        })
      }
      return isValid
    })

  if (normalized.length !== items.length) {
    console.warn('⚠️ normalizeStrapiArray - Alguns itens foram filtrados:', {
      originalCount: items.length,
      normalizedCount: normalized.length,
      filtered: items.length - normalized.length
    })
  }

  return normalized
}

/**
 * Extrai dados de uma resposta do Strapi (pode ser array ou objeto único)
 */
function extractStrapiData<T>(response: any): T | T[] | null {
  console.log('🔍 extractStrapiData - Processando resposta:', {
    isNull: response === null,
    isUndefined: response === undefined,
    type: typeof response,
    isArray: Array.isArray(response),
    hasData: typeof response === 'object' && response !== null && 'data' in response,
    keys: typeof response === 'object' && response !== null ? Object.keys(response) : []
  })

  if (!response) {
    console.warn('⚠️ extractStrapiData - Resposta é null ou undefined')
    return null
  }

  // Se já é um array, retornar diretamente
  if (Array.isArray(response)) {
    console.log('✅ extractStrapiData - Resposta é array direto, retornando:', response.length, 'itens')
    return response
  }

  // Se tem estrutura StrapiResponse, extrair o data
  if (typeof response === 'object' && 'data' in response) {
    const data = response.data
    console.log('✅ extractStrapiData - Extraindo data da resposta Strapi:', {
      dataIsNull: data === null,
      dataIsUndefined: data === undefined,
      dataIsArray: Array.isArray(data),
      dataLength: Array.isArray(data) ? data.length : (data ? 1 : 0),
      dataType: typeof data
    })
    
    if (data === null || data === undefined) {
      console.warn('⚠️ extractStrapiData - data é null ou undefined na resposta')
      return null
    }
    
    return data
  }

  // Se é um objeto único com id e attributes, retornar diretamente
  if (typeof response === 'object' && 'id' in response && 'attributes' in response) {
    console.log('✅ extractStrapiData - Resposta é objeto único com id e attributes')
    return response
  }

  // Se é um objeto único mas não tem a estrutura esperada, logar e retornar
  if (typeof response === 'object') {
    console.warn('⚠️ extractStrapiData - Estrutura de resposta não reconhecida:', {
      keys: Object.keys(response),
      hasId: 'id' in response,
      hasDocumentId: 'documentId' in response,
      hasAttributes: 'attributes' in response,
      sample: JSON.stringify(response).substring(0, 300)
    })
    // Tentar retornar mesmo assim, pode ser um formato diferente do Strapi
    return response
  }

  console.warn('⚠️ extractStrapiData - Tipo de resposta não suportado:', typeof response)
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
 * @param options - Opções de fetch (revalidate, cache, headers, useToken)
 * @returns Dados da resposta do Strapi
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: FetchAPIOptions = {}
): Promise<T> {
  const { revalidate, cache = 'no-store', headers = {}, useToken = false } = options

  // Construir URL completa
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${STRAPI_URL}${cleanEndpoint}`

  // Log da configuração
  console.log('🔗 fetchAPI - Configuração:', {
    endpoint,
    url,
    strapiUrl: STRAPI_URL,
    useToken,
    hasToken: !!(process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN)
  })

  // Configurar headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // IMPORTANTE: Para endpoints públicos (categorias, produtos, banners), não usar token
  // O token só é necessário para operações que requerem autenticação
  // Se as permissões do role "Public" estiverem configuradas, não precisa de token
  const apiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
  if (useToken && apiToken) {
    requestHeaders['Authorization'] = `Bearer ${apiToken}`
    console.log('🔑 fetchAPI - Token de autenticação adicionado (useToken=true)')
  } else if (!useToken) {
    console.log('ℹ️ fetchAPI - Requisição pública (sem token). Certifique-se de que as permissões do role "Public" estão configuradas no Strapi.')
  } else {
    console.warn('⚠️ fetchAPI - useToken=true mas nenhum token configurado.')
  }

  // Configurar opções de fetch
  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: requestHeaders,
    cache,
    ...(revalidate !== undefined && { next: { revalidate } }),
  }

  try {
    console.log('📡 fetchAPI - Fazendo requisição para:', url)
    let response = await fetch(url, fetchOptions)

    console.log('📥 fetchAPI - Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      usedToken: useToken && !!apiToken
    })

    // Se recebeu 401 e estava usando token, tentar novamente sem token (endpoint público)
    if (!response.ok && response.status === 401 && useToken && apiToken) {
      console.warn('⚠️ fetchAPI - 401 com token. Tentando novamente sem token (endpoint público)...')
      
      // Remover token e tentar novamente
      const publicHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      }
      
      const publicFetchOptions: RequestInit = {
        method: 'GET',
        headers: publicHeaders,
        cache,
        ...(revalidate !== undefined && { next: { revalidate } }),
      }
      
      response = await fetch(url, publicFetchOptions)
      console.log('📥 fetchAPI - Resposta após retry sem token:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      const errorDetails = {
        endpoint,
        url,
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 500), // Limitar tamanho do log
        usedToken: useToken && !!apiToken
      }
      
      console.error('❌ fetchAPI - Erro na resposta:', errorDetails)
      
      // Mensagem de erro mais detalhada
      let errorMessage = `Erro ao buscar dados do Strapi: ${response.status} ${response.statusText}`
      if (response.status === 403) {
        errorMessage += '. Verifique as permissões da API no Strapi (Settings > Users & Permissions > Roles > Public)'
      } else if (response.status === 401) {
        errorMessage += '. Erro de autenticação. Verifique: 1) Se as permissões do role "Public" estão habilitadas no Strapi, 2) Se o token está correto (se necessário)'
      } else if (response.status === 404) {
        errorMessage += '. Endpoint não encontrado. Verifique se o Strapi está rodando e se o endpoint existe'
      }
      
      throw new Error(`${errorMessage}. Detalhes: ${errorText.substring(0, 200)}`)
    }

    const json = await response.json()
    
    // Log detalhado da estrutura da resposta
    console.log('📦 fetchAPI - Estrutura da resposta RAW:', {
      hasData: 'data' in json,
      dataIsArray: Array.isArray(json.data),
      dataLength: Array.isArray(json.data) ? json.data.length : (json.data ? 1 : 0),
      dataType: typeof json.data,
      keys: Object.keys(json),
      firstDataItem: Array.isArray(json.data) && json.data.length > 0 ? {
        keys: Object.keys(json.data[0]),
        hasId: 'id' in json.data[0],
        hasDocumentId: 'documentId' in json.data[0],
        hasAttributes: 'attributes' in json.data[0],
        sample: JSON.stringify(json.data[0]).substring(0, 200)
      } : null
    })

    // IMPORTANTE: Não extrair data aqui, deixar para extractStrapiData fazer
    // Isso permite que extractStrapiData veja a estrutura completa
    console.log('✅ fetchAPI - Retornando resposta completa para processamento')
    return json as T
  } catch (error: any) {
    console.error(`❌ fetchAPI - Erro ao buscar ${endpoint}:`, {
      message: error.message,
      stack: error.stack,
      url,
      endpoint
    })
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
    console.log('📦 getProdutos - Iniciando busca de produtos')
    // Populate específico para garantir que Imagem1 e Destaque sejam populados
    // IMPORTANTE: Adicionar publicationState=live para buscar apenas produtos publicados
    // NOTA: Tentar sem publicationState primeiro, pois pode não funcionar em todas as versões do Strapi
    let response
    try {
      console.log('📦 getProdutos - Tentando buscar com populate específico')
      response = await fetchAPI<StrapiResponse<StrapiProduto[]> | StrapiProduto[]>(
        '/api/produtos?populate[Imagem1]=*&populate[Imagem2]=*&populate[Variacao]=*&populate[categoria]=*&populate[subcategoria]=*',
        options
      )
    } catch (error: any) {
      console.warn('⚠️ getProdutos - Erro ao buscar com populate específico, tentando populate=*:', error.message)
      // Fallback: tentar com populate=* simples
      response = await fetchAPI<StrapiResponse<StrapiProduto[]> | StrapiProduto[]>(
        '/api/produtos?populate=*',
        options
      )
    }

    console.log('📦 getProdutos - Resposta recebida do Strapi:', {
      responseType: typeof response,
      isArray: Array.isArray(response),
      hasData: typeof response === 'object' && 'data' in response
    })

    const data = extractStrapiData(response)
    if (!data) {
      console.warn('⚠️ getProdutos - Nenhum dado retornado do Strapi')
      return []
    }

    const produtosArray = Array.isArray(data) ? data : [data]
    console.log('📦 getProdutos - Dados extraídos:', {
      isArray: Array.isArray(data),
      count: produtosArray.length
    })

    const produtosNormalizados = normalizeStrapiArray<StrapiProduto['attributes']>(produtosArray) as StrapiProduto[]
    
    // Log detalhado dos produtos
    console.log('📦 getProdutos - Produtos normalizados:', produtosNormalizados.length)
    
    const produtosPublicados = produtosNormalizados.filter(p => p.publishedAt !== null)
    const produtosNaoPublicados = produtosNormalizados.filter(p => p.publishedAt === null)
    
    console.log('📦 getProdutos - Status de publicação:', {
      total: produtosNormalizados.length,
      publicados: produtosPublicados.length,
      naoPublicados: produtosNaoPublicados.length
    })

    if (produtosNaoPublicados.length > 0) {
      console.warn('⚠️ getProdutos - Produtos não publicados encontrados:', produtosNaoPublicados.map(p => ({
        id: p.documentId || p.id,
        nome: (p.attributes as any)?.Nome
      })))
    }

    // Log detalhado de cada produto (apenas os primeiros 5 para não poluir o log)
    produtosNormalizados.slice(0, 5).forEach((produto, index) => {
      const attrs = produto.attributes as any
      console.log(`📦 getProdutos - Produto ${index + 1}:`, {
        id: produto.documentId || produto.id,
        nome: attrs?.Nome,
        temDestaque: 'Destaque' in (attrs || {}),
        valorDestaques: attrs?.Destaques,
        valorDestaque: attrs?.Destaque, // Fallback
        publicado: produto.publishedAt !== null,
        temImagem: !!attrs?.Imagem1
      })
    })
    
    return produtosNormalizados
  } catch (error: any) {
    console.error('❌ getProdutos - Erro ao buscar produtos:', {
      message: error.message,
      stack: error.stack
    })
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
    console.log('🎨 getBanners - Iniciando busca de banners')
    const response = await fetchAPI<StrapiResponse<StrapiBanner[]> | StrapiBanner[]>(
      '/api/banners?populate=*',
      options
    )

    console.log('🎨 getBanners - Resposta recebida do Strapi:', {
      responseType: typeof response,
      isArray: Array.isArray(response),
      hasData: typeof response === 'object' && 'data' in response
    })

    const data = extractStrapiData(response)
    if (!data) {
      console.warn('⚠️ getBanners - Nenhum dado extraído da resposta')
      return []
    }

    const bannersArray = Array.isArray(data) ? data : [data]
    console.log('🎨 getBanners - Dados extraídos:', {
      isArray: Array.isArray(data),
      count: bannersArray.length
    })

    const normalizedBanners = normalizeStrapiArray<StrapiBanner['attributes']>(bannersArray) as StrapiBanner[]
    
    console.log('🎨 getBanners - Banners normalizados:', normalizedBanners.length)
    
    const bannersPublicados = normalizedBanners.filter(b => b.publishedAt !== null)
    const bannersNaoPublicados = normalizedBanners.filter(b => b.publishedAt === null)
    
    console.log('🎨 getBanners - Status de publicação:', {
      total: normalizedBanners.length,
      publicados: bannersPublicados.length,
      naoPublicados: bannersNaoPublicados.length
    })

    if (bannersNaoPublicados.length > 0) {
      console.warn('⚠️ getBanners - Banners não publicados encontrados:', bannersNaoPublicados.map(b => ({
        id: b.documentId || b.id,
        local: b.attributes?.Local
      })))
    }

    // Log detalhado dos banners
    normalizedBanners.forEach((banner, index) => {
      console.log(`🎨 getBanners - Banner ${index + 1}:`, {
        id: banner.id,
        documentId: banner.documentId,
        local: banner.attributes?.Local,
        publishedAt: banner.publishedAt,
        publicado: banner.publishedAt !== null,
        hasImagemDesktop: !!banner.attributes?.ImagemDesktop,
        hasImagemMobile: !!banner.attributes?.ImagemMobile
      })
    })
    
    return normalizedBanners
  } catch (error: any) {
    console.error('❌ getBanners - Erro ao buscar banners:', {
      message: error.message,
      stack: error.stack
    })
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
    console.log('📂 getCategorias - Iniciando busca de categorias')
    const response = await fetchAPI<StrapiResponse<StrapiCategoria[]> | StrapiCategoria[]>(
      '/api/categorias?populate=*',
      options
    )

    console.log('📂 getCategorias - Resposta recebida do Strapi:', {
      responseType: typeof response,
      isArray: Array.isArray(response),
      hasData: typeof response === 'object' && 'data' in response,
      responseKeys: typeof response === 'object' ? Object.keys(response) : []
    })

    const data = extractStrapiData(response)
    if (!data) {
      console.warn('⚠️ getCategorias - Nenhum dado extraído da resposta')
      return []
    }

    const categoriasArray = Array.isArray(data) ? data : [data]
    console.log('📂 getCategorias - Dados extraídos:', {
      isArray: Array.isArray(data),
      count: categoriasArray.length
    })

    const categoriasNormalizadas = normalizeStrapiArray<StrapiCategoria['attributes']>(
      categoriasArray
    ) as StrapiCategoria[]

    console.log('✅ getCategorias - Categorias normalizadas:', {
      total: categoriasNormalizadas.length,
      categorias: categoriasNormalizadas.map(cat => ({
        id: cat.documentId || cat.id,
        nome: cat.attributes?.Nome,
        publicado: cat.publishedAt !== null
      }))
    })

    // Log de categorias não publicadas
    const naoPublicadas = categoriasNormalizadas.filter(cat => cat.publishedAt === null)
    if (naoPublicadas.length > 0) {
      console.warn('⚠️ getCategorias - Categorias não publicadas encontradas:', naoPublicadas.length, naoPublicadas.map(c => ({
        id: c.documentId || c.id,
        nome: c.attributes?.Nome
      })))
    }

    return categoriasNormalizadas
  } catch (error: any) {
    console.error('❌ getCategorias - Erro ao buscar categorias:', {
      message: error.message,
      stack: error.stack
    })
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

