'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react'
import { Product } from '@/lib/types'
import { useAuth } from './AuthContext'
import { createClient } from '@/lib/supabase-client'

// Interface que define o tipo do contexto de favoritos
interface FavoritesContextType {
  favorites: Product[]
  addToFavorites: (product: Product) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  toggleFavorite: (product: Product) => Promise<void>
  clearFavorites: () => Promise<void>
  getFavoritesCount: () => number
  refreshFavorites: () => Promise<void> // Função para recarregar do banco
  isLoading: boolean
}

// Criação do contexto de favoritos
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Provedor do contexto de favoritos
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()
  const hasLoadedRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  // Função para carregar favoritos do banco/localStorage
  const loadFavoritesFromDB = useCallback(async (forceReload: boolean = false) => {
    const currentUserId = user?.id || null
    
    // Verificar se precisa recarregar (primeira vez, usuário mudou, ou forceReload)
    const shouldReload = !hasLoadedRef.current || lastUserIdRef.current !== currentUserId || forceReload
    
    if (!shouldReload && !forceReload) {
      console.log('Pulando recarregamento - já carregado para este usuário')
      return
    }

    setIsLoading(true)
    if (!forceReload) {
      hasLoadedRef.current = true
      lastUserIdRef.current = currentUserId
    }
    
    if (!user) {
      // Se não estiver logado, carregar do localStorage
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('al-sports-favorites')
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites)
            console.log('Favoritos carregados do localStorage:', parsedFavorites.length)
          setFavorites(parsedFavorites)
        } catch (error) {
            console.error('Erro ao carregar favoritos do localStorage:', error)
          }
        } else {
          console.log('Nenhum favorito encontrado no localStorage')
          setFavorites([])
        }
      }
      setIsLoading(false)
      return
    }

    try {
      console.log('Carregando favoritos do banco para usuário:', user.id)
      // Carregar favoritos do banco de dados
      const { data, error } = await supabase
        .from('favorites')
        .select('product_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar favoritos do banco:', error)
        // Fallback para localStorage
        if (typeof window !== 'undefined') {
          const savedFavorites = localStorage.getItem('al-sports-favorites')
          if (savedFavorites) {
            try {
              const parsedFavorites = JSON.parse(savedFavorites)
              console.log('Fallback: Favoritos carregados do localStorage:', parsedFavorites.length)
              setFavorites(parsedFavorites)
            } catch (e) {
              console.error('Erro ao carregar favoritos do localStorage:', e)
            }
          }
        }
        setIsLoading(false)
        return
      }

      if (data) {
        // Converter product_data JSONB para Product[]
        const favoritesFromDB = data
          .map(item => item.product_data)
          .filter(Boolean) as Product[]
        console.log('Favoritos carregados do banco:', favoritesFromDB.length, 'itens')
        setFavorites(favoritesFromDB)
      } else {
        console.log('Nenhum favorito encontrado no banco')
        setFavorites([])
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase]) // Dependências da função

  // Carregar favoritos do banco de dados quando o usuário estiver logado
  // ou do localStorage quando não estiver logado
  // IMPORTANTE: Só carregar na inicialização ou quando o usuário mudar (login/logout)
  useEffect(() => {
    loadFavoritesFromDB()
  }, [loadFavoritesFromDB]) // Recarregar quando o user.id mudar (login/logout)

  // Sincronizar favoritos do localStorage com o banco quando o usuário fizer login
  useEffect(() => {
    const syncLocalStorageToDB = async () => {
      if (!user || typeof window === 'undefined') return

      try {
        const savedFavorites = localStorage.getItem('al-sports-favorites')
        if (!savedFavorites) return

        const localFavorites: Product[] = JSON.parse(savedFavorites)
        if (localFavorites.length === 0) return

        // Verificar quais favoritos já existem no banco
        const { data: existingFavorites } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id)

        const existingProductIds = new Set(
          existingFavorites?.map(fav => fav.product_id) || []
        )

        // Adicionar favoritos do localStorage que não estão no banco
        const favoritesToAdd = localFavorites.filter(
          product => !existingProductIds.has(product.id)
        )

        if (favoritesToAdd.length > 0) {
          const favoritesToInsert = favoritesToAdd.map(product => ({
            user_id: user.id,
            product_id: product.id,
            product_data: product
          }))

          const { error } = await supabase
            .from('favorites')
            .insert(favoritesToInsert)

          if (error) {
            console.error('Erro ao sincronizar favoritos:', error)
          } else {
            // Limpar localStorage após sincronização bem-sucedida
            localStorage.removeItem('al-sports-favorites')
          }
        }
      } catch (error) {
        console.error('Erro ao sincronizar favoritos:', error)
      }
    }

    if (user) {
      syncLocalStorageToDB()
    }
  }, [user, supabase])

  // Salvar favoritos no localStorage quando não estiver logado
  // (quando logado, os favoritos são salvos diretamente no banco)
  useEffect(() => {
    if (!user && typeof window !== 'undefined' && !isLoading) {
      // Salvar no localStorage se não estiver logado e não estiver carregando
      localStorage.setItem('al-sports-favorites', JSON.stringify(favorites))
      console.log('Favoritos salvos no localStorage:', favorites.length, 'itens')
    }
  }, [favorites, user, isLoading])

  // Função para adicionar produto aos favoritos
  const addToFavorites = async (product: Product) => {
    // Verificar se o produto já está nos favoritos
    if (favorites.some(fav => fav.id === product.id)) {
      console.log('Produto já está nos favoritos')
      return // Não adicionar se já estiver nos favoritos
    }

    console.log('Adicionando produto aos favoritos:', product.id, product.name)

    // Atualizar estado local imediatamente
    setFavorites(prev => {
      const newFavorites = [...prev, product]
      console.log('Estado local atualizado. Total de favoritos:', newFavorites.length)
      return newFavorites
    })

    // Se o usuário estiver logado, salvar no banco de dados
    if (user) {
      try {
        console.log('Usuário logado, salvando no banco. User ID:', user.id)
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id,
            product_data: product
          })
          .select()

        if (error) {
          console.error('Erro ao adicionar favorito no banco:', error)
          // Reverter mudança local se falhar
          setFavorites(prev => prev.filter(fav => fav.id !== product.id))
          throw error
        } else {
          console.log('Favorito adicionado com sucesso no banco:', data)
        }
      } catch (error) {
        console.error('Erro ao adicionar favorito:', error)
        // Reverter mudança local se falhar
        setFavorites(prev => prev.filter(fav => fav.id !== product.id))
        throw error
      }
    } else {
      console.log('Usuário não logado, favorito salvo apenas no localStorage')
      // O localStorage será atualizado pelo useEffect que monitora favorites
    }
  }

  // Função para remover produto dos favoritos
  const removeFromFavorites = async (productId: string) => {
    // Atualizar estado local imediatamente
    setFavorites(prev => prev.filter(fav => fav.id !== productId))

    // Se o usuário estiver logado, remover do banco de dados
    if (user) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (error) {
          console.error('Erro ao remover favorito do banco:', error)
          // Recarregar favoritos do banco em caso de erro
          const { data } = await supabase
            .from('favorites')
            .select('product_data')
            .eq('user_id', user.id)
          
          if (data) {
            const favoritesFromDB = data
              .map(item => item.product_data)
              .filter(Boolean) as Product[]
            setFavorites(favoritesFromDB)
          }
        }
      } catch (error) {
        console.error('Erro ao remover favorito:', error)
      }
    }
  }

  // Função para verificar se um produto está nos favoritos
  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId)
  }

  // Função para alternar favorito (adicionar se não estiver, remover se estiver)
  const toggleFavorite = async (product: Product) => {
    try {
    if (isFavorite(product.id)) {
        await removeFromFavorites(product.id)
    } else {
        await addToFavorites(product)
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error)
      throw error // Re-throw para que o componente possa tratar
    }
  }

  // Função para limpar todos os favoritos
  const clearFavorites = async () => {
    // Se o usuário estiver logado, limpar do banco de dados
    if (user) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)

        if (error) {
          console.error('Erro ao limpar favoritos do banco:', error)
        }
      } catch (error) {
        console.error('Erro ao limpar favoritos:', error)
      }
    }
    
    setFavorites([])
  }

  // Função para obter quantidade de favoritos
  const getFavoritesCount = () => {
    return favorites.length
  }

  // Função para recarregar favoritos do banco (útil para forçar atualização)
  const refreshFavorites = useCallback(async () => {
    console.log('Recarregando favoritos do banco...')
    await loadFavoritesFromDB(true) // forceReload = true
  }, [loadFavoritesFromDB])

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesCount,
    refreshFavorites,
    isLoading
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
