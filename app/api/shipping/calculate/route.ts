import { NextRequest, NextResponse } from 'next/server'

const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com.br'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🚚 API Route: Calculando frete via SuperFrete...', body)
    
    // Tentar chamar a API SuperFrete com timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
    
    try {
      const response = await fetch(`${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
          'User-Agent': 'AL-Sports/1.0'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ SuperFrete API error:', response.status, errorText)
        throw new Error(`SuperFrete API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Resposta da SuperFrete API:', data)
      
      return NextResponse.json(data)
      
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.warn('⚠️ SuperFrete API falhou, usando fallback:', fetchError)
      
      // Fallback: retornar opções simuladas baseadas nos dados do pedido
      const fallbackOptions = generateFallbackOptions(body)
      console.log('🔄 Usando opções de fallback:', fallbackOptions)
      
      return NextResponse.json(fallbackOptions)
    }
    
  } catch (error) {
    console.error('❌ Erro na API route:', error)
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
  
  // Calcular preço base baseado no peso e distância
  let basePrice = 15 // Preço base
  basePrice += Math.ceil(totalWeight) * 2 // Adicionar por peso
  basePrice += Math.ceil(totalValue / 100) * 1 // Adicionar por valor
  
  // Garantir preço mínimo e máximo
  basePrice = Math.max(8, Math.min(50, basePrice))
  
  return [
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
}
