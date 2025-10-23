// Serviço de integração com SuperFrete para cálculo de frete
export interface ShippingRequest {
  from: {
    postal_code: string
  }
  to: {
    postal_code: string
  }
  products: Array<{
    id: string
    width: number
    height: number
    length: number
    weight: number
    insurance_value: number
    quantity: number
  }>
  services?: string[]
}

export interface ShippingOption {
  id: string | number
  name: string
  price: number
  delivery_time: number
  company: {
    id: number
    name: string
    picture: string
  }
}

export interface ShippingResponse {
  id: string
  name: string
  price: number
  delivery_time: number
  delivery_range: {
    min: number
    max: number
  }
  company: {
    id: number
    name: string
    picture: string
  }
  error?: string
}

class SuperFreteService {
  private apiKey: string
  private baseUrl = 'https://api.superfrete.com.br'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async calculateShipping(request: ShippingRequest): Promise<ShippingResponse[]> {
    try {
      console.log('🚚 Calculando frete via SuperFrete API...')
      
      const response = await fetch(`${this.baseUrl}/api/v0/me/shipment/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'AL-Sports/1.0'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`SuperFrete API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Resposta da API SuperFrete:', data)
      
      return data
      
    } catch (error) {
      console.error('❌ Erro na API SuperFrete:', error)
      throw new Error(`Falha ao calcular frete: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }


  async getShippingOptions(
    fromCep: string,
    toCep: string,
    products: Array<{
      width: number
      height: number
      length: number
      weight: number
      value: number
      quantity: number
    }>,
    totalPieces?: number
  ): Promise<ShippingOption[]> {
    // Calcular dimensões totais do pedido
    const totalWeight = products.reduce((sum, product) => sum + (product.weight * product.quantity), 0)
    const totalValue = products.reduce((sum, product) => sum + (product.value * product.quantity), 0)
    
    // Usar as maiores dimensões para o cálculo
    const maxWidth = Math.max(...products.map(p => p.width))
    const maxHeight = Math.max(...products.map(p => p.height))
    const maxLength = Math.max(...products.map(p => p.length))

    const request: ShippingRequest = {
      from: {
        postal_code: fromCep.replace(/\D/g, '')
      },
      to: {
        postal_code: toCep.replace(/\D/g, '')
      },
      products: [{
        id: 'package',
        width: maxWidth,
        height: maxHeight,
        length: maxLength,
        weight: totalWeight,
        insurance_value: totalValue,
        quantity: 1
      }],
      services: ['1', '2', '3', '4', '5'] // PAC, SEDEX, Jadlog, Total Express, Loggi
    }

    try {
      const shippingOptions = await this.calculateShipping(request)
      
      // Filtrar e mapear apenas opções válidas
      const validOptions = shippingOptions
        .filter(option => option && option.price > 0 && !option.error)
        .map(option => ({
          id: option.id,
          name: option.name,
          price: option.price,
          delivery_time: option.delivery_time,
          company: option.company
        }))
        .sort((a, b) => a.price - b.price) // Ordenar por preço

      console.log('🚚 Opções válidas do SuperFrete:', validOptions)
      
      return validOptions
    } catch (error) {
      console.error('❌ Erro na API SuperFrete:', error)
      throw error
    }
  }
}

// Instância do serviço com a API key fornecida
export const superFreteService = new SuperFreteService(
  process.env.NEXT_PUBLIC_SUPERFRETE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
)

// Função helper para calcular dimensões padrão de produtos
export function getDefaultProductDimensions(category: string) {
  const dimensions = {
    'futebol': { width: 30, height: 2, length: 40, weight: 0.3 },
    'nba': { width: 30, height: 2, length: 40, weight: 0.3 },
    'nfl': { width: 30, height: 2, length: 40, weight: 0.3 },
    'roupas-treino': { width: 25, height: 2, length: 35, weight: 0.2 },
    'conjuntos-infantis': { width: 20, height: 2, length: 30, weight: 0.15 },
    'acessorios': { width: 15, height: 2, length: 20, weight: 0.1 },
    'bermudas-shorts': { width: 25, height: 2, length: 35, weight: 0.2 }
  }
  
  return dimensions[category as keyof typeof dimensions] || dimensions['futebol']
}
