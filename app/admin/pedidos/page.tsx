'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { emailService } from '@/lib/email-service'
import { 
  ShoppingCart,
  Package,
  User,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search, 
  Filter, 
  RefreshCw,
  Bell,
  Truck,
  Edit, 
  Trash2,
  Plus,
  Mail,
  Save,
  X,
  MessageCircle
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  status: string
  total_amount: number
  created_at: string
  items_count: number
  shipping_address: any
  notes?: string
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_email: '',
    status: '',
    notes: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    customer_name: '',
    customer_email: '',
    total_amount: 0,
    shipping_address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zip_code: ''
    }
  })
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()

    // Configurar atualização em tempo real
    const interval = setInterval(() => {
      fetchOrders()
      setLastUpdate(new Date())
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      // Buscar pedidos do banco de dados
      const { data: dbOrders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pedidos do banco:', error)
      }

      // Buscar pedidos WhatsApp do banco de dados
      let whatsappOrders = []
      let whatsappError = null

      try {
        const { data, error } = await supabase
          .from('whatsapp_orders')
          .select('*')
          .order('created_at', { ascending: false })

        whatsappOrders = data || []
        whatsappError = error

        if (whatsappError) {
          console.error('❌ Erro ao buscar pedidos WhatsApp:', whatsappError)
        }

        console.log('📱 Pedidos WhatsApp encontrados na tabela whatsapp_orders:', whatsappOrders.length)
      } catch (error) {
        console.log('⚠️ Tabela whatsapp_orders não disponível, buscando na tabela orders...')
        
        // Fallback: buscar pedidos WhatsApp na tabela orders
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

          if (ordersError) {
            console.error('❌ Erro ao buscar pedidos na tabela orders:', ordersError)
          } else {
            // Filtrar apenas pedidos que parecem ser WhatsApp (baseado em padrões)
            whatsappOrders = (ordersData || []).filter(order => 
              order.order_number?.includes('ALS-') || 
              order.notes?.includes('WhatsApp') ||
              order.customer_email
            )
            console.log('📱 Pedidos WhatsApp encontrados na tabela orders:', whatsappOrders.length)
          }
        } catch (fallbackError) {
          console.error('❌ Erro no fallback para tabela orders:', fallbackError)
        }
      }
      
      // Mapear pedidos do banco tradicional
      const formattedDbOrders = (dbOrders || []).map(order => ({
        ...order,
        items_count: order.order_items?.[0]?.count || 0,
        source: 'database'
      }))

      // Mapear pedidos WhatsApp do banco
      const formattedWhatsappOrders = (whatsappOrders || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        status: order.status,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items_count: order.items?.length || 0,
        source: 'whatsapp',
        method: 'whatsapp'
      }))
      
      console.log('📱 Pedidos WhatsApp mapeados:', formattedWhatsappOrders.length)

      // Combinar todos os pedidos
      const allOrders = [...formattedDbOrders, ...formattedWhatsappOrders]
      
      // Ordenar por data de criação (mais recentes primeiro)
      allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      // Verificar novos pedidos
      const currentTime = new Date()
      const recentOrders = allOrders.filter(order => {
        const orderTime = new Date(order.created_at)
        const timeDiff = currentTime.getTime() - orderTime.getTime()
        return timeDiff < 300000 // Últimos 5 minutos
      })
      
      setNewOrdersCount(recentOrders.length)
      setOrders(allOrders)
      
      console.log('📋 Pedidos encontrados:', allOrders.length)
      console.log('📊 Pedidos do banco:', formattedDbOrders.length)
      console.log('📱 Pedidos WhatsApp:', whatsappOrders.length)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === id)
      if (!order) return

      // Verificar se é um pedido WhatsApp
      if ((order as any).source === 'whatsapp') {
        // Tentar atualizar na tabela whatsapp_orders primeiro
        try {
          const { error } = await supabase
            .from('whatsapp_orders')
            .update({ 
              status: newStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)

          if (error) {
            console.error('❌ Erro ao atualizar em whatsapp_orders:', error)
            throw error
          }
          
          console.log('✅ Status atualizado no banco whatsapp_orders:', newStatus)
        } catch (whatsappError) {
          console.log('⚠️ Tabela whatsapp_orders não disponível, tentando tabela orders...')
          
          // Fallback: atualizar na tabela orders
          const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id)

          if (error) {
            console.error('❌ Erro ao atualizar na tabela orders:', error)
            throw error
          }
          
          console.log('✅ Status atualizado na tabela orders:', newStatus)
        }
      } else {
        // Atualizar no banco de dados
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', id)

        if (error) throw error
        
        // Atualizar histórico de status
        await supabase
          .from('order_status_history')
          .insert({
            order_id: id,
            status: newStatus,
            notes: `Status alterado para ${getStatusText(newStatus)}`
          })
      }
      
      // Atualizar estado local
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ))
      
      // Enviar notificação por email
      await sendStatusNotification(order, newStatus)
      
      alert(`Status do pedido ${order.order_number} atualizado para ${getStatusText(newStatus)}`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  const sendStatusNotification = async (order: Order, newStatus: string) => {
    try {
      setSendingEmail(order.id)
      
      const success = await emailService.sendOrderStatusUpdate(
        order.customer_email,
        order.customer_name,
        order.order_number,
        newStatus,
        order
      )

      if (success) {
        console.log('✅ Email de notificação enviado com sucesso')
      } else {
        console.log('❌ Falha ao enviar email de notificação')
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
    } finally {
      setSendingEmail(null)
    }
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setEditForm({
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      status: order.status,
      notes: order.notes || ''
    })
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedOrder) return

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: editForm.customer_name,
          customer_email: editForm.customer_email,
          status: editForm.status,
          notes: editForm.notes
        })
        .eq('id', selectedOrder.id)

      if (error) throw error

      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, ...editForm }
          : order
      ))

      // Se o status mudou, enviar notificação
      if (editForm.status !== selectedOrder.status) {
        await sendStatusNotification(
          { ...selectedOrder, ...editForm },
          editForm.status
        )
      }

      setIsEditing(false)
      setSelectedOrder(null)
      alert('Pedido atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
      alert('Erro ao atualizar pedido')
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) throw error

      setOrders(orders.filter(order => order.id !== id))
      alert('Pedido excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
      alert('Erro ao excluir pedido')
    }
  }

  const handleCreateOrder = async () => {
    try {
      const orderNumber = `ALS-${Date.now()}`
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: createForm.customer_name,
          customer_email: createForm.customer_email,
          total_amount: createForm.total_amount,
          shipping_address: createForm.shipping_address,
          status: 'aguardando_pagamento',
          subtotal: createForm.total_amount,
          shipping_cost: 0,
          discount_amount: 0
        })
        .select()

      if (error) throw error

      setOrders([data[0], ...orders])
      setShowCreateModal(false)
      setCreateForm({
        customer_name: '',
        customer_email: '',
        total_amount: 0,
        shipping_address: {
          street: '',
          number: '',
          city: '',
          state: '',
          zip_code: ''
        }
      })
      alert('Pedido criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao criar pedido')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando_pagamento': return 'bg-yellow-600'
      case 'pagamento_confirmado': return 'bg-blue-600'
      case 'preparando_pedido': return 'bg-orange-600'
      case 'enviado': return 'bg-purple-600'
      case 'em_transito': return 'bg-indigo-600'
      case 'entregue': return 'bg-green-600'
      case 'cancelado': return 'bg-red-600'
      case 'devolvido': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aguardando_pagamento': return 'Aguardando Pagamento'
      case 'pagamento_confirmado': return 'Pagamento Confirmado'
      case 'preparando_pedido': return 'Preparando Pedido'
      case 'enviado': return 'Enviado'
      case 'em_transito': return 'Em Trânsito'
      case 'entregue': return 'Entregue'
      case 'cancelado': return 'Cancelado'
      case 'devolvido': return 'Devolvido'
      default: return status
    }
  }

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(order => !statusFilter || order.status === statusFilter)

  const pendingOrders = orders.filter(o => o.status === 'aguardando_pagamento')
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const todayRevenue = orders
    .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total_amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header com atualização em tempo real */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Pedidos em Tempo Real</h1>
          <p className="text-gray-400">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            {newOrdersCount > 0 && (
              <span className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                {newOrdersCount} novo(s)
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </button>
          <button
            onClick={fetchOrders}
            className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Estatísticas em tempo real */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-white">{pendingOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Entregues</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'entregue').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Receita Hoje</p>
              <p className="text-2xl font-bold text-white">
                R$ {todayRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Pedidos WhatsApp</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.source === 'whatsapp').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
              placeholder="Buscar pedido, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>
              <select
                value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
            <option value="">Todos os status</option>
                <option value="aguardando_pagamento">Aguardando Pagamento</option>
                <option value="pagamento_confirmado">Pagamento Confirmado</option>
                <option value="preparando_pedido">Preparando Pedido</option>
                <option value="enviado">Enviado</option>
                <option value="em_transito">Em Trânsito</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>
          </div>
        </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
                {filteredOrders.map((order) => (
          <div key={order.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-white mr-3">
                    Pedido #{order.order_number}
                  </h3>
                  {order.source === 'whatsapp' && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white mr-2 flex items-center">
                      📱 WhatsApp
                    </span>
                  )}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>
                    <p><strong>Cliente:</strong> {order.customer_name}</p>
                    <p><strong>Email:</strong> {order.customer_email}</p>
                    {order.customer_phone && (
                      <p><strong>Telefone:</strong> {order.customer_phone}</p>
                    )}
                    {order.source === 'whatsapp' && (
                      <p><strong>Método:</strong> 📱 WhatsApp</p>
                    )}
                          </div>
                  <div>
                    <p><strong>Itens:</strong> {order.items_count}</p>
                    <p><strong>Total:</strong> R$ {order.total_amount.toFixed(2)}</p>
                    {order.shipping_cost && (
                      <p><strong>Frete:</strong> R$ {order.shipping_cost.toFixed(2)}</p>
                    )}
                          </div>
                        </div>
                {order.shipping_address && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p><strong>Endereço:</strong> {order.shipping_address.street}, {order.shipping_address.number} - {order.shipping_address.city}</p>
          </div>
                )}
                {order.notes && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p><strong>Observações:</strong> {order.notes}</p>
                  </div>
                )}
                  </div>
              <div className="text-right text-sm text-gray-400">
                <p>{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                <p>{new Date(order.created_at).toLocaleTimeString('pt-BR')}</p>
                      </div>
                      </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                    <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="aguardando_pagamento">Aguardando Pagamento</option>
                  <option value="pagamento_confirmado">Pagamento Confirmado</option>
                  <option value="preparando_pedido">Preparando Pedido</option>
                  <option value="enviado">Enviado</option>
                  <option value="em_transito">Em Trânsito</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                    </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                  onClick={() => handleEditOrder(order)}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Editar pedido"
                >
                  <Edit className="h-4 w-4" />
                        </button>
                        <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  title="Excluir pedido"
                >
                  <Trash2 className="h-4 w-4" />
                        </button>
                {sendingEmail === order.id && (
                  <div className="p-2 bg-yellow-600 text-white rounded">
                    <Mail className="h-4 w-4 animate-pulse" />
        </div>
        )}
      </div>
    </div>
        </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum pedido encontrado</h3>
          <p className="text-gray-400">
            {searchTerm || statusFilter 
              ? 'Tente ajustar os filtros de busca'
              : 'Ainda não há pedidos registrados'
            }
          </p>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditing && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Editar Pedido #{selectedOrder.order_number}</h3>
            <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-white"
            >
                <X className="h-6 w-6" />
            </button>
          </div>
          
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Cliente
                  </label>
                  <input
                    type="text"
                    value={editForm.customer_name}
                    onChange={(e) => setEditForm({...editForm, customer_name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email do Cliente
                  </label>
                  <input
                    type="email"
                    value={editForm.customer_email}
                    onChange={(e) => setEditForm({...editForm, customer_email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                    </label>
                    <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="aguardando_pagamento">Aguardando Pagamento</option>
                  <option value="pagamento_confirmado">Pagamento Confirmado</option>
                  <option value="preparando_pedido">Preparando Pedido</option>
                  <option value="enviado">Enviado</option>
                  <option value="em_transito">Em Trânsito</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  
                  <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Observações
                    </label>
                    <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Observações sobre o pedido..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Criar Novo Pedido</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={createForm.customer_name}
                    onChange={(e) => setCreateForm({...createForm, customer_name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email do Cliente *
                  </label>
                  <input
                    type="email"
                    value={createForm.customer_email}
                    onChange={(e) => setCreateForm({...createForm, customer_email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                    />
                  </div>
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor Total *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createForm.total_amount}
                  onChange={(e) => setCreateForm({...createForm, total_amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endereço de Entrega
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Rua"
                    value={createForm.shipping_address.street}
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      shipping_address: {...createForm.shipping_address, street: e.target.value}
                    })}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={createForm.shipping_address.number}
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      shipping_address: {...createForm.shipping_address, number: e.target.value}
                    })}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={createForm.shipping_address.city}
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      shipping_address: {...createForm.shipping_address, city: e.target.value}
                    })}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    value={createForm.shipping_address.state}
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      shipping_address: {...createForm.shipping_address, state: e.target.value}
                    })}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
              </div>
            </div>
          </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrder}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}