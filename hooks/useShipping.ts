'use client'

import { useState, useEffect } from 'react'
import { superFreteService, ShippingOption } from '@/lib/shipping-service'

interface UseShippingProps {
  fromCep: string
  toCep: string
  products: Array<{
    category: string
    value: number
    quantity: number
  }>
  totalPieces?: number
}

export function useShipping({ fromCep, toCep, products, totalPieces = 0 }: UseShippingProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null)

  const calculateShipping = async () => {
    if (!fromCep || !toCep || products.length === 0) {
      setShippingOptions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🚚 Calculando frete...', { fromCep, toCep, products })
      
      const productDimensions = products.map(product => ({
        ...getDefaultProductDimensions(product.category),
        value: product.value,
        quantity: product.quantity
      }))

      console.log('📦 Dimensões dos produtos:', productDimensions)

      const options = await superFreteService.getShippingOptions(
        fromCep,
        toCep,
        productDimensions
      )

      console.log('✅ Opções de frete recebidas:', options)

      setShippingOptions(options)
      
      // Seleciona automaticamente a opção mais barata
      if (options.length > 0) {
        const cheapest = options.reduce((prev, current) => 
          prev.price < current.price ? prev : current
        )
        setSelectedOption(cheapest)
        console.log('🎯 Opção selecionada:', cheapest)
      }
    } catch (err) {
      console.error('❌ Erro ao calcular frete:', err)
      
      // Determinar o tipo de erro
      let errorMessage = 'Erro ao calcular frete'
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Não foi possível conectar com a API de frete'
        } else if (err.message.includes('Network')) {
          errorMessage = 'Problema de conexão com a internet'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      
      // Fallback com preços baseados na distância
      const fallbackOptions = createFallbackOptions(fromCep, toCep, totalPieces)
      setShippingOptions(fallbackOptions)
      
      if (fallbackOptions.length > 0) {
        setSelectedOption(fallbackOptions[0])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateShipping()
  }, [fromCep, toCep, products])

  return {
    shippingOptions,
    loading,
    error,
    selectedOption,
    setSelectedOption,
    recalculate: calculateShipping
  }
}

// Função helper para obter dimensões padrão
function getDefaultProductDimensions(category: string) {
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

// Função para criar opções de fallback baseadas na distância
function createFallbackOptions(fromCep: string, toCep: string, totalPieces: number): ShippingOption[] {
  // Extrair região do CEP de destino
  const toRegion = toCep.substring(0, 2)
  const fromRegion = fromCep.substring(0, 2)
  
  // Calcular preços baseados na distância
  let basePrice = 15
  let deliveryTime = 5
  
  if (toRegion === fromRegion) {
    // Mesma região - mais barato
    basePrice = 8
    deliveryTime = 3
  } else if (['01', '02', '03', '04', '05', '06', '07', '08', '09'].includes(toRegion)) {
    // Região Sudeste - preço médio
    basePrice = 12
    deliveryTime = 4
  } else if (['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'].includes(toRegion)) {
    // Região Nordeste - preço médio-alto
    basePrice = 18
    deliveryTime = 6
  } else if (['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'].includes(toRegion)) {
    // Região Sul - preço médio
    basePrice = 16
    deliveryTime = 5
  } else if (['50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69'].includes(toRegion)) {
    // Região Centro-Oeste - preço médio-alto
    basePrice = 20
    deliveryTime = 7
  } else if (['70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89'].includes(toRegion)) {
    // Região Norte - preço alto
    basePrice = 25
    deliveryTime = 8
  } else {
    // CEP não reconhecido - preço padrão
    basePrice = 15
    deliveryTime = 5
  }

  // Opções básicas sempre disponíveis
  const options: ShippingOption[] = [
    {
      id: 'pac-fallback',
      name: 'PAC',
      price: basePrice,
      delivery_time: deliveryTime,
      company: {
        id: 1,
        name: 'Correios',
        picture: ''
      }
    },
    {
      id: 'sedex-fallback',
      name: 'SEDEX',
      price: Math.round(basePrice * 1.5),
      delivery_time: Math.max(2, deliveryTime - 2),
      company: {
        id: 2,
        name: 'Correios',
        picture: ''
      }
    }
  ]

  // Adicionar transportadoras privadas APENAS se tiver 20+ peças
  if (totalPieces >= 20) {
    // Jadlog - mais barato que PAC
    options.push({
      id: 'jadlog-fallback',
      name: 'Jadlog (20+ peças)',
      price: Math.round(basePrice * 0.7), // 30% mais barato que PAC
      delivery_time: Math.max(3, deliveryTime - 1),
      company: {
        id: 3,
        name: 'Jadlog',
        picture: ''
      }
    })

    // Total Express - preço médio
    options.push({
      id: 'total-express-fallback',
      name: 'Total Express (20+ peças)',
      price: Math.round(basePrice * 0.8), // 20% mais barato que PAC
      delivery_time: Math.max(2, deliveryTime - 2),
      company: {
        id: 4,
        name: 'Total Express',
        picture: ''
      }
    })

    // Loggi - mais rápido
    options.push({
      id: 'loggi-fallback',
      name: 'Loggi (20+ peças)',
      price: Math.round(basePrice * 1.1), // 10% mais caro que PAC, mas mais rápido
      delivery_time: Math.max(1, deliveryTime - 3),
      company: {
        id: 5,
        name: 'Loggi',
        picture: ''
      }
    })

    // Opção econômica para pedidos grandes
    options.push({
      id: 'economico-fallback',
      name: 'Econômico (20+ peças)',
      price: Math.round(basePrice * 0.5), // 50% mais barato que PAC
      delivery_time: deliveryTime + 2,
      company: {
        id: 6,
        name: 'Transportadora Econômica',
        picture: ''
      }
    })
  }

  // Ordenar por preço (mais barato primeiro)
  return options.sort((a, b) => a.price - b.price)
}
