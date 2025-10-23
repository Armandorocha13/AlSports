import { NextRequest, NextResponse } from 'next/server'

const SUPERFRETE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
const SUPERFRETE_BASE_URL = 'https://api.superfrete.com.br'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🚚 API Route: Calculando frete via SuperFrete...', body)
    
    const response = await fetch(`${SUPERFRETE_BASE_URL}/api/v0/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPERFRETE_API_KEY}`,
        'User-Agent': 'AL-Sports/1.0'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ SuperFrete API error:', response.status, errorText)
      return NextResponse.json(
        { error: `SuperFrete API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Resposta da SuperFrete API:', data)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Erro na API route:', error)
    return NextResponse.json(
      { error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}
