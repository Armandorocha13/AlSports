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
   * Busca todos os pedidos
   */
  async getOrders(): Promise<AdminOrder[]> {
    try {
      // Simular dados por enquanto - em produção viria do Supabase
      const mockOrders: AdminOrder[] = [
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
        },
        {
          id: 'ORD-002',
          customer: {
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(11) 88888-8888'
          },
          items: [
            { name: 'Conjunto Infantil Real Madrid', quantity: 1, price: 65.50 }
          ],
          total: 65.50,
          status: 'confirmed',
          paymentMethod: 'Cartão de Crédito',
          shippingAddress: 'Av. Paulista, 456 - São Paulo, SP',
          createdAt: '2024-01-19T14:15:00Z',
          updatedAt: '2024-01-19T16:20:00Z'
        }
      ]

      return mockOrders
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      throw new Error('Erro ao carregar pedidos')
    }
  }

  /**
   * Busca estatísticas do dashboard
   */
  async getStats(): Promise<AdminStats> {
    try {
      // Simular dados por enquanto - em produção viria do Supabase
      const mockStats: AdminStats = {
        totalOrders: 1250,
        totalRevenue: 45890,
        activeProducts: 312,
        newCustomers: 78,
        ordersGrowth: 5.2,
        revenueGrowth: 8.1,
        productsGrowth: -1.5,
        customersGrowth: 12.0
      }

      return mockStats
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw new Error('Erro ao carregar estatísticas')
    }
  }

  /**
   * Atualiza status de um pedido
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      // Simular atualização - em produção seria uma chamada real ao Supabase
      console.log(`Atualizando pedido ${orderId} para status: ${status}`)
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
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

