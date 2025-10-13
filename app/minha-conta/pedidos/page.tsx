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
      // Por enquanto, buscar apenas do localStorage até as tabelas estarem configuradas
      const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
      
      // Filtrar pedidos do usuário atual
      const userOrders = localOrders.filter((order: any) => 
        order.customer_email === user.email
      )
      
      // Mapear para o formato esperado
      const allOrders = userOrders.map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name || order.customer?.name,
        customer_email: order.customer_email || order.customer?.email,
        customer_phone: order.customer_phone || order.customer?.phone,
        status: order.status,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        notes: order.notes,
        created_at: order.created_at,
        method: order.method || 'whatsapp'
      }))

      // Ordenar por data de criação (mais recentes primeiro)
      allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      console.log('📋 Pedidos encontrados no localStorage:', allOrders.length)
      setOrders(allOrders)
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
                        <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                        {order.shipping_address.complement && (
                          <p>{order.shipping_address.complement}</p>
                        )}
                        <p>{order.shipping_address.neighborhood}</p>
                        <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                        <p>CEP: {order.shipping_address.zip_code}</p>
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
