import { CreateCategoryDto, categoriesService } from '@/lib/services/categoriesService'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/categorias
 * Lista todas as categorias
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('is_active')
    const includeSubcategories = searchParams.get('include_subcategories') === 'true'

    const categories = await categoriesService.getCategories()

    // Filtrar categorias
    let filteredCategories = categories

    if (isActive !== null) {
      const active = isActive === 'true'
      filteredCategories = filteredCategories.filter(c => c.is_active === active)
    }

    // Se incluir subcategorias, buscar para cada categoria
    if (includeSubcategories) {
      const { subcategoriesService } = await import('@/lib/services/subcategoriesService')
      for (const category of filteredCategories) {
        const subcategories = await subcategoriesService.getSubcategories(category.id)
        category.subcategories = subcategories
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredCategories,
      count: filteredCategories.length
    })
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar categorias'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/categorias
 * Cria uma nova categoria
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome da categoria é obrigatório'
        },
        { status: 400 }
      )
    }

    const categoryData: CreateCategoryDto = {
      name: body.name.trim(),
      description: body.description,
      image_url: body.image_url,
      banner_url: body.banner_url,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    const category = await categoriesService.createCategory(categoryData)

    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao criar categoria'
      },
      { status: 500 }
    )
  }
}

