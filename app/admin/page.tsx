'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  DollarSign,
  Eye,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { adminService, AdminStats } from '@/lib/admin-service'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
    newCustomers: 0,
    ordersGrowth: 0,
    revenueGrowth: 0,
    productsGrowth: 0,
    customersGrowth: 0
  })
  const [loading, setLoading] = useState(true)

  // Carregar dados do dashboard
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const statsData = await adminService.getStats()
        setStats(statsData)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        alert('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const quickActions = [
    {
      name: 'Gerenciar Produtos',
      href: '/admin/produtos',
      icon: Package,
      color: 'bg-yellow-500 hover:bg-yellow-400 text-black',
      description: 'Adicione, edite e remova produtos',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnftTLjHW2yjmaM8DwAz6WjTwvwGN7fMWN7Vka2ri_ITXJxogTOxFuIufjOVIOOKq7MHkYXnJl8vxhgxLb7zZ52U3UKiT17ww5tjgBs05rQ_ClkZjpoEou82MFIuObWQyebDOUXpQXWAiqIWxKrloNVtyWI6gP7bWf1rAtEAWOI42RrkqAuiW0MRPkhWCeW6ShNWJazQC1dPkhPtjor6Gvrpdo9SpzAJIq0BFMHF3pWwrl6HL-dDAToMTmTb3n7YREPeKtgS11Pg'
    },
    {
      name: 'Visualizar Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingCart,
      color: 'bg-black hover:bg-gray-800 text-yellow-400',
      description: 'Acompanhe novos e antigos pedidos',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWiG0APFINYotiP_5Ip-hgxUo2c5ittBSyDhjFUYhabYzYOkHrqVoAcJA5KZmU8DJnZ_tUtMkUKJ0WsGfNtB6hVigXuqOSfwEZiT26LcR9J3qrrCpB_OY6JGs_D_uYQqYaT5MDgvzD6CBOf0OJPGhef5UBP5HTlUEJM66tHRfWmNqG9c24ohriug1PP8bHnTPCSWQ6UFFkdwAnuEg2AyZVjAelb6Bbzog5V9KCfnLgMlAtNtYoKJzBnro1K8YWpdEoXIGxe8W71w'
    },
    {
      name: 'Gerenciar Categorias',
      href: '/admin/categorias',
      icon: BarChart3,
      color: 'bg-yellow-500 hover:bg-yellow-400 text-black',
      description: 'Organize seus produtos em categorias',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8cpOVhdzxnEYEsgOVVfFpQSkBL7enkodeBF0lp3AxTcDNPGsWuvZWMptV_41ecViETwiM9Ea04z1ZLB3_9x2E6aed8N08cxEqIyj9zlYZ-BpOzm7W3AuBT2Vi3WJfnNBBQ-qu9qyuBVNFI6g-Pks77TxvqYLdDjViH_DZq6jD19GpVgQgJ-4i0LIG_AnYEBhy2slm_YKC4pAc1C-4OO6reR6O1m0LEVOTpg3U5Jt6U1yIOgQND6xfxZ3fXJk8saIUHuoQTPQVig'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Dashboard</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <h1 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-base font-medium leading-normal">Total de Pedidos</p>
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">{stats.totalOrders.toLocaleString()}</p>
          <p className={`text-sm font-medium leading-normal ${
            stats.ordersGrowth >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}% vs. mês passado
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-base font-medium leading-normal">Faturamento Total</p>
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">R$ {stats.totalRevenue.toLocaleString()}</p>
          <p className={`text-sm font-medium leading-normal ${
            stats.revenueGrowth >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% vs. mês passado
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-base font-medium leading-normal">Produtos Ativos</p>
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">{stats.activeProducts}</p>
          <p className={`text-sm font-medium leading-normal ${
            stats.productsGrowth >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {stats.productsGrowth >= 0 ? '+' : ''}{stats.productsGrowth}% vs. mês passado
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-base font-medium leading-normal">Usuários Ativos</p>
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
              <Users className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-900 tracking-light text-3xl font-bold leading-tight">{stats.newCustomers}</p>
          <p className={`text-sm font-medium leading-normal ${
            stats.customersGrowth >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {stats.customersGrowth >= 0 ? '+' : ''}{stats.customersGrowth}% vs. mês passado
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <div key={action.name} className="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: `url(${action.image})` }}></div>
              <div>
                <p className="text-gray-900 text-base font-semibold leading-normal">{action.name}</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">{action.description}</p>
              </div>
              <Link
                href={action.href}
                className={`w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-colors ${action.color}`}
              >
                Acessar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
