// ========================================================================
// SCRIPT: Gerar SQL para inserção de produtos no Supabase
// ========================================================================
// Este script lê os produtos hardcoded e gera um arquivo SQL
// com INSERT statements que podem ser executados diretamente no Supabase
// ========================================================================

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Função para gerar slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Combinar todos os produtos
const allProducts = [
  ...futebolProducts,
  ...roupasTreinoProducts,
  ...infantisProducts,
  ...nbaProducts,
  ...nflProducts,
  ...acessoriosProducts
]

// Cache de categorias e subcategorias
let categoriesCache: Array<{ id: string; nome: string }> | null = null
const subcategoriesCache: Record<string, Array<{ id: string; nome: string }>> = {}

// Mapeamento de categorias
const categoryMap: Record<string, string> = {
  'futebol': 'FUTEBOL',
  'conjuntos-infantis': 'INFANTIS',
  'infantis': 'INFANTIS',
  'infantil': 'INFANTIS',
  'roupas-treino': 'ROUPAS DE TREINO',
  'treino': 'ROUPAS DE TREINO',
  'nba': 'NBA',
  'nfl': 'NFL',
  'acessorios': 'ACESSÓRIOS',
  'acessórios': 'ACESSÓRIOS'
}

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

async function getCategoryId(categorySlug: string): Promise<string | null> {
  const categories = await loadCategoriesCache()
  if (!categories || categories.length === 0) return null
  
  const slugLower = categorySlug.toLowerCase()
  const mappedName = categoryMap[slugLower] || slugLower.toUpperCase()
  
  const category = categories.find(cat => {
    const catName = cat.nome.toUpperCase()
    return catName.includes(mappedName) || mappedName.includes(catName)
  })
  
  return category ? category.id : null
}

async function getSubcategoryId(subcategorySlug: string, categoryId: string): Promise<string | null> {
  if (!categoryId || !subcategorySlug) return null
  
  const categoryIdNum = parseInt(categoryId)
  if (isNaN(categoryIdNum)) return null
  
  if (!subcategoriesCache[categoryId]) {
    const { data: subcategories, error } = await supabase
      .from('subcategorias')
      .select('id, nome')
      .eq('id_categoria', categoryIdNum)
    
    if (error || !subcategories) {
      return null
    }
    
    subcategoriesCache[categoryId] = subcategories.map(s => ({ id: s.id.toString(), nome: s.nome }))
  }
  
  const subcategories = subcategoriesCache[categoryId]
  if (subcategories.length === 0) return null
  
  const slugLower = subcategorySlug.toLowerCase()
  
  // Buscar subcategoria com múltiplas estratégias
  let subcategory = subcategories.find(sub => {
    const subName = sub.nome.toLowerCase().replace(/\s+/g, '-')
    return subName === slugLower || slugLower === subName
  })
  
  if (!subcategory) {
    const slugNormalized = slugLower.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
    subcategory = subcategories.find(sub => {
      const subName = sub.nome.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
      return subName.includes(slugNormalized) || slugNormalized.includes(subName) ||
             slugLower.includes(subName.replace(/\s+/g, '-')) || 
             subName.includes(slugLower.replace(/-/g, ' '))
    })
  }
  
  return subcategory ? subcategory.id : null
}

// Escapar strings para SQL
function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}

// Gerar SQL para um produto
async function generateProductSQL(product: any, index: number): Promise<string> {
  const slug = generateSlug(product.name)
  return generateProductSQLWithSlug(product, index, slug)
}

