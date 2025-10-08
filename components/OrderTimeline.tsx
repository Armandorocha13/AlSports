'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  MapPin
} from 'lucide-react'
import { OrderStatus, OrderStatusHistory } from '@/lib/types/database'
import { useOrderRealtime, useOrderStatusHistoryRealtime } from '@/hooks/useRealtime'
import { createClient } from '@/lib/supabase-client'

interface OrderTimelineProps {
  orderId: string
  currentStatus: OrderStatus
  statusHistory?: OrderStatusHistory[]
  realtime?: boolean
}

const statusConfig = {
  aguardando_pagamento: {
    title: 'Aguardando Pagamento',
    description: 'Seu pedido foi criado e está aguardando confirmação do pagamento.',
    icon: CreditCard,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  pagamento_confirmado: {
    title: 'Pagamento Confirmado',
    description: 'Pagamento aprovado! Seu pedido está sendo preparado.',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  preparando_pedido: {
    title: 'Preparando Pedido',
    description: 'Seus produtos estão sendo separados e embalados.',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  enviado: {
    title: 'Pedido Enviado',
    description: 'Seu pedido foi enviado e está a caminho.',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  em_transito: {
    title: 'Em Trânsito',
    description: 'Seu pedido está em trânsito para o endereço de entrega.',
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200'
  },
  entregue: {
    title: 'Entregue',
    description: 'Seu pedido foi entregue com sucesso!',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  cancelado: {
    title: 'Pedido Cancelado',
    description: 'Seu pedido foi cancelado.',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  },
  devolvido: {
    title: 'Devolvido',
    description: 'Seu pedido foi devolvido.',
    icon: RotateCcw,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  }
}

const statusOrder: OrderStatus[] = [
  'aguardando_pagamento',
  'pagamento_confirmado',
  'preparando_pedido',
  'enviado',
  'em_transito',
  'entregue'
]

export default function OrderTimeline({ 
  orderId, 
  currentStatus, 
  statusHistory = [],
  realtime = false 
}: OrderTimelineProps) {
  const [currentStatusState, setCurrentStatusState] = useState(currentStatus)
  const [history, setHistory] = useState(statusHistory)
  const supabase = createClient()

  // Configurar Realtime para atualizações do pedido
  useOrderRealtime(orderId, (order) => {
    if (order.status !== currentStatusState) {
      setCurrentStatusState(order.status)
    }
  })

  // Configurar Realtime para histórico de status
  useOrderStatusHistoryRealtime(orderId, (newHistoryItem) => {
    setHistory(prev => [...prev, newHistoryItem])
  })

  // Buscar histórico inicial se não fornecido
  useEffect(() => {
    if (statusHistory.length === 0 && realtime) {
      fetchStatusHistory()
    }
  }, [orderId, realtime])

  const fetchStatusHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar histórico:', error)
        return
      }

      setHistory(data || [])
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    }
  }

  const getStatusIndex = (status: OrderStatus) => {
    return statusOrder.indexOf(status)
  }

  const isStatusCompleted = (status: OrderStatus) => {
    const currentIndex = getStatusIndex(currentStatusState)
    const statusIndex = getStatusIndex(status)
    return statusIndex <= currentIndex
  }

  const isStatusCurrent = (status: OrderStatus) => {
    return status === currentStatusState
  }

  const getStatusHistory = (status: OrderStatus) => {
    return history.find(h => h.status === status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Acompanhamento do Pedido
        </h3>
        {realtime && (
          <div className="ml-auto flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            Tempo real
          </div>
        )}
      </div>

      <div className="space-y-4">
        {statusOrder.map((status, index) => {
          const config = statusConfig[status]
          const Icon = config.icon
          const isCompleted = isStatusCompleted(status)
          const isCurrent = isStatusCurrent(status)
          const statusHistoryItem = getStatusHistory(status)

          return (
            <div key={status} className="flex items-start">
              {/* Timeline Line */}
              <div className="flex flex-col items-center mr-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2
                  ${isCompleted 
                    ? `${config.bgColor} ${config.borderColor} ${config.color}` 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                  ${isCurrent ? 'ring-4 ring-primary-200' : ''}
                `}>
                  <Icon size={20} />
                </div>
                {index < statusOrder.length - 1 && (
                  <div className={`
                    w-0.5 h-8 mt-2
                    ${isCompleted ? 'bg-primary-300' : 'bg-gray-200'}
                  `} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center justify-between">
                  <h4 className={`
                    font-medium
                    ${isCompleted ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {config.title}
                  </h4>
                  {statusHistoryItem && (
                    <span className="text-sm text-gray-500">
                      {formatDate(statusHistoryItem.created_at)}
                    </span>
                  )}
                </div>
                
                <p className={`
                  text-sm mt-1
                  ${isCompleted ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {config.description}
                </p>

                {statusHistoryItem?.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Observação:</strong> {statusHistoryItem.notes}
                  </div>
                )}

                {isCurrent && (
                  <div className="mt-2 flex items-center text-sm text-primary-600">
                    <Clock size={16} className="mr-1" />
                    Status atual
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Informações Adicionais */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Número do Pedido:</span>
            <p className="text-gray-600">{orderId}</p>
          </div>
          <div>
            <span className="font-medium text-gray-900">Status Atual:</span>
            <p className="text-gray-600">{statusConfig[currentStatusState].title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
