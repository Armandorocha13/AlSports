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
      const productDimensions = products.map(product => ({
        ...getDefaultProductDimensions(product.category),
        value: product.value,
        quantity: product.quantity
      }))

      const options = await superFreteService.getShippingOptions(
        fromCep,
        toCep,
        productDimensions
      )

      setShippingOptions(options)
      
      // Seleciona automaticamente a opção mais barata
      if (options.length > 0) {
        const cheapest = options.reduce((prev, current) => 
          prev.price < current.price ? prev : current
        )
        setSelectedOption(cheapest)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular frete')
      setShippingOptions([])
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
