import { UpdateSubcategoryDto, subcategoriesService } from '@/lib/services/subcategoriesService'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/subcategorias/[id]
 * Retorna uma subcategoria específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID da subcategoria é obrigatório'
        },
        { status: 400 }
      )
    }

    const subcategory = await subcategoriesService.getSubcategoryById(id)

    if (!subcategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subcategoria não encontrada'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: subcategory
    })
  } catch (error: any) {
    console.error('Erro ao buscar subcategoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar subcategoria'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/subcategorias/[id]
 * Atualiza uma subcategoria
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
          error: 'ID da subcategoria é obrigatório'
        },
        { status: 400 }
      )
    }

    const updateData: UpdateSubcategoryDto = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.category_id !== undefined) updateData.category_id = body.category_id
    if (body.description !== undefined) updateData.description = body.description
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const subcategory = await subcategoriesService.updateSubcategory(id, updateData)

    return NextResponse.json({
      success: true,
      data: subcategory
    })
  } catch (error: any) {
    console.error('Erro ao atualizar subcategoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao atualizar subcategoria'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/subcategorias/[id]
 * Remove uma subcategoria
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
          error: 'ID da subcategoria é obrigatório'
        },
        { status: 400 }
      )
    }

    await subcategoriesService.deleteSubcategory(id)

    return NextResponse.json({
      success: true,
      message: 'Subcategoria excluída com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao excluir subcategoria:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao excluir subcategoria'
      },
      { status: 500 }
    )
  }
}

