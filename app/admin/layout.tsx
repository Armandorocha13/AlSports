'use client'

import { useAuth } from '@/contexts/AuthContext'
import {
    LayoutDashboard,
    LogOut,
    Package2,
    Paintbrush,
    Settings,
    ShoppingCart,
    Store
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  // Menu items do painel admin
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingCart,
    },
    {
      name: 'Conteúdo',
      href: '/admin/produtos',
      icon: Package2,
    },
    {
      name: 'Aparência',
      href: '/admin/aparencia',
      icon: Paintbrush,
    },
    {
      name: 'Configurações',
      href: '/admin/configuracoes',
      icon: Settings,
    }
  ]

  // Aguardar o carregamento da autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    )
  }

  // Se não há usuário, mostrar mensagem
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Acesso Negado</div>
          <div className="text-white/70 mb-6">Você precisa estar logado para acessar esta área.</div>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors font-semibold"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  // Verificar se o usuário é admin autorizado
  const isAdmin = profile?.user_types === 'admin'
  const isAuthorizedAdmin = profile?.email?.toLowerCase() === 'almundodabola@gmail.com' || isAdmin

  // Se não é admin autorizado, bloquear acesso
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Acesso Negado</div>
          <div className="text-white/70 mb-6">
            Você não tem permissão para acessar o painel administrativo.
            <br />
            Apenas administradores autorizados podem acessar esta área.
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors font-semibold"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-full min-h-screen w-full">
        {/* Sidebar */}
        <aside className="flex h-screen min-h-[700px] w-64 flex-col justify-between border-r-2 border-yellow-500/30 bg-black p-4">
          <div className="flex flex-col gap-4">
            {/* Logo e Nome da Loja */}
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 flex items-center justify-center rounded-full size-10">
                <Store className="h-6 w-6 text-black" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">
                  Minha Loja
                </h1>
                <p className="text-gray-300 text-sm font-normal leading-normal">
                  Painel Admin
                </p>
              </div>
            </div>

            {/* Menu de Navegação */}
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="flex flex-col gap-2">
            {/* Botão Ver Loja */}
            <Link
              href="/"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-yellow-500 text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-yellow-400 transition-colors"
            >
              <Store className="h-4 w-4" />
              <span className="truncate">Ver Loja</span>
            </Link>

            {/* Menu do Usuário */}
            <div className="flex flex-col gap-1 border-t border-gray-700 pt-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-black">
                    {(profile?.full_name || user.email || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-300">Administrador</p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-yellow-400 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto bg-black">
          {children}
        </main>
      </div>
    </div>
  )
}
