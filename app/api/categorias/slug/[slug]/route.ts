import { categoriesService } from '@/lib/services/categoriesService'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/categorias/slug/[slug]
 * Retorna uma categoria pelo slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const searchParams = request.nextUrl.searchParams
    const includeSubcategories = searchParams.get('include_subcategories') === 'true'

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug da categoria é obrigatório'
        },
        { status: 400 }
      )
    }

    // Buscar todas as categorias e filtrar por slug
    const categories = await categoriesService.getCategories()
    const category = categories.find(c => c.slug === slug)

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Categoria não encontrada'
        },
        { status: 404 }
      )
    }

    // Se incluir subcategorias
    if (includeSubcategories) {
      const { subcategoriesService } = await import('@/lib/services/subcategoriesService')
      const subcategories = await subcategoriesService.getSubcategories(category.id)
      category.subcategories = subcategories
    }

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error: any) {
    console.error('Erro ao buscar categoria por slug:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar categoria'
      },
      { status: 500 }
    )
  }
}

