/**
 * Script para testar a conexão com o Strapi
 * Execute com: node scripts/test-strapi-connection.js
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

async function testStrapiConnection() {
  console.log('🔍 Testando conexão com Strapi...\n')
  console.log(`URL: ${STRAPI_URL}`)
  console.log(`Token: ${STRAPI_API_TOKEN ? 'Configurado' : 'Não configurado'}\n`)

  try {
    // Teste 1: Verificar se o Strapi está rodando
    console.log('1️⃣ Testando se o Strapi está acessível...')
    const healthCheck = await fetch(`${STRAPI_URL}/api`)
    console.log(`   Status: ${healthCheck.status}`)
    
    if (!healthCheck.ok) {
      console.error('   ❌ Strapi não está respondendo corretamente')
      return
    }
    console.log('   ✅ Strapi está acessível\n')

    // Teste 2: Buscar produtos
    console.log('2️⃣ Buscando produtos...')
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    const produtosResponse = await fetch(`${STRAPI_URL}/api/produtos?populate=*`, {
      headers,
    })

    console.log(`   Status: ${produtosResponse.status}`)
    
    if (!produtosResponse.ok) {
      const errorText = await produtosResponse.text()
      console.error(`   ❌ Erro: ${errorText}`)
      return
    }

    const produtosData = await produtosResponse.json()
    console.log(`   ✅ Resposta recebida`)
    console.log(`   Estrutura:`, JSON.stringify(produtosData, null, 2).substring(0, 500))
    console.log(`   Total de produtos: ${Array.isArray(produtosData.data) ? produtosData.data.length : produtosData.data ? 1 : 0}\n`)

    // Teste 3: Buscar categorias
    console.log('3️⃣ Buscando categorias...')
    const categoriasResponse = await fetch(`${STRAPI_URL}/api/categorias?populate=*`, {
      headers,
    })

    console.log(`   Status: ${categoriasResponse.status}`)
    
    if (categoriasResponse.ok) {
      const categoriasData = await categoriasResponse.json()
      console.log(`   ✅ Resposta recebida`)
      console.log(`   Total de categorias: ${Array.isArray(categoriasData.data) ? categoriasData.data.length : categoriasData.data ? 1 : 0}\n`)
    } else {
      const errorText = await categoriasResponse.text()
      console.error(`   ❌ Erro: ${errorText}\n`)
    }

    // Teste 4: Verificar estrutura de um produto
    if (produtosData.data && produtosData.data.length > 0) {
      console.log('4️⃣ Estrutura do primeiro produto:')
      const primeiroProduto = produtosData.data[0]
      console.log(JSON.stringify(primeiroProduto, null, 2))
    } else {
      console.log('4️⃣ ⚠️ Nenhum produto encontrado')
      console.log('   Verifique se:')
      console.log('   - Os produtos foram PUBLICADOS no Strapi (não apenas salvos como rascunho)')
      console.log('   - O Content Type está configurado corretamente')
      console.log('   - O nome do endpoint está correto (produtos)')
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com Strapi:', error.message)
    console.error('\nPossíveis causas:')
    console.error('1. Strapi não está rodando (execute: cd al-sport-backend && npm run develop)')
    console.error('2. URL incorreta no .env.local')
    console.error('3. Problema de CORS no Strapi')
    console.error('4. Token de API inválido ou expirado')
  }
}

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

testStrapiConnection()


