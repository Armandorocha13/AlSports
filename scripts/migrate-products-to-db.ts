// ========================================================================
// SCRIPT DE MIGRAÇÃO: Produtos hardcoded -> Banco de dados
// ========================================================================
// Este script lê todos os produtos dos arquivos TypeScript em lib/data
// e os insere na tabela products do Supabase

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import {
	acessoriosProducts,
	futebolProducts,
	infantisProducts,
	nbaProducts,
	nflProducts,
	roupasTreinoProducts
} from '../lib/data/index'

config({ path: '.env.local' })

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas!')
  console.error('   Crie um arquivo .env.local com essas variáveis.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Função para gerar slug a partir do nome
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim()
}

// Combinar todos os produtos
const allProducts = [
  ...futebolProducts,
  ...roupasTreinoProducts,
  ...nbaProducts,
  ...nflProducts,
  ...infantisProducts,
  ...acessoriosProducts
]

// Mapeamento de categorias
const categoryMap: Record<string, string> = {
  'futebol': 'FUTEBOL',
  'roupas-de-treino': 'ROUPAS DE TREINO',
  'roupa-de-treino': 'ROUPAS DE TREINO',
  'nba': 'NBA',
  'nfl': 'NFL',
  'infantil': 'INFANTIL',
  'infantis': 'INFANTIS',
  'acessorios': 'ACESSÓRIOS',
  'acessórios': 'ACESSÓRIOS'
}

// Cache de categorias para evitar múltiplas queries
let categoriesCache: Array<{ id: string; nome: string }> | null = null

// Buscar todas as categorias uma vez
async function loadCategoriesCache() {
  if (categoriesCache) return categoriesCache
  
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome')
    .limit(100)
  
  if (error || !data) {
    console.error(`❌ Erro ao buscar categorias:`, error?.message)
    return []
  }
  
  categoriesCache = data.map(c => ({ id: c.id.toString(), nome: c.nome }))
  return categoriesCache
}

// Buscar categoria pelo slug ou nome
async function getCategoryId(categorySlug: string): Promise<string | null> {
  const categories = await loadCategoriesCache()
  
  if (categories.length === 0) {
    console.warn(`⚠️  Nenhuma categoria encontrada no banco`)
    return null
  }
  
  const categoryName = categoryMap[categorySlug.toLowerCase()] || categorySlug.toUpperCase()
  
  // Buscar por nome similar
  const category = categories.find(c => {
    const catName = c.nome.toUpperCase()
    const searchName = categoryName.toUpperCase()
    return catName === searchName || 
           catName.includes(searchName) || 
           searchName.includes(catName)
  })
  
  if (!category) {
    console.warn(`⚠️  Categoria não encontrada: ${categorySlug} (procurando: ${categoryName})`)
    console.log(`   Categorias disponíveis:`, categories.map(c => c.nome).join(', '))
    return null
  }
  
  return category.id
}

// Cache de subcategorias por categoria
const subcategoriesCache: Record<string, Array<{ id: string; nome: string }>> = {}

