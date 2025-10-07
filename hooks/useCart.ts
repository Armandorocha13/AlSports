'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/data'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar itens do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('cart-items')
      if (savedItems) {
        try {
          setItems(JSON.parse(savedItems))
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

  const addItem = (product: Product, size: string) => {
    console.log('useCart addItem chamado:', product.name, size)
    setItems(prev => {
      console.log('Items anteriores:', prev.length)
      const existingItem = prev.find(item => 
        item.product.id === product.id && item.selectedSize === size
      )
      
      if (existingItem) {
        console.log('Item existente encontrado, incrementando quantidade')
        return prev.map(item =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        console.log('Novo item sendo adicionado')
        return [...prev, { product, quantity: 1, selectedSize: size }]
      }
    })
  }

  const removeItem = (productId: string, size: string) => {
    setItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedSize === size)
    ))
  }

  const updateQuantity = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, size)
      return
    }
    
    setItems(prev => prev.map(item =>
      item.product.id === productId && item.selectedSize === size
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getItemPrice = (product: Product, quantity: number): number => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return product.wholesalePrice
    }

    // Encontrar a faixa de preço apropriada
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
    return items.reduce((total, item) => 
      total + (getItemPrice(item.product, item.quantity) * item.quantity), 0
    )
  }

  const generateOrderCode = (): string => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `AL${timestamp.slice(-6)}${random}`
  }

  const clearCart = () => {
    setItems([])
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getItemPrice,
    generateOrderCode,
    clearCart
  }
}
