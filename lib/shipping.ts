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
    this.apiKey = process.env.NEXT_PUBLIC_SUPERFRETE_API_KEY || ''
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
    if (totalPieces >= 50) {
      return {
        method: 'transportadora',
        cost: 0,
        estimatedDays: '5-7 dias úteis',
        minQuantity: 50
      }
    } else if (totalPieces >= 20) {
      return {
        method: 'super-frete',
        cost: 10.00,
        estimatedDays: '3-5 dias úteis',
        minQuantity: 1
      }
    } else {
      return {
        method: 'super-frete',
        cost: 15.00,
        estimatedDays: '3-5 dias úteis',
        minQuantity: 1
      }
    }
  }
}

export const shippingService = ShippingService.getInstance()
