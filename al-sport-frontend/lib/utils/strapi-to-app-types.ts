/**
 * Funções para transformar dados do Strapi para os tipos da aplicação
 */

import { StrapiProduto, StrapiCategoria, StrapiBanner, StrapiMedia } from '@/lib/types'
import { Product, Category } from '@/lib/types'
import { getStrapiMediaUrl } from '@/lib/api'

/**
 * Transforma um produto do Strapi para o formato da aplicação
 */
export function transformStrapiProdutoToProduct(strapiProduto: StrapiProduto): Product {
  // Debug: log do produto recebido
  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiProdutoToProduct - Recebido:', {
      id: strapiProduto.id,
      documentId: strapiProduto.documentId,
      hasAttributes: !!strapiProduto.attributes,
      attributes: strapiProduto.attributes
    })
  }

  // Verificar se attributes existe
  if (!strapiProduto.attributes) {
    console.warn('Produto sem attributes:', strapiProduto)
    return {
      id: strapiProduto.documentId || strapiProduto.id?.toString() || '',
      name: 'Produto sem nome',
      price: 0,
      wholesalePrice: 0,
      image: '/images/placeholder.jpg',
      description: '',
      sizes: [],
      category: '',
      subcategory: '',
      featured: false,
      onSale: false,
      priceRanges: [],
    }
  }

  // Imagem1 pode vir como objeto direto ou dentro de { data: ... }
  const imagem1 = strapiProduto.attributes.Imagem1
  let imagemUrl: string = '/images/placeholder.jpg'
  
  // Debug: log detalhado da imagem
  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiProdutoToProduct - Imagem1 recebida:', {
      hasImagem1: !!imagem1,
      imagem1Type: typeof imagem1,
      imagem1Value: imagem1,
      imagem1Keys: imagem1 ? Object.keys(imagem1) : [],
      imagem1Data: imagem1 ? (imagem1 as any).data : null,
      imagem1Attributes: imagem1 ? (imagem1 as any).attributes : null,
      imagem1Url: imagem1 ? (imagem1 as any).url : null
    })
  }
  
  if (imagem1) {
    // Se já é um objeto StrapiMedia (com attributes ou url direto), usar diretamente
    if (imagem1.attributes || imagem1.url) {
      const url = getStrapiMediaUrl(imagem1 as any)
      if (process.env.NODE_ENV === 'development') {
        console.log('transformStrapiProdutoToProduct - URL obtida (direto):', url)
      }
      if (url) {
        imagemUrl = url
      }
    } 
    // Se está dentro de { data: StrapiMedia }
    else if ((imagem1 as any).data) {
      const url = getStrapiMediaUrl((imagem1 as any).data)
      if (process.env.NODE_ENV === 'development') {
        console.log('transformStrapiProdutoToProduct - URL obtida (data):', url)
      }
      if (url) {
        imagemUrl = url
      }
    }
    // Se é null ou undefined, manter placeholder
    else if (imagem1 === null || imagem1 === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('transformStrapiProdutoToProduct - Imagem1 é null/undefined')
      }
    }
    // Tentar outras estruturas possíveis
    else {
      // Tentar como string direto (URL)
      if (typeof imagem1 === 'string' && imagem1.trim() !== '') {
        imagemUrl = imagem1
        if (process.env.NODE_ENV === 'development') {
          console.log('transformStrapiProdutoToProduct - Imagem1 é string:', imagemUrl)
        }
      } else {
        // Tentar getStrapiMediaUrl com o objeto completo
        const url = getStrapiMediaUrl(imagem1 as any)
        if (url) {
          imagemUrl = url
          if (process.env.NODE_ENV === 'development') {
            console.log('transformStrapiProdutoToProduct - URL obtida (fallback):', url)
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('transformStrapiProdutoToProduct - Não foi possível obter URL da imagem:', imagem1)
          }
        }
      }
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('transformStrapiProdutoToProduct - Produto sem Imagem1:', {
        produtoId: strapiProduto.documentId || strapiProduto.id,
        produtoNome: strapiProduto.attributes?.Nome
      })
    }
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiProdutoToProduct - URL final da imagem:', imagemUrl)
  }
  
  // Extrair variações para sizes
  // O schema do Strapi usa "Variacao" (singular) como componente repeatable
  const sizes: string[] = []
  // Tentar acessar variações como componente (Variacao) ou como relação (variacoes)
  const variacoes = (strapiProduto.attributes as any).Variacao || 
                    (strapiProduto.attributes as any).variacoes?.data ||
                    []
  
  if (Array.isArray(variacoes) && variacoes.length > 0) {
    variacoes.forEach((variacao: any) => {
      // Strapi 5 pode retornar campos diretamente ou dentro de attributes
      const tamanho = variacao.attributes?.Tamanho || 
                      variacao.Tamanho || 
                      ''
      
      if (tamanho && tamanho.trim() !== '' && !sizes.includes(tamanho)) {
        sizes.push(tamanho)
      }
    })
  }

  // Debug: log das variações encontradas
  if (process.env.NODE_ENV === 'development') {
    console.log('Variações encontradas:', {
      variacoesCount: variacoes.length,
      variacoes: variacoes,
      sizesExtracted: sizes
    })
  }

  const nome = strapiProduto.attributes.Nome
  if (!nome || nome.trim() === '') {
    console.warn('Produto sem nome válido:', strapiProduto)
  }

  // Descrição pode vir como string ou como array de blocks (Strapi rich text)
  let descricao = ''
  if (typeof strapiProduto.attributes.Descricao === 'string') {
    descricao = strapiProduto.attributes.Descricao
  } else if (Array.isArray(strapiProduto.attributes.Descricao)) {
    // Se for um array de blocks (Strapi rich text), extrair o texto
    descricao = strapiProduto.attributes.Descricao
      .map((block: any) => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join('')
        }
        return ''
      })
      .join('\n')
  }

  // Categoria pode vir como objeto direto ou dentro de { data: ... }
  let categoriaNome = ''
  const categoria = strapiProduto.attributes.categoria || (strapiProduto.attributes as any).subcategoria
  if (categoria) {
    if (categoria.Nome) {
      categoriaNome = categoria.Nome
    } else if (categoria.data?.Nome) {
      categoriaNome = categoria.data.Nome
    } else if (categoria.data?.attributes?.Nome) {
      categoriaNome = categoria.data.attributes.Nome
    }
  }

  // Subcategoria
  let subcategoriaNome = ''
  const subcategoria = (strapiProduto.attributes as any).subcategoria
  if (subcategoria) {
    if (subcategoria.Nome) {
      subcategoriaNome = subcategoria.Nome
    } else if (subcategoria.data?.Nome) {
      subcategoriaNome = subcategoria.data.Nome
    }
  }

  // Verificar se o produto está em destaque
  // Pode vir como "Destaque", "Featured", "EmDestaque", "is_featured", etc.
  const destaqueValue = strapiProduto.attributes.Destaque
  const isFeatured = 
    destaqueValue === true ||
    destaqueValue === 'true' ||
    strapiProduto.attributes.Featured === true ||
    strapiProduto.attributes.EmDestaque === true ||
    strapiProduto.attributes.is_featured === true ||
    (strapiProduto.attributes as any).featured === true ||
    false

  // Debug: sempre logar o valor de Destaque (não só em desenvolvimento)
  console.log('🔍 Verificando produto em destaque:', {
    id: strapiProduto.documentId || strapiProduto.id,
    nome: nome,
    destaqueValue: destaqueValue,
    destaqueType: typeof destaqueValue,
    isFeatured: isFeatured,
    allAttributes: Object.keys(strapiProduto.attributes)
  })

  if (isFeatured) {
    console.log('✅ Produto em destaque encontrado:', {
      id: strapiProduto.documentId || strapiProduto.id,
      nome: nome,
      isFeatured: isFeatured
    })
  }

  const produtoTransformado = {
    id: strapiProduto.documentId || strapiProduto.id?.toString() || '',
    name: nome || 'Produto sem nome',
    price: strapiProduto.attributes.Preco || 0,
    wholesalePrice: strapiProduto.attributes.Preco || 0, // Usar Preco como wholesalePrice por enquanto
    image: imagemUrl,
    description: descricao,
    sizes: sizes,
    category: categoriaNome,
    subcategory: subcategoriaNome,
    featured: isFeatured,
    onSale: false, // Adicionar campo no Strapi se necessário
    priceRanges: [], // Adicionar campo no Strapi se necessário
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiProdutoToProduct - Transformado:', produtoTransformado)
  }

  return produtoTransformado
}

