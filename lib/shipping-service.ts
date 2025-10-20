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
}

export interface ShippingOption {
  id: number
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
  private baseUrl = 'https://api.superfrete.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async calculateShipping(request: ShippingRequest): Promise<ShippingResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/shipment/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'AlSports/1.0'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`Erro na API SuperFrete: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
      throw error
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
    }>
  ): Promise<ShippingOption[]> {
    const request: ShippingRequest = {
      from: {
        postal_code: fromCep.replace(/\D/g, '')
      },
      to: {
        postal_code: toCep.replace(/\D/g, '')
      },
      products: products.map((product, index) => ({
        id: `product_${index}`,
        width: product.width,
        height: product.height,
        length: product.length,
        weight: product.weight,
        insurance_value: product.value,
        quantity: product.quantity
      }))
    }

    const shippingOptions = await this.calculateShipping(request)
    
    return shippingOptions.map(option => ({
      id: option.id,
      name: option.name,
      price: option.price,
      delivery_time: option.delivery_time,
      company: option.company
    }))
  }
}

// Instância do serviço com a API key fornecida
export const superFreteService = new SuperFreteService(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjA5ODc1MjQsInN1YiI6IjlQOW5ZUnJRRFhOUGlndHRPaFM5WGZVMVJxODMifQ.opG9fsPXCMW1cNhGQLZR9jufXRg3MMJC49Ud1BE4d1s'
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
