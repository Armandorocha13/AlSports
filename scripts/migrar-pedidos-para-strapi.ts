#!/usr/bin/env ts-node

/**
 * Script para migrar pedidos da tabela orders (Supabase) para o Strapi
 * 
 * Uso:
 *   ts-node scripts/migrar-pedidos-para-strapi.ts
 * 
 * Ou se não tiver ts-node instalado:
 *   npx ts-node scripts/migrar-pedidos-para-strapi.ts
 */

import { createClient } from '@supabase/supabase-js'

// ========================================
// CONFIGURAÇÕES
// ========================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-aqui'
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

// Limite de pedidos por vez (para não sobrecarregar)
const BATCH_SIZE = 10

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function formatAddress(shippingAddress: any): string {
  if (!shippingAddress) return ''
  
  const parts = [
    shippingAddress.street,
    shippingAddress.number,
    shippingAddress.complement,
    shippingAddress.neighborhood,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.cep
  ].filter(Boolean)

  return parts.join(', ')
}

function mapStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'aguardando_pagamento': 'Aguardando Pagamento',
    'pagamento_aprovado': 'Pagamento Aprovado',
    'em_separacao': 'Em Separação',
    'enviado': 'Enviado',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado'
  }

  return statusMap[status?.toLowerCase()] || 'Aguardando Pagamento'
}

async function syncOrderToStrapi(order: any, items: any[]): Promise<boolean> {
  try {
    const orderData = {
      orderId: order.order_number,
      customer: {
        fullName: order.shipping_address?.fullName || '',
        phone: order.shipping_address?.phone || '',
        email: order.shipping_address?.email || '',
        address: order.shipping_address?.street || '',
        number: order.shipping_address?.number || '',
        complement: order.shipping_address?.complement || '',
        neighborhood: order.shipping_address?.neighborhood || '',
        city: order.shipping_address?.city || '',
        state: order.shipping_address?.state || '',
        cep: order.shipping_address?.cep || '',
      },
      items: items.map(item => ({
        id: item.product_id || item.product_sku,
        name: item.product_name,
        price: parseFloat(item.unit_price),
        quantity: item.quantity,
        image: item.product_image_url,
        size: item.size,
        color: item.color
      })),
      subtotal: parseFloat(order.subtotal),
      shippingCost: parseFloat(order.shipping_cost),
      total: parseFloat(order.total_amount),
      status: order.status,
      createdAt: order.created_at
    }

    const response = await fetch(`${STRAPI_URL}/api/pedidos/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData })
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`  ✅ Pedido ${order.order_number} migrado com sucesso`)
      return true
    } else {
      const errorText = await response.text()
      console.error(`  ❌ Erro ao migrar pedido ${order.order_number}:`, errorText)
      return false
    }
  } catch (error) {
    console.error(`  ❌ Erro ao migrar pedido ${order.order_number}:`, error)
    return false
  }
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

async function main() {
  console.log('🚀 Iniciando migração de pedidos para o Strapi...\n')
  console.log(`📊 Configurações:`)
  console.log(`   - Supabase URL: ${SUPABASE_URL}`)
  console.log(`   - Strapi URL: ${STRAPI_URL}`)
  console.log(`   - Batch size: ${BATCH_SIZE}\n`)

  // Criar cliente Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  try {
    // 1. Buscar todos os pedidos do Supabase
    console.log('📥 Buscando pedidos no banco de dados...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Erro ao buscar pedidos:', ordersError)
      process.exit(1)
    }

    if (!orders || orders.length === 0) {
      console.log('ℹ️  Nenhum pedido encontrado no banco de dados.')
      process.exit(0)
    }

    console.log(`✅ ${orders.length} pedido(s) encontrado(s)\n`)

    // 2. Migrar cada pedido
    let success = 0
    let failed = 0

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      console.log(`\n[${i + 1}/${orders.length}] Migrando pedido ${order.order_number}...`)

      // Buscar itens do pedido
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      if (itemsError) {
        console.error(`  ❌ Erro ao buscar itens do pedido ${order.order_number}:`, itemsError)
        failed++
        continue
      }

      if (!items || items.length === 0) {
        console.warn(`  ⚠️  Pedido ${order.order_number} sem itens, pulando...`)
        failed++
        continue
      }

      console.log(`  📦 ${items.length} item(ns) encontrado(s)`)

      // Sincronizar com Strapi
      const result = await syncOrderToStrapi(order, items)
      
      if (result) {
        success++
      } else {
        failed++
      }

      // Aguardar um pouco entre requisições para não sobrecarregar
      if (i < orders.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // 3. Resumo final
    console.log('\n' + '='.repeat(50))
    console.log('📊 RESUMO DA MIGRAÇÃO')
    console.log('='.repeat(50))
    console.log(`Total de pedidos: ${orders.length}`)
    console.log(`✅ Migrados com sucesso: ${success}`)
    console.log(`❌ Falharam: ${failed}`)
    console.log('='.repeat(50))

    if (failed > 0) {
      console.log('\n⚠️  Alguns pedidos falharam. Verifique os erros acima.')
      process.exit(1)
    } else {
      console.log('\n🎉 Todos os pedidos foram migrados com sucesso!')
      process.exit(0)
    }

  } catch (error) {
    console.error('\n❌ Erro fatal durante a migração:', error)
    process.exit(1)
  }
}

// ========================================
// EXECUTAR
// ========================================

main().catch(error => {
  console.error('❌ Erro não tratado:', error)
  process.exit(1)
})


