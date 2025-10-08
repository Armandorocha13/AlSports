'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  User,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { OrderWithCustomer, OrderStatus } from '@/lib/types/database'
import { useUserOrdersRealtime } from '@/hooks/useRealtime'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && (!user || profile?.user_type !== 'admin')) {
      router.push('/')
      return
    }

    if (user && profile?.user_type === 'admin') {
      fetchOrders()
    }
  }, [user, profile, authLoading])

  // Configurar Realtime para atualizações de pedidos
  useUserOrdersRealtime('all', (updatedOrder) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    )
  })

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders_with_customer')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pedidos:', error)
        return
      }

      setOrders(data || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, notes?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        throw error
      }

      // Adicionar ao histórico de status
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: newStatus,
          notes: notes || `Status alterado para ${getStatusText(newStatus)}`,
          updated_by: user?.id
        })

      if (historyError) {
        console.error('Erro ao adicionar histórico:', historyError)
      }

      // Atualizar lista local
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      )

      setShowOrderModal(false)
      setSelectedOrder(null)
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'entregue':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelado':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'aguardando_pagamento':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Package className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusText = (status: OrderStatus) => {
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
    return statusMap[status] || status
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'entregue':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'aguardando_pagamento':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || profile?.user_type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 ml-4">
              Gerenciar Pedidos
            </h1>
          </div>
          <div className="text-sm text-gray-600">
            {filteredOrders.length} pedido(s) encontrado(s)
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="all">Todos os Status</option>
                <option value="aguardando_pagamento">Aguardando Pagamento</option>
                <option value="pagamento_confirmado">Pagamento Confirmado</option>
                <option value="preparando_pedido">Preparando Pedido</option>
                <option value="enviado">Enviado</option>
                <option value="em_transito">Em Trânsito</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
                <option value="devolvido">Devolvido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.order_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.total_items} item(s)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.customer_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Modal */}
        {showOrderModal && selectedOrder && (
          <OrderStatusModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false)
              setSelectedOrder(null)
            }}
            onStatusUpdate={updateOrderStatus}
          />
        )}
      </div>
    </div>
  )
}

// Componente Modal para alterar status
function OrderStatusModal({ 
  order, 
  onClose, 
  onStatusUpdate 
}: { 
  order: OrderWithCustomer
  onClose: () => void
  onStatusUpdate: (orderId: string, status: OrderStatus, notes?: string) => void
}) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    await onStatusUpdate(order.id, newStatus, notes)
    setLoading(false)
  }

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'aguardando_pagamento', label: 'Aguardando Pagamento' },
    { value: 'pagamento_confirmado', label: 'Pagamento Confirmado' },
    { value: 'preparando_pedido', label: 'Preparando Pedido' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'em_transito', label: 'Em Trânsito' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'devolvido', label: 'Devolvido' }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pedido #{order.order_number}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XCircle size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Order Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Pedido</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Cliente:</span>
                    <p className="text-gray-900">{order.customer_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{order.customer_email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total:</span>
                    <p className="text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Data:</span>
                    <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Novo Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Adicione observações sobre a mudança de status..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || newStatus === order.status}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Atualizando...' : 'Atualizar Status'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
