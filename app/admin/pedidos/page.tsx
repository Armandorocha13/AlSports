'use client'

import { AdminOrder, adminService } from '@/lib/admin-service'
import {
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    DollarSign,
    Edit,
    Eye,
    Package,
    Search,
    Trash2,
    Truck,
    User,
    X,
    XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'

// Usar o tipo AdminOrder do serviço
type Order = AdminOrder

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)

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
      setUpdatingStatus(orderId)
      const success = await adminService.updateOrderStatus(orderId, newStatus)
      
      if (success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
            : order
        ))
      } else {
        alert('Erro ao atualizar status do pedido. Verifique se o pedido existe no banco de dados.')
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      const errorMessage = error?.message || 'Erro desconhecido ao atualizar status do pedido'
      alert(`Erro ao atualizar status do pedido: ${errorMessage}`)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order)
    setShowModal(true)
    
    // Sempre verificar se há itens no banco quando abrir o modal
    setLoadingItems(true)
    try {
      // Usar função de verificação que retorna mais informações
      const verification = await adminService.verifyOrderItems(order.id)
      
      console.log(`🔍 Verificação do pedido ${order.id}:`, verification)
      
      if (verification.itemsCount > 0) {
        // Encontrou itens, atualizar
        setSelectedOrder({
          ...order,
          items: verification.items
        })
        // Atualizar também na lista de pedidos
        setOrders(prev => prev.map(o => 
          o.id === order.id ? { ...o, items: verification.items } : o
        ))
        console.log(`✅ ${verification.itemsCount} item(ns) encontrado(s) para pedido ${order.id}`)
      } else if (verification.error) {
        console.error(`❌ Erro na verificação: ${verification.error}`)
        // Ainda assim atualizar para mostrar mensagem de erro
        setSelectedOrder({
          ...order,
          items: []
        })
      } else {
        console.warn(`⚠️ Pedido ${order.id} não possui itens no banco de dados`)
        // Garantir que items está vazio
        setSelectedOrder({
          ...order,
          items: []
        })
      }
    } catch (error) {
      console.error('Erro ao verificar itens do pedido:', error)
      setSelectedOrder({
        ...order,
        items: []
      })
    } finally {
      setLoadingItems(false)
    }
  }

  const handleEdit = (order: Order) => {
    setEditingOrder({ ...order })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingOrder) return

    // Validar dados antes de salvar
    if (!editingOrder.customer.name.trim() || !editingOrder.customer.email.trim()) {
      alert('Por favor, preencha pelo menos o nome e email do cliente')
      return
    }

    if (!editingOrder.items || editingOrder.items.length === 0) {
      alert('O pedido deve ter pelo menos um item')
      return
    }

    const invalidItems = editingOrder.items.filter(
      item => !item.name.trim() || item.quantity <= 0 || item.price < 0
    )

    if (invalidItems.length > 0) {
      alert('Por favor, verifique se todos os itens têm nome, quantidade maior que zero e preço válido')
      return
    }

    try {
      setSavingOrder(true)
      const success = await adminService.updateOrder(editingOrder.id, editingOrder)
      
      if (success) {
        // Atualizar lista de pedidos
        setOrders(prev => prev.map(order => 
          order.id === editingOrder.id 
            ? { ...editingOrder, updatedAt: new Date().toISOString() }
            : order
        ))
        setShowEditModal(false)
        setEditingOrder(null)
        alert('Pedido atualizado com sucesso!')
      } else {
        alert('Erro ao atualizar pedido. Verifique se o pedido existe no banco de dados.')
      }
    } catch (error: any) {
      console.error('Erro ao salvar pedido:', error)
      const errorMessage = error?.message || 'Erro desconhecido ao salvar pedido'
      alert(`Erro ao salvar pedido: ${errorMessage}`)
    } finally {
      setSavingOrder(false)
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingOrder(null)
  }

  const updateEditingOrder = (field: keyof Order, value: any) => {
    if (!editingOrder) return
    
    if (field === 'customer') {
      setEditingOrder({
        ...editingOrder,
        customer: { ...editingOrder.customer, ...value }
      })
    } else if (field === 'items') {
      setEditingOrder({
        ...editingOrder,
        items: value,
        total: value.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0)
      })
    } else {
      setEditingOrder({
        ...editingOrder,
        [field]: value
      })
      
      // Recalcular total se items ou preços foram alterados
      if (field === 'items' || (field in editingOrder && field === 'items')) {
        const newTotal = editingOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
        setEditingOrder(prev => prev ? { ...prev, total: newTotal } : null)
      }
    }
  }

  const updateItem = (index: number, field: 'name' | 'quantity' | 'price', value: any) => {
    if (!editingOrder) return
    
    const updatedItems = [...editingOrder.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'price' ? Number(value) : value
    }
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    })
  }

  const removeItem = (index: number) => {
    if (!editingOrder) return
    
    const updatedItems = editingOrder.items.filter((_, i) => i !== index)
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      total: newTotal
    })
  }

  const addItem = () => {
    if (!editingOrder) return
    
    setEditingOrder({
      ...editingOrder,
      items: [
        ...editingOrder.items,
        { name: '', quantity: 1, price: 0 }
      ]
    })
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setDeletingOrder(orderId)
      const success = await adminService.deleteOrder(orderId)
      
      if (success) {
        setOrders(prev => prev.filter(order => order.id !== orderId))
        alert('Pedido excluído com sucesso!')
      } else {
        alert('Erro ao excluir pedido')
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
      alert('Erro ao excluir pedido')
    } finally {
      setDeletingOrder(null)
    }
  }

  const reloadOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await adminService.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Erro ao recarregar pedidos:', error)
      alert('Erro ao recarregar pedidos')
    } finally {
      setLoading(false)
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
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie todos os pedidos da sua loja
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total de Pedidos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pendentes</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Enviados</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{orders.filter(o => o.status === 'shipped').length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Entregues</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Faturamento</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Pedidos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por pedido, cliente ou email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtro de Status */}
          <div className="lg:w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900 font-medium appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 bg-white"
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Ordenação */}
          <div className="lg:w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar por
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900 font-medium appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Data (Mais Recente)</option>
                <option value="total">Valor (Maior)</option>
                <option value="customer">Cliente (A-Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicadores de filtros ativos */}
        {(searchTerm || filterStatus !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Filtros ativos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                Busca: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                Status: {getStatusInfo(filterStatus).label}
                <button
                  onClick={() => setFilterStatus('all')}
                  className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setSortBy('createdAt')
              }}
              className="ml-auto text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Itens
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon

                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {order.id}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {order.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {order.items.length > 0 ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}` : '0 item(s)'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate" title={order.items.length > 0 
                        ? order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')
                        : 'Nenhum item cadastrado'
                      }>
                        {order.items.length > 0 ? (
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  {item.quantity}x
                                </span>
                                <span className="truncate">{item.name}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <span className="text-gray-500 dark:text-gray-400 italic">
                                +{order.items.length - 2} mais...
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 italic">
                            Nenhum item cadastrado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border-0 ${statusInfo.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      {updatingStatus === order.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mt-1 ml-2"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Ver detalhes"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(order)}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                          title="Editar pedido"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(order.id)}
                          disabled={deletingOrder === order.id}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir pedido"
                        >
                          {deletingOrder === order.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
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

      {/* Modal de Detalhes */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalhes do Pedido - {selectedOrder.id}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedOrder(null)
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações do Cliente */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Cliente
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Nome:</span> {selectedOrder.customer.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Email:</span> {selectedOrder.customer.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Telefone:</span> {selectedOrder.customer.phone}
                  </p>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Endereço de Entrega
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                  {/* Separar o endereço principal do CEP */}
                  {(() => {
                    const addressText = selectedOrder.shippingAddress
                    const cepMatch = addressText.match(/CEP:\s*([0-9-]+)/i)
                    const addressWithoutCep = addressText.replace(/\s*-\s*CEP:.*$/i, '').trim()
                    
                    return (
                      <>
                        {addressWithoutCep && (
                          <div className="flex flex-col">
                            {addressWithoutCep.split(' - ').map((part, idx) => (
                              <div key={idx}>{part}</div>
                            ))}
                          </div>
                        )}
                        {cepMatch && (
                          <div className="flex items-center gap-2 pt-1 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">CEP:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {cepMatch[1]}
                            </span>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Itens do Pedido ({selectedOrder.items.length})
                </h3>
                {loadingItems ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Buscando itens do pedido...
                    </span>
                  </div>
                ) : selectedOrder.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Quantidade: {item.quantity} × R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          R$ {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Este pedido não possui itens cadastrados no banco de dados.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Verifique se os itens foram salvos corretamente durante a criação do pedido.
                    </p>
                  </div>
                )}
              </div>

              {/* Informações de Pagamento e Total */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pagamento
                  </h3>
                  <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border-0 ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Método:</span> {selectedOrder.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Data:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        Total:
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        R$ {selectedOrder.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editar Pedido - {editingOrder.id}
              </h2>
              <button
                onClick={handleCancelEdit}
                disabled={savingOrder}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações do Cliente */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Cliente
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={editingOrder.customer.name}
                      onChange={(e) => updateEditingOrder('customer', { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingOrder.customer.email}
                      onChange={(e) => updateEditingOrder('customer', { email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={editingOrder.customer.phone}
                      onChange={(e) => updateEditingOrder('customer', { phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => updateEditingOrder('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Endereço de Entrega
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Endereço Completo
                  </label>
                  <textarea
                    value={editingOrder.shippingAddress}
                    onChange={(e) => updateEditingOrder('shippingAddress', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
                  />
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Itens do Pedido ({editingOrder.items.length})
                  </h3>
                  <button
                    onClick={addItem}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    + Adicionar Item
                  </button>
                </div>
                <div className="space-y-3">
                  {editingOrder.items.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-5">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome do Produto
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Preço Unit.
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-gray-900"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remover item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subtotal: R$ {(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de Pagamento
                </label>
                <input
                  type="text"
                  value={editingOrder.paymentMethod}
                  onChange={(e) => updateEditingOrder('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-900"
                />
              </div>

              {/* Total */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Total:
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {editingOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={savingOrder}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingOrder}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}