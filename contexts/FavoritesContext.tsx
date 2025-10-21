'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Product } from '@/lib/types'

// Interface que define o tipo do contexto de favoritos
interface FavoritesContextType {
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  toggleFavorite: (product: Product) => void
  clearFavorites: () => void
  getFavoritesCount: () => number
}

// Criação do contexto de favoritos
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Provedor do contexto de favoritos
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    // Verificar se estamos no cliente (não no servidor)
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('al-sports-favorites')
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites)
          setFavorites(parsedFavorites)
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error)
        }
      }
    }
  }, [])

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('al-sports-favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  // Função para adicionar produto aos favoritos
  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      // Verificar se o produto já está nos favoritos
      const isAlreadyFavorite = prev.some(fav => fav.id === product.id)
      
      if (isAlreadyFavorite) {
        return prev // Não adicionar se já estiver nos favoritos
      }
      
      return [...prev, product]
    })
  }

  // Função para remover produto dos favoritos
  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => {
      return prev.filter(fav => fav.id !== productId)
    })
  }

  // Função para verificar se um produto está nos favoritos
  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId)
  }

  // Função para alternar favorito (adicionar se não estiver, remover se estiver)
  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  // Função para limpar todos os favoritos
  const clearFavorites = () => {
    setFavorites([])
  }

  // Função para obter quantidade de favoritos
  const getFavoritesCount = () => {
    return favorites.length
  }

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesCount
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Hook para usar o contexto de favoritos
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider')
  }
  return context
}