/**
 * Gera slug a partir do nome
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Transforma uma categoria do Strapi para o formato da aplicação
 */
export function transformStrapiCategoriaToCategory(strapiCategoria: StrapiCategoria): Category {
  // Debug: log da categoria recebida
  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiCategoriaToCategory - Recebido:', {
      id: strapiCategoria.id,
      documentId: strapiCategoria.documentId,
      hasAttributes: !!strapiCategoria.attributes,
      attributes: strapiCategoria.attributes
    })
  }

  // Verificar se attributes existe
  if (!strapiCategoria.attributes) {
    console.warn('Categoria sem attributes:', strapiCategoria)
    return {
      id: strapiCategoria.documentId || strapiCategoria.id?.toString() || '',
      name: 'Categoria sem nome',
      slug: '',
      image: '/images/placeholder.jpg',
      description: '',
      subcategories: [],
    }
  }

  const nome = strapiCategoria.attributes.Nome
  if (!nome || nome.trim() === '') {
    console.warn('Categoria sem nome válido:', strapiCategoria)
    return {
      id: strapiCategoria.documentId || strapiCategoria.id?.toString() || '',
      name: 'Categoria sem nome',
      slug: '',
      image: '/images/placeholder.jpg',
      description: '',
      subcategories: [],
    }
  }

  const slugExistente = strapiCategoria.attributes.slug
  // Gerar slug a partir do nome se não existir
  const slug = slugExistente || generateSlug(nome)
  
  // ImagemDaCategoria pode vir como objeto direto ou dentro de { data: ... }
  const imagemDaCategoria = strapiCategoria.attributes.ImagemDaCategoria
  let imagemUrl: string = '/images/placeholder.jpg'
  
  if (imagemDaCategoria) {
    // Se já é um objeto StrapiMedia (com attributes ou url direto), usar diretamente
    if (imagemDaCategoria.attributes || imagemDaCategoria.url) {
      const url = getStrapiMediaUrl(imagemDaCategoria as any)
      if (url) {
        imagemUrl = url
      }
    } 
    // Se está dentro de { data: StrapiMedia }
    else if ((imagemDaCategoria as any).data) {
      const url = getStrapiMediaUrl((imagemDaCategoria as any).data)
      if (url) {
        imagemUrl = url
      }
    }
  }

  const categoriaTransformada = {
    id: strapiCategoria.documentId || strapiCategoria.id?.toString() || '',
    name: nome,
    slug: slug,
    image: imagemUrl,
    description: (strapiCategoria.attributes as any).Descricao || '',
    subcategories: [], // Será preenchido depois quando agruparmos subcategorias
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiCategoriaToCategory - Transformado:', categoriaTransformada)
  }

  return categoriaTransformada
}

