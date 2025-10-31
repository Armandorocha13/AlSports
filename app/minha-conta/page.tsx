'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { OrderWithCustomer } from '@/lib/types/database'
import {
    DollarSign,
    LogOut,
    Package,
    Settings,
    Shield,
    Truck,
    User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MyAccountPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/minha-conta')
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    if (!user) return

    try {
      setLoading(true)
      // Buscar todos os pedidos do usuário logado
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pedidos:', error)
        setOrders([])
        return
      }

      console.log('Pedidos encontrados:', data?.length || 0)
      setOrders(data || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-semibold text-white mb-2">
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
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30 mr-4 flex-shrink-0">
                    <Package className="h-6 w-6 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 mb-2">Total de Pedidos</p>
                    <p className="text-2xl text-white">
                      {loading ? '...' : orders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 mr-4 flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-gray-400 mb-2">Total Gasto</p>
                    <p className="text-xl text-white">
                      {loading ? '...' : formatCurrency(
                        orders.reduce((total, order) => {
                          // Garantir que total_amount seja um número
                          const amount = typeof order.total_amount === 'number' 
                            ? order.total_amount 
                            : parseFloat(String(order.total_amount)) || 0
                          return total + amount
                        }, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30 mr-4 flex-shrink-0">
                    <Truck className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 mb-2">Pedidos Ativos</p>
                    <p className="text-2xl text-white">
                      {loading ? '...' : orders.filter(order => {
                        // Pedidos ativos são aqueles que não estão entregues, cancelados ou devolvidos
                        const activeStatuses = [
                          'aguardando_pagamento',
                          'pagamento_confirmado',
                          'preparando_pedido',
                          'enviado',
                          'em_transito'
                        ]
                        return activeStatuses.includes(order.status)
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Menu */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-gray-700">
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
                    href="/minha-conta/configuracoes"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Configurações</span>
                  </Link>
                  
                  {/* Admin Panel Button - apenas para admins */}
                  {(profile?.user_types === 'admin' || profile?.email?.toLowerCase() === 'almundodabola@gmail.com') && (
                    <Link
                      href="/admin"
                      className="flex items-center p-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      <span>Painel Admin</span>
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-gray-700">
                  Informações da Conta
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="pb-3 border-b border-gray-700">
                    <span className="font-medium text-gray-400 block mb-1">Nome:</span>
                    <p className="text-white">{profile?.full_name || 'Não informado'}</p>
                  </div>
                  <div className="pb-3 border-b border-gray-700">
                    <span className="font-medium text-gray-400 block mb-1">Email:</span>
                    <p className="text-white break-all">{user.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400 block mb-1">Membro desde:</span>
                    <p className="text-white">
                      {new Date(user.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-gray-700">
                  Ações Rápidas
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                  >
                    Continuar Comprando
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full border border-gray-600 text-gray-300 text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
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
