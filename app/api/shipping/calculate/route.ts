import { NextRequest, NextResponse } from 'next/server'

const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🚚 API Route: Calculando frete via SuperFrete...', JSON.stringify(body, null, 2))
    
    // Validar body conforme documentação SuperFrete
    // from e to devem ser objetos com postal_code
    if (!body || !body.from || !body.to || !body.services) {
      console.error('❌ Body inválido - campos obrigatórios:', { from: !!body?.from, to: !!body?.to, services: !!body?.services })
      return NextResponse.json(
        { error: 'Dados de requisição inválidos. É necessário from, to e services.' },
        { status: 400 }
      )
    }

    // Converter from/to para formato correto (objeto com postal_code)
    let fromCep = ''
    let toCep = ''

    if (typeof body.from === 'object' && body.from.postal_code) {
      fromCep = body.from.postal_code.replace(/\D/g, '')
    } else if (typeof body.from === 'string') {
      fromCep = body.from.replace(/\D/g, '')
    } else {
      return NextResponse.json(
        { error: 'Campo "from" deve ser um objeto com postal_code ou uma string com CEP.' },
        { status: 400 }
      )
    }

    if (typeof body.to === 'object' && body.to.postal_code) {
      toCep = body.to.postal_code.replace(/\D/g, '')
    } else if (typeof body.to === 'string') {
      toCep = body.to.replace(/\D/g, '')
    } else {
      return NextResponse.json(
        { error: 'Campo "to" deve ser um objeto com postal_code ou uma string com CEP.' },
        { status: 400 }
      )
    }

    // Garantir formato correto (objeto com postal_code)
    body.from = { postal_code: fromCep }
    body.to = { postal_code: toCep }

    // Validar products ou package
    if (!body.products && !body.package) {
      console.error('❌ Body inválido - falta products ou package')
      return NextResponse.json(
        { error: 'É necessário fornecer products (array) ou package (objeto) com as dimensões.' },
        { status: 400 }
      )
    }

    // Validar products se fornecido
    if (body.products && (!Array.isArray(body.products) || body.products.length === 0)) {
      console.error('❌ Body inválido - products deve ser um array não vazio')
      return NextResponse.json(
        { error: 'Products deve ser um array não vazio com as dimensões dos produtos.' },
        { status: 400 }
      )
    }

    // Converter services de array para string se necessário
    if (body.services && Array.isArray(body.services)) {
      body.services = body.services.join(',')
    }
    
    // Tentar chamar a API SuperFrete com timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos timeout
    
    try {
      const apiUrl = `${SUPERFRETE_BASE_URL}/api/v0/calculator`
      console.log('📡 Chamando SuperFrete API:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
          'User-Agent': 'AL-Sports (contato@alsports.com.br)',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📥 Status da resposta SuperFrete:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`
        try {
          const errorText = await response.text()
          console.error('❌ SuperFrete API error (texto):', errorText)
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.message || errorJson.error || errorMessage
          } catch {
            errorMessage = errorText || errorMessage
          }
        } catch (e) {
          console.error('❌ Erro ao ler resposta de erro:', e)
        }
        return NextResponse.json(
          { error: `SuperFrete API error: ${errorMessage}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      console.log('✅ Resposta da SuperFrete API:', JSON.stringify(data, null, 2))
      
      // Garantir que retornamos um array
      const result = Array.isArray(data) ? data : [data]
      return NextResponse.json(result)
      
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('❌ SuperFrete API error (catch):', fetchError)
      
      let errorMessage = 'Erro desconhecido ao calcular frete'
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          errorMessage = 'Timeout: A requisição demorou muito para responder. Tente novamente.'
        } else if (fetchError.message.includes('fetch')) {
          errorMessage = 'Erro de conexão: não foi possível conectar ao SuperFrete. Verifique sua conexão.'
        } else {
          errorMessage = fetchError.message
        }
      }
      
      return NextResponse.json(
        { error: `Erro ao calcular frete: ${errorMessage}` },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Erro na API route (parse):', error)
    return NextResponse.json(
      { error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

// Função para gerar opções de fallback quando a API SuperFrete falha
function generateFallbackOptions(request: any) {
  const { from, to, products } = request
  
  // Calcular peso total
  const totalWeight = products.reduce((sum: number, product: any) => 
    sum + (product.weight * product.quantity), 0
  )
  
  // Calcular valor total
  const totalValue = products.reduce((sum: number, product: any) => 
    sum + (product.insurance_value * product.quantity), 0
  )
  
  // Calcular total de peças
  const totalPieces = products.reduce((sum: number, product: any) => 
    sum + product.quantity, 0
  )
  
  // Calcular preço base baseado no peso e distância
  let basePrice = 15 // Preço base
  basePrice += Math.ceil(totalWeight) * 2 // Adicionar por peso
  basePrice += Math.ceil(totalValue / 100) * 1 // Adicionar por valor
  
  // Garantir preço mínimo e máximo
  basePrice = Math.max(8, Math.min(50, basePrice))
  
  // Opções básicas sempre disponíveis
  const options = [
    {
      id: '1',
      name: 'PAC',
      price: basePrice,
      delivery_time: 5,
      delivery_range: {
        min: 3,
        max: 7
      },
      company: {
        id: 1,
        name: 'Correios',
        picture: ''
      }
    },
    {
      id: '2',
      name: 'SEDEX',
      price: Math.round(basePrice * 1.5),
      delivery_time: 2,
      delivery_range: {
        min: 1,
        max: 3
      },
      company: {
        id: 2,
        name: 'Correios',
        picture: ''
      }
    }
  ]

  // Adicionar transportadoras privadas se tiver 20+ peças
  if (totalPieces >= 20) {
    options.push(
      {
        id: '3',
        name: 'Jadlog',
        price: Math.round(basePrice * 0.8), // 20% mais barato que PAC
        delivery_time: 3,
        delivery_range: {
          min: 2,
          max: 4
        },
        company: {
          id: 3,
          name: 'Jadlog',
          picture: ''
        }
      },
      {
        id: '4',
        name: 'Total Express',
        price: Math.round(basePrice * 0.9), // 10% mais barato que PAC
        delivery_time: 3,
        delivery_range: {
          min: 2,
          max: 4
        },
        company: {
          id: 4,
          name: 'Total Express',
          picture: ''
        }
      },
      {
        id: '5',
        name: 'Loggi',
        price: Math.round(basePrice * 1.1), // 10% mais caro que PAC, mas mais rápido
        delivery_time: 1,
        delivery_range: {
          min: 1,
          max: 2
        },
        company: {
          id: 5,
          name: 'Loggi',
          picture: ''
        }
      }
    )
  }

  return options
}
