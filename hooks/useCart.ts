'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/data'
import { shippingService } from '@/lib/shipping'
import { orderGenerator, OrderData } from '@/lib/order-generator'

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
  totalPieces: number
  subtotal: number
  shipping: number
  total: number
  shippingMethod: string
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
  shippingAddress?: {
    name: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }
  paymentMethod?: string
  notes?: string
  items: Array<{
    productName: string
    size: string
    color?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  // Carrinho agora funciona apenas em memória (sem localStorage)
  // Isso garante que funcione corretamente em qualquer ambiente

  const addItem = (product: Product, size: string, quantity: number = 1, color?: string) => {
    console.log('🛒 Adicionando ao carrinho:', { product: product.name, size, quantity, color })
    
    setItems(prev => {
      console.log('🛒 Itens anteriores:', prev.length)
      
      const existingItem = prev.find(item =>
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      )

      if (existingItem) {
        console.log('🛒 Item existente encontrado, atualizando quantidade')
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity, addedAt: new Date() }
            : item
        )
      } else {
        console.log('🛒 Novo item, adicionando ao carrinho')
        const newItem = {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          addedAt: new Date()
        }
        console.log('🛒 Novo item criado:', newItem)
        return [...prev, newItem]
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
    return shippingService.calculateShippingByQuantity(totalPieces)
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

  const createOrder = (customerInfo?: {
    name: string
    email: string
    phone: string
  }, shippingAddress?: {
    name: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }, paymentMethod?: string, notes?: string): OrderInfo => {
    const shippingInfo = getShippingInfo()
    
    const orderItems = items.map(item => {
      const unitPrice = getItemPrice(item.product, item.quantity)
      return {
        productName: item.product.name,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: unitPrice * item.quantity
      }
    })

    return orderGenerator.createOrder({
      totalItems: getTotalItems(),
      totalPieces: getTotalPieces(),
      subtotal: getSubtotal(),
      shipping: getShippingCost(),
      total: getTotal(),
      shippingMethod: shippingInfo.method,
      customerInfo,
      shippingAddress,
      paymentMethod,
      notes,
      items: orderItems
    })
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

  const generateWhatsAppMessage = (order: OrderInfo): string => {
    return orderGenerator.formatOrderForWhatsApp(order)
  }

  const generateWhatsAppUrl = (order: OrderInfo, phoneNumber: string = '5511999999999'): string => {
    return orderGenerator.generateWhatsAppUrl(order, phoneNumber)
  }

  const openWhatsAppOrder = (order: OrderInfo, phoneNumber: string = '5511999999999') => {
    const url = generateWhatsAppUrl(order, phoneNumber)
    window.open(url, '_blank')
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
    getCartSummary,
    generateWhatsAppMessage,
    generateWhatsAppUrl,
    openWhatsAppOrder
  }
}
