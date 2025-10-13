'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'
import { Profile } from '@/lib/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        // Se não conseguir buscar perfil, criar um perfil temporário
        const tempProfile = {
          id: userId,
          email: 'usuario@exemplo.com',
          full_name: 'Usuário',
          phone: null,
          cpf: null,
          birth_date: null,
          user_type: 'cliente' as const,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setProfile(tempProfile)
        return
      }

      // Buscar roles do usuário na tabela user_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)

      if (rolesError) {
        console.error('Erro ao buscar roles:', rolesError)
        // Se não conseguir buscar roles, usar o user_type do perfil como fallback
        setProfile(profileData)
        return
      }

      // Determinar o tipo de usuário baseado nos roles
      let userType = profileData.user_type || 'cliente' // usar o do perfil como fallback
      
      // Verificar se o usuário tem role de admin na tabela user_roles
      if (userRoles && userRoles.length > 0) {
        const roles = userRoles.map(ur => ur.role)
        if (roles.includes('admin')) {
          userType = 'admin'
        } else if (roles.includes('vendedor')) {
          userType = 'vendedor'
        }
      }
      
      // Fallback temporário: verificar se é um usuário específico conhecido como admin
      // TODO: Remover este fallback quando a tabela user_roles estiver configurada
      if (userId === '00000000-0000-0000-0000-000000000001') {
        userType = 'admin'
        console.log('🔧 Usuário admin detectado via fallback')
      }

      // Criar perfil com o tipo correto baseado nos roles
      const profileWithRole = {
        ...profileData,
        user_type: userType
      }

      setProfile(profileWithRole)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      // Em caso de erro, criar perfil temporário
      const tempProfile = {
        id: userId,
        email: 'usuario@exemplo.com',
        full_name: 'Usuário',
        phone: null,
        cpf: null,
        birth_date: null,
        user_type: 'cliente' as const,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setProfile(tempProfile)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      // Verificar se o email já existe
      const { data: existingUser } = await supabase.auth.getUser()
      
      // Verificar se já existe um perfil com este email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single()

      if (existingProfile) {
        return { error: { message: 'Este email já está cadastrado' } }
      }

      // Verificar se já existe um perfil com este CPF
      if (userData.cpf) {
        const { data: existingCpf } = await supabase
          .from('profiles')
          .select('cpf')
          .eq('cpf', userData.cpf)
          .single()

        if (existingCpf) {
          return { error: { message: 'Este CPF já está cadastrado' } }
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
          }
        }
      })

      if (error) {
        // Tratar erros específicos do Supabase
        let errorMessage = error.message
        
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido'
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres'
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Não foi possível validar o email'
        }
        
        return { error: { ...error, message: errorMessage } }
      }

      // Criar perfil do usuário apenas se o usuário foi criado com sucesso
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: userData.full_name,
            phone: userData.phone,
            cpf: userData.cpf,
            birth_date: userData.birth_date,
            user_type: 'cliente'
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
          // Se falhou ao criar o perfil, tentar deletar o usuário criado
          await supabase.auth.admin.deleteUser(data.user.id)
          return { error: { message: 'Erro ao criar perfil do usuário' } }
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Erro no signUp:', error)
      return { error: { message: 'Erro interno do servidor' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        return { error }
      }

      // Atualizar perfil local
      setProfile(prev => prev ? { ...prev, ...updates } : null)

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
