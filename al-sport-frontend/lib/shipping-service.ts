// Serviço de integração com SuperFrete para cálculo de frete
// Formato conforme documentação: https://superfrete.readme.io/reference/cotacao-de-frete
export interface ShippingRequest {
  from: {
    postal_code: string // CEP de origem (formato XXXXXXXX ou XXXXX-XXX)
  }
  to: {
    postal_code: string // CEP de destino (formato XXXXXXXX ou XXXXX-XXX)
  }
  services: string // Códigos dos serviços separados por vírgula (ex: "1,2" para PAC e SEDEX)
  products: Array<{
    quantity: number
    height: number // cm
    length: number // cm
    width: number // cm
    weight: number // kg
  }>
  options?: {
    own_hand?: boolean
    receipt?: boolean
    insurance_value?: number
    use_insurance_value?: boolean
  }
}

export interface ShippingOption {
  id: string | number
  name: string
  price: number // Preço já com desconto aplicado
  discount?: string | number // Desconto aplicado
  originalPrice?: number // Preço original antes do desconto (se disponível)
  delivery_time: number
  delivery_range?: {
    min: number
    max: number
  }
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
      console.log('🚚 Calculando frete via API route local...', request)
      
      // Usar URL absoluta para evitar problemas em produção
      const apiUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/shipping/calculate`
        : '/api/shipping/calculate'
      
      console.log('📡 Chamando API:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      console.log('📥 Status da resposta:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          const errorText = await response.text()
          console.error('❌ Erro da API (texto):', errorText)
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Resposta da API route:', data)
      
      // Verificar se a resposta é um array
      if (!Array.isArray(data)) {
        console.error('❌ Resposta não é um array:', data)
        throw new Error('Resposta inválida da API: esperado um array de opções de frete')
      }
      
      return data
      
    } catch (error) {
      console.error('❌ Erro na API route:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: não foi possível conectar ao servidor. Verifique sua conexão com a internet.')
      }
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
    // Limpar CEPs (remover caracteres não numéricos)
    const fromCepClean = fromCep.replace(/\D/g, '')
    const toCepClean = toCep.replace(/\D/g, '')
    
    // Calcular valor total para seguro
    const totalValue = products.reduce((sum, product) => sum + (product.value * product.quantity), 0)
    const calculatedTotalPieces = products.reduce((sum, product) => sum + product.quantity, 0)

    // Converter produtos para formato do SuperFrete (dimensões individuais)
    // A API calculará a caixa ideal automaticamente
    const superFreteProducts = products.map(product => ({
      quantity: product.quantity,
      height: product.height, // cm
      length: product.length, // cm
      width: product.width, // cm
      weight: product.weight // kg
    }))

    const request: ShippingRequest = {
      from: {
        postal_code: fromCepClean // CEP como string dentro do objeto
      },
      to: {
        postal_code: toCepClean // CEP como string dentro do objeto
      },
      services: '1,2,17,3', // PAC (1), SEDEX (2), Mini Envios (17), Jadlog.Package (3)
      // Loggi (31) é ativado/desativado nas configurações do token
      products: superFreteProducts, // Array de produtos individuais
      options: {
        own_hand: false,
        receipt: false,
        // Não incluir seguro por padrão para manter preços mais baixos
        // insurance_value: totalValue > 0 ? totalValue : undefined,
        // use_insurance_value: false
      }
    }

    try {
      console.log('🔢 Total de peças calculado:', calculatedTotalPieces)
      console.log('📦 Dados do request:', request)
      
      const shippingOptions = await this.calculateShipping(request)
      
      // Filtrar e mapear apenas opções válidas
      // Remover opções "elem" e opções com erro ou preço zero
      const validOptions = shippingOptions
        .filter(option => {
          if (!option || option.price <= 0 || option.error || (option as any).has_error) return false
          const nameLower = option.name?.toLowerCase() || ''
          const idStr = String(option.id || '').toLowerCase()
          return !nameLower.includes('elem') && !idStr.includes('elem')
        })
        .map(option => {
          // Calcular preço original se houver desconto
          const discount = (option as any).discount ? parseFloat(String((option as any).discount)) : 0
          const originalPrice = discount > 0 ? option.price + discount : undefined

          return {
            id: option.id,
            name: option.name,
            price: option.price, // Preço já com desconto (preço final)
            discount: discount > 0 ? discount : undefined,
            originalPrice: originalPrice, // Preço original antes do desconto
            delivery_time: option.delivery_time,
            delivery_range: (option as any).delivery_range,
            company: option.company
          }
        })
        .sort((a, b) => a.price - b.price) // Ordenar por preço (já com desconto)

      console.log('🚚 Opções válidas do SuperFrete:', validOptions)
      console.log('🔢 Total de peças nas opções:', calculatedTotalPieces)
      
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

// Re-exportar funções de dimensões do arquivo dedicado
export {
  getProductDimensions as getDefaultProductDimensions,
  mapCartItemsToSuperFreteProducts,
  type ProductDimensions
} from './product-dimensions'

