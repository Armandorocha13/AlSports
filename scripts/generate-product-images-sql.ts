/**
 * Script para gerar SQL de inserção de imagens de produtos
 * 
 * Este script:
 * 1. Lê os produtos hardcoded que têm caminhos de imagens
 * 2. Busca os produtos correspondentes no banco de dados
 * 3. Gera INSERT statements SQL para a tabela product_images
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import {
    allProducts as hardcodedProducts
} from '../lib/data/index'

config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_ROLE_KEY)) {
  console.error('❌ Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY são obrigatórias')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)

/**
 * Normaliza string para comparação
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Escapa string para SQL
 */
function escapeSql(str: string): string {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}

/**
 * Função principal
 */
async function generateSQL() {
  console.log('🚀 Iniciando geração de SQL para imagens de produtos...\n')

  try {
    // 1. Buscar todos os produtos do banco
    console.log('📦 Buscando produtos do banco de dados...')
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, slug')
      .order('name')

    if (dbError) {
      console.error('❌ Erro ao buscar produtos:', dbError)
      throw dbError
    }

    if (!dbProducts || dbProducts.length === 0) {
      console.error('❌ Nenhum produto encontrado no banco de dados!')
      console.error('💡 Execute primeiro o script de migração de produtos')
      process.exit(1)
    }

    console.log(`✅ Encontrados ${dbProducts.length} produtos no banco\n`)

    // 2. Criar mapa de produtos do banco por nome normalizado
    const dbProductsMap = new Map<string, string>()
    dbProducts.forEach((prod: any) => {
      const normalizedName = normalizeString(prod.name)
      if (!dbProductsMap.has(normalizedName)) {
        dbProductsMap.set(normalizedName, prod.id)
      }
    })

    // 3. Processar produtos hardcoded e gerar SQL
    console.log('🔄 Processando produtos hardcoded e gerando SQL...\n')
    
    const sqlStatements: string[] = []
    let matchedCount = 0
    let unmatchedCount = 0

    sqlStatements.push(`-- =====================================================`)
    sqlStatements.push(`-- SQL para inserção de imagens de produtos`)
    sqlStatements.push(`-- Gerado em: ${new Date().toISOString()}`)
    sqlStatements.push(`-- Total de produtos hardcoded: ${hardcodedProducts.length}`)
    sqlStatements.push(`-- =====================================================\n`)
    sqlStatements.push(`BEGIN;\n`)

    // Processar cada produto hardcoded
    for (let i = 0; i < hardcodedProducts.length; i++) {
      const product = hardcodedProducts[i] as any
      const normalizedName = normalizeString(product.name)

      // Tentar encontrar produto no banco
      const productId = dbProductsMap.get(normalizedName)

      if (!productId) {
        console.log(`⚠️  Produto não encontrado no banco: ${product.name}`)
        unmatchedCount++
        continue
      }

      matchedCount++

      // Coletar todas as imagens do produto
      const images: string[] = []

      // Imagem principal
      if (product.image) {
        images.push(product.image)
      }

      // Imagens adicionais
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img: string) => {
          if (img && !images.includes(img)) {
            images.push(img)
          }
        })
      }

      // Se não houver imagens, pular
      if (images.length === 0) {
        console.log(`⚠️  Produto sem imagens: ${product.name}`)
        continue
      }

      // Gerar INSERT para cada imagem
      images.forEach((imageUrl, imgIndex) => {
        const isPrimary = imgIndex === 0
        const sortOrder = imgIndex

        sqlStatements.push(`-- Produto: ${product.name}`)
        sqlStatements.push(`-- Imagem ${imgIndex + 1}/${images.length}: ${imageUrl}`)
        sqlStatements.push(`INSERT INTO public.product_images (`)
        sqlStatements.push(`  product_id,`)
        sqlStatements.push(`  image_url,`)
        sqlStatements.push(`  alt_text,`)
        sqlStatements.push(`  sort_order,`)
        sqlStatements.push(`  is_primary`)
        sqlStatements.push(`) VALUES (`)
        sqlStatements.push(`  ${escapeSql(productId)},`)
        sqlStatements.push(`  ${escapeSql(imageUrl)},`)
        sqlStatements.push(`  ${escapeSql(product.name || null)},`)
        sqlStatements.push(`  ${sortOrder},`)
        sqlStatements.push(`  ${isPrimary}`)
        sqlStatements.push(`) ON CONFLICT DO NOTHING;`)
        sqlStatements.push(``)
      })

      console.log(`[${i + 1}/${hardcodedProducts.length}] ✅ ${product.name} - ${images.length} imagem(ns)`)
    }

    sqlStatements.push(`COMMIT;`)
    sqlStatements.push(``)
    sqlStatements.push(`-- =====================================================`)
    sqlStatements.push(`-- Estatísticas:`)
    sqlStatements.push(`--   Produtos encontrados: ${matchedCount}`)
    sqlStatements.push(`--   Produtos não encontrados: ${unmatchedCount}`)
    sqlStatements.push(`-- =====================================================`)

    // Salvar arquivo SQL
    const outputPath = path.join(process.cwd(), 'database', 'migrations', '011_insert_product_images.sql')
    const outputDir = path.dirname(outputPath)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8')

    console.log(`\n✅ SQL gerado com sucesso!`)
    console.log(`📄 Arquivo: ${outputPath}`)
    console.log(`📊 Estatísticas:`)
    console.log(`   - Produtos encontrados: ${matchedCount}`)
    console.log(`   - Produtos não encontrados: ${unmatchedCount}`)
    console.log(`\n💡 Próximos passos:`)
    console.log(`   1. Abra o arquivo ${outputPath}`)
    console.log(`   2. Revise os INSERT statements`)
    console.log(`   3. Execute no SQL Editor do Supabase`)

  } catch (error) {
    console.error('❌ Erro ao gerar SQL:', error)
    process.exit(1)
  }
}

generateSQL()

