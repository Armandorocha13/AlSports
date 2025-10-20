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
}

export function useShipping({ fromCep, toCep, products }: UseShippingProps) {
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
      setError(err instanceof Error ? err.message : 'Erro ao calcular frete')
      
      // Fallback com preços baseados na distância
      const fallbackOptions = createFallbackOptions(fromCep, toCep)
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
function createFallbackOptions(fromCep: string, toCep: string): ShippingOption[] {
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

  return [
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
}
