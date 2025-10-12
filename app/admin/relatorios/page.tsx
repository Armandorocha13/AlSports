'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  averageOrderValue: number
  ordersThisMonth: number
  revenueThisMonth: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    order_code: string
    total_amount: number
    user_name: string
    created_at: string
    status: string
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export default function AdminRelatorios() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Buscar dados de pedidos
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_code,
          total_amount,
          status,
          created_at,
          user_id,
          profiles!orders_user_id_fkey (
            full_name
          )
        `)

      if (ordersError) throw ordersError

      // Buscar dados de usuários
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at')

      if (usersError) throw usersError

      // Buscar dados de produtos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price')

      if (productsError) throw productsError

      // Calcular estatísticas
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const totalOrders = orders?.length || 0
      const totalUsers = users?.length || 0
      const totalProducts = products?.length || 0
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Pedidos deste mês
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const ordersThisMonth = orders?.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      }).length || 0

      const revenueThisMonth = orders?.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      }).reduce((sum, order) => sum + order.total_amount, 0) || 0

      // Produtos mais vendidos (simulado - seria necessário dados de order_items)
      const topProducts = products?.slice(0, 5).map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 50) + 1,
        revenue: product.price * (Math.floor(Math.random() * 50) + 1)
      })) || []

      // Pedidos recentes
      const recentOrders = orders?.slice(0, 5).map(order => ({
        id: order.id,
        order_code: order.order_code,
        total_amount: order.total_amount,
        user_name: order.profiles?.full_name || 'N/A',
        created_at: order.created_at,
        status: order.status
      })) || []

      // Receita mensal (últimos 6 meses)
      const monthlyRevenue = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthOrders = orders?.filter(order => {
          const orderDate = new Date(order.created_at)
          return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
        }) || []
        
        monthlyRevenue.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          revenue: monthOrders.reduce((sum, order) => sum + order.total_amount, 0),
          orders: monthOrders.length
        })
      }

      setStats({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        averageOrderValue,
        ordersThisMonth,
        revenueThisMonth,
        topProducts,
        recentOrders,
        monthlyRevenue
      })
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    // Implementar exportação de dados
    alert('Funcionalidade de exportação será implementada em breve!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando relatórios...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar dados</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Relatórios e Dashboard</h1>
          <p className="text-gray-400">Acompanhe o desempenho do seu negócio</p>
        </div>
        <button
          onClick={exportData}
          className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Dados
        </button>
      </div>

      {/* Filtros de Data */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data Final
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-white">
                R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Usuários</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Produtos</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pedidos Este Mês</p>
              <p className="text-2xl font-bold text-white">{stats.ordersThisMonth}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Receita Este Mês</p>
              <p className="text-2xl font-bold text-white">
                R$ {stats.revenueThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">
                R$ {stats.averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Receita Mensal */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
          <div className="space-y-4">
            {stats.monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ 
                        width: `${(month.revenue / Math.max(...stats.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">
                    R$ {month.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm">{product.sales} vendas</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="mt-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{order.order_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {order.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      R$ {order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}