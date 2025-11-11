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
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-400'
  },
  pagamento_confirmado: {
    title: 'Pagamento Aprovado',
    description: 'Pagamento confirmado! Seu pedido será preparado em breve.',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-400'
  },
  preparando_pedido: {
    title: 'Em Separação',
    description: 'Seus produtos estão sendo separados e embalados.',
    icon: Package,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-400'
  },
  enviado: {
    title: 'Enviado',
    description: 'Seu pedido foi enviado e está a caminho.',
    icon: Truck,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-400'
  },
  em_transito: {
    title: 'Em Trânsito',
    description: 'Seu pedido está em trânsito para o endereço de entrega.',
    icon: Truck,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900/20',
    borderColor: 'border-indigo-400'
  },
  entregue: {
    title: 'Concluído',
    description: 'Seu pedido foi entregue com sucesso!',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-400'
  },
  cancelado: {
    title: 'Cancelado',
    description: 'Seu pedido foi cancelado.',
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-400'
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

  // Renderizar cancelado separadamente se for o status atual
  const isCancelled = currentStatusState === 'cancelado'

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-yellow-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">
          Acompanhamento do Pedido
        </h3>
        {realtime && (
          <div className="ml-auto flex items-center text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            tempo real
          </div>
        )}
      </div>

      {isCancelled ? (
        // Mostrar apenas status de cancelado
        <div className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center border-2
              ${statusConfig.cancelado.bgColor} ${statusConfig.cancelado.borderColor} ${statusConfig.cancelado.color}
              ring-4 ring-red-900/30
            `}>
              <XCircle size={24} />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white text-lg">
              {statusConfig.cancelado.title}
            </h4>
            <p className="text-sm mt-1 text-gray-400">
              {statusConfig.cancelado.description}
            </p>
            {getStatusHistory('cancelado') && (
              <span className="text-sm text-gray-500 mt-2 block">
                {formatDate(getStatusHistory('cancelado')!.created_at)}
              </span>
            )}
          </div>
        </div>
      ) : (
        // Mostrar timeline normal
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
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                    ${isCompleted 
                      ? `${config.bgColor} ${config.borderColor} ${config.color}` 
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                    }
                    ${isCurrent ? 'ring-4 ring-yellow-400/30 scale-110' : ''}
                  `}>
                    <Icon size={24} />
                  </div>
                  {index < statusOrder.length - 1 && (
                    <div className={`
                      w-0.5 h-12 mt-2 transition-all
                      ${isCompleted ? 'bg-yellow-400' : 'bg-gray-700'}
                    `} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between">
                    <h4 className={`
                      font-semibold text-base
                      ${isCompleted ? 'text-white' : 'text-gray-600'}
                      ${isCurrent ? 'text-yellow-400' : ''}
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
                    ${isCompleted ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {config.description}
                  </p>

                  {statusHistoryItem?.notes && (
                    <div className="mt-2 p-3 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300">
                      <strong className="text-yellow-400">Observação:</strong> {statusHistoryItem.notes}
                    </div>
                  )}

                  {isCurrent && (
                    <div className="mt-2 flex items-center text-sm text-yellow-400 font-medium">
                      <Clock size={16} className="mr-1 animate-pulse" />
                      Status atual
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-yellow-400">Número do Pedido:</span>
            <p className="text-white font-mono mt-1">{orderId}</p>
          </div>
          <div>
            <span className="font-medium text-yellow-400">Status Atual:</span>
            <p className="text-white mt-1">{statusConfig[currentStatusState]?.title || 'Aguardando Pagamento'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
