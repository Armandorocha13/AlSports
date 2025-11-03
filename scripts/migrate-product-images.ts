/**
 * Script para migrar imagens de produtos da pasta public/images para a tabela product_images
 * 
 * Este script:
 * 1. Busca todos os produtos do banco de dados
 * 2. Tenta fazer match com as imagens na pasta public/images
 * 3. Insere as imagens na tabela product_images vinculando ao product_id
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as fs from 'fs'
import { glob as globAsync } from 'glob'
import * as path from 'path'
import {
    allProducts as hardcodedProducts
} from '../lib/data/index'

// Carregar variáveis de ambiente
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  config({ path: envPath })
} else {
  // Tentar também .env se .env.local não existir
  config()
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('❌ Variável NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL não encontrada!')
  process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_ANON_KEY) {
  console.error('❌ Variável SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada!')
  console.error('💡 Verifique se o arquivo .env.local existe e contém as variáveis necessárias')
  process.exit(1)
}

// Usar service_role key se disponível (mais permissões), senão usar anon key
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.error('❌ Nenhuma chave do Supabase encontrada!')
  console.error('💡 Configure SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local')
  process.exit(1)
}

if (supabaseKey.length < 50) {
  console.warn('⚠️  A chave do Supabase parece muito curta. Verifique se está completa.')
}

const supabase = createClient(SUPABASE_URL, supabaseKey)

console.log(`✅ Supabase configurado: ${SUPABASE_URL.substring(0, 30)}...`)
console.log(`✅ Usando chave: ${SUPABASE_SERVICE_ROLE_KEY ? 'Service Role' : 'Anon'} (${supabaseKey.substring(0, 10)}...)\n`)

// Mapeamento de categorias para pastas de imagens
const categoryImageMap: Record<string, string[]> = {
  'futebol': ['Futebol'],
  'nba': ['NBA'],
  'nfl': ['NFL'],
  'infantis': ['ConjuntosInfantis'],
  'acessorios': ['Acessorios'],
  'roupas-treino': ['ConjuntoTreino']
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
 * Normaliza string para comparação (remove acentos, espaços, etc)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Busca imagens relacionadas a um produto
 * Primeiro tenta usar os dados hardcoded, depois faz match por nome
 */
function findImagesForProduct(
  productName: string, 
  productSlug: string, 
  imagesMap: Map<string, string[]>,
  hardcodedProductsMap: Map<string, { image: string; images?: string[] }>
): string[] {
  const productNormalized = normalizeString(productName)
  
  // 1. Tentar encontrar nas imagens hardcoded (mais preciso)
  const hardcodedProduct = hardcodedProductsMap.get(productNormalized)
  if (hardcodedProduct) {
    const images: string[] = []
    
    // Adicionar imagem principal
    if (hardcodedProduct.image) {
      images.push(hardcodedProduct.image)
    }
    
    // Adicionar outras imagens
    if (hardcodedProduct.images && Array.isArray(hardcodedProduct.images)) {
      hardcodedProduct.images.forEach(img => {
        if (img && !images.includes(img)) {
          images.push(img)
        }
      })
    }
    
    if (images.length > 0) {
      return images
    }
  }
  
  // 2. Se não encontrou nos hardcoded, fazer match por nome
  const matchedImages: Array<{ path: string; score: number }> = []
  const slugNormalized = normalizeString(productSlug)
  
  // Buscar em todas as pastas
  imagesMap.forEach((images, folderName) => {
    images.forEach(imagePath => {
      const imageName = path.basename(imagePath, path.extname(imagePath))
      const imageNormalized = normalizeString(imageName)
      let score = 0
      
      // Match com nome do produto
      if (productNormalized.includes(imageNormalized) || imageNormalized.includes(productNormalized)) {
        score = 100
      } else {
        // Match parcial com palavras principais
        const productWords = productNormalized.split(/\s+/).filter(w => w.length > 3)
        const imageWords = imageNormalized.split(/\s+/).filter(w => w.length > 3)
        
        let matches = 0
        productWords.forEach(pw => {
          if (imageWords.some(iw => iw.includes(pw) || pw.includes(iw))) {
            matches++
          }
        })
        
        score = productWords.length > 0 ? (matches / productWords.length) * 100 : 0
      }
      
      // Bonus se o slug também match
      if (slugNormalized && imageNormalized.includes(slugNormalized)) {
        score += 20
      }
      
      if (score > 30) {
        matchedImages.push({ path: imagePath, score })
      }
    })
  })
  
  // Ordenar por score e retornar as melhores (top 5)
  return matchedImages
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(img => img.path)
}

/**
 * Busca todas as imagens na pasta public/images
 */
async function getAllImages(): Promise<Map<string, string[]>> {
  const imagesMap = new Map<string, string[]>()
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ Pasta public/images não encontrada!')
    return imagesMap
  }

  // Buscar todas as imagens recursivamente
  const imageFiles = await globAsync('**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    cwd: imagesDir,
    absolute: false
  })

  // Agrupar por categoria/pasta
  imageFiles.forEach(file => {
    const parts = file.split(path.sep)
    if (parts.length > 0) {
      const categoryFolder = parts[0]
      
      // Ignorar pastas que não são de produtos
      if (categoryFolder !== 'Banners' && categoryFolder !== 'Logo') {
        if (!imagesMap.has(categoryFolder)) {
          imagesMap.set(categoryFolder, [])
        }
        
        // Caminho relativo começando com /images
        const relativePath = `/images/${file.replace(/\\/g, '/')}`
        imagesMap.get(categoryFolder)!.push(relativePath)
      }
    }
  })

  return imagesMap
}

