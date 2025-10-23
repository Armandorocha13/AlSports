'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Aguardar o carregamento da autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  // Se não há usuário, mostrar mensagem sem redirecionamento automático
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Acesso Negado</div>
          <div className="text-gray-300 mb-6">Você precisa estar logado para acessar esta área.</div>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-primary-500 text-black px-4 py-2 rounded hover:bg-primary-600 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  // Verificar se o usuário é admin
  if (profile?.user_types !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Acesso Negado</div>
          <div className="text-gray-300 mb-6">Você não tem permissão para acessar esta área administrativa.</div>
          <div className="text-gray-400 mb-6">
            Tipo de usuário: {profile?.user_types || 'Não definido'}
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-primary-500 text-black px-4 py-2 rounded hover:bg-primary-600 transition-colors"
          >
            Voltar ao Site
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold text-white">Painel Administrativo</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {profile?.full_name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}