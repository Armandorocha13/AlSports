'use client'

// Importações necessárias para hooks de tempo real
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { OrderWithCustomer, OrderStatusHistory } from '@/lib/types/database'

// Hook para atualizações em tempo real de pedidos específicos
export function useOrderRealtime(
  orderId: string, // ID do pedido para monitorar
  callback: (order: any) => void // Função callback chamada quando há mudanças
) {
  // Referência para o callback para evitar re-subscrições desnecessárias
  const callbackRef = useRef(callback)
  const supabase = createClient()

  // Atualizar referência do callback quando ele mudar
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Configurar subscription para mudanças no pedido
  useEffect(() => {
    if (!orderId) return

    // Criar canal específico para este pedido
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes', // Tipo de mudança PostgreSQL
        {
          event: '*', // Todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public', // Schema do banco
          table: 'orders', // Tabela de pedidos
          filter: `id=eq.${orderId}` // Filtro para este pedido específico
        },
        (payload) => {
          // Chamar callback com os novos dados
          callbackRef.current(payload.new)
        }
      )
      .subscribe()

    // Cleanup: remover canal quando componente desmontar
    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, supabase])
}

// Hook para atualizações em tempo real do histórico de status de pedidos
export function useOrderStatusHistoryRealtime(
  orderId: string, // ID do pedido para monitorar histórico
  callback: (historyItem: OrderStatusHistory) => void // Callback para novos itens de histórico
) {
  // Referência para o callback para evitar re-subscrições desnecessárias
  const callbackRef = useRef(callback)
  const supabase = createClient()

  // Atualizar referência do callback quando ele mudar
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Configurar subscription para mudanças no histórico de status
  useEffect(() => {
    if (!orderId) return

    // Criar canal específico para histórico de status deste pedido
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes', // Tipo de mudança PostgreSQL
        {
          event: 'INSERT', // Apenas novos registros (novos status)
          schema: 'public', // Schema do banco
          table: 'order_status_history', // Tabela de histórico de status
          filter: `order_id=eq.${orderId}` // Filtro para este pedido específico
        },
        (payload) => {
          // Chamar callback com o novo item de histórico
          callbackRef.current(payload.new as OrderStatusHistory)
        }
      )
      .subscribe()

    // Cleanup: remover canal quando componente desmontar
    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, supabase])
}

// Hook para atualizações em tempo real de pedidos do usuário
export function useUserOrdersRealtime(
  userId: string | 'all', // ID do usuário ou 'all' para todos os usuários
  callback: (order: OrderWithCustomer) => void // Callback para novos/atualizados pedidos
) {
  // Referência para o callback para evitar re-subscrições desnecessárias
  const callbackRef = useRef(callback)
  const supabase = createClient()

  // Atualizar referência do callback quando ele mudar
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Configurar subscription para mudanças nos pedidos do usuário
  useEffect(() => {
    if (!userId) return

    // Criar canal específico para pedidos do usuário
    const channel = supabase
      .channel(`user-orders-${userId}`)
      .on(
        'postgres_changes', // Tipo de mudança PostgreSQL
        {
          event: '*', // Todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public', // Schema do banco
          table: 'orders_with_customer', // View com pedidos e dados do cliente
          filter: userId === 'all' ? undefined : `user_id=eq.${userId}` // Filtro por usuário ou todos
        },
        (payload) => {
          // Chamar callback com o pedido atualizado
          callbackRef.current(payload.new as OrderWithCustomer)
        }
      )
      .subscribe()

    // Cleanup: remover canal quando componente desmontar
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])
}
