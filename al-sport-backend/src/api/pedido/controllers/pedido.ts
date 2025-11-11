/**
 * pedido controller
 */

import { factories } from '@strapi/strapi'

// Funções auxiliares (fora do controller)
function formatAddress(customer: any): string {
  if (!customer) return ''
  
  const parts = [
    customer.address || customer.rua,
    customer.number || customer.numero,
    customer.complement || customer.complemento,
    customer.neighborhood || customer.bairro,
    customer.city || customer.cidade,
    customer.state || customer.estado,
    customer.cep
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

export default factories.createCoreController('api::pedido.pedido', ({ strapi }) => ({
  // Método customizado para sincronizar pedido do frontend
  async sync(ctx) {
    try {
      const { orderData } = ctx.request.body

      if (!orderData) {
        return ctx.badRequest('orderData é obrigatório')
      }

      // Calcular valor total
      const subtotal = parseFloat(orderData.subtotal) || 0
      const shippingCost = parseFloat(orderData.shippingCost || orderData.shipping?.price) || 0
      const totalAmount = subtotal + shippingCost

      // Mapear dados do frontend para o schema do Strapi
      const pedidoData: any = {
        data: {
          NumeroPedido: orderData.orderId || '',
          NomeCliente: orderData.customer?.fullName || orderData.customer?.nome || 'Cliente',
          Email: orderData.customer?.email || 'sem-email@cliente.com',
          Telefone: orderData.customer?.phone || orderData.customer?.telefone || 'Sem telefone',
          Endereco: formatAddress(orderData.customer) || 'Endereço não informado',
          ItensComprados: orderData.items || [],
          ValorProdutos: subtotal,
          ValorFrete: shippingCost,
          ValorTotal: totalAmount,
          StatusPedido: mapStatus(orderData.status || 'aguardando_pagamento'),
          CodigoRastreio: null,
          Observacoes: `Pedido criado automaticamente via checkout online em ${new Date().toLocaleString('pt-BR')}`,
          publishedAt: new Date() // Publicar automaticamente
        }
      }

      console.log('📊 Dados do pedido para Strapi:', {
        numeroPedido: pedidoData.data.NumeroPedido,
        cliente: pedidoData.data.NomeCliente,
        email: pedidoData.data.Email,
        valorTotal: pedidoData.data.ValorTotal
      })

      // Criar pedido no Strapi
      const entity = await strapi.entityService.create('api::pedido.pedido', pedidoData)

      return ctx.send({
        success: true,
        data: entity,
        message: 'Pedido sincronizado com sucesso'
      })

    } catch (error: any) {
      console.error('❌ Erro ao sincronizar pedido:', error)
      return ctx.badRequest(`Erro ao sincronizar pedido: ${error.message}`)
    }
  },

  // Método para atualizar código de rastreio
  async updateTracking(ctx) {
    try {
      const { id } = ctx.params
      const { codigoRastreio } = ctx.request.body

      if (!codigoRastreio) {
        return ctx.badRequest('codigoRastreio é obrigatório')
      }

      const updated = await strapi.entityService.update('api::pedido.pedido', id, {
        data: {
          CodigoRastreio: codigoRastreio,
          StatusPedido: 'Enviado'
        }
      })

      return ctx.send({
        success: true,
        data: updated,
        message: 'Código de rastreio atualizado'
      })

    } catch (error: any) {
      console.error('❌ Erro ao atualizar rastreio:', error)
      return ctx.badRequest(`Erro ao atualizar rastreio: ${error.message}`)
    }
  }
}));
