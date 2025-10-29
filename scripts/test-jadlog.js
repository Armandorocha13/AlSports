// Script para testar especificamente JADLOG
const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com'

async function testJadlog() {
  console.log('🧪 Testando JADLOG...\n')

  const request = {
    from: {
      postal_code: '26015005'
    },
    to: {
      postal_code: '26015005'
    },
    services: '1,2,17,3', // Incluindo JADLOG (3)
    products: [{
      quantity: 1,
      height: 15,
      length: 15,
      width: 15,
      weight: 0.3
    }],
    options: {
      own_hand: false,
      receipt: false
    }
  }

  try {
    const response = await fetch(`${SUPERFRETE_BASE_URL}/api/v0/calculator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
        'User-Agent': 'AL-Sports (contato@alsports.com.br)',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    })

    const data = await response.json()
    
    console.log('📦 Todas as opções retornadas:\n')
    data.forEach((option, index) => {
      console.log(`${index + 1}. ${option.name} (ID: ${option.id})`)
      console.log(`   - Preço: R$ ${option.price}`)
      console.log(`   - Empresa: ${option.company?.name}`)
      console.log(`   - Tem erro: ${option.has_error || false}`)
      console.log()
    })

    const jadlogOptions = data.filter(opt => 
      opt.name?.toLowerCase().includes('jadlog') || 
      opt.company?.name?.toLowerCase().includes('jadlog')
    )

    if (jadlogOptions.length > 0) {
      console.log('✅ JADLOG encontrada!')
      jadlogOptions.forEach(opt => {
        console.log(`\n   ${opt.name}:`)
        console.log(`   - Preço: R$ ${opt.price}`)
        console.log(`   - Prazo: ${opt.delivery_time} dias`)
      })
    } else {
      console.log('⚠️ JADLOG não encontrada nas opções retornadas')
      console.log('\n💡 Possíveis razões:')
      console.log('   1. Não há ponto de postagem JADLOG próximo ao CEP de origem')
      console.log('   2. As dimensões do produto excedem os limites da JADLOG')
      console.log('   3. O serviço não está disponível para este CEP')
    }

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testJadlog()

