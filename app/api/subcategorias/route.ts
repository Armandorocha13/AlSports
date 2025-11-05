import { CreateSubcategoryDto, subcategoriesService } from '@/lib/services/subcategoriesService'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/subcategorias
 * Lista todas as subcategorias
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const isActive = searchParams.get('is_active')

    const subcategories = await subcategoriesService.getSubcategories(categoryId || undefined)

    // Filtrar subcategorias
    let filteredSubcategories = subcategories

    if (isActive !== null) {
      const active = isActive === 'true'
      filteredSubcategories = filteredSubcategories.filter(s => s.is_active === active)
    }

    return NextResponse.json({
      success: true,
      data: filteredSubcategories,
      count: filteredSubcategories.length
    })
  } catch (error: any) {
    console.error('Erro ao buscar subcategorias:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar subcategorias'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/subcategorias
 * Cria uma nova subcategoria
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome da subcategoria é obrigatório'
        },
        { status: 400 }
      )
    }

    if (!body.category_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID da categoria é obrigatório'
        },
        { status: 400 }
      )
    }

    const subcategoryData: CreateSubcategoryDto = {
      name: body.name.trim(),
      category_id: body.category_id,
      description: body.description,
      image_url: body.image_url,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    const subcategory = await subcategoriesService.createSubcategory(subcategoryData)

    return NextResponse.json({
      success: true,
      data: subcategory
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar subcategoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao criar subcategoria'
      },
      { status: 500 }
    )
  }
}

