import { getCategorias, getProdutos, getBanners, getSubcategorias } from '@/lib/api'
import { NextResponse } from 'next/server'

/**
 * GET /api/test-strapi
 * Endpoint de teste para diagnosticar problemas com a conexão Strapi
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    config: {
      strapiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL || 
                 process.env.NEXT_PUBLIC_STRAPI_URL || 
                 'http://localhost:1337',
      hasToken: !!(process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN),
      tokenSource: process.env.STRAPI_API_TOKEN ? 'STRAPI_API_TOKEN' : 
                   process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ? 'NEXT_PUBLIC_STRAPI_API_TOKEN' : 
                   'none'
    },
    tests: {
      categorias: { success: false, error: null, data: null, count: 0 },
      produtos: { success: false, error: null, data: null, count: 0 },
      banners: { success: false, error: null, data: null, count: 0 },
      subcategorias: { success: false, error: null, data: null, count: 0 }
    },
    summary: {
      totalTests: 4,
      passed: 0,
      failed: 0,
      warnings: [] as string[]
    }
  }

  // Teste 1: Categorias
  try {
    console.log('🧪 Testando busca de categorias...')
    const categorias = await getCategorias({ revalidate: 0 })
    
    // Testar requisição direta para ver a resposta raw
    let rawResponse = null
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 
                       process.env.NEXT_PUBLIC_STRAPI_URL || 
                       'http://localhost:1337'
      const apiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`
      }
      
      const response = await fetch(`${strapiUrl}/api/categorias?populate=*`, { headers })
      rawResponse = await response.json()
    } catch (e) {
      // Ignorar erro na requisição raw
    }
    
    results.tests.categorias = {
      success: true,
      error: null,
      count: categorias.length,
      data: categorias.slice(0, 3).map(cat => ({
        id: cat.documentId || cat.id,
        nome: cat.attributes?.Nome,
        publicado: cat.publishedAt !== null,
        hasImage: !!cat.attributes?.ImagemDaCategoria
      })),
      rawResponseStructure: rawResponse ? {
        hasData: 'data' in rawResponse,
        dataIsArray: Array.isArray(rawResponse.data),
        dataLength: Array.isArray(rawResponse.data) ? rawResponse.data.length : (rawResponse.data ? 1 : 0),
        keys: Object.keys(rawResponse),
        firstItemSample: Array.isArray(rawResponse.data) && rawResponse.data.length > 0 ? {
          keys: Object.keys(rawResponse.data[0]),
          hasId: 'id' in rawResponse.data[0],
          hasDocumentId: 'documentId' in rawResponse.data[0],
          hasAttributes: 'attributes' in rawResponse.data[0]
        } : null
      } : null
    }
    
    const categoriasNaoPublicadas = categorias.filter(c => c.publishedAt === null)
    if (categoriasNaoPublicadas.length > 0) {
      results.summary.warnings.push(
        `${categoriasNaoPublicadas.length} categoria(s) não publicada(s) encontrada(s)`
      )
    }
    
    results.summary.passed++
  } catch (error: any) {
    results.tests.categorias = {
      success: false,
      error: error.message,
      data: null,
      count: 0
    }
    results.summary.failed++
  }

  // Teste 2: Produtos
  try {
    console.log('🧪 Testando busca de produtos...')
    const produtos = await getProdutos({ revalidate: 0 })
    results.tests.produtos = {
      success: true,
      error: null,
      count: produtos.length,
      data: produtos.slice(0, 3).map(prod => ({
        id: prod.documentId || prod.id,
        nome: (prod.attributes as any)?.Nome,
        publicado: prod.publishedAt !== null,
        temDestaques: !!(prod.attributes as any)?.Destaques,
        temDestaque: !!(prod.attributes as any)?.Destaque, // Fallback
        hasImage: !!(prod.attributes as any)?.Imagem1
      }))
    }
    
    const produtosNaoPublicados = produtos.filter(p => p.publishedAt === null)
    if (produtosNaoPublicados.length > 0) {
      results.summary.warnings.push(
        `${produtosNaoPublicados.length} produto(s) não publicado(s) encontrado(s)`
      )
    }
    
    if (produtos.length === 0) {
      results.summary.warnings.push('Nenhum produto encontrado. Verifique se há produtos cadastrados e publicados no Strapi.')
    }
    
    results.summary.passed++
  } catch (error: any) {
    results.tests.produtos = {
      success: false,
      error: error.message,
      data: null,
      count: 0
    }
    results.summary.failed++
  }

  // Teste 3: Banners
  try {
    console.log('🧪 Testando busca de banners...')
    const banners = await getBanners({ revalidate: 0 })
    results.tests.banners = {
      success: true,
      error: null,
      count: banners.length,
      data: banners.slice(0, 3).map(banner => ({
        id: banner.documentId || banner.id,
        local: banner.attributes?.Local,
        publicado: banner.publishedAt !== null,
        hasImageDesktop: !!banner.attributes?.ImagemDesktop,
        hasImageMobile: !!banner.attributes?.ImagemMobile
      }))
    }
    
    const bannersNaoPublicados = banners.filter(b => b.publishedAt === null)
    if (bannersNaoPublicados.length > 0) {
      results.summary.warnings.push(
        `${bannersNaoPublicados.length} banner(s) não publicado(s) encontrado(s)`
      )
    }
    
    results.summary.passed++
  } catch (error: any) {
    results.tests.banners = {
      success: false,
      error: error.message,
      data: null,
      count: 0
    }
    results.summary.failed++
  }

  // Teste 4: Subcategorias
  try {
    console.log('🧪 Testando busca de subcategorias...')
    const subcategorias = await getSubcategorias({ revalidate: 0 })
    results.tests.subcategorias = {
      success: true,
      error: null,
      count: subcategorias.length,
      data: subcategorias.slice(0, 3).map(sub => ({
        id: sub.documentId || sub.id,
        nome: sub.attributes?.Nome || (sub as any).Nome,
        publicado: sub.publishedAt !== null
      }))
    }
    
    results.summary.passed++
  } catch (error: any) {
    results.tests.subcategorias = {
      success: false,
      error: error.message,
      data: null,
      count: 0
    }
    results.summary.failed++
  }

  // Adicionar recomendações baseadas nos resultados
  results.recommendations = []
  
  if (!results.config.hasToken) {
    results.recommendations.push({
      type: 'warning',
      message: 'Nenhum token de API configurado. Alguns dados podem não estar acessíveis sem autenticação.',
      action: 'Configure STRAPI_API_TOKEN ou NEXT_PUBLIC_STRAPI_API_TOKEN no arquivo .env.local'
    })
  }

  if (results.summary.failed > 0) {
    results.recommendations.push({
      type: 'error',
      message: `${results.summary.failed} teste(s) falharam. Verifique se o Strapi está rodando e se as permissões estão configuradas.`,
      action: '1. Verifique se o Strapi está rodando em ' + results.config.strapiUrl + 
              '\n2. Acesse Settings > Users & Permissions > Roles > Public' +
              '\n3. Habilite find e findOne para Categoria, Produto, Banner e Subcategoria'
    })
  }

  if (results.tests.produtos.count === 0 && results.tests.produtos.success) {
    results.recommendations.push({
      type: 'warning',
      message: 'Nenhum produto encontrado. Isso pode indicar que os produtos não estão publicados.',
      action: '1. Acesse o painel admin do Strapi' +
              '\n2. Vá em Content Manager > Produto' +
              '\n3. Certifique-se de que os produtos estão com status "Published" (não "Draft")'
    })
  }

  if (results.tests.categorias.count === 0 && results.tests.categorias.success) {
    results.recommendations.push({
      type: 'warning',
      message: 'Nenhuma categoria encontrada.',
      action: '1. Acesse o painel admin do Strapi' +
              '\n2. Vá em Content Manager > Categoria' +
              '\n3. Certifique-se de que há categorias cadastradas'
    })
  }

  // Status HTTP baseado nos resultados
  const statusCode = results.summary.failed > 0 ? 500 : 200

  return NextResponse.json(results, { status: statusCode })
}

