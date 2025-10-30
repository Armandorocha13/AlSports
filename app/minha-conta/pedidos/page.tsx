'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Mail,
    MapPin,
    Package,
    Phone,
    ShoppingCart,
    Truck,
    User,
    X,
    XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// Order type already defined in database types
import OrderTimeline from '@/components/OrderTimeline'
import { OrderStatus, OrderWithCustomer } from '@/lib/types/database'

interface OrderItem {
  id: string
  product_name: string
  product_sku?: string
  product_image_url?: string
  size?: string
  color?: string
  quantity: number
  unit_price: number
  total_price: number
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loadingItems, setLoadingItems] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/minha-conta/pedidos')
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    if (!user) return

    try {
      // Buscar pedidos WhatsApp do banco de dados
      let whatsappOrders = []
      let whatsappError = null

      try {
        const { data, error } = await supabase
          .from('whatsapp_orders')
          .select('*')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false })

        whatsappOrders = data || []
        whatsappError = error

        if (whatsappError) {
          console.error('❌ Erro ao buscar pedidos WhatsApp:', whatsappError)
        }
      } catch (error) {
        console.log('⚠️ Tabela whatsapp_orders não disponível, buscando na tabela orders...')
        
        // Fallback: buscar pedidos WhatsApp na tabela orders
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_email', user.email)
            .order('created_at', { ascending: false })

          if (ordersError) {
            console.error('❌ Erro ao buscar pedidos na tabela orders:', ordersError)
          } else {
            // Filtrar apenas pedidos que parecem ser WhatsApp
            whatsappOrders = (ordersData || []).filter(order => 
              order.order_number?.includes('ALS-') || 
              order.notes?.includes('WhatsApp')
            )
            console.log('📱 Pedidos WhatsApp encontrados na tabela orders:', whatsappOrders.length)
          }
        } catch (fallbackError) {
          console.error('❌ Erro no fallback para tabela orders:', fallbackError)
        }
      }

      // Buscar pedidos tradicionais do banco de dados
      const { data: dbOrders, error: dbError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (dbError) {
        console.error('❌ Erro ao buscar pedidos do banco:', dbError)
      }

      // Mapear pedidos WhatsApp
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
        method: 'whatsapp'
      }))

      // Mapear pedidos tradicionais
      const formattedDbOrders = (dbOrders || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.profiles?.full_name || 'Cliente',
        customer_email: order.profiles?.email || '',
        customer_phone: order.profiles?.phone || '',
        status: order.status,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        notes: order.notes,
        created_at: order.created_at,
        method: 'database'
      }))

      // Combinar todos os pedidos
      const allOrders = [...formattedWhatsappOrders, ...formattedDbOrders]

      // Ordenar por data de criação (mais recentes primeiro)
      allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      console.log('📋 Pedidos encontrados:', allOrders.length)
      console.log('📱 Pedidos WhatsApp:', formattedWhatsappOrders.length)
      console.log('📊 Pedidos tradicionais:', formattedDbOrders.length)
      setOrders(allOrders as any)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
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
        return 'bg-green-900 text-green-400 border border-green-400'
      case 'cancelado':
        return 'bg-red-900 text-red-400 border border-red-400'
      case 'aguardando_pagamento':
        return 'bg-yellow-900 text-yellow-400 border border-yellow-400'
      default:
        return 'bg-blue-900 text-blue-400 border border-blue-400'
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

  const fetchOrderItems = async (orderId: string) => {
    setLoadingItems(true)
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar itens do pedido:', error)
        setOrderItems([])
      } else {
        setOrderItems(data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar itens do pedido:', error)
      setOrderItems([])
    } finally {
      setLoadingItems(false)
    }
  }

  const handleViewDetails = async (order: OrderWithCustomer) => {
    setSelectedOrder(order)
    setShowDetails(true)
    await fetchOrderItems(order.id)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/minha-conta"
            className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white ml-4">
            Meus Pedidos
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-900 border border-yellow-400 rounded-lg shadow p-8 text-center">
            <Package className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-300 mb-6">
              Você ainda não fez nenhum pedido. Que tal começar a comprar?
            </p>
            <Link
              href="/"
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors duration-200 font-semibold"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-900 border border-yellow-400 rounded-lg shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium text-white">
                          Pedido #{order.order_number}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-400">
                        Pedido em {formatDate(order.created_at)}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Informações do Pedido</h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                          <span>Data: {formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-yellow-400" />
                          <span>Total: {formatCurrency(order.total_amount)}</span>
                        </div>
                        {order.tracking_code && (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-2 text-yellow-400" />
                            <span>Rastreamento: {order.tracking_code}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Endereço de Entrega</h4>
                      <div className="text-sm text-gray-300">
                        <p>{(order.shipping_address as any)?.street}, {(order.shipping_address as any)?.number}</p>
                        {(order.shipping_address as any)?.complement && (
                          <p>{(order.shipping_address as any).complement}</p>
                        )}
                        <p>{(order.shipping_address as any)?.neighborhood}</p>
                        <p>{(order.shipping_address as any)?.city} - {(order.shipping_address as any)?.state}</p>
                        <p>CEP: {(order.shipping_address as any)?.zip_code}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Ações</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowTimeline(true)
                          }}
                          className="w-full flex items-center justify-center px-4 py-2 border border-yellow-400 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Acompanhar Pedido
                        </button>
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors duration-200"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-4 p-3 bg-yellow-900 border border-yellow-400 rounded-lg">
                      <h5 className="text-sm font-medium text-yellow-400 mb-1">Observações</h5>
                      <p className="text-sm text-gray-300">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Modal */}
        {showTimeline && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setShowTimeline(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-gray-900 border-l border-yellow-400 shadow-xl">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-yellow-400 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">
                    Acompanhamento - #{selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setShowTimeline(false)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <OrderTimeline
                    orderId={selectedOrder.id}
                    currentStatus={selectedOrder.status}
                    realtime={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setShowDetails(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-yellow-400 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between border-b border-yellow-400 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    Detalhes do Pedido #{selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="p-6 space-y-6">
                    {/* Order Status and Info */}
                    <div className="bg-yellow-900 border border-yellow-400 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(selectedOrder.status)}
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {getStatusText(selectedOrder.status)}
                            </h3>
                            <p className="text-sm text-yellow-400">
                              Pedido em {formatDate(selectedOrder.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            {formatCurrency(selectedOrder.total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800 border border-yellow-400 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-yellow-400 mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Informações do Cliente
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-yellow-400" />
                            <span className="text-white">{selectedOrder.customer_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-yellow-400" />
                            <span className="text-gray-300">{selectedOrder.customer_email}</span>
                          </div>
                          {selectedOrder.customer_phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-yellow-400" />
                              <span className="text-gray-300">{selectedOrder.customer_phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800 border border-yellow-400 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-yellow-400 mb-3 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Endereço de Entrega
                        </h4>
                        <div className="text-sm text-gray-300">
                          <p>{(selectedOrder.shipping_address as any)?.street}, {(selectedOrder.shipping_address as any)?.number}</p>
                          {(selectedOrder.shipping_address as any)?.complement && (
                            <p>{(selectedOrder.shipping_address as any).complement}</p>
                          )}
                          <p>{(selectedOrder.shipping_address as any)?.neighborhood}</p>
                          <p>{(selectedOrder.shipping_address as any)?.city} - {(selectedOrder.shipping_address as any)?.state}</p>
                          <p>CEP: {(selectedOrder.shipping_address as any)?.zip_code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-800 border border-yellow-400 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-yellow-400 mb-4 flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Itens do Pedido
                      </h4>
                      
                      {loadingItems ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                        </div>
                      ) : orderItems.length > 0 ? (
                        <div className="space-y-4">
                          {orderItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-900 border border-yellow-400 rounded-lg">
                              {item.product_image_url && (
                                <img
                                  src={item.product_image_url}
                                  alt={item.product_name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-medium text-white">{item.product_name}</h5>
                                {item.product_sku && (
                                  <p className="text-sm text-yellow-400">SKU: {item.product_sku}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-1">
                                  {item.size && (
                                    <span className="text-sm text-gray-300">Tamanho: {item.size}</span>
                                  )}
                                  {item.color && (
                                    <span className="text-sm text-gray-300">Cor: {item.color}</span>
                                  )}
                                  <span className="text-sm text-gray-300">Qtd: {item.quantity}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-white">
                                  {formatCurrency(item.unit_price)}
                                </p>
                                <p className="text-sm text-yellow-400">
                                  Total: {formatCurrency(item.total_price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-300">
                          <Package className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                          <p>Nenhum item encontrado para este pedido</p>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-yellow-900 border border-yellow-400 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-yellow-400 mb-3">Resumo do Pedido</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Subtotal:</span>
                          <span className="font-medium text-white">{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Frete:</span>
                          <span className="font-medium text-white">{formatCurrency(selectedOrder.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-yellow-400 pt-2">
                          <span className="text-yellow-400">Total:</span>
                          <span className="text-white">{formatCurrency(selectedOrder.total_amount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedOrder.notes && (
                      <div className="bg-yellow-900 border border-yellow-400 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-yellow-400 mb-2">Observações</h4>
                        <p className="text-sm text-gray-300">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
