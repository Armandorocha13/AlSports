'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  order_code: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  user_name: string
  user_email: string
  user_phone: string
  shipping_address?: string
  payment_method?: string
}

const statusOptions = [
  { value: 'aguardando_pagamento', label: 'Aguardando Pagamento', color: 'yellow' },
  { value: 'pago', label: 'Pago', color: 'green' },
  { value: 'processando', label: 'Processando', color: 'blue' },
  { value: 'enviado', label: 'Enviado', color: 'purple' },
  { value: 'entregue', label: 'Entregue', color: 'green' },
  { value: 'cancelado', label: 'Cancelado', color: 'red' }
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders_with_customer')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      // Add status history entry
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: newStatus,
          created_at: new Date().toISOString()
        })

    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    const matchesDate = !dateFilter || 
      order.created_at.startsWith(dateFilter)
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    if (!statusOption) return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    
    const colorMap = {
      yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      green: 'bg-green-500/10 text-green-400 border-green-500/30',
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      red: 'bg-red-500/10 text-red-400 border-red-500/30'
    }
    
    return colorMap[statusOption.color as keyof typeof colorMap]
  }

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption?.label || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aguardando_pagamento':
        return <CreditCard className="w-4 h-4" />
      case 'pago':
        return <CheckCircle className="w-4 h-4" />
      case 'processando':
        return <Clock className="w-4 h-4" />
      case 'enviado':
        return <Truck className="w-4 h-4" />
      case 'entregue':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelado':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Pedidos</h1>
          <p className="text-gray-400 mt-2">Acompanhe e gerencie todos os pedidos</p>
        </div>
        <button className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          {/* Actions */}
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      #{order.order_code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {order.user_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {order.user_email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(order.total_amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderModal(true)
                        }}
                        className="text-primary-400 hover:text-primary-300"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderModal(true)
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="Editar Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter || dateFilter 
                ? 'Tente ajustar os filtros de busca' 
                : 'Ainda não há pedidos registrados'
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Pedido #{selectedOrder.order_code}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Cliente
                  </label>
                  <p className="text-white">{selectedOrder.user_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <p className="text-white">{selectedOrder.user_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Telefone
                  </label>
                  <p className="text-white">{selectedOrder.user_phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Valor Total
                  </label>
                  <p className="text-white font-semibold">
                    {formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Atualizar Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, status.value)
                        setShowOrderModal(false)
                      }}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedOrder.status === status.value
                          ? 'bg-primary-500 text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statusOptions.map(status => {
          const count = orders.filter(o => o.status === status.value).length
          return (
            <div key={status.value} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{status.label}</p>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  status.color === 'yellow' ? 'bg-yellow-500/10' :
                  status.color === 'green' ? 'bg-green-500/10' :
                  status.color === 'blue' ? 'bg-blue-500/10' :
                  status.color === 'purple' ? 'bg-purple-500/10' :
                  'bg-red-500/10'
                }`}>
                  {getStatusIcon(status.value)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}