import { NextResponse } from 'next/server'
import { getProdutos } from '@/lib/api'
import { transformStrapiProdutosToProducts } from '@/lib/utils/strapi-to-app-types'

/**
 * Endpoint de teste para verificar produtos em destaque
 * Acesse: http://localhost:3000/api/test-produtos-destaque
 */
export async function GET() {
  try {
    // Buscar produtos do Strapi
    const strapiProdutos = await getProdutos()
    
    // Transformar produtos
    const produtos = transformStrapiProdutosToProducts(strapiProdutos)
    
    // Filtrar produtos em destaque
    const produtosDestaque = produtos.filter(p => p.featured === true)
    
    // Retornar informações detalhadas
    return NextResponse.json({
      success: true,
      totalProdutos: produtos.length,
      totalDestaque: produtosDestaque.length,
      produtos: produtos.map(p => ({
        id: p.id,
        nome: p.name,
        featured: p.featured,
        featuredType: typeof p.featured
      })),
      produtosDestaque: produtosDestaque.map(p => ({
        id: p.id,
        nome: p.name,
        featured: p.featured
      })),
      rawStrapi: strapiProdutos.map(p => ({
        id: p.documentId || p.id,
        nome: (p.attributes as any)?.Nome,
        destaques: (p.attributes as any)?.Destaques,
        destaquesType: typeof (p.attributes as any)?.Destaques,
        destaque: (p.attributes as any)?.Destaque, // Fallback para singular
        destaqueType: typeof (p.attributes as any)?.Destaque,
        publicado: p.publishedAt !== null,
        allAttributes: Object.keys(p.attributes || {})
      }))
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}




