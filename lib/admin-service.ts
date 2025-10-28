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
          billing_address,
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
        if (order.user_id) {
          const { data: profileData } = await this.supabase
            .from('profiles')
            .select('email, full_name, phone')
            .eq('id', order.user_id)
            .single()
          
          profile = profileData
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
        const shippingAddress = shippingAddr 
          ? `${shippingAddr.street}, ${shippingAddr.number} - ${shippingAddr.neighborhood}, ${shippingAddr.city} - ${shippingAddr.state}`
          : 'Endereço não informado'

        // Mapear status
        const mappedStatus = this.mapOrderStatus(order.status)

        orders.push({
          id: order.order_number || order.id,
          customer: {
            name: profile?.full_name || profile?.email || 'Cliente',
            email: profile?.email || '',
            phone: profile?.phone || ''
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

      // Buscar pedido pelo order_number ou id
      const { data: orderData } = await this.supabase
        .from('orders')
        .select('id')
        .or(`order_number.eq.${orderId},id.eq.${orderId}`)
        .single()

      if (!orderData) {
        console.error('Pedido não encontrado:', orderId)
        return false
      }

      // Atualizar status do pedido
      const { error: updateError } = await this.supabase
        .from('orders')
        .update({ 
          status: dbStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderData.id)

      if (updateError) {
        console.error('Erro ao atualizar pedido:', updateError)
        return false
      }

      // Registrar no histórico de status
      await this.supabase
        .from('order_status_history')
        .insert({
          order_id: orderData.id,
          status: dbStatus,
          notes: `Status alterado para ${status}`,
          updated_by: null
        })

      console.log(`Pedido ${orderId} atualizado para status: ${dbStatus}`)
      return true
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw new Error('Erro ao atualizar pedido')
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
}

export const adminService = new AdminService()

