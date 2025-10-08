'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/data'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor?: string
  addedAt: Date
}

export interface ShippingInfo {
  method: 'super-frete' | 'transportadora'
  cost: number
  minQuantity: number
  estimatedDays: string
}

export interface OrderInfo {
  id: string
  code: string
  createdAt: Date
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  totalItems: number
  subtotal: number
  shipping: number
  total: number
  shippingMethod: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar itens do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items')
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems)
          // Converter strings de data de volta para objetos Date
          const itemsWithDates = parsedItems.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
          setItems(itemsWithDates)
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error)
        }
      }
    }
  }, [])

  // Salvar itens no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart-items', JSON.stringify(items))
      } catch (error) {
        console.error('Erro ao salvar carrinho:', error)
      }
    }
  }, [items])

  const addItem = (product: Product, size: string, quantity: number = 1, color?: string) => {
    setItems(prev => {
      const existingItem = prev.find(item =>
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      )

      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity, addedAt: new Date() }
            : item
        )
      } else {
        return [...prev, {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          addedAt: new Date()
        }]
      }
    })
  }

  const removeItem = (productId: string, size: string, color?: string) => {
    setItems(prev => prev.filter(item =>
      !(item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color)
    ))
  }

  const updateQuantity = (productId: string, size: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, color)
      return
    }

    setItems(prev => prev.map(item =>
      item.product.id === productId && 
      item.selectedSize === size && 
      item.selectedColor === color
        ? { ...item, quantity, addedAt: new Date() }
        : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const price = getItemPrice(item.product, item.quantity)
      return total + (price * item.quantity)
    }, 0)
  }

  const getItemPrice = (product: Product, quantity: number) => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return product.wholesalePrice
    }
    
    const priceRange = product.priceRanges.find(range => {
      if (range.max) {
        return quantity >= range.min && quantity <= range.max
      } else {
        return quantity >= range.min
      }
    })
    
    return priceRange ? priceRange.price : product.wholesalePrice
  }

  const getShippingInfo = (): ShippingInfo => {
    const totalPieces = getTotalPieces()
    
    if (totalPieces >= 50) {
      return {
        method: 'transportadora',
        cost: 0,
        minQuantity: 50,
        estimatedDays: '5-7 dias úteis'
      }
    } else {
      return {
        method: 'super-frete',
        cost: 15.00,
        minQuantity: 1,
        estimatedDays: '3-5 dias úteis'
      }
    }
  }

  const getShippingCost = () => {
    return getShippingInfo().cost
  }

  const getTotal = () => {
    return getSubtotal() + getShippingCost()
  }

  const getTotalPieces = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const canUseTransportadora = () => {
    return getTotalPieces() >= 50
  }

  const getMissingForTransportadora = () => {
    const totalPieces = getTotalPieces()
    return Math.max(0, 50 - totalPieces)
  }

  const generateOrderCode = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `ALS-${timestamp}-${random}`
  }

  const createOrder = (): OrderInfo => {
    const shippingInfo = getShippingInfo()
    
    return {
      id: generateOrderCode(),
      code: generateOrderCode(),
      createdAt: new Date(),
      status: 'pending',
      totalItems: getTotalItems(),
      subtotal: getSubtotal(),
      shipping: getShippingCost(),
      total: getTotal(),
      shippingMethod: shippingInfo.method
    }
  }

  const getCartSummary = () => {
    return {
      items: items,
      totalItems: getTotalItems(),
      totalPieces: getTotalPieces(),
      subtotal: getSubtotal(),
      shipping: getShippingCost(),
      total: getTotal(),
      shippingInfo: getShippingInfo(),
      canUseTransportadora: canUseTransportadora(),
      missingForTransportadora: getMissingForTransportadora()
    }
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getTotal,
    getItemPrice,
    getShippingInfo,
    getShippingCost,
    getTotalPieces,
    canUseTransportadora,
    getMissingForTransportadora,
    createOrder,
    getCartSummary
  }
}
