'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeOptions {
  table: string
  filter?: string
  onUpdate?: (payload: any) => void
  onInsert?: (payload: any) => void
  onDelete?: (payload: any) => void
  enabled?: boolean
}

export function useRealtime({
  table,
  filter,
  onUpdate,
  onInsert,
  onDelete,
  enabled = true
}: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!enabled) return

    // Criar canal único para esta tabela e filtro
    const channelName = filter ? `${table}:${filter}` : table
    const channel = supabase.channel(channelName)

    // Configurar listeners
    if (onUpdate) {
      channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter: filter ? `id=eq.${filter}` : undefined
        },
        onUpdate
      )
    }

    if (onInsert) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter: filter ? `id=eq.${filter}` : undefined
        },
        onInsert
      )
    }

    if (onDelete) {
      channel.on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
          filter: filter ? `id=eq.${filter}` : undefined
        },
        onDelete
      )
    }

    // Subscrever ao canal
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Realtime: Subscribed to ${channelName}`)
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Realtime: Error subscribing to ${channelName}`)
      }
    })

    channelRef.current = channel

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [table, filter, enabled, onUpdate, onInsert, onDelete])

  return {
    channel: channelRef.current
  }
}

// Hook específico para acompanhamento de pedidos
export function useOrderRealtime(orderId: string, onStatusUpdate?: (order: any) => void) {
  return useRealtime({
    table: 'orders',
    filter: orderId,
    onUpdate: (payload) => {
      console.log('Order updated:', payload)
      if (onStatusUpdate) {
        onStatusUpdate(payload.new)
      }
    },
    enabled: !!orderId
  })
}

// Hook para histórico de status de pedidos
export function useOrderStatusHistoryRealtime(orderId: string, onHistoryUpdate?: (history: any) => void) {
  return useRealtime({
    table: 'order_status_history',
    filter: orderId,
    onInsert: (payload) => {
      console.log('Status history updated:', payload)
      if (onHistoryUpdate) {
        onHistoryUpdate(payload.new)
      }
    },
    enabled: !!orderId
  })
}

// Hook para lista de pedidos do usuário
export function useUserOrdersRealtime(userId: string, onOrdersUpdate?: (orders: any[]) => void) {
  return useRealtime({
    table: 'orders',
    filter: userId,
    onUpdate: (payload) => {
      console.log('User orders updated:', payload)
      if (onOrdersUpdate) {
        // Aqui você pode implementar lógica para atualizar a lista de pedidos
        onOrdersUpdate(payload.new)
      }
    },
    onInsert: (payload) => {
      console.log('New order created:', payload)
      if (onOrdersUpdate) {
        onOrdersUpdate(payload.new)
      }
    },
    enabled: !!userId
  })
}