/**
 * Transforma array de produtos do Strapi
 */
export function transformStrapiProdutosToProducts(strapiProdutos: StrapiProduto[]): Product[] {
  if (!Array.isArray(strapiProdutos)) {
    console.warn('transformStrapiProdutosToProducts: entrada não é um array', strapiProdutos)
    return []
  }

  console.log('🔄 transformStrapiProdutosToProducts - Total de produtos recebidos:', strapiProdutos.length)
  
  const produtosTransformados = strapiProdutos
    .filter(produto => {
      // Filtrar apenas produtos publicados
      const isPublished = produto.publishedAt !== null
      if (!isPublished) {
        console.log('⚠️ Produto não publicado ignorado:', produto.documentId || produto.id, produto.attributes?.Nome)
      }
      return produto != null && isPublished
    })
    .map(transformStrapiProdutoToProduct)
    .filter(produto => produto.id) // Filtrar produtos inválidos
  
  console.log('✅ transformStrapiProdutosToProducts - Produtos transformados:', produtosTransformados.length)
  console.log('⭐ Produtos em destaque após transformação:', produtosTransformados.filter(p => p.featured).map(p => ({ id: p.id, nome: p.name })))
  
  return produtosTransformados
}

/**
 * Transforma uma subcategoria do Strapi para o formato da aplicação
 */
