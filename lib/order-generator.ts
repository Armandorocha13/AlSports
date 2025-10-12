// Serviço para geração de IDs únicos de pedido

export interface OrderData {
  id: string
  code: string
  createdAt: Date
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalItems: number
  totalPieces: number
  subtotal: number
  shipping: number
  total: number
  shippingMethod: string
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
  shippingAddress?: {
    name: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }
  paymentMethod?: string
  notes?: string
  items: Array<{
    productName: string
    size: string
    color?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

export class OrderGenerator {
  private static instance: OrderGenerator

  static getInstance(): OrderGenerator {
    if (!OrderGenerator.instance) {
      OrderGenerator.instance = new OrderGenerator()
    }
    return OrderGenerator.instance
  }

  generateOrderCode(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    
    return `ALS${year}${month}${day}-${random}`
  }

  generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  createOrder(data: Partial<OrderData>): OrderData {
    const orderCode = this.generateOrderCode()
    const orderId = this.generateOrderId()

    return {
      id: orderId,
      code: orderCode,
      createdAt: new Date(),
      status: 'pending',
      totalItems: data.totalItems || 0,
      totalPieces: data.totalPieces || 0,
      subtotal: data.subtotal || 0,
      shipping: data.shipping || 0,
      total: data.total || 0,
      shippingMethod: data.shippingMethod || 'super-frete',
      customerInfo: data.customerInfo,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      items: data.items || []
    }
  }

  formatOrderForWhatsApp(order: OrderData): string {
    let message = `🛒 *NOVO PEDIDO - ${order.code}*\n\n`
    
    message += `📋 *RESUMO DO PEDIDO:*\n`
    message += `• Total de itens: ${order.totalItems}\n`
    message += `• Total de peças: ${order.totalPieces}\n`
    message += `• Subtotal: R$ ${order.subtotal.toFixed(2)}\n`
    message += `• Frete: R$ ${order.shipping.toFixed(2)}\n`
    message += `• *TOTAL: R$ ${order.total.toFixed(2)}*\n\n`
    
    message += `🚚 *FRETE:*\n`
    if (order.shippingMethod === 'transportadora') {
      message += `• Método: Transportadora (GRÁTIS)\n`
      message += `• Prazo: 5-7 dias úteis\n`
    } else {
      message += `• Método: Super Frete\n`
      message += `• Valor: R$ ${order.shipping.toFixed(2)}\n`
      message += `• Prazo: 3-5 dias úteis\n`
    }
    
    message += `\n📦 *ITENS DO PEDIDO:*\n`
    order.items.forEach((item, index) => {
      message += `${index + 1}. ${item.productName}\n`
      message += `   • Tamanho: ${item.size}\n`
      if (item.color) {
        message += `   • Cor: ${item.color}\n`
      }
      message += `   • Quantidade: ${item.quantity}x\n`
      message += `   • Preço unit.: R$ ${item.unitPrice.toFixed(2)}\n`
      message += `   • Subtotal: R$ ${item.totalPrice.toFixed(2)}\n\n`
    })
    
    if (order.customerInfo) {
      message += `\n👤 *DADOS DO CLIENTE:*\n`
      message += `• Nome: ${order.customerInfo.name}\n`
      message += `• Email: ${order.customerInfo.email}\n`
      message += `• Telefone: ${order.customerInfo.phone}\n`
    }
    
    if (order.shippingAddress) {
      message += `\n📍 *ENDEREÇO DE ENTREGA:*\n`
      message += `• ${order.shippingAddress.name}\n`
      message += `• ${order.shippingAddress.street}, ${order.shippingAddress.number}`
      if (order.shippingAddress.complement) {
        message += `, ${order.shippingAddress.complement}`
      }
      message += `\n`
      message += `• ${order.shippingAddress.neighborhood}\n`
      message += `• ${order.shippingAddress.city}/${order.shippingAddress.state}\n`
      message += `• CEP: ${order.shippingAddress.zip_code}\n`
    }
    
    if (order.paymentMethod) {
      message += `\n💳 *FORMA DE PAGAMENTO:*\n`
      message += `• ${this.formatPaymentMethod(order.paymentMethod)}\n`
    }
    
    if (order.notes) {
      message += `\n📝 *OBSERVAÇÕES:*\n`
      message += `• ${order.notes}\n`
    }
    
    message += `\n✅ *CONFIRMAÇÃO:*\n`
    message += `• Cliente confirma o pedido\n`
    message += `• Dados de entrega corretos\n`
    message += `• Forma de pagamento escolhida\n\n`
    
    message += `📞 *INSTRUÇÕES PARA O CLIENTE:*\n`
    message += `• Anote o número do pedido: *${order.code}*\n`
    message += `• Envie o comprovante de pagamento junto com este número\n`
    message += `• Aguarde a confirmação do pagamento\n\n`
    
    message += `_Pedido gerado em ${order.createdAt.toLocaleString('pt-BR')}_`
    
    return message
  }

  private formatPaymentMethod(method: string): string {
    const methods = {
      'pix': 'PIX',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'boleto': 'Boleto Bancário',
      'transferencia': 'Transferência Bancária'
    }
    return methods[method as keyof typeof methods] || method
  }

  generateWhatsAppUrl(order: OrderData, phoneNumber: string = '21990708854'): string {
    const message = this.formatOrderForWhatsApp(order)
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }
}

export const orderGenerator = OrderGenerator.getInstance()
