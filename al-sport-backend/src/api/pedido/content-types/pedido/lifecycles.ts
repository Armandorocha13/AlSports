const statusMap: Record<string, string> = {
  'Aguardando Pagamento': 'aguardando_pagamento',
  'Pagamento Aprovado': 'pagamento_confirmado',
  'Em Separação': 'preparando_pedido',
  'Enviado': 'enviado',
  'Concluído': 'entregue',
  'Cancelado': 'cancelado'
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ALS-${timestamp}${random}`
}

async function syncToSupabase(entry: any) {
  try {
    const numeroPedido = entry?.NumeroPedido
    const statusPedido = entry?.StatusPedido
    if (!numeroPedido || !statusPedido) return

    const status = statusMap[statusPedido] || 'aguardando_pagamento'
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    await fetch(`${apiUrl}/api/orders/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber: String(numeroPedido), status })
    })
  } catch (err) {
    strapi.log.warn(`Falha ao sincronizar pedido com Supabase: ${String(err)}`)
  }
}

const lifecycles = {
  async beforeCreate(event) {
    if (!event.params?.data?.NumeroPedido) {
      event.params.data.NumeroPedido = generateOrderNumber()
    }
  },
  async beforeUpdate(event) {
    if (!event.params?.data?.NumeroPedido) {
      event.params.data.NumeroPedido = generateOrderNumber()
    }
  },
  async afterCreate(event) {
    await syncToSupabase(event.result)
  },
  async afterUpdate(event) {
    await syncToSupabase(event.result)
  }
}

export default lifecycles