function transformStrapiSubcategoriaToSubcategory(strapiSubcategoria: any, categoriaId: string): Category['subcategories'][0] {
  const nome = strapiSubcategoria.attributes?.Nome || strapiSubcategoria.Nome || 'Subcategoria sem nome'
  const slug = generateSlug(nome)
  
  // Buscar imagem de capa - pode vir como 'ImagemDaSubcategoria', 'image' ou 'Imagem'
  const imagemDaSubcategoria = strapiSubcategoria.attributes?.ImagemDaSubcategoria || strapiSubcategoria.ImagemDaSubcategoria
  let imagemUrl: string = '/images/placeholder.jpg'
  
  if (imagemDaSubcategoria) {
    // Se já é um objeto StrapiMedia (com attributes ou url direto), usar diretamente
    if (imagemDaSubcategoria.attributes || imagemDaSubcategoria.url) {
      const url = getStrapiMediaUrl(imagemDaSubcategoria as any)
      if (url) {
        imagemUrl = url
      }
    } 
    // Se está dentro de { data: StrapiMedia }
    else if ((imagemDaSubcategoria as any).data) {
      const url = getStrapiMediaUrl((imagemDaSubcategoria as any).data)
      if (url) {
        imagemUrl = url
      }
    }
  }
  
  return {
    id: strapiSubcategoria.documentId || strapiSubcategoria.id?.toString() || '',
    name: nome,
    slug: slug,
    image: imagemUrl,
  }
}

/**
 * Transforma array de categorias do Strapi, incluindo subcategorias
 */
