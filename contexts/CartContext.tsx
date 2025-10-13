'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/lib/data'
import { shippingService } from '@/lib/shipping'
import { orderGenerator, OrderData } from '@/lib/order-generator'
import { DiscountCalculator, CartDiscountSummary } from '@/lib/discount-calculator'
import { createClient } from '@/lib/supabase-client'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor?: string
  addedAt: Date
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string, quantity: number, color?: string) => void
  removeItem: (productId: string, size: string, color?: string) => void
  updateQuantity: (productId: string, size: string, quantity: number, color?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPieces: () => number
  getSubtotal: () => number
  getShippingCost: () => number
  getTotal: () => number
  getItemPrice: (product: Product, quantity: number) => number
  getShippingInfo: () => any
  canUseTransportadora: () => boolean
  getMissingForTransportadora: () => number
  createOrder: (customerInfo?: any, shippingAddress?: any, paymentMethod?: string, notes?: string) => any
  getCartSummary: () => any
  openWhatsAppOrder: (order: any, phoneNumber?: string) => void
  saveOrderToDatabase: (customerInfo: { name: string; email: string; phone: string }, orderData: any) => Promise<any>
  // Novas funções de desconto
  getDiscountSummary: () => CartDiscountSummary
  getItemDiscount: (product: Product, quantity: number) => any
  getNextDiscountThreshold: (product: Product, currentQuantity: number) => any
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (product: Product, size: string, quantity: number = 1, color?: string) => {
    console.log('🛒 CartContext: Adicionando ao carrinho:', { product: product.name, size, quantity, color })
    
    setItems(prev => {
      const existingItem = prev.find(item =>
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      )

      if (existingItem) {
        console.log('🛒 CartContext: Item existente, atualizando quantidade')
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity, addedAt: new Date() }
            : item
        )
      } else {
        console.log('🛒 CartContext: Novo item adicionado')
        const newItems = [...prev, {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          addedAt: new Date()
        }]
        console.log('🛒 CartContext: Total de itens no carrinho:', newItems.length)
        return newItems
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

  const getTotalPieces = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getItemPrice = (product: Product, quantity: number): number => {
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

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const price = getItemPrice(item.product, item.quantity)
      return total + (price * item.quantity)
    }, 0)
  }

  const getShippingInfo = () => {
    const totalPieces = getTotalPieces()
    return shippingService.calculateShippingByQuantity(totalPieces)
  }

  const getShippingCost = () => {
    return getShippingInfo().cost
  }

  const getTotal = () => {
    return getSubtotal() + getShippingCost()
  }

  const canUseTransportadora = () => {
    return getTotalPieces() >= 50
  }

  const getMissingForTransportadora = () => {
    const missing = 50 - getTotalPieces()
    return missing > 0 ? missing : 0
  }

  const getCartSummary = () => {
    return {
      totalItems: getTotalItems(),
      totalPieces: getTotalPieces(),
      subtotal: getSubtotal(),
      shipping: getShippingCost(),
      total: getTotal(),
      shippingInfo: getShippingInfo()
    }
  }

  const createOrder = (
    customerInfo?: { name: string; email: string; phone: string },
    shippingAddress?: any,
    paymentMethod?: string,
    notes?: string
  ) => {
    const shippingInfo = getShippingInfo()
    
    const orderItems = items.map(item => ({
      productName: item.product.name,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
      unitPrice: getItemPrice(item.product, item.quantity),
      totalPrice: getItemPrice(item.product, item.quantity) * item.quantity
    }))

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

  const openWhatsAppOrder = (order: any, phoneNumber: string = '5521990708854') => {
    const url = orderGenerator.generateWhatsAppUrl(order, phoneNumber)
    window.open(url, '_blank')
  }

  const saveOrderToDatabase = async (
    customerInfo: { name: string; email: string; phone: string },
    orderData: any
  ) => {
    try {
      // Solução temporária: salvar no localStorage até a tabela whatsapp_orders ser criada
      const orderToSave = {
        id: `order_${Date.now()}`,
        order_number: orderData.code,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        status: 'aguardando_pagamento',
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shipping,
        total_amount: orderData.total,
        items: orderData.items,
        shipping_address: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          method: orderData.shippingMethod || 'whatsapp'
        },
        notes: `Pedido finalizado via WhatsApp - ${orderData.code}`,
        whatsapp_message: `Olá! Tenho um novo pedido para você:\n\n*Número do Pedido:* ${orderData.code}\n*Total:* R$ ${orderData.total.toFixed(2)}\n*Itens:*\n${orderData.items.map((item: any) => `- ${item.quantity}x ${item.productName} (${item.size}) - R$ ${item.totalPrice.toFixed(2)}`).join('\n')}\n\nPor favor, aguardo as instruções para pagamento e envio do comprovante.`,
        whatsapp_sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        method: 'whatsapp'
      }

      // Salvar no localStorage
      const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      existingOrders.push(orderToSave)
      localStorage.setItem('user_orders', JSON.stringify(existingOrders))

      console.log('✅ Pedido salvo no localStorage (aguardando tabela whatsapp_orders):', orderToSave)
      console.log('📊 Total de pedidos no localStorage:', existingOrders.length)
      console.log('📧 Email do cliente:', customerInfo.email)
      return orderToSave
    } catch (error) {
      console.error('Erro ao salvar pedido:', error)
      throw error
    }
  }

  // Funções de desconto
  const getDiscountSummary = (): CartDiscountSummary => {
    return DiscountCalculator.calculateCartDiscountSummary(items)
  }

  const getItemDiscount = (product: Product, quantity: number) => {
    return DiscountCalculator.calculateItemDiscount(product, quantity)
  }

  const getNextDiscountThreshold = (product: Product, currentQuantity: number) => {
    return DiscountCalculator.getNextDiscountThreshold(product, currentQuantity)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPieces,
        getSubtotal,
        getShippingCost,
        getTotal,
        getItemPrice,
        getShippingInfo,
        canUseTransportadora,
        getMissingForTransportadora,
        createOrder,
        getCartSummary,
        openWhatsAppOrder,
        saveOrderToDatabase,
        getDiscountSummary,
        getItemDiscount,
        getNextDiscountThreshold
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

