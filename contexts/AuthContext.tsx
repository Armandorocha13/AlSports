'use client'

// Importações necessárias para o contexto de autenticação
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'
import { Profile } from '@/lib/types/database'

// Interface que define o tipo do contexto de autenticação
interface AuthContextType {
  user: User | null // Usuário atual do Supabase
  profile: Profile | null // Perfil do usuário na aplicação
  session: Session | null // Sessão atual do Supabase
  loading: boolean // Estado de carregamento
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }> // Função de cadastro
  signIn: (email: string, password: string) => Promise<{ error: any }> // Função de login
  signOut: () => Promise<void> // Função de logout
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }> // Função de atualização do perfil
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provedor do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estados para gerenciar autenticação
  const [user, setUser] = useState<User | null>(null) // Usuário atual
  const [profile, setProfile] = useState<Profile | null>(null) // Perfil do usuário
  const [session, setSession] = useState<Session | null>(null) // Sessão atual
  const [loading, setLoading] = useState(true) // Estado de carregamento
  const supabase = createClient() // Cliente do Supabase

  useEffect(() => {
    // Função para obter sessão inicial do usuário
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      // Se há usuário logado, buscar seu perfil
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Se há usuário logado, buscar perfil; senão, limpar perfil
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // Cleanup da subscription
    return () => subscription.unsubscribe()
  }, [])

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      // Buscar perfil do usuário na tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        console.log('Tentando criar perfil para usuário:', userId)
        
        // Tentar criar um perfil básico se não existir
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user?.email || 'usuario@exemplo.com',
            full_name: 'Usuário',
            user_type: 'cliente'
          })
          .select()
          .single()

        if (createError) {
          console.error('Erro ao criar perfil:', createError)
          // Se não conseguir criar perfil, usar perfil temporário
          const tempProfile = {
            id: userId,
            email: user?.email || 'usuario@exemplo.com',
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
        } else {
          console.log('Perfil criado com sucesso:', newProfile)
          setProfile(newProfile)
        }
      } else {
        console.log('Perfil encontrado:', profileData)
        setProfile(profileData)
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

  // Função para cadastro de novos usuários
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

      // Criar usuário no Supabase Auth
      console.log('Criando usuário no Supabase Auth...')
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

      console.log('Resultado da criação do usuário:', { data, error })

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
        console.log('Criando perfil para usuário:', data.user.id)
        // Preparar dados do perfil com apenas campos essenciais
        const profileInsertData: any = {
          id: data.user.id,
          email: data.user.email!
        }

        // Adicionar campos opcionais apenas se fornecidos
        if (userData.full_name) {
          profileInsertData.full_name = userData.full_name
        }
        if (userData.phone) {
          profileInsertData.phone = userData.phone
        }
        if (userData.cpf) {
          profileInsertData.cpf = userData.cpf
        }
        if (userData.birth_date) {
          profileInsertData.birth_date = userData.birth_date
        }

        console.log('Dados do perfil a serem inseridos:', profileInsertData)

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert(profileInsertData)
          .select()

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
          console.error('Detalhes do erro:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          })
          
          // Não deletar o usuário, apenas retornar erro
          return { error: { message: `Erro ao criar perfil: ${profileError.message}` } }
        } else {
          console.log('Perfil criado com sucesso:', profileData)
        }
      }

      console.log('Cadastro finalizado com sucesso, retornando sucesso')
      return { error: null }
    } catch (error) {
      console.error('Erro no signUp:', error)
      return { error: { message: 'Erro interno do servidor' } }
    }
  }

  // Função para login de usuários
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login para:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erro no login:', error)
        return { error }
      } else {
        console.log('Login realizado com sucesso:', data.user?.email)
        return { error: null }
      }
    } catch (error) {
      console.error('Erro no catch do login:', error)
      return { error }
    }
  }

  // Função para logout do usuário
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      // Redirecionar para a página de login após logout
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  // Função para atualizar perfil do usuário
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

  // Valor do contexto com todas as funções e estados
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

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
