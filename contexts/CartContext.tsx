'use client'

import { createClient } from '@/lib/supabase-client'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

// Tipos para o carrinho
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  description?: string
  size?: string
  color?: string
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  totalItems: number
  shippingInfo: {
    method: string
    estimatedDays: string
    cost: number
  }
  canUseTransportadora: boolean
}

interface CartContextType {
  // Estado do carrinho
  items: CartItem[]
  loading: boolean
  
  // Funções do carrinho
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  
  // Funções de cálculo
  getTotalItems: () => number
  getSubtotal: () => number
  getShippingCost: () => number
  getTotal: () => number
  getCartSummary: () => CartSummary
  
  // Funções de pedido
  createOrder: (orderData: any) => Promise<{ success: boolean; error?: string }>
  openWhatsAppOrder: (order: any) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
      }
    }
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  /**
   * Adiciona um item ao carrinho
   */
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        item.color === newItem.color
      )

      if (existingItem) {
        return prevItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevItems, { ...newItem, quantity: 1 }]
    })
  }

  /**
   * Remove um item do carrinho
   */
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  /**
   * Atualiza a quantidade de um item
   */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  /**
   * Limpa todo o carrinho
   */
  const clearCart = () => {
    setItems([])
  }

  /**
   * Calcula o total de itens no carrinho
   */
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  /**
   * Calcula o subtotal do carrinho
   */
  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  /**
   * Calcula o custo do frete
   */
  const getShippingCost = () => {
    const subtotal = getSubtotal()
    const totalItems = getTotalItems()
    
    // Frete grátis para pedidos acima de R$ 200
    if (subtotal >= 200) {
      return 0
    }
    
    // Frete baseado na quantidade de itens
    if (totalItems >= 5) {
      return 0 // Frete grátis para 5+ itens
    }
    
    return 15 // Frete padrão
  }

  /**
   * Calcula o total do carrinho
   */
  const getTotal = () => {
    return getSubtotal() + getShippingCost()
  }

  /**
   * Retorna um resumo completo do carrinho
   */
  const getCartSummary = (): CartSummary => {
    const subtotal = getSubtotal()
    const shipping = getShippingCost()
    const total = subtotal + shipping
    const totalItems = getTotalItems()

    return {
      items,
      subtotal,
      shipping,
      total,
      totalItems,
      shippingInfo: {
        method: shipping === 0 ? 'transportadora' : 'superfrete',
        estimatedDays: shipping === 0 ? '3-5 dias úteis' : '5-7 dias úteis',
        cost: shipping
      },
      canUseTransportadora: subtotal >= 200 || totalItems >= 5
    }
  }

  /**
   * Cria um pedido no banco de dados
   */
  const createOrder = async (orderData: any): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Buscar usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || null

      // Atualizar ou criar perfil do usuário se necessário
      if (userId && orderData.customer && user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: orderData.customer.email || user.email || '',
            full_name: orderData.customer.fullName || '',
            phone: orderData.customer.phone || '',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.warn('Aviso ao atualizar perfil do usuário:', profileError)
          // Não falhar o pedido por causa do perfil
        }
      }

      // Preparar endereço de entrega
      const shippingAddress: any = {
        street: orderData.customer.address || '',
        number: orderData.customer.number || '',
        complement: orderData.customer.complement || '',
        neighborhood: orderData.customer.neighborhood || '',
        city: orderData.customer.city || '',
        state: orderData.customer.state || '',
        cep: orderData.customer.cep || '',
        fullName: orderData.customer.fullName || '',
        phone: orderData.customer.phone || '',
        email: orderData.customer.email || ''
      }

      // Mapear status inicial
      const status = 'aguardando_pagamento'

      // ============================================
      // PASSO 1: REGISTRAR PEDIDO NO BANCO (PRIMEIRO)
      // ============================================
      console.log('📦 Registrando pedido no banco de dados...')
      
      // Criar pedido na tabela orders
      // De acordo com o schema: shipping_address é NOT NULL, discount_amount tem DEFAULT 0
      const orderInsert: any = {
        order_number: orderData.orderId,
        user_id: userId,
        status: status,
        subtotal: orderData.subtotal || 0,
        shipping_cost: orderData.shippingCost || 0,
        discount_amount: 0, // Conforme schema, tem DEFAULT 0 mas podemos incluir explicitamente
        total_amount: orderData.total || 0,
        shipping_address: shippingAddress, // NOT NULL conforme schema - obrigatório
        notes: `Pedido criado via checkout online`
      }

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select('id, order_number')
        .single()

      if (orderError) {
        console.error('❌ ERRO ao registrar pedido no banco:', orderError)
        throw new Error(`Erro ao criar pedido: ${orderError.message}`)
      }

      if (!newOrder || !newOrder.id) {
        console.error('❌ ERRO: Pedido não foi retornado do banco')
        throw new Error('Falha ao criar pedido: nenhum dado retornado')
      }

      console.log('✅ Pedido registrado com sucesso no banco:', {
        id: newOrder.id,
        order_number: newOrder.order_number
      })

      // ============================================
      // PASSO 2: Registrar histórico de status
      // ============================================
      try {
        const { error: historyError } = await supabase
          .from('order_status_history')
          .insert({
            order_id: newOrder.id,
            status: status,
            notes: 'Pedido criado via checkout',
            updated_by: userId
          })

        if (historyError) {
          console.warn('⚠️ Aviso ao registrar histórico de status:', historyError)
          // Não falhar o pedido por causa do histórico
        } else {
          console.log('✅ Histórico de status registrado')
        }
      } catch (historyErr) {
        console.warn('⚠️ Erro ao registrar histórico (não crítico):', historyErr)
      }

      // ============================================
      // PASSO 3: Inserir itens do pedido
      // ============================================
      if (orderData.items && orderData.items.length > 0) {
        try {
          const orderItems = orderData.items.map((item: CartItem) => ({
            order_id: newOrder.id,
            product_id: item.id || null,
            product_name: item.name,
            product_sku: item.id || null,
            product_image_url: item.image || null,
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.quantity * item.price
          }))

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

          if (itemsError) {
            console.error('❌ Erro ao inserir itens do pedido:', itemsError)
            // O pedido já foi criado, então apenas logamos o erro
            // Mas não lançamos exceção para não perder o pedido principal
            console.warn('⚠️ Pedido foi criado mas alguns itens não foram salvos')
          } else {
            console.log(`✅ ${orderItems.length} item(ns) do pedido registrado(s)`)
          }
        } catch (itemsErr) {
          console.warn('⚠️ Erro ao inserir itens (não crítico):', itemsErr)
        }
      }

      // ============================================
      // PASSO 4: Criar registro de pagamento (pendente)
      // ============================================
      try {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id: newOrder.id,
            method: 'pix' as any, // Método padrão, pode ser alterado depois
            status: 'pendente' as any,
            amount: orderData.total || 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (paymentError) {
          console.warn('⚠️ Aviso ao criar pagamento:', paymentError)
          // Não falhar o pedido por causa do pagamento
        } else {
          console.log('✅ Registro de pagamento criado')
        }
      } catch (paymentErr) {
        console.warn('⚠️ Erro ao criar pagamento (não crítico):', paymentErr)
      }

      console.log('✅✅✅ Pedido COMPLETO registrado no banco de dados:', {
        order_id: newOrder.id,
        order_number: newOrder.order_number,
        total: orderData.total
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error)
      return { 
        success: false, 
        error: error?.message || 'Erro ao criar pedido no banco de dados' 
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Abre o WhatsApp com o pedido
   */
  const openWhatsAppOrder = (order: any) => {
    const message = `Olá! Gostaria de fazer um pedido:

${order.items.map((item: CartItem) => 
  `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

Total: R$ ${order.total.toFixed(2)}`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const value: CartContextType = {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getShippingCost,
    getTotal,
    getCartSummary,
    createOrder,
    openWhatsAppOrder
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Hook para usar o contexto do carrinho
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

