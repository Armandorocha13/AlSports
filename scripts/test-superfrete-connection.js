// Script para testar conexão com a API do SuperFrete
const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com.br'

async function testConnection() {
  console.log('🧪 Testando conexão com a API do SuperFrete...\n')
  console.log('📡 URL:', `${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`)
  console.log('🔑 Token:', SUPERFRETE_API_KEY.substring(0, 50) + '...\n')

  // Dados de teste
  const testRequest = {
    from: {
      postal_code: '20040020' // Rio de Janeiro - Centro
    },
    to: {
      postal_code: '01310100' // São Paulo - Avenida Paulista
    },
    products: [{
      id: 'test-product',
      width: 30,
      height: 2,
      length: 40,
      weight: 0.3,
      insurance_value: 100,
      quantity: 1
    }],
    services: ['1', '2'] // PAC e SEDEX
  }

  console.log('📦 Dados do teste:')
  console.log(JSON.stringify(testRequest, null, 2))
  console.log('\n⏳ Enviando requisição...\n')

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const startTime = Date.now()

    const response = await fetch(`${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
        'User-Agent': 'AL-Sports/1.0',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testRequest),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const duration = Date.now() - startTime

    console.log('📥 Resposta recebida:')
    console.log('   Status:', response.status, response.statusText)
    console.log('   Tempo de resposta:', duration + 'ms')
    console.log('   Headers:', Object.fromEntries(response.headers.entries()))
    console.log()

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ ERRO - Status não OK:')
      console.log('   Resposta:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        console.log('   JSON:', JSON.stringify(errorJson, null, 2))
      } catch (e) {
        console.log('   (Não é JSON válido)')
      }
      
      return {
        success: false,
        status: response.status,
        error: errorText
      }
    }

    const data = await response.json()
    console.log('✅ SUCESSO!')
    console.log('📊 Dados retornados:')
    console.log(JSON.stringify(data, null, 2))
    console.log()
    
    if (Array.isArray(data)) {
      console.log(`📦 Total de opções de frete: ${data.length}`)
      data.forEach((option, index) => {
        console.log(`\n   Opção ${index + 1}:`)
        console.log(`   - Nome: ${option.name || 'N/A'}`)
        console.log(`   - Preço: R$ ${option.price || 'N/A'}`)
        console.log(`   - Prazo: ${option.delivery_time || 'N/A'} dias`)
        console.log(`   - Empresa: ${option.company?.name || 'N/A'}`)
      })
    }

    return {
      success: true,
      status: response.status,
      data: data,
      duration: duration
    }

  } catch (error) {
    console.log('❌ ERRO na requisição:')
    
    if (error.name === 'AbortError') {
      console.log('   Tipo: Timeout (requisição demorou mais de 15 segundos)')
    } else if (error.message.includes('fetch')) {
      console.log('   Tipo: Erro de conexão/fetch')
      console.log('   Detalhes:', error.message)
    } else {
      console.log('   Tipo:', error.name || 'Erro desconhecido')
      console.log('   Mensagem:', error.message)
    }
    
    console.log('\n   Stack trace:')
    console.log(error.stack)
    
    return {
      success: false,
      error: error.message,
      errorType: error.name
    }
  }
}

// Executar o teste
testConnection()
  .then(result => {
    console.log('\n' + '='.repeat(60))
    if (result.success) {
      console.log('✅ TESTE CONCLUÍDO COM SUCESSO')
      process.exit(0)
    } else {
      console.log('❌ TESTE FALHOU')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('\n❌ ERRO FATAL:', error)
    process.exit(1)
  })

