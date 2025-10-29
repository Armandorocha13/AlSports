// Script detalhado para testar conexão com a API do SuperFrete
const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com.br'

async function testBasicConnection() {
  console.log('🧪 Teste 1: Verificando conectividade básica...\n')
  
  try {
    const response = await fetch('https://api.superfrete.com.br', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    console.log('✅ Conectividade básica OK')
    console.log('   Status:', response.status)
    return true
  } catch (error) {
    console.log('❌ Problema de conectividade básica')
    console.log('   Erro:', error.message)
    return false
  }
}

async function testDNS() {
  console.log('\n🧪 Teste 2: Verificando DNS...\n')
  
  const dns = require('dns').promises
  try {
    const addresses = await dns.resolve4('api.superfrete.com.br')
    console.log('✅ DNS resolvido com sucesso')
    console.log('   IPs:', addresses.join(', '))
    return true
  } catch (error) {
    console.log('❌ Erro ao resolver DNS')
    console.log('   Erro:', error.message)
    return false
  }
}

async function testAPIEndpoint() {
  console.log('\n🧪 Teste 3: Testando endpoint da API...\n')
  
  const testRequest = {
    from: {
      postal_code: '20040020'
    },
    to: {
      postal_code: '01310100'
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
    services: ['1', '2']
  }

  console.log('📡 URL:', `${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`)
  console.log('📦 Enviando requisição...\n')

  try {
    // Testar com fetch nativo do Node.js (se disponível)
    const response = await fetch(`${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
        'User-Agent': 'AL-Sports-Test/1.0',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testRequest),
      signal: AbortSignal.timeout(20000)
    })

    console.log('📥 Resposta recebida!')
    console.log('   Status:', response.status, response.statusText)
    console.log('   Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('\n❌ Status não OK:')
      console.log('   Resposta:', errorText.substring(0, 500))
      return { success: false, status: response.status, error: errorText }
    }

    const data = await response.json()
    console.log('\n✅ SUCESSO!')
    console.log('📊 Resposta:', JSON.stringify(data, null, 2).substring(0, 1000))
    
    return { success: true, status: response.status, data: data }

  } catch (error) {
    console.log('\n❌ Erro na requisição:')
    console.log('   Tipo:', error.name)
    console.log('   Mensagem:', error.message)
    console.log('   Código:', error.code)
    
    if (error.cause) {
      console.log('   Causa:', error.cause)
    }

    // Tentar com axios se disponível
    try {
      console.log('\n🔄 Tentando com axios...')
      const axios = require('axios')
      const axiosResponse = await axios.post(
        `${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`,
        testRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
            'User-Agent': 'AL-Sports-Test/1.0',
          },
          timeout: 20000
        }
      )
      console.log('✅ Axios funcionou!')
      console.log('   Status:', axiosResponse.status)
      console.log('   Dados:', JSON.stringify(axiosResponse.data, null, 2).substring(0, 1000))
      return { success: true, status: axiosResponse.status, data: axiosResponse.data, method: 'axios' }
    } catch (axiosError) {
      console.log('❌ Axios também falhou')
      console.log('   Erro:', axiosError.message)
    }

    return { success: false, error: error.message, errorType: error.name }
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('='.repeat(60))
  console.log('TESTE DE CONEXÃO COM API SUPERFRETE')
  console.log('='.repeat(60))
  console.log()

  const results = {
    dns: false,
    connectivity: false,
    api: null
  }

  // Teste DNS (somente se disponível no Node.js)
  try {
    results.dns = await testDNS()
  } catch (e) {
    console.log('⚠️ Teste DNS não disponível neste ambiente')
  }

  // Teste de conectividade básica
  results.connectivity = await testBasicConnection()

  // Teste do endpoint da API
  results.api = await testAPIEndpoint()

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('RESUMO DOS TESTES')
  console.log('='.repeat(60))
  console.log('DNS:', results.dns ? '✅ OK' : '❌ FALHOU')
  console.log('Conectividade:', results.connectivity ? '✅ OK' : '❌ FALHOU')
  console.log('API:', results.api?.success ? '✅ OK' : '❌ FALHOU')
  
  if (results.api?.success) {
    console.log('\n✅ TODOS OS TESTES PASSARAM')
    process.exit(0)
  } else {
    console.log('\n❌ ALGUM TESTE FALHOU')
    console.log('\n💡 POSSÍVEIS SOLUÇÕES:')
    console.log('   1. Verificar conexão com internet')
    console.log('   2. Verificar se há firewall bloqueando')
    console.log('   3. Verificar se o token está válido')
    console.log('   4. Verificar certificados SSL')
    console.log('   5. Tentar em outro ambiente/rede')
    process.exit(1)
  }
}

runAllTests().catch(error => {
  console.error('\n❌ ERRO FATAL:', error)
  process.exit(1)
})