// Buscar subcategoria pelo slug
async function getSubcategoryId(subcategorySlug: string, categoryId: string): Promise<string | null> {
  if (!categoryId || !subcategorySlug) return null
  
  const categoryIdNum = parseInt(categoryId)
  if (isNaN(categoryIdNum)) return null
  
  // Usar cache se disponível
  if (!subcategoriesCache[categoryId]) {
    const { data: subcategories, error } = await supabase
      .from('subcategorias')
      .select('id, nome')
      .eq('id_categoria', categoryIdNum)
    
    if (error || !subcategories) {
      console.warn(`⚠️  Erro ao buscar subcategorias para categoria ${categoryId}:`, error?.message)
      return null
    }
    
    subcategoriesCache[categoryId] = subcategories.map(s => ({ id: s.id.toString(), nome: s.nome }))
  }
  
  const subcategories = subcategoriesCache[categoryId]
  
  if (subcategories.length === 0) {
    console.warn(`⚠️  Nenhuma subcategoria encontrada para categoria ${categoryId}`)
    return null
  }
  
  // Buscar por slug ou nome similar (com múltiplas estratégias)
  const slugLower = subcategorySlug.toLowerCase()
  
  // Estratégia 1: Match exato do slug
  let subcategory = subcategories.find(sub => {
    const subName = sub.nome.toLowerCase().replace(/\s+/g, '-')
    return subName === slugLower || slugLower === subName
  })
  
  // Estratégia 2: Buscar por palavras-chave comuns (ex: "temporada-25-26" -> "25/26")
  if (!subcategory) {
    const keywords = slugLower.split('-')
    const yearPattern = /\d{2}\/?\d{2}/
    const yearMatch = slugLower.match(yearPattern)
    
    if (yearMatch) {
      // Buscar subcategorias que contenham o ano
      subcategory = subcategories.find(sub => {
        const subName = sub.nome.toLowerCase()
        return subName.includes(yearMatch[0].replace('/', '')) || 
               subName.includes(yearMatch[0].replace(/\//, '/'))
      })
    }
  }
  
  // Estratégia 3: Buscar por palavras-chave (ex: "temporada" -> qualquer coisa com temporada)
  if (!subcategory) {
    const keyWords = [
      'temporada', 'lançamento', 'versao', 'versão', 'jogador', 'feminina', 'retro', 'regata',
      'kit', 'infantil', 'promoção', 'promocao', 'nfl', 'nba', 'boné', 'bonés', 'meias', 
      'meia', 'short', 'shorts', 'masculino', 'feminino', 'casuais', 'times', 'camisa',
      'agasalho', 'calça', 'calca', 'casaco', 'corta', 'vento', 'silk', 'bordada',
      'chinês', 'europeu', 'brasileiro', 'completo', 'pedido', 'extra'
    ]
    const matchedKeyword = keyWords.find(kw => slugLower.includes(kw))
    
    if (matchedKeyword) {
      subcategory = subcategories.find(sub => {
        const subName = sub.nome.toLowerCase()
        return subName.includes(matchedKeyword) || 
               (matchedKeyword === 'versao' && subName.includes('versão')) ||
               (matchedKeyword === 'versão' && subName.includes('versao')) ||
               (matchedKeyword === 'promocao' && subName.includes('promoção')) ||
               (matchedKeyword === 'promoção' && subName.includes('promocao'))
      })
    }
  }
  
  // Estratégia 3.5: Mapeamentos específicos conhecidos
  if (!subcategory) {
    const specificMappings: Record<string, string[]> = {
      // Temporadas e lançamentos
      'temporada-25-26': ['lançamento (25/26)', 'lançamento 25/26', 'temporada 25/26', '25/26', 'lançamento'],
      'temporada-24-25': ['temporada 24/25', '24/25'],
      'temporada-23-24': ['temporada 23/24', '23/24'],
      
      // Futebol - versões
      'versao-jogador': ['versão jogador', 'versao jogador'],
      'retro': ['retrô', 'retro'],
      'versao-feminina': ['versão feminina', 'versao feminina'],
      'regatas': ['regatas'],
      
      // Futebol - shorts
      'shorts-masculino': ['short masculino'],
      'shorts-feminino': ['short feminino'],
      
      // Infantis
      'kit-infantil-25-26': ['kit infantil 25/26', 'kit infantil 25-26'],
      'kit-infantil-24-25': ['kit infantil 24/25', 'kit infantil 24-25'],
      'kit-infantil-retro': ['kit infantil retrô', 'kit infantil retro'],
      'kit-infantil': ['kit infantil'],
      
      // Acessórios
      'bones': ['bonés times', 'bonés casuais', 'boné times', 'boné casuais', 'bones times', 'bones casuais'],
      'meias': ['meias times', 'meias casuais', 'meia times', 'meia casuais'],
      
      // NFL
      'camisas-nfl': ['nfl (camisas)', 'nfl', 'camisas nfl'],
      
      // NBA
      'camisas-nba': ['nba silk', 'nba bordada', 'nba', 'camisas nba'],
      
      // Roupas de treino
      'camisa-short': ['camisa + short', 'camisa short'],
      'regata-short': ['regata + short', 'regata short'],
      'calca': ['calça', 'calca'],
      'casaco': ['casaco'],
      'corta-vento': ['corta vento', 'corta-vento'],
      
      // Outros
      'promocao': ['promoção', 'promocao'],
      'agasalho-completo': ['agasalho completo'],
      'pedido-extra': ['pedido extra'],
      'conjunto-time-chines': ['conjunto time chinês', 'kit europeu', 'kit brasileiro']
    }
    
    const mappings = specificMappings[slugLower]
    if (mappings) {
      for (const mapping of mappings) {
        subcategory = subcategories.find(sub => {
          const subName = sub.nome.toLowerCase().trim()
          const mappingLower = mapping.toLowerCase().trim()
          
          // Match exato
          if (subName === mappingLower) return true
          
          // Inclusão simples
          if (subName.includes(mappingLower) || mappingLower.includes(subName)) return true
          
          // Normalizar espaços e caracteres especiais
          const subNameNormalized = subName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
          const mappingNormalized = mappingLower.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
          if (subNameNormalized.includes(mappingNormalized) || mappingNormalized.includes(subNameNormalized)) return true
          
          return false
        })
        if (subcategory) break
      }
    }
  }
  
  // Estratégia 4: Busca por inclusão simples (normalizada)
  if (!subcategory) {
    const slugNormalized = slugLower.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
    subcategory = subcategories.find(sub => {
      const subName = sub.nome.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
      return subName.includes(slugNormalized) || slugNormalized.includes(subName) ||
             slugLower.includes(subName.replace(/\s+/g, '-')) || 
             subName.includes(slugLower.replace(/-/g, ' '))
    })
  }
  
  if (!subcategory) {
    console.warn(`⚠️  Subcategoria não encontrada: ${subcategorySlug}`)
    console.log(`   Subcategorias disponíveis:`, subcategories.map(s => s.nome).join(', '))
    return null
  }
  
  return subcategory.id
}

// Mapear produto do formato hardcoded para formato do banco
async function mapProductToDatabase(product: any) {
  const categoryId = await getCategoryId(product.category)
  
  // Se não encontrou categoria, tentar buscar na tabela categories (schema) como fallback
  let finalCategoryId: string | null = categoryId
  
  if (!finalCategoryId) {
    // Tentar buscar na tabela categories (UUID) usando o slug
    const { data: categoryFallback } = await supabase
      .from('categories')
      .select('id')
      .ilike('slug', `%${product.category}%`)
      .limit(1)
      .maybeSingle()
    
    if (categoryFallback) {
      finalCategoryId = categoryFallback.id
      console.log(`✅ Categoria encontrada na tabela categories: ${categoryFallback.id}`)
    }
  }
  
  const subcategoryId = finalCategoryId ? await getSubcategoryId(product.subcategory, finalCategoryId) : null
  
  // Se não encontrou subcategoria na tabela subcategorias, tentar subcategories (schema)
  let finalSubcategoryId: string | null = subcategoryId
  
  if (!finalSubcategoryId && finalCategoryId) {
    const { data: subcategoryFallback } = await supabase
      .from('subcategories')
      .select('id')
      .eq('category_id', finalCategoryId)
      .ilike('slug', `%${product.subcategory}%`)
      .limit(1)
      .maybeSingle()
    
    if (subcategoryFallback) {
      finalSubcategoryId = subcategoryFallback.id
      console.log(`✅ Subcategoria encontrada na tabela subcategories: ${subcategoryFallback.id}`)
    }
  }
  
  // Calcular preço base (usar o maior preço das faixas ou preço direto)
  let basePrice = product.price || 0
  if (product.priceRanges && product.priceRanges.length > 0) {
    basePrice = Math.max(...product.priceRanges.map((r: any) => r.price))
  }
  
  const wholesalePrice = product.wholesalePrice || basePrice
  
  // Criar objeto de produto com apenas campos que existem na tabela real
  // IMPORTANTE: NÃO incluir 'id' - deixar o banco gerar UUID automaticamente
  const productData: any = {
    name: product.name,
    slug: generateSlug(product.name),
    description: product.description || null,
    base_price: basePrice, // Usar base_price ao invés de price
    category_id: finalCategoryId, // TEXT (ID da tabela categorias como string)
    is_active: true
  }
  
  // Adicionar campos opcionais
  if (finalSubcategoryId) {
    productData.subcategory_id = finalSubcategoryId // TEXT (ID da tabela subcategorias como string)
  }
  
  if (wholesalePrice && wholesalePrice !== basePrice) {
    productData.wholesale_price = wholesalePrice
  }
  
  if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
    productData.sizes = product.sizes
  }
  
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
    productData.colors = product.colors
  }
  
  if (product.materials && Array.isArray(product.materials) && product.materials.length > 0) {
    productData.materials = product.materials
  }
  
  productData.is_featured = product.featured || false
  productData.is_on_sale = product.onSale || false
  productData.stock_quantity = 100 // Valor padrão
  productData.min_stock = 10 // Valor padrão
  
  // SKU será gerado no insertProduct com base no _originalId
  
  // created_at e updated_at são gerados automaticamente pelo banco
  
  // Campos extras para mapeamento (não serão inseridos no banco)
  return {
    ...productData,
    _originalId: product.id,
    _image: product.image,
    _priceRanges: product.priceRanges || []
  }
}

