'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut,
  ArrowRight,
  Calendar,
  DollarSign,
  Truck
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { OrderWithCustomer } from '@/lib/types/database'

export default function MyAccountPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [recentOrders, setRecentOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/minha-conta')
      return
    }

    if (user) {
      fetchRecentOrders()
    }
  }, [user, authLoading])

  const fetchRecentOrders = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('orders_with_customer')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Erro ao buscar pedidos recentes:', error)
        return
      }

      setRecentOrders(data || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos recentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      aguardando_pagamento: 'Aguardando Pagamento',
      pagamento_confirmado: 'Pagamento Confirmado',
      preparando_pedido: 'Preparando Pedido',
      enviado: 'Enviado',
      em_transito: 'Em Trânsito',
      entregue: 'Entregue',
      cancelado: 'Cancelado',
      devolvido: 'Devolvido'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue':
        return 'text-green-600'
      case 'cancelado':
        return 'text-red-600'
      case 'aguardando_pagamento':
        return 'text-yellow-600'
      default:
        return 'text-primary-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {profile?.full_name || user.email}!
          </h1>
          <p className="text-gray-400">
            Gerencie sua conta e acompanhe seus pedidos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-500/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-white">
                      {recentOrders.length > 0 ? recentOrders.length + '+' : '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Gasto</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(
                        recentOrders.reduce((total, order) => total + order.total_amount, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Pedidos Ativos</p>
                    <p className="text-2xl font-bold text-white">
                      {recentOrders.filter(order => 
                        !['entregue', 'cancelado'].includes(order.status)
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Pedidos Recentes
                  </h2>
                  <Link
                    href="/minha-conta/pedidos"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    Ver todos
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Você ainda não fez nenhum pedido.
                    </p>
                    <Link
                      href="/"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Começar a Comprar
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gray-700 rounded-lg">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              Pedido #{order.order_number}
                            </p>
                            <p className="text-sm text-gray-400">
                              {formatDate(order.created_at)} • {order.total_items} item(s)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </p>
                          <p className={`text-sm ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Menu */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Minha Conta
                </h3>
                <nav className="space-y-2">
                  <Link
                    href="/minha-conta/perfil"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Meu Perfil</span>
                  </Link>
                  <Link
                    href="/minha-conta/pedidos"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <Package className="h-5 w-5 mr-3" />
                    <span>Meus Pedidos</span>
                  </Link>
                  <Link
                    href="/minha-conta/enderecos"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>Endereços</span>
                  </Link>
                  <Link
                    href="/minha-conta/configuracoes"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Configurações</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Informações da Conta
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span>
                    <p className="text-white">{profile?.full_name || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Telefone:</span>
                    <p className="text-white">{profile?.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Membro desde:</span>
                    <p className="text-white">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ações Rápidas
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Continuar Comprando
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full border border-gray-600 text-gray-300 text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
