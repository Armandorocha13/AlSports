interface EmailData {
  to: string
  subject: string
  html: string
}

export class EmailService {
  private static instance: EmailService

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendOrderStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    newStatus: string,
    orderDetails: any
  ): Promise<boolean> {
    try {
      const subject = `Atualização do Pedido #${orderNumber} - AlSports`
      const html = this.generateStatusUpdateEmail(
        customerName,
        orderNumber,
        newStatus,
        orderDetails
      )

      // Aqui você pode integrar com serviços como:
      // - SendGrid
      // - AWS SES
      // - Resend
      // - Nodemailer
      
      console.log('📧 Enviando email de notificação...')
      console.log('Para:', customerEmail)
      console.log('Assunto:', subject)
      
      // Simulação de envio de email
      // Em produção, substitua por um serviço real
      await this.simulateEmailSend({
        to: customerEmail,
        subject,
        html
      })

      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  private generateStatusUpdateEmail(
    customerName: string,
    orderNumber: string,
    status: string,
    orderDetails: any
  ): string {
    const statusText = this.getStatusText(status)
    const statusColor = this.getStatusColor(status)
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atualização do Pedido - AlSports</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #fbbf24;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            margin: 10px 0;
            background-color: ${statusColor};
          }
          .order-info {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background-color: #fbbf24;
            color: #1f2937;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏃‍♂️ AlSports</div>
            <p>Seu pedido foi atualizado!</p>
          </div>
          
          <h2>Olá, ${customerName}!</h2>
          
          <p>Seu pedido <strong>#${orderNumber}</strong> teve seu status atualizado:</p>
          
          <div class="status-badge">${statusText}</div>
          
          <div class="order-info">
            <h3>📦 Detalhes do Pedido</h3>
            <p><strong>Número do Pedido:</strong> #${orderNumber}</p>
            <p><strong>Status Atual:</strong> ${statusText}</p>
            <p><strong>Data da Atualização:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            ${orderDetails.total_amount ? `<p><strong>Valor Total:</strong> R$ ${orderDetails.total_amount.toFixed(2)}</p>` : ''}
          </div>
          
          <p>${this.getStatusMessage(status)}</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/minha-conta/pedidos" class="button">
              Acompanhar Pedido
            </a>
          </div>
          
          <div class="footer">
            <p>Se você tiver alguma dúvida, entre em contato conosco.</p>
            <p>AlSports - Sua loja de artigos esportivos</p>
            <p>📧 contato@alsports.com | 📱 (11) 99999-9999</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getStatusText(status: string): string {
    switch (status) {
      case 'aguardando_pagamento': return 'Aguardando Pagamento'
      case 'pagamento_confirmado': return 'Pagamento Confirmado'
      case 'preparando_pedido': return 'Preparando Pedido'
      case 'enviado': return 'Enviado'
      case 'em_transito': return 'Em Trânsito'
      case 'entregue': return 'Entregue'
      case 'cancelado': return 'Cancelado'
      case 'devolvido': return 'Devolvido'
      default: return status
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'aguardando_pagamento': return '#f59e0b'
      case 'pagamento_confirmado': return '#3b82f6'
      case 'preparando_pedido': return '#f97316'
      case 'enviado': return '#8b5cf6'
      case 'em_transito': return '#6366f1'
      case 'entregue': return '#10b981'
      case 'cancelado': return '#ef4444'
      case 'devolvido': return '#6b7280'
      default: return '#6b7280'
    }
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case 'aguardando_pagamento': 
        return 'Seu pedido está aguardando a confirmação do pagamento. Assim que o pagamento for confirmado, iniciaremos o processamento.'
      case 'pagamento_confirmado': 
        return 'Pagamento confirmado! Seu pedido está sendo processado e em breve será preparado para envio.'
      case 'preparando_pedido': 
        return 'Seu pedido está sendo preparado com muito cuidado. Em breve ele será enviado!'
      case 'enviado': 
        return 'Seu pedido foi enviado! Você receberá o código de rastreamento em breve.'
      case 'em_transito': 
        return 'Seu pedido está a caminho! Acompanhe o rastreamento para saber onde ele está.'
      case 'entregue': 
        return 'Seu pedido foi entregue! Esperamos que você aproveite sua compra. Obrigado por escolher a AlSports!'
      case 'cancelado': 
        return 'Seu pedido foi cancelado. Se você tiver alguma dúvida, entre em contato conosco.'
      case 'devolvido': 
        return 'Seu pedido foi devolvido. Estamos processando a devolução e você será reembolsado em breve.'
      default: 
        return 'Seu pedido foi atualizado. Acompanhe o progresso em sua conta.'
    }
  }

  private async simulateEmailSend(emailData: EmailData): Promise<void> {
    // Simulação de envio de email
    // Em produção, substitua por um serviço real como SendGrid, AWS SES, etc.
    console.log('📧 Email simulado enviado:')
    console.log('Para:', emailData.to)
    console.log('Assunto:', emailData.subject)
    console.log('Conteúdo HTML gerado com sucesso')
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

export const emailService = EmailService.getInstance()
