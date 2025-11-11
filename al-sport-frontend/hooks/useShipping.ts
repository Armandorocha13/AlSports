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
  const [userHasSelected, setUserHasSelected] = useState(false)

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
        productDimensions,
        totalPieces
      )

      console.log('✅ Opções de frete recebidas:', options)

      setShippingOptions(options)
      
      // Seleciona automaticamente a opção mais barata apenas se o usuário não fez uma seleção manual
      if (options.length > 0 && !userHasSelected) {
        const cheapest = options.reduce((prev, current) => 
          prev.price < current.price ? prev : current
        )
        setSelectedOption(cheapest)
        console.log('🎯 Opção selecionada automaticamente:', cheapest)
      }
    } catch (err) {
      console.error('❌ Erro ao calcular frete:', err)
      
      // Determinar o tipo de erro
      let errorMessage = 'Erro ao calcular frete'
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Não foi possível conectar com a API SuperFrete'
        } else if (err.message.includes('Network')) {
          errorMessage = 'Problema de conexão com a internet'
        } else if (err.message.includes('SuperFrete API error')) {
          errorMessage = 'Erro na API SuperFrete. Tente novamente.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setShippingOptions([])
      setSelectedOption(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Reset user selection when CEP changes (new destination)
    if (toCep) {
      setUserHasSelected(false)
    }
    calculateShipping()
  }, [fromCep, toCep, products])

  const handleSetSelectedOption = (option: ShippingOption | null) => {
    setSelectedOption(option)
    setUserHasSelected(true)
  }

  return {
    shippingOptions,
    loading,
    error,
    selectedOption,
    setSelectedOption: handleSetSelectedOption,
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