/**
 * Busca produtos do banco de dados
 */
async function getProductsFromDatabase(): Promise<any[]> {
  console.log('🔍 Testando conexão com Supabase...')
  
  // Testar conexão primeiro
  const { data: testData, error: testError } = await supabase
    .from('products')
    .select('id')
    .limit(1)

  if (testError) {
    console.error('❌ Erro ao testar conexão:', testError)
    if (testError.message?.includes('Invalid API key')) {
      console.error('\n💡 Problema: Chave da API inválida!')
      console.error('   Verifique se:')
      console.error('   1. A variável NEXT_PUBLIC_SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY está correta')
      console.error('   2. A chave não está expirada ou revogada')
      console.error('   3. O arquivo .env.local está no diretório raiz do projeto')
      console.error(`   4. A URL do Supabase está correta: ${SUPABASE_URL?.substring(0, 50)}...`)
    }
    throw testError
  }

  console.log('✅ Conexão com Supabase estabelecida!\n')
  console.log('📦 Buscando produtos do banco de dados...')

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, category_id, subcategory_id')
    .order('name')

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    throw error
  }

  return data || []
}

/**
 * Busca categorias e subcategorias para fazer o mapeamento
 */
async function getCategoryMapping(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  
  // Buscar categorias
  const { data: categorias } = await supabase
    .from('categorias')
    .select('id, nome')
  
  if (categorias) {
    categorias.forEach(cat => {
      map.set(cat.id.toString(), cat.nome.toLowerCase())
    })
  }
  
  return map
}

/**
 * Insere imagens na tabela product_images
 */
async function insertProductImage(productId: string, imageUrl: string, isPrimary: boolean = false, sortOrder: number = 0): Promise<boolean> {
  try {
    // Verificar se a imagem já existe
    const { data: existing } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', productId)
      .eq('image_url', imageUrl)
      .maybeSingle()
    
    if (existing) {
      return false // Já existe
    }

    const { error } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: imageUrl,
        alt_text: null,
        sort_order: sortOrder,
        is_primary: isPrimary
      })

    if (error) {
      console.error(`  ❌ Erro ao inserir imagem ${imageUrl}:`, error.message)
      return false
    }

    return true
  } catch (error: any) {
    console.error(`  ❌ Erro ao inserir imagem ${imageUrl}:`, error.message)
    return false
  }
}


/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando migração de imagens de produtos...\n')

  try {
    // 1. Buscar produtos do banco
    console.log('📦 Buscando produtos do banco de dados...')
    const products = await getProductsFromDatabase()
    console.log(`✅ Encontrados ${products.length} produtos\n`)

    // 2. Buscar todas as imagens
    console.log('🖼️  Buscando imagens na pasta public/images...')
    const imagesMap = await getAllImages()
    const totalImages = Array.from(imagesMap.values()).flat().length
    console.log(`✅ Encontradas ${totalImages} imagens em ${imagesMap.size} pastas\n`)

    // 3. Buscar mapeamento de categorias
    console.log('📂 Buscando mapeamento de categorias...')
    const categoryMap = await getCategoryMapping()
    console.log(`✅ ${categoryMap.size} categorias encontradas\n`)

    // 3.5. Mapear produtos hardcoded por nome (para encontrar imagens exatas)
    const hardcodedProductsMap = new Map<string, { image: string; images?: string[] }>()
    hardcodedProducts.forEach((prod: any) => {
      const normalizedName = normalizeString(prod.name)
      if (!hardcodedProductsMap.has(normalizedName)) {
        hardcodedProductsMap.set(normalizedName, {
          image: prod.image || '',
          images: prod.images || []
        })
      }
    })
    console.log(`✅ ${hardcodedProductsMap.size} produtos hardcoded mapeados\n`)

    // 4. Para cada produto, tentar encontrar e inserir imagens
    console.log('🔄 Processando produtos e vinculando imagens...\n')
    
    let totalInserted = 0
    let totalSkipped = 0
    let totalErrors = 0

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      console.log(`[${i + 1}/${products.length}] Processando: ${product.name}`)

      const matchedImages = findImagesForProduct(
        product.name, 
        product.slug || generateSlug(product.name), 
        imagesMap,
        hardcodedProductsMap
      )

      if (matchedImages.length === 0) {
        console.log(`  ⚠️  Nenhuma imagem encontrada para este produto`)
        totalSkipped++
        continue
      }

      console.log(`  ✅ Encontradas ${matchedImages.length} imagem(ns) potencial(is)`)

      // Inserir cada imagem
      for (let j = 0; j < matchedImages.length; j++) {
        const imageUrl = matchedImages[j]
        const isPrimary = j === 0 // Primeira imagem é primary
        
        const inserted = await insertProductImage(product.id, imageUrl, isPrimary, j)
        
        if (inserted) {
          console.log(`    ✅ Inserida: ${imageUrl} ${isPrimary ? '(PRIMARY)' : ''}`)
          totalInserted++
        } else {
          console.log(`    ⏭️  Já existe: ${imageUrl}`)
        }
      }
    }

    console.log('\n✅ Migração concluída!')
    console.log(`📊 Estatísticas:`)
    console.log(`   - Imagens inseridas: ${totalInserted}`)
    console.log(`   - Produtos sem imagens: ${totalSkipped}`)
    console.log(`   - Erros: ${totalErrors}`)

  } catch (error) {
    console.error('❌ Erro ao executar migração:', error)
    process.exit(1)
  }
}

main()

