'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { OrderWithCustomer, OrderStatusHistory } from '@/lib/types/database'

// Hook para atualizações em tempo real de pedidos
export function useOrderRealtime(
  orderId: string, 
  callback: (order: any) => void
) {
  const callbackRef = useRef(callback)
  const supabase = createClient()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!orderId) return

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          callbackRef.current(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, supabase])
}

// Hook para atualizações em tempo real do histórico de status
export function useOrderStatusHistoryRealtime(
  orderId: string,
  callback: (historyItem: OrderStatusHistory) => void
) {
  const callbackRef = useRef(callback)
  const supabase = createClient()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!orderId) return

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          callbackRef.current(payload.new as OrderStatusHistory)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, supabase])
}

// Hook para atualizações em tempo real de pedidos do usuário
export function useUserOrdersRealtime(
  userId: string | 'all',
  callback: (order: OrderWithCustomer) => void
) {
  const callbackRef = useRef(callback)
  const supabase = createClient()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`user-orders-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders_with_customer',
          filter: userId === 'all' ? undefined : `user_id=eq.${userId}`
        },
        (payload) => {
          callbackRef.current(payload.new as OrderWithCustomer)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])
}