// Inserir produto no banco
async function insertProduct(productData: any) {
  // Separar dados do produto dos dados extras
  const { _originalId, _image, _priceRanges, ...allData } = productData
  
  // Criar objeto limpo com apenas campos essenciais
  // NÃO incluir 'id' - deixar o banco gerar automaticamente (UUID)
  // Usar 'base_price' ao invés de 'price'
  const dbProductData: any = {
    name: allData.name,
    slug: allData.slug, // Adicionar slug gerado
    description: allData.description || null,
    base_price: allData.base_price, // Usar base_price ao invés de price
    category_id: allData.category_id || null,
    subcategory_id: allData.subcategory_id || null,
    is_active: allData.is_active !== undefined ? allData.is_active : true
  }
  
  // Adicionar campos opcionais apenas se existirem
  if (allData.wholesale_price !== undefined && allData.wholesale_price !== null) {
    dbProductData.wholesale_price = allData.wholesale_price
  }
  if (allData.sku) {
    dbProductData.sku = allData.sku
  }
  if (allData.sizes && Array.isArray(allData.sizes) && allData.sizes.length > 0) {
    dbProductData.sizes = allData.sizes
  }
  if (allData.colors && Array.isArray(allData.colors) && allData.colors.length > 0) {
    dbProductData.colors = allData.colors
  }
  if (allData.materials && Array.isArray(allData.materials) && allData.materials.length > 0) {
    dbProductData.materials = allData.materials
  }
  if (allData.is_featured !== undefined) {
    dbProductData.is_featured = allData.is_featured
  }
  if (allData.is_on_sale !== undefined) {
    dbProductData.is_on_sale = allData.is_on_sale
  }
  if (allData.stock_quantity !== undefined) {
    dbProductData.stock_quantity = allData.stock_quantity
  }
  if (allData.min_stock !== undefined) {
    dbProductData.min_stock = allData.min_stock
  }
  
  // Gerar SKU se não foi fornecido
  if (!dbProductData.sku && _originalId) {
    dbProductData.sku = `SKU-${_originalId}`
  }
  
  // Verificar se produto já existe (pelo SKU ou slug)
  // Verificar primeiro por SKU, depois por slug
  let existing = null
  if (dbProductData.sku) {
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('sku', dbProductData.sku)
      .maybeSingle()
    existing = data
  }
  
  if (!existing && dbProductData.slug) {
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('slug', dbProductData.slug)
      .maybeSingle()
    existing = data
  }
  
  if (existing) {
    console.log(`⏭️  Produto já existe (pulando): ${productData.name}`)
    return { _skipped: true, id: existing.id }
  }
  
  // Inserir produto
  const { data: product, error } = await supabase
    .from('products')
    .insert(dbProductData)
    .select()
    .single()
  
  if (error) {
    console.error(`❌ Erro ao inserir produto "${productData.name}":`, error.message)
    if (error.message.includes('column') || error.message.includes('schema cache')) {
      console.error(`💡 Dica: A tabela products pode não ter algumas colunas. Verifique o schema.`)
    }
    return null
  }
  
  console.log(`✅ Produto inserido: ${productData.name} (ID: ${product.id})`)
  
  // Inserir imagem
  if (_image) {
    const { error: imgError } = await supabase
      .from('product_images')
      .insert({
        product_id: product.id,
        image_url: _image,
        alt_text: productData.name,
        sort_order: 0,
        is_primary: true
      })
    
    if (imgError) {
      console.warn(`⚠️  Erro ao inserir imagem para "${productData.name}":`, imgError.message)
    }
  }
  
  // Inserir faixas de preço
  if (_priceRanges && _priceRanges.length > 0) {
    const priceRangeData = _priceRanges.map((range: any) => ({
      product_id: product.id,
      min_quantity: range.min,
      max_quantity: range.max || null,
      price: range.price
    }))
    
    const { error: priceError } = await supabase
      .from('price_ranges')
      .insert(priceRangeData)
    
    if (priceError) {
      console.warn(`⚠️  Erro ao inserir faixas de preço para "${productData.name}":`, priceError.message)
    }
  }
  
  return product
}