export async function transformStrapiCategoriasToCategories(
  strapiCategorias: StrapiCategoria[],
  strapiSubcategorias?: any[]
): Promise<Category[]> {
  if (!Array.isArray(strapiCategorias)) {
    console.warn('transformStrapiCategoriasToCategories: entrada não é um array', strapiCategorias)
    return []
  }

  // Transformar categorias
  const categorias = strapiCategorias
    .filter(categoria => categoria != null) // Filtrar valores null/undefined
    .map(transformStrapiCategoriaToCategory)
    .filter(categoria => categoria.id) // Filtrar categorias inválidas

  // Se subcategorias foram fornecidas, agrupá-las por categoria
  if (strapiSubcategorias && Array.isArray(strapiSubcategorias)) {
    strapiSubcategorias.forEach((subcategoria: any) => {
      // Obter o ID da categoria relacionada
      // Pode estar em attributes.categoria ou diretamente em categoria
      const categoriaRelacionada = subcategoria.attributes?.categoria || subcategoria.categoria
      let categoriaId: string | null = null

      if (categoriaRelacionada) {
        // Strapi 5 retorna categoria diretamente como objeto com documentId
        if (categoriaRelacionada.documentId) {
          categoriaId = categoriaRelacionada.documentId
        } 
        // Strapi 4 pode retornar dentro de { data: ... }
        else if (categoriaRelacionada.data?.documentId) {
          categoriaId = categoriaRelacionada.data.documentId
        } 
        // Se só tem id numérico, buscar a categoria correspondente no array de categorias Strapi
        else if (categoriaRelacionada.id) {
          const categoriaStrapi = strapiCategorias.find(cat => 
            cat.id === categoriaRelacionada.id || 
            cat.documentId === categoriaRelacionada.documentId
          )
          if (categoriaStrapi) {
            categoriaId = categoriaStrapi.documentId || categoriaStrapi.id?.toString() || ''
          }
        }
      }

      if (categoriaId) {
        // Encontrar a categoria correspondente e adicionar a subcategoria
        const categoria = categorias.find(cat => cat.id === categoriaId)
        if (categoria) {
          const subcategoriaTransformada = transformStrapiSubcategoriaToSubcategory(subcategoria, categoriaId)
          categoria.subcategories.push(subcategoriaTransformada)
        } else if (process.env.NODE_ENV === 'development') {
          console.warn('Categoria não encontrada para subcategoria:', {
            subcategoriaNome: subcategoria.attributes?.Nome || subcategoria.Nome,
            categoriaIdProcurado: categoriaId,
            categoriasDisponiveis: categorias.map(c => ({ id: c.id, name: c.name }))
          })
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('Não foi possível determinar categoriaId para subcategoria:', {
          subcategoria,
          categoriaRelacionada
        })
      }
    })
  }

  return categorias
}

/**
 * Interface para banner do carrossel
 */
export interface AppBanner {
  id: string
  image: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

/**
 * Transforma um banner do Strapi para o formato da aplicação
 */
export function transformStrapiBannerToAppBanner(strapiBanner: StrapiBanner): AppBanner {
  if (!strapiBanner.attributes) {
    console.warn('Banner sem attributes:', strapiBanner)
    return {
      id: strapiBanner.documentId || strapiBanner.id?.toString() || '',
      image: '/images/placeholder.jpg',
      title: 'Banner',
      description: '',
      buttonText: 'Ver mais',
      buttonLink: '/'
    }
  }

  // Debug: log do banner sendo transformado
  if (process.env.NODE_ENV === 'development') {
    console.log('transformStrapiBannerToAppBanner - Banner recebido:', {
      id: strapiBanner.id,
      documentId: strapiBanner.documentId,
      local: strapiBanner.attributes.Local,
      imagemDesktop: strapiBanner.attributes.ImagemDesktop,
      imagemMobile: strapiBanner.attributes.ImagemMobile
    })
  }

  // Obter imagem desktop (prioridade) ou mobile
  let imagemUrl: string = '/images/placeholder.jpg'
  const imagemDesktop = strapiBanner.attributes.ImagemDesktop
  const imagemMobile = strapiBanner.attributes.ImagemMobile

  // Tentar obter imagem desktop primeiro
  if (imagemDesktop) {
    // Strapi pode retornar como { data: StrapiMedia } ou diretamente como StrapiMedia
    let mediaData = imagemDesktop
    if ((imagemDesktop as any).data) {
      mediaData = (imagemDesktop as any).data
    }
    
    const url = getStrapiMediaUrl(mediaData as any)
    if (url) {
      imagemUrl = url
      if (process.env.NODE_ENV === 'development') {
        console.log('transformStrapiBannerToAppBanner - URL desktop obtida:', url)
      }
    }
  }
  
  // Se não tiver desktop, tentar mobile
  if (imagemUrl === '/images/placeholder.jpg' && imagemMobile) {
    let mediaData = imagemMobile
    if ((imagemMobile as any).data) {
      mediaData = (imagemMobile as any).data
    }
    
    const url = getStrapiMediaUrl(mediaData as any)
    if (url) {
      imagemUrl = url
      if (process.env.NODE_ENV === 'development') {
        console.log('transformStrapiBannerToAppBanner - URL mobile obtida:', url)
      }
    }
  }

  if (imagemUrl === '/images/placeholder.jpg' && process.env.NODE_ENV === 'development') {
    console.warn('transformStrapiBannerToAppBanner - Nenhuma imagem válida encontrada para o banner:', strapiBanner.documentId || strapiBanner.id)
  }

  // Obter link (pode ser string ou media)
  let link = '/'
  const linkData = strapiBanner.attributes.Link
  
  if (typeof linkData === 'string' && linkData.trim() !== '') {
    link = linkData
  } else if (linkData && (linkData as any).url) {
    // Se for um objeto media, tentar obter a URL
    link = getStrapiMediaUrl(linkData as any) || '/'
  }
  
  // Determinar texto do botão baseado no Local
  const local = strapiBanner.attributes.Local || 'Topo-Home'
  let buttonText = 'Ver mais'
  let buttonLink = link

  // Texto do botão baseado no local
  switch (local) {
    case 'Topo-Home':
      buttonText = 'Ver Produtos'
      break
    case 'Promocional':
      buttonText = 'Ver Oferta'
      break
    case 'Rodape':
      buttonText = 'Saiba Mais'
      break
    default:
      buttonText = 'Ver mais'
  }

  return {
    id: strapiBanner.documentId || strapiBanner.id?.toString() || '',
    image: imagemUrl,
    title: `Banner ${local}`,
    description: local === 'Promocional' ? 'Oferta especial' : 'Confira nossos produtos',
    buttonText: buttonText,
    buttonLink: buttonLink
  }
}

/**
 * Transforma array de banners do Strapi
 */
export function transformStrapiBannersToAppBanners(strapiBanners: StrapiBanner[]): AppBanner[] {
  if (!Array.isArray(strapiBanners)) {
    console.warn('transformStrapiBannersToAppBanners: entrada não é um array', strapiBanners)
    return []
  }

  return strapiBanners
    .filter(banner => banner != null && banner.publishedAt !== null) // Filtrar apenas banners publicados
    .map(transformStrapiBannerToAppBanner)
    .filter(banner => banner.id && banner.image !== '/images/placeholder.jpg') // Filtrar banners inválidos
}

