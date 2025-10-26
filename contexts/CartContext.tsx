'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
   * Cria um pedido
   */
  const createOrder = async (orderData: any): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      // Simular criação do pedido
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui você integraria com sua API de pedidos
      console.log('Pedido criado:', orderData)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      return { success: false, error: 'Erro ao criar pedido' }
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

