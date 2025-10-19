'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Eye, 
  Package, 
  Calendar, 
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { OrderWithCustomer, OrderStatus } from '@/lib/types/database'
import OrderTimeline from '@/components/OrderTimeline'

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)

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
        .from('orders_with_customer')
        .select('*')
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
        customer_name: order.customer_name || order.profiles?.full_name,
        customer_email: order.customer_email || order.profiles?.email,
        customer_phone: order.customer_phone || order.profiles?.phone,
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
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/minha-conta"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 ml-4">
            Meus Pedidos
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhum pedido. Que tal começar a comprar?
            </p>
            <Link
              href="/"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          Pedido #{order.order_number}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Pedido em {formatDate(order.created_at)}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
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
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Informações do Pedido</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Data: {formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>Total: {formatCurrency(order.total_amount)}</span>
                        </div>
                        {order.tracking_code && (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            <span>Rastreamento: {order.tracking_code}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Endereço de Entrega</h4>
                      <div className="text-sm text-gray-600">
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
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Ações</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowTimeline(true)
                          }}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Acompanhar Pedido
                        </button>
                        <Link
                          href={`/minha-conta/pedidos/${order.id}`}
                          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Observações</h5>
                      <p className="text-sm text-gray-600">{order.notes}</p>
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
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowTimeline(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Acompanhamento - #{selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setShowTimeline(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
      </div>
    </div>
  )
}
