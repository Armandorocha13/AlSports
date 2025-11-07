import { UpdateProductDto, productsService } from '@/lib/services/productsService'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/produtos/[id]
 * Retorna um produto específico
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
          error: 'ID do produto é obrigatório'
        },
        { status: 400 }
      )
    }

    const product = await productsService.getProductById(id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produto não encontrado'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar produto'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/produtos/[id]
 * Atualiza um produto
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
          error: 'ID do produto é obrigatório'
        },
        { status: 400 }
      )
    }

    const updateData: UpdateProductDto = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.category_id !== undefined) updateData.category_id = body.category_id
    if (body.subcategory_id !== undefined) updateData.subcategory_id = body.subcategory_id
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.stock_quantity !== undefined) updateData.stock_quantity = body.stock_quantity
    if (body.min_stock !== undefined) updateData.min_stock = body.min_stock
    if (body.max_stock !== undefined) updateData.max_stock = body.max_stock
    if (body.sizes !== undefined) updateData.sizes = body.sizes
    if (body.colors !== undefined) updateData.colors = body.colors
    if (body.materials !== undefined) updateData.materials = body.materials
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured
    if (body.is_on_sale !== undefined) updateData.is_on_sale = body.is_on_sale
    if (body.weight !== undefined) updateData.weight = body.weight
    if (body.sku !== undefined) updateData.sku = body.sku

    const product = await productsService.updateProduct(id, updateData)

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao atualizar produto'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/produtos/[id]
 * Remove um produto
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
          error: 'ID do produto é obrigatório'
        },
        { status: 400 }
      )
    }

    await productsService.deleteProduct(id)

    return NextResponse.json({
      success: true,
      message: 'Produto excluído com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao excluir produto'
      },
      { status: 500 }
    )
  }
}

