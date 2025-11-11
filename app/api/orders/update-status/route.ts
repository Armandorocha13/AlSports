import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const allowedStatuses = new Set([
  'aguardando_pagamento',
  'pagamento_confirmado',
  'preparando_pedido',
  'enviado',
  'em_transito',
  'entregue',
  'cancelado',
  'devolvido'
])

export async function POST(request: NextRequest) {
  try {
    let { orderNumber, status } = await request.json()

    if (!orderNumber || !status) {
      return NextResponse.json(
        { error: 'orderNumber e status são obrigatórios' },
        { status: 400 }
      )
    }

    // Normalizar possíveis aliases vindos do Strapi
    const aliasMap: Record<string, string> = {
      pagamento_aprovado: 'pagamento_confirmado',
      em_separacao: 'preparando_pedido',
      concluido: 'entregue'
    }
    status = aliasMap[status] || status

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: `Status inválido: ${status}` },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Atualizar status na tabela orders do Supabase
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('order_number', orderNumber)
      .select('id, order_number, status')
      .single()

    if (updateError) {
      console.error('❌ Erro ao atualizar status no Supabase:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar status', details: updateError.message },
        { status: 500 }
      )
    }

    // Registrar no histórico de status
    if (updatedOrder) {
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: updatedOrder.id,
          status,
          notes: 'Status atualizado via admin Strapi',
          updated_by: null
        })

      if (historyError) {
        console.warn('⚠️ Erro ao registrar histórico (não crítico):', historyError)
      }
    }

    console.log(`✅ Status do pedido ${orderNumber} atualizado para ${status}`)

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Status atualizado com sucesso'
    })

  } catch (error: any) {
    console.error('❌ Erro ao processar atualização de status:', error)
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    )
  }
}

