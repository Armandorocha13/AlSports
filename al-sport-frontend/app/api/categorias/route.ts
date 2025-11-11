import { getCategorias, getSubcategorias } from '@/lib/api'
import { transformStrapiCategoriasToCategories } from '@/lib/utils/strapi-to-app-types'
import { NextRequest, NextResponse } from 'next/server'
import { TABELA_MEDIDAS_CATEGORY } from '@/lib/constants/tabela-medidas-category'

/**
 * GET /api/categorias
 * Lista todas as categorias do Strapi
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('is_active')
    const includeSubcategories = searchParams.get('include_subcategories') !== 'false' // Por padrão incluir subcategorias

    // Buscar categorias e subcategorias do Strapi
    const [strapiCategorias, strapiSubcategorias] = await Promise.all([
      getCategorias({ revalidate: 60 }),
      includeSubcategories ? getSubcategorias({ revalidate: 60 }) : Promise.resolve([])
    ])
    
    // Debug: log das categorias do Strapi
    if (process.env.NODE_ENV === 'development') {
      console.log('GET /api/categorias - Categorias do Strapi:', {
        count: strapiCategorias.length,
        firstCategory: strapiCategorias[0],
        subcategoriasCount: strapiSubcategorias.length
      })
    }

    let categories = await transformStrapiCategoriasToCategories(
      strapiCategorias, 
      includeSubcategories ? strapiSubcategorias : undefined
    )

    // Debug: log das categorias transformadas
    if (process.env.NODE_ENV === 'development') {
      console.log('GET /api/categorias - Categorias transformadas:', {
        count: categories.length,
        firstCategory: categories[0]
      })
    }

    // Filtrar categorias (excluir tabela-medidas do Strapi, pois temos uma fixa)
    let filteredCategories = categories.filter(cat => cat.slug !== 'tabela-medidas')
    
    // Adicionar categoria fixa de Tabela de Medidas
    filteredCategories.push(TABELA_MEDIDAS_CATEGORY)

    if (isActive !== null) {
      // Por enquanto, todas as categorias do Strapi são consideradas ativas
      // Adicionar campo 'active' no Strapi se necessário
    }

    // Se incluir subcategorias, buscar do Strapi
    if (includeSubcategories) {
      // As subcategorias já devem vir populadas do Strapi se usar populate=*
      // Implementar busca de subcategorias se necessário
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