// Gerar SQL para um produto com slug específico
async function generateProductSQLWithSlug(product: any, index: number, slug: string): Promise<string> {
  const categoryId = await getCategoryId(product.category)
  const subcategoryId = categoryId ? await getSubcategoryId(product.subcategory, categoryId) : null
  
  // Calcular preços
  let basePrice = product.price || 0
  if (product.priceRanges && product.priceRanges.length > 0) {
    basePrice = Math.max(...product.priceRanges.map((r: any) => r.price))
  }
  const wholesalePrice = product.wholesalePrice || basePrice
  
  const sku = `SKU-${product.id}`
  const description = product.description || null
  
  // Montar array SQL para sizes, colors, materials
  const sizesSql = product.sizes && product.sizes.length > 0 
    ? `ARRAY[${product.sizes.map((s: string) => escapeSql(s)).join(', ')}]`
    : `ARRAY[]::TEXT[]`
  
  const colorsSql = product.colors && product.colors.length > 0
    ? `ARRAY[${product.colors.map((c: string) => escapeSql(c)).join(', ')}]`
    : `ARRAY[]::TEXT[]`
  
  const materialsSql = product.materials && product.materials.length > 0
    ? `ARRAY[${product.materials.map((m: string) => escapeSql(m)).join(', ')}]`
    : `ARRAY[]::TEXT[]`
  
  // category_id e subcategory_id na tabela products são TEXT (não UUID)
  // Se a tabela ainda tiver UUID, precisará ser atualizada primeiro
  // Por enquanto, usamos NULL se não conseguir mapear corretamente
  // ou o valor como string se a coluna for TEXT
  const categoryIdSql = categoryId ? escapeSql(categoryId) : 'NULL'
  const subcategoryIdSql = subcategoryId ? escapeSql(subcategoryId) : 'NULL'
  
  // Se a tabela products ainda usa UUID para category_id, precisamos deixar NULL
  // ou atualizar a tabela primeiro com a migration 007
  
  // Calcular wholesale_price (só incluir se for diferente do base_price)
  const wholesalePriceSql = wholesalePrice !== basePrice ? wholesalePrice.toString() : 'NULL'
  
  const sql = `
-- Produto ${index + 1}: ${product.name}
INSERT INTO public.products (
  name, slug, description, base_price, wholesale_price,
  category_id, subcategory_id, sku, sizes, colors, materials,
  is_active, is_featured, is_on_sale, stock_quantity, min_stock
) VALUES (
  ${escapeSql(product.name)},
  ${escapeSql(slug)},
  ${escapeSql(description)},
  ${basePrice},
  ${wholesalePriceSql},
  ${categoryIdSql},
  ${subcategoryIdSql},
  ${escapeSql(sku)},
  ${sizesSql},
  ${colorsSql},
  ${materialsSql},
  true,
  ${product.featured ? 'true' : 'false'},
  ${product.onSale ? 'true' : 'false'},
  100,
  10
) ON CONFLICT (sku) DO NOTHING;
`
  
  return sql
}

// Função principal
async function generateSQL() {
  console.log('🚀 Iniciando geração de SQL...')
  console.log(`📦 Total de produtos: ${allProducts.length}`)
  
  // Carregar categorias primeiro
  await loadCategoriesCache()
  console.log(`✅ Categorias carregadas: ${categoriesCache?.length || 0}`)
  
  // Gerar slugs únicos para todos os produtos primeiro
  const slugMap = new Map<string, number>()
  const productSlugs: string[] = []
  
  for (const product of allProducts) {
    let baseSlug = generateSlug(product.name)
    let finalSlug = baseSlug
    let counter = 1
    
    // Se o slug já existe, adicionar sufixo numérico
    while (slugMap.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }
    
    slugMap.set(finalSlug, (slugMap.get(finalSlug) || 0) + 1)
    productSlugs.push(finalSlug)
  }
  
  console.log(`✅ Slugs únicos gerados: ${slugMap.size}`)
  
  const sqlStatements: string[] = []
  
  sqlStatements.push(`-- =====================================================`)
  sqlStatements.push(`-- SQL para inserção de produtos`)
  sqlStatements.push(`-- Gerado em: ${new Date().toISOString()}`)
  sqlStatements.push(`-- Total de produtos: ${allProducts.length}`)
  sqlStatements.push(`-- =====================================================\n`)
  sqlStatements.push(`BEGIN;\n`)
  
  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i]
    const uniqueSlug = productSlugs[i]
    console.log(`[${i + 1}/${allProducts.length}] Gerando SQL para: ${product.name} (slug: ${uniqueSlug})`)
    const sql = await generateProductSQLWithSlug(product, i, uniqueSlug)
    sqlStatements.push(sql)
  }
  
  sqlStatements.push(`COMMIT;`)
  
  // Escrever arquivo SQL
  const outputPath = path.join(process.cwd(), 'database', 'migrations', '008_insert_products.sql')
  const sqlContent = sqlStatements.join('\n')
  
  fs.writeFileSync(outputPath, sqlContent, 'utf-8')
  
  console.log(`\n✅ SQL gerado com sucesso!`)
  console.log(`📄 Arquivo: ${outputPath}`)
  console.log(`\n💡 Próximos passos:`)
  console.log(`   1. Abra o arquivo ${outputPath}`)
  console.log(`   2. Revise os dados se necessário`)
  console.log(`   3. Execute no SQL Editor do Supabase`)
}

// Executar
generateSQL().catch(console.error)

