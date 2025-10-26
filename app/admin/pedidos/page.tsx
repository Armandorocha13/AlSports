'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  User,
  Calendar,
  DollarSign
} from 'lucide-react'
import { adminService, AdminOrder } from '@/lib/admin-service'

// Usar o tipo AdminOrder do serviço
type Order = AdminOrder

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  // Carregar pedidos do serviço
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const ordersData = await adminService.getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
        alert('Erro ao carregar pedidos')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'total':
        return b.total - a.total
      case 'customer':
        return a.customer.name.localeCompare(b.customer.name)
      default:
        return 0
    }
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pendente', 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: Clock
        }
      case 'confirmed':
        return { 
          label: 'Confirmado', 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: CheckCircle
        }
      case 'shipped':
        return { 
          label: 'Enviado', 
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: Truck
        }
      case 'delivered':
        return { 
          label: 'Entregue', 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: Package
        }
      case 'cancelled':
        return { 
          label: 'Cancelado', 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: XCircle
        }
      default:
        return { 
          label: 'Desconhecido', 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: Clock
        }
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
          : order
      ))
      alert('Status do pedido atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Pedidos</h1>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Pedidos</h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
            Gerencie todos os pedidos da sua loja
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Enviados</p>
              <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Faturamento</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-800 dark:text-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-800 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Ordenar por Data</option>
            <option value="total">Ordenar por Valor</option>
            <option value="customer">Ordenar por Cliente</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Itens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon

                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.items.length} item(s)
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items.map(item => item.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${statusInfo.color}`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {sortedOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Ainda não há pedidos em sua loja'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}