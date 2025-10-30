/**
 * Serviço para gerenciamento administrativo
 * Gerencia produtos, pedidos e estatísticas
 */

import { createClient } from '@/lib/supabase-client'

export interface AdminProduct {
  id: string
  name: string
  price: number
  category: string
  stock: number
  status: 'active' | 'inactive'
  image: string
  description: string
  createdAt: string
  sales: number
  rating: number
}

export interface AdminOrder {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  activeProducts: number
  newCustomers: number
  ordersGrowth: number
  revenueGrowth: number
  productsGrowth: number
  customersGrowth: number
}

class AdminService {
  private supabase = createClient()

  /**
   * Busca todos os produtos
   */
  async getProducts(): Promise<AdminProduct[]> {
    try {
      // Simular dados por enquanto - em produção viria do Supabase
      const mockProducts: AdminProduct[] = [
        {
          id: '1',
          name: 'Camisa Flamengo 2024',
          price: 89.90,
          category: 'Futebol',
          stock: 45,
          status: 'active',
          image: '/images/Futebol/Camisas24-25/CamisaFlamengo2024.jpg',
          description: 'Camisa oficial do Flamengo temporada 2024',
          createdAt: '2024-01-15',
          sales: 156,
          rating: 4.8
        },
        {
          id: '2',
          name: 'Conjunto Infantil Real Madrid',
          price: 65.50,
          category: 'Infantil',
          stock: 23,
          status: 'active',
          image: '/images/ConjuntosInfantis/InfantilRealMadrid/InfantilRealMadrid1.jpg',
          description: 'Conjunto infantil do Real Madrid',
          createdAt: '2024-01-20',
          sales: 89,
          rating: 4.6
        },
        {
          id: '3',
          name: 'Agasalho Completo Milan',
          price: 120.00,
          category: 'Treino',
          stock: 0,
          status: 'inactive',
          image: '/images/ConjuntoTreino/AgasalhoCompleto/AgasalhoCompleto.jpg',
          description: 'Agasalho completo do Milan',
          createdAt: '2024-01-10',
          sales: 34,
          rating: 4.5
        }
      ]

      return mockProducts
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw new Error('Erro ao carregar produtos')
    }
  }

