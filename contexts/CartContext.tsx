'use client'

// Importações necessárias para o contexto do carrinho
import { createContext, useContext, useState, ReactNode } from 'react'
import { Product, CartItem } from '@/lib/types'
import { shippingService } from '@/lib/shipping'
import { orderGenerator, OrderData } from '@/lib/order-generator'
import { DiscountCalculator, CartDiscountSummary } from '@/lib/discount-calculator'
import { createClient } from '@/lib/supabase-client'

// Cliente do Supabase para operações de banco de dados
const supabase = createClient()

// CartItem já importado de @/lib/types

// Interface que define o tipo do contexto do carrinho
interface CartContextType {
  items: CartItem[] // Lista de itens no carrinho
  addItem: (product: Product, size: string, quantity: number, color?: string) => void // Adicionar item
  removeItem: (productId: string, size: string, color?: string) => void // Remover item
  updateQuantity: (productId: string, size: string, quantity: number, color?: string) => void // Atualizar quantidade
  clearCart: () => void // Limpar carrinho
  getTotalItems: () => number // Total de itens únicos
  getTotalPieces: () => number // Total de peças
  getSubtotal: () => number // Subtotal sem frete
  getShippingCost: () => number // Custo do frete
  getTotal: () => number // Total com frete
  getItemPrice: (product: Product, quantity: number) => number // Preço do item baseado na quantidade
  getShippingInfo: () => any // Informações de frete
  canUseTransportadora: () => boolean // Pode usar transportadora
  getMissingForTransportadora: () => number // Peças faltando para transportadora
  createOrder: (customerInfo?: any, shippingAddress?: any, paymentMethod?: string, notes?: string) => any // Criar pedido
  getCartSummary: () => any // Resumo do carrinho
  openWhatsAppOrder: (order: any, phoneNumber?: string) => void // Abrir pedido no WhatsApp
  saveOrderToDatabase: (customerInfo: { name: string; email: string; phone: string }, orderData: any) => Promise<any> // Salvar pedido no banco
  // Funções de desconto
  getDiscountSummary: () => CartDiscountSummary // Resumo de descontos
  getItemDiscount: (product: Product, quantity: number) => any // Desconto de um item
  getNextDiscountThreshold: (product: Product, currentQuantity: number) => any // Próximo limite de desconto
}

