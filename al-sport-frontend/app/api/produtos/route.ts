import { getProdutos } from '@/lib/api'
import { transformStrapiProdutosToProducts } from '@/lib/utils/strapi-to-app-types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/produtos
 * Lista todos os produtos do Strapi
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const subcategoryId = searchParams.get('subcategory_id')
    const isActive = searchParams.get('is_active')
    const isFeatured = searchParams.get('is_featured')
    const limit = searchParams.get('limit')

    // Buscar produtos do Strapi
    const strapiProdutos = await getProdutos({ revalidate: 60 })
    let products = transformStrapiProdutosToProducts(strapiProdutos)

    // Filtrar produtos
    let filteredProducts = products

    if (categoryId) {
      filteredProducts = filteredProducts.filter(p => p.category === categoryId)
    }

    if (subcategoryId) {
      filteredProducts = filteredProducts.filter(p => p.subcategory === subcategoryId)
    }

    if (isActive !== null) {
      // Por enquanto, todos os produtos do Strapi são considerados ativos
      // Adicionar campo 'active' no Strapi se necessário
    }

    if (isFeatured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured === true)
    }

    // Aplicar limite
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum)) {
        filteredProducts = filteredProducts.slice(0, limitNum)
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length
    })
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar produtos'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/produtos
 * Cria um novo produto
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos obrigatórios
    if (!body.name || !body.price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome e preço são obrigatórios'
        },
        { status: 400 }
      )
    }

    const productData: CreateProductDto = {
      name: body.name,
      description: body.description,
      category_id: body.category_id,
      subcategory_id: body.subcategory_id,
      price: parseFloat(body.price),
      stock_quantity: body.stock_quantity || 0,
      min_stock: body.min_stock || 0,
      max_stock: body.max_stock,
      sizes: body.sizes || [],
      colors: body.colors || [],
      materials: body.materials || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_featured: body.is_featured || false,
      is_on_sale: body.is_on_sale || false,
      weight: body.weight,
      sku: body.sku
    }

    const product = await productsService.createProduct(productData)

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao criar produto'
      },
      { status: 500 }
    )
  }
}

