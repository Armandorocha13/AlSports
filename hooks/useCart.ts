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
    const savedItems = localStorage.getItem('cart-items')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // Salvar itens no localStorage
  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, size: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.product.id === product.id && item.selectedSize === size
      )
      
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
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

  const getSubtotal = () => {
    return items.reduce((total, item) => 
      total + (item.product.wholesalePrice * item.quantity), 0
    )
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
    clearCart
  }
}
