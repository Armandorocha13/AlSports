// Serviço para cálculo de frete com Superfrete API

export interface ShippingQuote {
  id: string
  name: string
  price: number
  delivery_time: number
  delivery_range: string
  company: {
    id: number
    name: string
    picture: string
  }
}

export interface ShippingRequest {
  from: {
    postal_code: string
  }
  to: {
    postal_code: string
  }
  products: {
    id: string
    width: number
    height: number
    length: number
    weight: number
    insurance_value: number
    quantity: number
  }[]
}

export interface ShippingResponse {
  id: string
  name: string
  price: number
  delivery_time: number
  delivery_range: string
  company: {
    id: number
    name: string
    picture: string
  }
}

// Configurações padrão para produtos
const DEFAULT_PRODUCT_DIMENSIONS = {
  width: 30, // cm
  height: 40, // cm
  length: 2, // cm
  weight: 0.3, // kg
  insurance_value: 50 // R$
}

export class ShippingService {
  private static instance: ShippingService
  private apiKey: string
  private baseUrl = 'https://api.superfrete.com'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_SUPERFRETE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjAyOTcxNDUsInN1YiI6IlBIc0VYRTh4ckNZdE1QUUlWcXdmSGZXSmNBbzIifQ.X1R-XEZgK_OBKbd80mFgUMN7g8h049dWAN7WMbJV980'
  }

  static getInstance(): ShippingService {
    if (!ShippingService.instance) {
      ShippingService.instance = new ShippingService()
    }
    return ShippingService.instance
  }

  async calculateShipping(
    fromZipCode: string,
    toZipCode: string,
    products: Array<{
      id: string
      quantity: number
      price: number
    }>
  ): Promise<ShippingQuote[]> {
    if (!this.apiKey) {
      console.warn('Superfrete API key não configurada')
      return this.getFallbackShipping()
    }

    try {
      const request: ShippingRequest = {
        from: {
          postal_code: fromZipCode.replace(/\D/g, '')
        },
        to: {
          postal_code: toZipCode.replace(/\D/g, '')
        },
        products: products.map(product => ({
          id: product.id,
          width: DEFAULT_PRODUCT_DIMENSIONS.width,
          height: DEFAULT_PRODUCT_DIMENSIONS.height,
          length: DEFAULT_PRODUCT_DIMENSIONS.length,
          weight: DEFAULT_PRODUCT_DIMENSIONS.weight,
          insurance_value: DEFAULT_PRODUCT_DIMENSIONS.insurance_value,
          quantity: product.quantity
        }))
      }

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
        throw new Error(`Erro na API Superfrete: ${response.status}`)
      }

      const data = await response.json()
      return data.map((quote: ShippingResponse) => ({
        id: quote.id,
        name: quote.name,
        price: quote.price,
        delivery_time: quote.delivery_time,
        delivery_range: quote.delivery_range,
        company: quote.company
      }))
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
      return this.getFallbackShipping()
    }
  }

  private getFallbackShipping(): ShippingQuote[] {
    return [
      {
        id: 'pac',
        name: 'PAC',
        price: 15.00,
        delivery_time: 5,
        delivery_range: '5-7 dias úteis',
        company: {
          id: 1,
          name: 'Correios',
          picture: ''
        }
      },
      {
        id: 'sedex',
        name: 'SEDEX',
        price: 25.00,
        delivery_time: 3,
        delivery_range: '3-5 dias úteis',
        company: {
          id: 1,
          name: 'Correios',
          picture: ''
        }
      }
    ]
  }

  // Calcular frete baseado na quantidade de peças
  calculateShippingByQuantity(totalPieces: number): {
    method: 'transportadora' | 'super-frete'
    cost: number
    estimatedDays: string
    minQuantity: number
  } {
    // Frete grátis para pedidos com 50+ peças
    if (totalPieces >= 50) {
      return {
        method: 'transportadora',
        cost: 0,
        estimatedDays: '5-7 dias úteis',
        minQuantity: 50
      }
    }
    
    // Frete reduzido para pedidos com 20+ peças
    else if (totalPieces >= 20) {
      return {
        method: 'super-frete',
        cost: 8.00,
        estimatedDays: '3-5 dias úteis',
        minQuantity: 1
      }
    }
    
    // Frete padrão para pedidos menores
    else if (totalPieces >= 10) {
      return {
        method: 'super-frete',
        cost: 12.00,
        estimatedDays: '3-5 dias úteis',
        minQuantity: 1
      }
    }
    
    // Frete para pedidos pequenos
    else {
      return {
        method: 'super-frete',
        cost: 15.00,
        estimatedDays: '3-5 dias úteis',
        minQuantity: 1
      }
    }
  }

  // Calcular preço específico para transportadora baseado na quantidade
  calculateTransportadoraPrice(totalPieces: number): number {
    // Pedidos com 50+ peças: frete grátis
    if (totalPieces >= 50) {
      return 0
    }
    
    // Pedidos com 30-49 peças: R$ 15,00
    else if (totalPieces >= 30) {
      return 15.00
    }
    
    // Pedidos com 20-29 peças: R$ 25,00
    else if (totalPieces >= 20) {
      return 25.00
    }
    
    // Pedidos menores que 20 peças: não disponível
    else {
      return -1 // Indica que transportadora não está disponível
    }
  }

  // Obter informações de precificação da transportadora
  getTransportadoraPricing(totalPieces: number): {
    available: boolean
    price: number
    description: string
    nextThreshold?: {
      pieces: number
      price: number
    }
  } {
    const price = this.calculateTransportadoraPrice(totalPieces)
    
    if (price === -1) {
      // Transportadora não disponível
      const nextThreshold = totalPieces < 20 ? 20 : totalPieces < 30 ? 30 : 50
      const nextPrice = nextThreshold === 20 ? 25.00 : nextThreshold === 30 ? 15.00 : 0
      
      return {
        available: false,
        price: 0,
        description: `Adicione mais ${nextThreshold - totalPieces} peças para ter acesso à transportadora`,
        nextThreshold: {
          pieces: nextThreshold,
          price: nextPrice
        }
      }
    }
    
    if (price === 0) {
      return {
        available: true,
        price: 0,
        description: 'Frete grátis para pedidos com 50+ peças'
      }
    }
    
    return {
      available: true,
      price: price,
      description: `R$ ${price.toFixed(2).replace('.', ',')} para pedidos com ${totalPieces} peças`
    }
  }
}

export const shippingService = ShippingService.getInstance()
