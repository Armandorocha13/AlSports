/**
 * Script para identificar e deletar tabelas não utilizadas no banco de dados
 * 
 * Este script:
 * 1. Analisa o código-fonte para encontrar todas as referências a tabelas
 * 2. Lista todas as tabelas no banco de dados
 * 3. Identifica tabelas que não estão sendo usadas
 * 4. Gera um script SQL para deletar as tabelas não utilizadas (com confirmação)
 */

import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

config({ path: path.join(process.cwd(), '.env.local') })

// Tabelas que sempre devem ser mantidas (tabelas do sistema Supabase)
const SYSTEM_TABLES = [
  'auth.users',
  'auth.sessions',
  'storage.objects',
  'storage.buckets',
  'realtime.schema_migrations'
]

// Tabelas que devem ser mantidas mesmo que não estejam no código
// (podem ser usadas por triggers, stored procedures, etc.)
const RESERVED_TABLES = [
  'profiles',
  'addresses',
  'products',
  'product_images',
  'orders',
  'order_items',
  'order_status_history',
  'payments',
  'whatsapp_orders',
  'settings',
  'categorias',
  'subcategorias'
]

/**
 * Encontra recursivamente todos os arquivos em um diretório
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      // Ignorar node_modules e .next
      if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
      }
    } else {
      // Apenas arquivos TypeScript/JavaScript
      if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        arrayOfFiles.push(filePath)
      }
    }
  })

  return arrayOfFiles
}

/**
 * Encontra todas as referências a tabelas no código
 */
