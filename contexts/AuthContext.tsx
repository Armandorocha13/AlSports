'use client'

// Importações necessárias para o contexto de autenticação
import { createClient } from '@/lib/supabase-client'
import { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

// Interface simplificada para o perfil
interface SimpleProfile {
  full_name: string | null
  email: string
  phone: string | null
  cpf?: string | null
  user_types?: 'cliente' | 'admin' | 'vendedor'
  updated_at?: string
}

// Interface que define o tipo do contexto de autenticação
interface AuthContextType {
  user: User | null // Usuário atual do Supabase
  profile: SimpleProfile | null // Perfil do usuário na aplicação
  session: Session | null // Sessão atual do Supabase
  loading: boolean // Estado de carregamento
  signUp: (email: string, password: string, userData: Partial<SimpleProfile>) => Promise<{ error: any }> // Função de cadastro
  signIn: (email: string, password: string) => Promise<{ error: any }> // Função de login
  signOut: () => Promise<void> // Função de logout
  updateProfile: (updates: Partial<SimpleProfile>) => Promise<{ error: any }> // Função de atualização do perfil
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provedor do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estados para gerenciar autenticação
  const [user, setUser] = useState<User | null>(null) // Usuário atual
  const [profile, setProfile] = useState<SimpleProfile | null>(null) // Perfil do usuário
  const [session, setSession] = useState<Session | null>(null) // Sessão atual
  const [loading, setLoading] = useState(true) // Estado de carregamento
  const supabase = createClient() // Cliente do Supabase

  useEffect(() => {
    // Função para carregar perfil completo da tabela profiles
    const loadProfile = async (userId: string) => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name, email, phone, cpf, user_types, updated_at')
          .eq('id', userId)
          .single()

        if (error) {
          console.error('Erro ao carregar perfil:', error)
          return null
        }

        return profileData as SimpleProfile
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        return null
      }
    }
    // Função para obter sessão inicial do usuário
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        // Se há usuário logado, carregar perfil completo
        if (session?.user) {
          const profileData = await loadProfile(session.user.id)
          if (profileData) {
            setProfile(profileData)
          } else {
            // Fallback para metadados se perfil não existe ainda
            setProfile({
              full_name: session.user.user_metadata?.full_name || null,
              email: session.user.email || '',
              phone: session.user.user_metadata?.phone || null,
              user_types: 'cliente'
            })
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Erro ao obter sessão:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Se há usuário logado, carregar perfil completo; senão, limpar perfil
        if (session?.user) {
          const profileData = await loadProfile(session.user.id)
          if (profileData) {
            setProfile(profileData)
          } else {
            // Fallback para metadados se perfil não existe ainda
            setProfile({
              full_name: session.user.user_metadata?.full_name || null,
              email: session.user.email || '',
              phone: session.user.user_metadata?.phone || null,
              user_types: 'cliente'
            })
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // Cleanup da subscription
    return () => subscription.unsubscribe()
  }, [supabase])

  // Função de cadastro
  const signUp = async (email: string, password: string, userData: Partial<SimpleProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone
          }
        }
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  // Função de atualização do perfil
  const updateProfile = async (updates: Partial<SimpleProfile>) => {
    try {
      if (!user) {
        return { error: { message: 'Usuário não logado' } }
      }

      // Atualizar metadados do usuário
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.full_name,
          phone: updates.phone
        }
      })

      if (error) {
        return { error }
      }

      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, ...updates } : null)

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Valor do contexto
  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