  /**
   * Busca todos os pedidos do banco de dados
   */
  async getOrders(): Promise<AdminOrder[]> {
    try {
      // Buscar pedidos da tabela orders
      const { data: ordersData, error: ordersError } = await this.supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          shipping_address,
          created_at,
          updated_at,
          user_id
        `)
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Erro ao buscar pedidos:', ordersError)
        return this.getMockOrders()
      }

      if (!ordersData || ordersData.length === 0) {
        return []
      }

      // Buscar itens dos pedidos
      const orders: AdminOrder[] = []
      
      for (const order of ordersData) {
        // Buscar perfil do cliente
        let profile: any = null
        let customerName = 'Cliente'
        let customerEmail = ''
        let customerPhone = ''
        
        if (order.user_id) {
          const { data: profileData } = await this.supabase
            .from('profiles')
            .select('email, full_name, phone')
            .eq('id', order.user_id)
            .single()
          
          profile = profileData
          customerName = profile?.full_name || profile?.email || 'Cliente'
          customerEmail = profile?.email || ''
          customerPhone = profile?.phone || ''
        }
        
        // Se não houver perfil, tentar extrair informações do endereço de entrega
        if (!profile && order.shipping_address) {
          const shippingAddr = order.shipping_address as any
          if (shippingAddr.fullName) {
            customerName = shippingAddr.fullName
          }
          if (shippingAddr.email) {
            customerEmail = shippingAddr.email
          }
          if (shippingAddr.phone) {
            customerPhone = shippingAddr.phone
          }
        }
        
        // Buscar itens do pedido
        const { data: itemsData } = await this.supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)

        const items = itemsData?.map(item => ({
          name: item.product_name,
          quantity: item.quantity,
          price: Number(item.unit_price)
        })) || []

        // Buscar método de pagamento
        const { data: paymentData } = await this.supabase
          .from('payments')
          .select('method')
          .eq('order_id', order.id)
          .single()

        const paymentMethod = this.mapPaymentMethod(paymentData?.method)

        // Mapear endereço de entrega
        const shippingAddr = order.shipping_address as any
        let shippingAddress = 'Endereço não informado'
        
        if (shippingAddr) {
          // Verificar se é objeto estruturado
          if (shippingAddr.street && shippingAddr.number) {
            shippingAddress = `${shippingAddr.street}, ${shippingAddr.number}${shippingAddr.complement ? ' - ' + shippingAddr.complement : ''} - ${shippingAddr.neighborhood}, ${shippingAddr.city} - ${shippingAddr.state}`
          } 
          // Verificar se é string (formato antigo)
          else if (typeof shippingAddr === 'string') {
            shippingAddress = shippingAddr
          }
          // Tentar pegar campo 'full' se disponível
          else if (shippingAddr.full) {
            shippingAddress = shippingAddr.full
          }
        }

        // Mapear status
        const mappedStatus = this.mapOrderStatus(order.status)

        orders.push({
          id: order.order_number || order.id,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
          },
          items,
          total: Number(order.total_amount),
          status: mappedStatus,
          paymentMethod,
          shippingAddress,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        })
      }

      return orders
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      return this.getMockOrders()
    }
  }

  /**
   * Mapeia status do banco para status do sistema
   */
  private mapOrderStatus(status: string): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' {
    const statusMap: Record<string, 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'> = {
      'aguardando_pagamento': 'pending',
      'pagamento_confirmado': 'confirmed',
      'preparando_pedido': 'confirmed',
      'enviado': 'shipped',
      'em_transito': 'shipped',
      'entregue': 'delivered',
      'cancelado': 'cancelled',
      'devolvido': 'cancelled'
    }
    
    return statusMap[status] || 'pending'
  }

  /**
   * Mapeia método de pagamento do banco
   */
  private mapPaymentMethod(method: string | undefined): string {
    if (!method) return 'Não informado'
    
    const methodMap: Record<string, string> = {
      'pix': 'PIX',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'boleto': 'Boleto',
      'transferencia': 'Transferência'
    }
    
    return methodMap[method] || method
  }

  /**
   * Retorna dados mock em caso de erro
   */
  private getMockOrders(): AdminOrder[] {
    return [
        {
          id: 'ORD-001',
          customer: {
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-9999'
          },
          items: [
            { name: 'Camisa Flamengo 2024', quantity: 2, price: 89.90 },
            { name: 'Short Flamengo', quantity: 1, price: 45.00 }
          ],
          total: 224.80,
          status: 'pending',
          paymentMethod: 'PIX',
          shippingAddress: 'Rua das Flores, 123 - São Paulo, SP',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T10:30:00Z'
      }
    ]
  }

  /**
   * Busca estatísticas do dashboard
   */
  async getStats(): Promise<AdminStats> {
    try {
      // Buscar dados reais do banco de dados
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      // Contar pedidos totais e do mês atual
      const { data: ordersData, error: ordersError } = await this.supabase
        .from('orders')
        .select('total_amount, created_at')
        
      if (ordersError) {
        console.error('Erro ao buscar pedidos:', ordersError)
        return this.getMockStats()
      }

      const orders = ordersData || []
      const thisMonthOrders = orders.filter(order => 
        new Date(order.created_at) >= startOfThisMonth
      )
      const lastMonthOrders = orders.filter(order => 
        new Date(order.created_at) >= lastMonth && 
        new Date(order.created_at) < startOfThisMonth
      )

      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      
      // Calcular crescimento de pedidos
      const ordersGrowth = lastMonthOrders.length > 0 
        ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
        : (thisMonthOrders.length > 0 ? 100 : 0)
      
      // Calcular crescimento de receita
      const revenueGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : (thisMonthRevenue > 0 ? 100 : 0)

      // Contar produtos ativos
      const { data: productsData, error: productsError } = await this.supabase
        .from('products')
        .select('id, created_at, is_active')
        .eq('is_active', true)

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError)
        return this.getMockStats()
      }

      const products = productsData || []
      const activeProducts = products.length
      
      const thisMonthProducts = products.filter(product => 
        new Date(product.created_at) >= startOfThisMonth
      )
      const lastMonthProducts = products.filter(product => 
        new Date(product.created_at) >= lastMonth && 
        new Date(product.created_at) < startOfThisMonth
      )

      const productsGrowth = lastMonthProducts.length > 0 
        ? ((thisMonthProducts.length - lastMonthProducts.length) / lastMonthProducts.length) * 100 
        : (thisMonthProducts.length > 0 ? 100 : 0)

      // Contar novos clientes (usuários criados no mês)
      const { data: profilesData, error: profilesError } = await this.supabase
        .from('profiles')
        .select('id, created_at')
        .gte('created_at', lastMonth.toISOString())

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError)
      }

      const profiles = profilesData || []
      const thisMonthCustomers = profiles.filter(profile => 
        new Date(profile.created_at) >= startOfThisMonth
      )
      const lastMonthCustomers = profiles.filter(profile => 
        new Date(profile.created_at) >= lastMonth && 
        new Date(profile.created_at) < startOfThisMonth
      )

      const newCustomers = thisMonthCustomers.length
      const customersGrowth = lastMonthCustomers.length > 0 
        ? ((thisMonthCustomers.length - lastMonthCustomers.length) / lastMonthCustomers.length) * 100 
        : (thisMonthCustomers.length > 0 ? 100 : 0)

      return {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        activeProducts,
        newCustomers,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        productsGrowth: Math.round(productsGrowth * 10) / 10,
        customersGrowth: Math.round(customersGrowth * 10) / 10
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return this.getMockStats()
    }
  }

  /**
   * Retorna dados mock caso não consiga buscar do banco
   */
  private getMockStats(): AdminStats {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      activeProducts: 0,
      newCustomers: 0,
      ordersGrowth: 0,
      revenueGrowth: 0,
      productsGrowth: 0,
      customersGrowth: 0
    }
  }

  /**
   * Atualiza status de um pedido
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      // Mapear status do sistema para status do banco
      const statusMap: Record<string, string> = {
        'pending': 'aguardando_pagamento',
        'confirmed': 'pagamento_confirmado',
        'shipped': 'enviado',
        'delivered': 'entregue',
        'cancelled': 'cancelado'
      }

      const dbStatus = statusMap[status] || status

      // Buscar pedido pelo order_number primeiro
      let orderDbId: string | null = null
      let lastError: any = null

      const { data: orderByNumber, error: errorByNumber } = await this.supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderId)
        .single()

      if (!errorByNumber && orderByNumber) {
        orderDbId = orderByNumber.id
      } else {
        lastError = errorByNumber
        // Tentar buscar por id se order_number não funcionou
        const { data: orderById, error: errorById } = await this.supabase
        .from('orders')
        .select('id')
          .eq('id', orderId)
        .single()

        if (!errorById && orderById) {
          orderDbId = orderById.id
        } else {
          lastError = errorById || errorByNumber
        }
      }

      if (!orderDbId) {
        console.error('Pedido não encontrado no banco de dados:', orderId)
        console.error('Último erro:', lastError)
        return false
      }

      // Atualizar status do pedido
      const { error: updateError } = await this.supabase
        .from('orders')
        .update({ 
          status: dbStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderDbId)

      if (updateError) {
        console.error('Erro ao atualizar status do pedido:', updateError)
        return false
      }

      // Registrar no histórico de status
      const { error: historyError } = await this.supabase
        .from('order_status_history')
        .insert({
          order_id: orderDbId,
          status: dbStatus,
          notes: `Status alterado para ${status}`,
          updated_by: null
        })

      if (historyError) {
        console.warn('Aviso ao registrar histórico de status:', historyError)
        // Não falhar por causa do histórico, apenas avisar
      }

      console.log(`Pedido ${orderId} (ID: ${orderDbId}) atualizado para status: ${dbStatus}`)
      return true
    } catch (error: any) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw new Error(`Erro ao atualizar status: ${error?.message || 'Erro desconhecido'}`)
    }
  }

  /**
   * Atualiza informações completas de um pedido
   */
  async updateOrder(orderId: string, orderData: Partial<AdminOrder>): Promise<boolean> {
    try {
      // Buscar pedido pelo order_number ou id
      let order: any = null
      let orderDbId: string | null = null

      // Tentar buscar por order_number primeiro
      const { data: orderByNumber, error: errorByNumber } = await this.supabase
        .from('orders')
        .select('id, user_id, order_number')
        .eq('order_number', orderId)
        .single()

      if (!errorByNumber && orderByNumber) {
        order = orderByNumber
        orderDbId = order.id
      } else {
        // Tentar buscar por id
        const { data: orderById, error: errorById } = await this.supabase
          .from('orders')
          .select('id, user_id, order_number')
          .eq('id', orderId)
          .single()

        if (!errorById && orderById) {
          order = orderById
          orderDbId = order.id
        }
      }

      // Se não encontrou no banco, criar um novo pedido
      if (!order || !orderDbId) {
        console.log(`Pedido ${orderId} não encontrado no banco. Criando novo pedido...`)
        
        // Buscar ou criar perfil do cliente
        let userId: string | null = null
        if (orderData.customer?.email) {
          // Verificar se o perfil já existe
          const { data: existingProfile } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('email', orderData.customer.email)
            .single()

          if (existingProfile) {
            userId = existingProfile.id
            // Atualizar perfil existente
            await this.supabase
              .from('profiles')
              .update({
                full_name: orderData.customer.name,
                phone: orderData.customer.phone,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)
          } else {
            // Criar novo perfil (será criado pela autenticação, mas podemos criar um básico)
            // Por enquanto, deixar userId como null
            console.warn('Cliente não encontrado. Pedido será criado sem user_id.')
          }
        }

        // Preparar dados do endereço
        let shippingAddress: any = {}
        if (orderData.shippingAddress) {
          const addressParts = orderData.shippingAddress.match(/(.+?),\s*(\d+)\s*-\s*(.+?),\s*(.+?)\s*-\s*(.+)/)
          if (addressParts && addressParts.length >= 6) {
            shippingAddress = {
              street: addressParts[1]?.trim(),
              number: addressParts[2]?.trim(),
              neighborhood: addressParts[3]?.trim(),
              city: addressParts[4]?.trim(),
              state: addressParts[5]?.trim()
            }
          } else {
            shippingAddress = { full: orderData.shippingAddress }
          }
        }

        // Mapear status
        const statusMap: Record<string, string> = {
          'pending': 'aguardando_pagamento',
          'confirmed': 'pagamento_confirmado',
          'shipped': 'enviado',
          'delivered': 'entregue',
          'cancelled': 'cancelado'
        }
        const dbStatus = statusMap[orderData.status || 'pending'] || 'aguardando_pagamento'

        // Calcular total
        const total = orderData.total || (orderData.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0)

        // Criar novo pedido no banco
        const { data: newOrder, error: createError } = await this.supabase
          .from('orders')
          .insert({
            order_number: orderId,
            user_id: userId,
            status: dbStatus,
            subtotal: total,
            shipping_cost: 0,
            discount_amount: 0, // Conforme schema, tem DEFAULT 0 mas incluindo explicitamente
            total_amount: total,
            shipping_address: shippingAddress, // NOT NULL conforme schema - obrigatório
            notes: 'Pedido criado via edição administrativa',
            created_at: orderData.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (createError) {
          console.error('Erro ao criar pedido:', createError)
          throw new Error(`Erro ao criar pedido: ${createError.message}`)
        }

        if (!newOrder) {
          console.error('Falha ao criar pedido: nenhum dado retornado')
          return false
        }

        orderDbId = newOrder.id
        console.log(`Pedido ${orderId} criado no banco com ID: ${orderDbId}`)

        // Inserir histórico de status
        await this.supabase
          .from('order_status_history')
          .insert({
            order_id: orderDbId,
            status: dbStatus,
            notes: 'Pedido criado via edição administrativa',
            updated_by: null
          })

        // Inserir itens se fornecidos
        if (orderData.items && orderData.items.length > 0) {
          const validItems = orderData.items.filter(item => 
            item.name && item.name.trim() && item.quantity > 0 && item.price >= 0
          )

          if (validItems.length > 0) {
            const newItems = validItems.map(item => ({
              order_id: orderDbId,
              product_name: item.name.trim(),
              quantity: item.quantity,
              unit_price: item.price,
              total_price: item.quantity * item.price
            }))

            const { error: itemsError } = await this.supabase
              .from('order_items')
              .insert(newItems)

            if (itemsError) {
              console.error('Erro ao inserir itens do pedido:', itemsError)
              return false
            }
          }
        }

        // Criar pagamento se método fornecido
        if (orderData.paymentMethod) {
          const paymentMethodMap: Record<string, string> = {
            'PIX': 'pix',
            'Cartão de Crédito': 'cartao_credito',
            'Cartão de Débito': 'cartao_debito',
            'Boleto': 'boleto',
            'Transferência': 'transferencia'
          }
          const dbPaymentMethod = paymentMethodMap[orderData.paymentMethod] || 'pix'

          await this.supabase
            .from('payments')
            .insert({
              order_id: orderDbId,
              method: dbPaymentMethod as any,
              status: dbStatus === 'pagamento_confirmado' ? 'aprovado' : 'pendente',
              amount: total,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
        }

        console.log(`Pedido ${orderId} criado e salvo com sucesso no banco de dados`)
        return true
      }

      // Preparar atualizações acumulativas
      const updates: any = {
        updated_at: new Date().toISOString()
      }

      // Se status foi alterado, atualizar status também
      if (orderData.status) {
        const statusMap: Record<string, string> = {
          'pending': 'aguardando_pagamento',
          'confirmed': 'pagamento_confirmado',
          'shipped': 'enviado',
          'delivered': 'entregue',
          'cancelled': 'cancelado'
        }
        const dbStatus = statusMap[orderData.status] || orderData.status
        updates.status = dbStatus

        // Registrar no histórico de status
        await this.supabase
          .from('order_status_history')
          .insert({
            order_id: orderDbId,
            status: dbStatus,
            notes: `Pedido atualizado via edição`,
            updated_by: null
          })
          .then(({ error }) => {
            if (error) {
              console.warn('Aviso ao registrar histórico de status:', error)
            }
          })
      }

      // Atualizar endereço de entrega se fornecido
      if (orderData.shippingAddress) {
        // Tentar parse do endereço formatado para objeto
        const addressParts = orderData.shippingAddress.match(/(.+?),\s*(\d+)\s*-\s*(.+?),\s*(.+?)\s*-\s*(.+)/)
        if (addressParts && addressParts.length >= 6) {
          updates.shipping_address = {
            street: addressParts[1]?.trim(),
            number: addressParts[2]?.trim(),
            neighborhood: addressParts[3]?.trim(),
            city: addressParts[4]?.trim(),
            state: addressParts[5]?.trim()
          }
        } else {
          // Se não conseguir fazer parse, salvar como string simples
          updates.shipping_address = orderData.shippingAddress
        }
      }

      // Atualizar total se fornecido
      if (orderData.total !== undefined) {
        updates.total_amount = orderData.total
      }

      // Fazer atualização acumulada do pedido
      if (Object.keys(updates).length > 1) { // Mais que apenas updated_at
        const { error: updateError } = await this.supabase
          .from('orders')
          .update(updates)
          .eq('id', orderDbId)

        if (updateError) {
          console.error('Erro ao atualizar pedido:', updateError)
          return false
        }
      }

      // Atualizar informações do cliente (perfil) se fornecido e se houver user_id
      if (orderData.customer && order.user_id) {
        const { error: profileError } = await this.supabase
          .from('profiles')
          .update({
            full_name: orderData.customer.name,
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', order.user_id)

        if (profileError) {
          console.warn('Aviso ao atualizar perfil do cliente (pode não existir):', profileError)
          // Não falhar aqui, apenas avisar
        }
      }

      // Atualizar itens do pedido se fornecido
      if (orderData.items && orderData.items.length > 0) {
        // Validar itens antes de atualizar
        const validItems = orderData.items.filter(item => 
          item.name && item.name.trim() && item.quantity > 0 && item.price >= 0
        )

        if (validItems.length === 0) {
          console.error('Nenhum item válido para atualizar')
          return false
        }

        // Deletar itens antigos
        const { error: deleteError } = await this.supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderDbId)

        if (deleteError) {
          console.error('Erro ao deletar itens antigos:', deleteError)
          return false
        }

        // Inserir novos itens
        const newItems = validItems.map(item => ({
          order_id: orderDbId,
          product_name: item.name.trim(),
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.quantity * item.price
        }))

        const { error: itemsError } = await this.supabase
          .from('order_items')
          .insert(newItems)

        if (itemsError) {
          console.error('Erro ao atualizar itens:', itemsError)
          return false
        }

        // Recalcular total baseado nos itens
        const newTotal = validItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
        const { error: totalUpdateError } = await this.supabase
          .from('orders')
          .update({
            total_amount: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderDbId)

        if (totalUpdateError) {
          console.error('Erro ao recalcular total:', totalUpdateError)
          // Não falhar, apenas avisar
        }
      }

      console.log(`Pedido ${orderId} atualizado com sucesso`)
      return true
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error)
      // Retornar mensagem de erro mais específica
      throw new Error(error?.message || 'Erro ao atualizar pedido')
    }
  }

  /**
   * Atualiza status de um produto
   */
  async updateProductStatus(productId: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      // Simular atualização - em produção seria uma chamada real ao Supabase
      console.log(`Atualizando produto ${productId} para status: ${status}`)
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return true
    } catch (error) {
      console.error('Erro ao atualizar status do produto:', error)
      throw new Error('Erro ao atualizar produto')
    }
  }

  /**
   * Deleta um produto
   */
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      // Simular exclusão - em produção seria uma chamada real ao Supabase
      console.log(`Deletando produto ${productId}`)
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return true
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      throw new Error('Erro ao deletar produto')
    }
  }

  /**
   * Deleta um pedido do banco de dados
   */
  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      // Buscar pedido pelo order_number primeiro
      let orderDbId: string | null = null

      const { data: orderByNumber, error: errorByNumber } = await this.supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderId)
        .single()

      if (!errorByNumber && orderByNumber) {
        orderDbId = orderByNumber.id
      } else {
        // Tentar buscar por id se order_number não funcionou
        const { data: orderById, error: errorById } = await this.supabase
        .from('orders')
        .select('id')
          .eq('id', orderId)
        .single()

        if (!errorById && orderById) {
          orderDbId = orderById.id
        }
      }

      if (!orderDbId) {
        console.error('Pedido não encontrado no banco de dados:', orderId)
        return false
      }

      // Deletar histórico de status primeiro (cascade deve cuidar disso, mas vamos ser explícitos)
      const { error: historyError } = await this.supabase
        .from('order_status_history')
        .delete()
        .eq('order_id', orderDbId)

      if (historyError) {
        console.warn('Aviso ao deletar histórico de status:', historyError)
      }

      // Deletar pagamentos
      const { error: paymentError } = await this.supabase
        .from('payments')
        .delete()
        .eq('order_id', orderDbId)

      if (paymentError) {
        console.warn('Aviso ao deletar pagamentos:', paymentError)
      }

      // Deletar itens do pedido (cascade deve cuidar disso, mas vamos ser explícitos)
      const { error: itemsError } = await this.supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderDbId)

      if (itemsError) {
        console.warn('Aviso ao deletar itens do pedido:', itemsError)
      }

      // Finalmente, deletar o pedido (isso deve disparar cascade para deletar os relacionados)
      const { error: deleteError } = await this.supabase
        .from('orders')
        .delete()
        .eq('id', orderDbId)

      if (deleteError) {
        console.error('Erro ao deletar pedido:', deleteError)
        return false
      }

      console.log(`Pedido ${orderId} (ID: ${orderDbId}) deletado com sucesso do banco de dados`)
      return true
    } catch (error: any) {
      console.error('Erro ao deletar pedido:', error)
      throw new Error(`Erro ao deletar pedido: ${error?.message || 'Erro desconhecido'}`)
    }
  }
}

export const adminService = new AdminService()

