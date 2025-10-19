import { Product } from './types'

export interface DiscountInfo {
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  discountPercentage: number
  priceRange?: {
    min: number
    max?: number
    price: number
  }
}

export interface CartDiscountSummary {
  totalOriginalPrice: number
  totalDiscountedPrice: number
  totalSavings: number
  totalSavingsPercentage: number
  items: Array<{
    productId: string
    productName: string
    quantity: number
    originalPrice: number
    discountedPrice: number
    savings: number
    savingsPercentage: number
  }>
}

export class DiscountCalculator {
  /**
   * Calcula o preço com desconto baseado na quantidade
   */
  static calculateItemDiscount(product: Product, quantity: number): DiscountInfo {
    const originalPrice = product.price
    let discountedPrice = product.wholesalePrice
    let priceRange = null

    // Se o produto tem faixas de preço, usar a lógica de faixas
    if (product.priceRanges && product.priceRanges.length > 0) {
      const applicableRange = product.priceRanges.find(range => {
        return quantity >= range.min
      })

      if (applicableRange) {
        discountedPrice = applicableRange.price
        priceRange = applicableRange
      }
    }

    const discountAmount = originalPrice - discountedPrice
    const discountPercentage = Math.round((discountAmount / originalPrice) * 100)

    return {
      originalPrice,
      discountedPrice,
      discountAmount,
      discountPercentage,
      priceRange: priceRange || undefined
    }
  }

  /**
   * Calcula o resumo de descontos do carrinho
   */
  static calculateCartDiscountSummary(items: Array<{
    product: Product
    quantity: number
    selectedSize: string
    selectedColor?: string
  }>): CartDiscountSummary {
    let totalOriginalPrice = 0
    let totalDiscountedPrice = 0
    const itemsWithDiscount = []

    for (const item of items) {
      const discountInfo = this.calculateItemDiscount(item.product, item.quantity)
      
      const itemOriginalPrice = discountInfo.originalPrice * item.quantity
      const itemDiscountedPrice = discountInfo.discountedPrice * item.quantity
      const itemSavings = itemOriginalPrice - itemDiscountedPrice

      totalOriginalPrice += itemOriginalPrice
      totalDiscountedPrice += itemDiscountedPrice

      itemsWithDiscount.push({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        originalPrice: itemOriginalPrice,
        discountedPrice: itemDiscountedPrice,
        savings: itemSavings,
        savingsPercentage: discountInfo.discountPercentage
      })
    }

    const totalSavings = totalOriginalPrice - totalDiscountedPrice
    const totalSavingsPercentage = totalOriginalPrice > 0 
      ? Math.round((totalSavings / totalOriginalPrice) * 100) 
      : 0

    return {
      totalOriginalPrice,
      totalDiscountedPrice,
      totalSavings,
      totalSavingsPercentage,
      items: itemsWithDiscount
    }
  }

  /**
   * Obtém a faixa de preço aplicável para uma quantidade
   */
  static getApplicablePriceRange(product: Product, quantity: number) {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return null
    }

    return product.priceRanges.find(range => {
      if (range.max) {
        return quantity >= range.min && quantity <= range.max
      } else {
        return quantity >= range.min
      }
    })
  }

  /**
   * Calcula quanto o cliente precisa comprar para atingir a próxima faixa de desconto
   */
  static getNextDiscountThreshold(product: Product, currentQuantity: number) {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return null
    }

    // Ordenar faixas por quantidade mínima
    const sortedRanges = [...product.priceRanges].sort((a, b) => a.min - b.min)
    
    // Encontrar a próxima faixa
    const nextRange = sortedRanges.find(range => range.min > currentQuantity)
    
    if (nextRange) {
      const neededQuantity = nextRange.min - currentQuantity
      const currentPrice = this.calculateItemDiscount(product, currentQuantity).discountedPrice
      const nextPrice = nextRange.price
      const savingsPerUnit = currentPrice - nextPrice
      const totalSavings = savingsPerUnit * nextRange.min

      return {
        neededQuantity,
        nextPrice,
        savingsPerUnit,
        totalSavings,
        range: nextRange
      }
    }

    return null
  }

  /**
   * Formata o valor monetário
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  /**
   * Formata a porcentagem
   */
  static formatPercentage(value: number): string {
    return `${value}%`
  }
}
