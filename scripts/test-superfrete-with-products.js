// Script de teste usando o formato correto com products conforme documentação
const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com'

async function testSuperFreteWithProducts() {
  console.log('🧪 Testando API SuperFrete com formato products...\n')
  console.log('📡 Base URL:', SUPERFRETE_BASE_URL)
  console.log('🔗 Endpoint: /api/v0/calculator')
  console.log()

  // Dados de teste com produtos individuais (formato conforme documentação)
  const testRequest = {
    from: {
      postal_code: '20040020' // Rio de Janeiro - Centro
    },
    to: {
      postal_code: '01310100' // São Paulo - Avenida Paulista
    },
    services: '1,2,17,3', // PAC, SEDEX, Mini Envios, Jadlog
    products: [
      {
        quantity: 2,
        height: 2, // cm
        length: 40, // cm
        width: 30, // cm
        weight: 0.3 // kg
      }
    ],
    options: {
      own_hand: false,
      receipt: false,
      insurance_value: 100,
      use_insurance_value: true
    }
  }

  console.log('📦 Dados do teste (formato conforme documentação):')
  console.log(JSON.stringify(testRequest, null, 2))
  console.log('\n⏳ Enviando requisição...\n')

  try {
    const apiUrl = `${SUPERFRETE_BASE_URL}/api/v0/calculator`
    const startTime = Date.now()

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
        'User-Agent': 'AL-Sports (contato@alsports.com.br)',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testRequest)
    })

    const duration = Date.now() - startTime

    console.log('📥 Resposta recebida:')
    console.log('   Status:', response.status, response.statusText)
    console.log('   Tempo:', duration + 'ms')
    console.log()

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ ERRO - Status não OK:')
      console.log('   Resposta:', errorText.substring(0, 500))
      
      try {
        const errorJson = JSON.parse(errorText)
        console.log('   JSON:', JSON.stringify(errorJson, null, 2))
      } catch (e) {
        console.log('   (Não é JSON válido)')
      }
      
      return { success: false, status: response.status, error: errorText }
    }

    const data = await response.json()
    console.log('✅ SUCESSO!')
    console.log('📊 Dados retornados:')
    console.log(JSON.stringify(data, null, 2))
    console.log()
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`📦 Total de opções de frete: ${data.length}`)
      data.forEach((option, index) => {
        console.log(`\n   Opção ${index + 1}:`)
        console.log(`   - ID: ${option.id || 'N/A'}`)
        console.log(`   - Nome: ${option.name || 'N/A'}`)
        console.log(`   - Preço: R$ ${option.price || 'N/A'}`)
        console.log(`   - Desconto: R$ ${option.discount || 'N/A'}`)
        console.log(`   - Prazo: ${option.delivery_time || 'N/A'} dias`)
        console.log(`   - Empresa: ${option.company?.name || 'N/A'}`)
        if (option.delivery_range) {
          console.log(`   - Prazo: ${option.delivery_range.min}-${option.delivery_range.max} dias`)
        }
        if (option.packages && option.packages.length > 0) {
          console.log(`   - Caixa ideal calculada pela API:`)
          const pkg = option.packages[0]
          console.log(`     * Peso: ${pkg.weight} kg`)
          console.log(`     * Dimensões: ${pkg.dimensions?.width}x${pkg.dimensions?.height}x${pkg.dimensions?.length} cm`)
        }
      })
    }

    return { success: true, status: response.status, data: data, duration: duration }

  } catch (error) {
    console.log('❌ ERRO na requisição:')
    console.log('   Tipo:', error.name)
    console.log('   Mensagem:', error.message)
    
    if (error.cause) {
      console.log('   Causa:', error.cause)
    }
    
    return { success: false, error: error.message, errorType: error.name }
  }
}

testSuperFreteWithProducts()
  .then(result => {
    console.log('\n' + '='.repeat(60))
    if (result.success) {
      console.log('✅ TESTE CONCLUÍDO COM SUCESSO')
      console.log('\n💡 A API calculou automaticamente a caixa ideal para os produtos!')
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