// Criação do contexto do carrinho
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provedor do contexto do carrinho
export function CartProvider({ children }: { children: ReactNode }) {
  // Estado que armazena os itens do carrinho
  const [items, setItems] = useState<CartItem[]>([])

  // Função para adicionar item ao carrinho
  const addItem = (product: Product, size: string, quantity: number = 1, color?: string) => {
    console.log('🛒 CartContext: Adicionando ao carrinho:', { product: product.name, size, quantity, color })
    
    setItems(prev => {
      // Verificar se já existe um item com o mesmo produto, tamanho e cor
      const existingItem = prev.find(item =>
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      )

      if (existingItem) {
        // Se o item já existe, atualizar a quantidade
        console.log('🛒 CartContext: Item existente, atualizando quantidade')
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity, addedAt: new Date() }
            : item
        )
      } else {
        // Se é um novo item, adicionar à lista
        console.log('🛒 CartContext: Novo item adicionado')
        const newItems = [...prev, {
          id: `${product.id}-${size}-${color || 'default'}-${Date.now()}`,
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

  // Função para remover item do carrinho
  const removeItem = (productId: string, size: string, color?: string) => {
    setItems(prev => prev.filter(item =>
      !(item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color)
    ))
  }

  // Função para atualizar quantidade de um item
  const updateQuantity = (productId: string, size: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      // Se quantidade for 0 ou menor, remover o item
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

  // Função para limpar todo o carrinho
  const clearCart = () => {
    setItems([])
  }

  // Função para obter total de itens únicos no carrinho
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  // Função para obter total de peças (mesmo que getTotalItems)
  const getTotalPieces = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  // Função para calcular preço de um item baseado na quantidade
  const getItemPrice = (product: Product, quantity: number): number => {
    // Se não há faixas de preço, usar preço atacado padrão
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return product.wholesalePrice
    }

    // Encontrar a faixa de preço adequada para a quantidade
    const priceRange = product.priceRanges.find(range => {
      if (range.max) {
        return quantity >= range.min && quantity <= range.max
      } else {
        return quantity >= range.min
      }
    })

    // Retornar preço da faixa encontrada ou preço atacado padrão
    return priceRange ? priceRange.price : product.wholesalePrice
  }

  // Função para calcular subtotal (sem frete)
  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const price = getItemPrice(item.product, item.quantity)
      return total + (price * item.quantity)
    }, 0)
  }

  // Função para obter informações de frete
  const getShippingInfo = () => {
    const totalPieces = getTotalPieces()
    return shippingService.calculateShippingByQuantity(totalPieces)
  }

  // Função para obter custo do frete
  const getShippingCost = () => {
    return getShippingInfo().cost
  }

  // Função para calcular total (subtotal + frete)
  const getTotal = () => {
    return getSubtotal() + getShippingCost()
  }

  // Função para verificar se pode usar transportadora (mínimo 50 peças)
  const canUseTransportadora = () => {
    return getTotalPieces() >= 50
  }

  // Função para calcular quantas peças faltam para transportadora
  const getMissingForTransportadora = () => {
    const missing = 50 - getTotalPieces()
    return missing > 0 ? missing : 0
  }

  // Função para obter resumo completo do carrinho
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

  // Função para criar um pedido com base no carrinho
  const createOrder = (
    customerInfo?: { name: string; email: string; phone: string },
    shippingAddress?: any,
    paymentMethod?: string,
    notes?: string
  ) => {
    const shippingInfo = getShippingInfo()
    
    // Mapear itens do carrinho para formato do pedido
    const orderItems = items.map(item => ({
      productName: item.product.name,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
      unitPrice: getItemPrice(item.product, item.quantity),
      totalPrice: getItemPrice(item.product, item.quantity) * item.quantity
    }))

    // Usar o gerador de pedidos para criar o pedido
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

  // Função para abrir pedido no WhatsApp
  const openWhatsAppOrder = (order: any, phoneNumber: string = '5521990708854') => {
    const url = orderGenerator.generateWhatsAppUrl(order, phoneNumber)
    window.open(url, '_blank')
  }

  // Função para salvar pedido no banco de dados
  const saveOrderToDatabase = async (
    customerInfo: { name: string; email: string; phone: string },
    orderData: any
  ) => {
    try {
      // Preparar dados do pedido para salvar
      const orderToSave = {
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
        whatsapp_sent_at: new Date().toISOString()
      }

      // Tentar salvar na tabela whatsapp_orders primeiro
      try {
        const { data, error } = await supabase
          .from('whatsapp_orders')
          .insert([orderToSave])
          .select()

        if (error) {
          console.error('❌ Erro ao salvar em whatsapp_orders:', error)
          throw error
        }

        console.log('✅ Pedido salvo na tabela whatsapp_orders:', data[0])
        return data[0]
      } catch (whatsappError) {
        console.log('⚠️ Tabela whatsapp_orders não disponível, tentando tabela orders...')
        
        // Fallback para tabela orders se whatsapp_orders não estiver disponível
        try {
          const orderForOrdersTable = {
            order_number: orderToSave.order_number,
            customer_name: orderToSave.customer_name,
            customer_email: orderToSave.customer_email,
            total_amount: orderToSave.total_amount,
            shipping_address: orderToSave.shipping_address,
            status: orderToSave.status,
            subtotal: orderToSave.subtotal,
            shipping_cost: orderToSave.shipping_cost,
            discount_amount: 0
          }

          const { data, error } = await supabase
            .from('orders')
            .insert([orderForOrdersTable])
            .select()

          if (error) {
            console.error('❌ Erro ao salvar na tabela orders:', error)
            throw error
          }

          console.log('✅ Pedido salvo na tabela orders:', data[0])
          return {
            ...data[0],
            source: 'whatsapp',
            method: 'whatsapp'
          }
        } catch (ordersError) {
          console.log('⚠️ Tabela orders não disponível, salvando no localStorage...')
          
          // Fallback final para localStorage
          const orderWithId = {
            ...orderToSave,
            id: `order_${Date.now()}`,
            created_at: new Date().toISOString(),
            method: 'whatsapp'
          }

          const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
          existingOrders.push(orderWithId)
          localStorage.setItem('user_orders', JSON.stringify(existingOrders))

          console.log('✅ Pedido salvo no localStorage (fallback final):', orderWithId)
          console.log('📊 Total de pedidos no localStorage:', existingOrders.length)
          return orderWithId
        }
      }
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

  // Retornar o provedor do contexto com todas as funções e estados
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

// Hook para usar o contexto do carrinho
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

