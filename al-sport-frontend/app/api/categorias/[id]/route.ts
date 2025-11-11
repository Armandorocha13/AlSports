import { UpdateCategoryDto, categoriesService } from '@/lib/services/categoriesService'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/categorias/[id]
 * Retorna uma categoria específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const includeSubcategories = searchParams.get('include_subcategories') === 'true'

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID da categoria é obrigatório'
        },
        { status: 400 }
      )
    }

    const category = await categoriesService.getCategoryById(id)

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
      const subcategories = await subcategoriesService.getSubcategories(id)
      category.subcategories = subcategories
    }

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error: any) {
    console.error('Erro ao buscar categoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar categoria'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/categorias/[id]
 * Atualiza uma categoria
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID da categoria é obrigatório'
        },
        { status: 400 }
      )
    }

    const updateData: UpdateCategoryDto = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.banner_url !== undefined) updateData.banner_url = body.banner_url
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const category = await categoriesService.updateCategory(id, updateData)

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao atualizar categoria'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/categorias/[id]
 * Remove uma categoria
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID da categoria é obrigatório'
        },
        { status: 400 }
      )
    }

    await categoriesService.deleteCategory(id)

    return NextResponse.json({
      success: true,
      message: 'Categoria excluída com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao excluir categoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao excluir categoria'
      },
      { status: 500 }
    )
  }
}

