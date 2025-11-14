import { getBanners } from '@/lib/api'
import { transformStrapiBannerToAppBanner } from '@/lib/utils/strapi-to-app-types'
import { NextResponse } from 'next/server'

/**
 * GET /api/test-banners
 * Endpoint de diagnóstico específico para banners
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    config: {
      strapiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL || 
                 process.env.NEXT_PUBLIC_STRAPI_URL || 
                 'http://localhost:1337',
      hasToken: !!(process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN)
    },
    raw: {
      fromStrapi: null as any,
      error: null as string | null
    },
    processed: {
      normalized: [] as any[],
      transformed: [] as any[],
      filtered: {
        topHome: [] as any[],
        bottom: [] as any[]
      }
    },
    issues: [] as string[]
  }

  // Teste 1: Buscar banners do Strapi (raw)
  try {
    console.log('🧪 Testando busca RAW de banners...')
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 
                     process.env.NEXT_PUBLIC_STRAPI_URL || 
                     'http://localhost:1337'
    
    const response = await fetch(`${strapiUrl}/api/banners?populate=*`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      results.raw.error = `HTTP ${response.status}: ${errorText}`
      results.issues.push(`Erro ao buscar banners: ${results.raw.error}`)
    } else {
      results.raw.fromStrapi = await response.json()
      
      if (!results.raw.fromStrapi.data || results.raw.fromStrapi.data.length === 0) {
        results.issues.push('Nenhum banner retornado do Strapi. Verifique se há banners cadastrados.')
      }
    }
  } catch (error: any) {
    results.raw.error = error.message
    results.issues.push(`Erro ao buscar banners: ${error.message}`)
  }

  // Teste 2: Processar banners usando getBanners
  try {
    console.log('🧪 Testando processamento de banners...')
    const banners = await getBanners({ revalidate: 0 })
    results.processed.normalized = banners.map(b => ({
      id: b.documentId || b.id,
      local: b.attributes?.Local,
      publishedAt: b.publishedAt,
      publicado: b.publishedAt !== null,
      hasImagemDesktop: !!b.attributes?.ImagemDesktop,
      hasImagemMobile: !!b.attributes?.ImagemMobile,
      imagemDesktopStructure: b.attributes?.ImagemDesktop ? {
        hasData: !!(b.attributes.ImagemDesktop as any).data,
        hasUrl: !!(b.attributes.ImagemDesktop as any).url,
        keys: Object.keys(b.attributes.ImagemDesktop as any).slice(0, 10)
      } : null
    }))

    // Verificar problemas
    banners.forEach((banner, index) => {
      if (!banner.publishedAt) {
        results.issues.push(`Banner ${index + 1} (ID: ${banner.documentId || banner.id}) não está publicado`)
      }
      if (!banner.attributes?.Local) {
        results.issues.push(`Banner ${index + 1} (ID: ${banner.documentId || banner.id}) não tem campo Local preenchido`)
      }
      if (!banner.attributes?.ImagemDesktop) {
        results.issues.push(`Banner ${index + 1} (ID: ${banner.documentId || banner.id}) não tem ImagemDesktop`)
      }
    })

    // Teste 3: Transformar banners
    const transformed = banners
      .filter(b => b.publishedAt !== null)
      .map(transformStrapiBannerToAppBanner)
    
    results.processed.transformed = transformed.map(b => ({
      id: b.id,
      image: b.image,
      hasImage: b.image !== '/images/placeholder.jpg',
      local: b.title.replace('Banner ', ''),
      buttonText: b.buttonText,
      buttonLink: b.buttonLink
    }))

    // Verificar banners sem imagem
    transformed.forEach((banner, index) => {
      if (banner.image === '/images/placeholder.jpg') {
        results.issues.push(`Banner transformado ${index + 1} (ID: ${banner.id}) não tem imagem válida`)
      }
    })

    // Teste 4: Filtrar por local
    const topBanners = banners
      .filter(b => {
        const local = b.attributes?.Local
        const isTopoHome = local === 'Topo-Home'
        const isPublished = b.publishedAt !== null
        return isTopoHome && isPublished
      })
      .map(transformStrapiBannerToAppBanner)
      .filter(b => b.image !== '/images/placeholder.jpg')

    const bottomBanners = banners
      .filter(b => {
        const local = b.attributes?.Local
        const isRodapeOrPromocional = local === 'Rodape' || local === 'Promocional'
        const isPublished = b.publishedAt !== null
        return isRodapeOrPromocional && isPublished
      })
      .map(transformStrapiBannerToAppBanner)
      .filter(b => b.image !== '/images/placeholder.jpg')

    results.processed.filtered.topHome = topBanners.map(b => ({
      id: b.id,
      image: b.image,
      local: 'Topo-Home'
    }))

    results.processed.filtered.bottom = bottomBanners.map(b => ({
      id: b.id,
      image: b.image,
      local: b.title.replace('Banner ', '')
    }))

    if (topBanners.length === 0 && banners.length > 0) {
      results.issues.push('Nenhum banner com Local="Topo-Home" encontrado ou todos foram filtrados')
    }

    if (bottomBanners.length === 0 && banners.length > 0) {
      results.issues.push('Nenhum banner com Local="Rodape" ou "Promocional" encontrado ou todos foram filtrados')
    }

  } catch (error: any) {
    results.issues.push(`Erro ao processar banners: ${error.message}`)
  }

  // Resumo
  results.summary = {
    totalFromStrapi: results.raw.fromStrapi?.data?.length || 0,
    totalNormalized: results.processed.normalized.length,
    totalTransformed: results.processed.transformed.length,
    topHomeCount: results.processed.filtered.topHome.length,
    bottomCount: results.processed.filtered.bottom.length,
    issuesCount: results.issues.length,
    status: results.issues.length === 0 ? 'ok' : 'has_issues'
  }

  const statusCode = results.issues.length > 0 ? 200 : 200 // Sempre 200, mas com issues no JSON

  return NextResponse.json(results, { status: statusCode })
}

