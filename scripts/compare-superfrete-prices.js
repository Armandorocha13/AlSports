// Script para comparar preços do SuperFrete com o site
const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com'

async function comparePrices() {
  console.log('🧪 Comparando preços do SuperFrete...\n')

  // Teste com 1 produto de 15x15x15cm e 300g
  const testCases = [
    {
      name: '1 produto - 15x15x15cm, 300g',
      from: '26015005',
      to: '26015005', // Usar mesmo CEP para teste
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
        // SEM seguro
      }
    },
    {
      name: '1 produto - COM seguro',
      from: '26015005',
      to: '26015005',
      products: [{
        quantity: 1,
        height: 15,
        length: 15,
        width: 15,
        weight: 0.3
      }],
      options: {
        own_hand: false,
        receipt: false,
        insurance_value: 100,
        use_insurance_value: true
      }
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n📦 Teste: ${testCase.name}`)
    console.log('='.repeat(60))
    
    const request = {
      from: {
        postal_code: testCase.from
      },
      to: {
        postal_code: testCase.to
      },
      services: '1,2,17,3', // PAC, SEDEX, Mini Envios, Jadlog
      products: testCase.products,
      options: testCase.options
    }

    console.log('\n📤 Request enviado:')
    console.log(JSON.stringify(request, null, 2))

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

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`\n❌ Erro ${response.status}:`, errorText)
        continue
      }

      const data = await response.json()
      
      console.log('\n📥 Resposta recebida:')
      data.forEach(option => {
        console.log(`\n   ${option.name} (ID: ${option.id}):`)
        console.log(`   - Preço: R$ ${option.price}`)
        if (option.discount) {
          const discount = parseFloat(option.discount)
          const originalPrice = option.price + discount
          console.log(`   - Preço original: R$ ${originalPrice.toFixed(2)}`)
          console.log(`   - Desconto: R$ ${discount.toFixed(2)}`)
        }
        console.log(`   - Prazo: ${option.delivery_time} dia(s)`)
        console.log(`   - Empresa: ${option.company?.name}`)
        if (option.packages && option.packages.length > 0) {
          const pkg = option.packages[0]
          console.log(`   - Caixa calculada: ${pkg.dimensions?.width}x${pkg.dimensions?.height}x${pkg.dimensions?.length} cm, ${pkg.weight} kg`)
        }
      })

    } catch (error) {
      console.log(`\n❌ Erro:`, error.message)
    }
  }
}

comparePrices().catch(console.error)