// Função principal
async function main() {
  console.log('🚀 Iniciando migração de produtos...\n')
  
  try {
    // Verificar conexão
    const { error: testError } = await supabase.from('products').select('id').limit(1)
    if (testError) {
      console.error('❌ Erro de conexão com Supabase:', testError.message)
      process.exit(1)
    }
    
    console.log(`📦 Total de produtos encontrados: ${allProducts.length}\n`)
    
    // Processar cada produto
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0
    
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i]
      console.log(`\n[${i + 1}/${allProducts.length}] Processando: ${product.name}`)
      
      try {
        const mappedProduct = await mapProductToDatabase(product)
        if (mappedProduct && mappedProduct.category_id) {
          const inserted = await insertProduct(mappedProduct)
          if (inserted) {
            if ((inserted as any)._skipped) {
              skippedCount++
            } else if (inserted.id) {
              successCount++
            } else {
              errorCount++
            }
          } else {
            errorCount++
          }
        } else {
          console.warn(`⚠️  Produto pulado: categoria não encontrada`)
          skippedCount++
        }
      } catch (error: any) {
        console.error(`❌ Erro ao processar produto:`, error.message)
        errorCount++
      }
      
      // Pequeno delay para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMO DA MIGRAÇÃO')
    console.log('='.repeat(60))
    console.log(`✅ Produtos inseridos com sucesso: ${successCount}`)
    console.log(`⏭️  Produtos pulados (já existentes): ${skippedCount}`)
    console.log(`❌ Produtos com erro: ${errorCount}`)
    console.log(`📦 Total processado: ${allProducts.length}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  }
}

// Executar
main().catch(console.error)