function findTableReferences(): Set<string> {
  const usedTables = new Set<string>()
  
  // Padrões para encontrar referências a tabelas
  const patterns = [
    /\.from\(['"]([^'"]+)['"]\)/g,
    /FROM\s+['"]?([a-z_]+)['"]?/gi,
    /from\s+['"]([^'"]+)['"]/gi,
    /table\s+['"]([^'"]+)['"]/gi,
  ]

  // Diretórios a serem analisados
  const codeDirectories = [
    'app',
    'lib',
    'components',
    'contexts',
    'scripts'
  ]

  console.log('🔍 Analisando código-fonte para encontrar referências a tabelas...')

  for (const dir of codeDirectories) {
    const dirPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(dirPath)) continue
    
    const files = getAllFiles(dirPath)
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8')
        
        for (const regex of patterns) {
          let match
          // Reset regex global state
          regex.lastIndex = 0
          while ((match = regex.exec(content)) !== null) {
            const tableName = match[1]
            // Remover schema prefix se existir (ex: public.products -> products)
            const cleanTableName = tableName.replace(/^(public|auth)\./, '')
            
            // Ignorar strings muito pequenas (provavelmente não são nomes de tabelas)
            if (cleanTableName.length > 2 && /^[a-z_][a-z0-9_]*$/i.test(cleanTableName)) {
              usedTables.add(cleanTableName.toLowerCase())
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️  Erro ao ler arquivo ${file}:`, error)
      }
    }
  }

  // Adicionar tabelas reservadas manualmente
  RESERVED_TABLES.forEach(table => usedTables.add(table.toLowerCase()))

  console.log(`✅ Encontradas ${usedTables.size} tabelas referenciadas no código`)
  console.log(`   Tabelas: ${Array.from(usedTables).sort().join(', ')}`)

  return usedTables
}

/**
 * Lista todas as tabelas definidas no schema.sql
 * (Esta é uma lista baseada no schema conhecido do projeto)
 */
function getAllTablesFromSchema(): string[] {
  // Ler o arquivo schema.sql para encontrar tabelas definidas
  const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
  
  if (!fs.existsSync(schemaPath)) {
    console.warn('⚠️  Arquivo schema.sql não encontrado. Usando lista padrão...')
    return [
      'profiles',
      'addresses',
      'categories',
      'subcategories',
      'categorias',
      'subcategorias',
      'products',
      'product_images',
      'price_ranges',
      'orders',
      'order_items',
      'order_status_history',
      'payments',
      'whatsapp_orders',
      'settings'
    ]
  }

  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
    const tables: string[] = []
    
    // Procurar por CREATE TABLE IF NOT EXISTS public.nome_da_tabela
    const tableRegex = /CREATE TABLE IF NOT EXISTS public\.(\w+)/gi
    let match
    
    while ((match = tableRegex.exec(schemaContent)) !== null) {
      const tableName = match[1].toLowerCase()
      if (!tables.includes(tableName)) {
        tables.push(tableName)
      }
    }

    if (tables.length > 0) {
      return tables.sort()
    }

    // Fallback para lista padrão
    console.warn('⚠️  Não foi possível extrair tabelas do schema.sql. Usando lista padrão...')
    return [
      'profiles',
      'addresses',
      'categories',
      'subcategories',
      'categorias',
      'subcategorias',
      'products',
      'product_images',
      'price_ranges',
      'orders',
      'order_items',
      'order_status_history',
      'payments',
      'whatsapp_orders',
      'settings'
    ]
  } catch (error) {
    console.warn('⚠️  Erro ao ler schema.sql:', error)
    // Fallback para lista padrão
    return [
      'profiles',
      'addresses',
      'categories',
      'subcategories',
      'categorias',
      'subcategorias',
      'products',
      'product_images',
      'price_ranges',
      'orders',
      'order_items',
      'order_status_history',
      'payments',
      'whatsapp_orders',
      'settings'
    ]
  }
}

/**
 * Gera script SQL para deletar tabelas não utilizadas
 */
function generateDeleteScript(unusedTables: string[]): string {
  if (unusedTables.length === 0) {
    return `-- Nenhuma tabela não utilizada encontrada!\n-- Todas as tabelas estão sendo usadas no código.\n`
  }

  const lines = [
    '-- =====================================================',
    '-- SCRIPT PARA DELETAR TABELAS NÃO UTILIZADAS',
    `-- Gerado em: ${new Date().toISOString()}`,
    `-- Total de tabelas a serem deletadas: ${unusedTables.length}`,
    '-- =====================================================',
    '',
    '-- ⚠️  ATENÇÃO: Este script irá DELETAR permanentemente as seguintes tabelas:',
    unusedTables.map(t => `--   - ${t}`).join('\n'),
    '',
    '-- Revise cuidadosamente antes de executar!',
    '',
    'BEGIN;',
    ''
  ]

  // Deletar tabelas na ordem correta (respeitando foreign keys)
  // Primeiro deletar tabelas dependentes, depois tabelas principais
  for (const table of unusedTables) {
    lines.push(`-- Deletar tabela: ${table}`)
    lines.push(`DROP TABLE IF EXISTS public.${table} CASCADE;`)
    lines.push('')
  }

  lines.push('COMMIT;')
  lines.push('')
  lines.push('-- =====================================================')
  lines.push('-- Script concluído')
  lines.push('-- =====================================================')

  return lines.join('\n')
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando análise de tabelas não utilizadas...\n')

  try {
    // 1. Encontrar tabelas usadas no código
    const usedTables = findTableReferences()
    console.log('')

    // 2. Listar todas as tabelas definidas no schema
    console.log('📊 Listando tabelas definidas no schema...')
    const allTables = getAllTablesFromSchema()
    console.log(`✅ Encontradas ${allTables.length} tabelas no schema`)
    console.log(`   Tabelas: ${allTables.sort().join(', ')}`)
    console.log('')

    // 3. Identificar tabelas não utilizadas
    const unusedTables = allTables.filter(table => {
      const tableLower = table.toLowerCase()
      // Ignorar tabelas do sistema e reservadas
      if (SYSTEM_TABLES.some(st => st.toLowerCase().includes(tableLower))) {
        return false
      }
      if (RESERVED_TABLES.some(rt => rt.toLowerCase() === tableLower)) {
        return false
      }
      return !usedTables.has(tableLower)
    })

    console.log('📋 Resultado da análise:')
    console.log(`   ✅ Tabelas utilizadas: ${allTables.length - unusedTables.length}`)
    console.log(`   ❌ Tabelas não utilizadas: ${unusedTables.length}`)

    if (unusedTables.length > 0) {
      console.log(`\n⚠️  Tabelas não utilizadas encontradas:`)
      unusedTables.forEach(table => console.log(`   - ${table}`))
    } else {
      console.log(`\n✅ Todas as tabelas estão sendo utilizadas!`)
    }

    // 4. Gerar script SQL
    console.log('\n📝 Gerando script SQL...')
    const sqlScript = generateDeleteScript(unusedTables)
    
    const outputPath = path.join(process.cwd(), 'database', 'scripts', 'delete_unused_tables.sql')
    const outputDir = path.dirname(outputPath)
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, sqlScript, 'utf-8')
    console.log(`✅ Script SQL gerado: ${outputPath}`)
    console.log(`\n💡 Próximos passos:`)
    console.log(`   1. Revise o arquivo ${outputPath}`)
    console.log(`   2. Execute no SQL Editor do Supabase APENAS se tiver certeza`)
    console.log(`   3. Faça backup antes de executar!`)

  } catch (error) {
    console.error('❌ Erro ao executar análise:', error)
    process.exit(1)
  }
}

main()

