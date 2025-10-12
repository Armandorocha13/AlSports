'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  FileText
} from 'lucide-react'

interface ReportData {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  ordersThisMonth: number
  revenueThisMonth: number
  averageOrderValue: number
  topProducts: Array<{
    id: string
    name: string
    quantity_sold: number
    revenue: number
  }>
  ordersByStatus: Array<{
    status: string
    count: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
  }>
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
    averageOrderValue: 0,
    topProducts: [],
    ordersByStatus: [],
    revenueByMonth: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const supabase = createClient()

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59')

      // Fetch users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select('*')

      // Calculate basic stats
      const totalOrders = orders?.length || 0
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const totalUsers = users?.length || 0
      const totalProducts = products?.length || 0

      // Calculate this month's stats
      const thisMonth = new Date().toISOString().substring(0, 7)
      const ordersThisMonth = orders?.filter(order => 
        order.created_at?.startsWith(thisMonth)
      ).length || 0
      const revenueThisMonth = orders?.filter(order => 
        order.created_at?.startsWith(thisMonth)
      ).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      // Calculate average order value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate orders by status
      const ordersByStatus = orders?.reduce((acc, order) => {
        const status = order.status || 'unknown'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const ordersByStatusArray = Object.entries(ordersByStatus).map(([status, count]) => ({
        status,
        count
      }))

      // Calculate revenue by month (last 6 months)
      const revenueByMonth = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toISOString().substring(0, 7)
        const monthRevenue = orders?.filter(order => 
          order.created_at?.startsWith(monthKey)
        ).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
        
        revenueByMonth.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          revenue: monthRevenue
        })
      }

      // Mock top products data (would need order_items table for real data)
      const topProducts = [
        { id: '1', name: 'Camisa Flamengo 2024/25', quantity_sold: 45, revenue: 4500 },
        { id: '2', name: 'Conjunto Nike Training', quantity_sold: 32, revenue: 4800 },
        { id: '3', name: 'Camisa Lakers LeBron', quantity_sold: 28, revenue: 3640 },
        { id: '4', name: 'Kit Infantil Barcelona', quantity_sold: 25, revenue: 3250 },
        { id: '5', name: 'Short Nike Dri-FIT', quantity_sold: 22, revenue: 1980 }
      ]

      setReportData({
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        ordersThisMonth,
        revenueThisMonth,
        averageOrderValue,
        topProducts,
        ordersByStatus: ordersByStatusArray,
        revenueByMonth
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_pagamento':
        return 'Aguardando Pagamento'
      case 'pago':
        return 'Pago'
      case 'processando':
        return 'Processando'
      case 'enviado':
        return 'Enviado'
      case 'entregue':
        return 'Entregue'
      case 'cancelado':
        return 'Cancelado'
      default:
        return status
    }
  }

  const handleExportReport = () => {
    // Mock export functionality
    alert('Funcionalidade de exportação será implementada em breve')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Carregando relatórios...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="text-gray-400 mt-2">Análise detalhada do seu negócio</p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-primary-400" />
          <span className="text-white font-medium">Período:</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <span className="text-gray-400">até</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold text-white">{reportData.totalOrders}</p>
              <p className="text-xs text-gray-500 mt-1">
                {reportData.ordersThisMonth} este mês
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Faturamento Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(reportData.totalRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(reportData.revenueThisMonth)} este mês
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(reportData.averageOrderValue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Por pedido
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Usuários</p>
              <p className="text-2xl font-bold text-white">{reportData.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">
                Cadastrados
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Faturamento por Mês</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            {reportData.revenueByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (item.revenue / Math.max(...reportData.revenueByMonth.map(r => r.revenue))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-white text-sm font-medium w-20 text-right">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Pedidos por Status</h3>
            <PieChart className="w-5 h-5 text-primary-400" />
          </div>
          <div className="space-y-3">
            {reportData.ordersByStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{getStatusLabel(item.status)}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (item.count / reportData.totalOrders) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-white text-sm font-medium w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Produtos Mais Vendidos</h2>
            <Package className="w-5 h-5 text-primary-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantidade Vendida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Faturamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {reportData.topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-black font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-white">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {product.quantity_sold} unidades
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(product.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (product.quantity_sold / Math.max(...reportData.topProducts.map(p => p.quantity_sold))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {Math.round((product.quantity_sold / Math.max(...reportData.topProducts.map(p => p.quantity_sold))) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Relatórios Rápidos</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary-500 text-black py-2 px-4 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              Relatório de Vendas
            </button>
            <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Relatório de Clientes
            </button>
            <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center">
              <Package className="w-4 h-4 mr-2" />
              Relatório de Produtos
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Exportar Dados</h3>
          <div className="space-y-3">
            <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </button>
            <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </button>
            <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Análise de Tendências</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Crescimento</span>
              <span className="text-green-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Conversão</span>
              <span className="text-blue-400">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Retenção</span>
              <span className="text-purple-400">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
