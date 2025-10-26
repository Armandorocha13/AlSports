/**
 * Testes para as páginas administrativas
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useAuth } from '@/contexts/AuthContext'
import ProdutosPage from '@/app/admin/produtos/page'
import PedidosPage from '@/app/admin/pedidos/page'
import AdminDashboard from '@/app/admin/page'

// Mock do contexto de autenticação
jest.mock('@/contexts/AuthContext')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock do serviço administrativo
jest.mock('@/lib/admin-service', () => ({
  adminService: {
    getProducts: jest.fn(),
    getOrders: jest.fn(),
    getStats: jest.fn(),
    updateProductStatus: jest.fn(),
    updateOrderStatus: jest.fn(),
    deleteProduct: jest.fn()
  }
}))

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  usePathname: () => '/admin'
}))

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock do Next.js Image
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
})

describe('Páginas Administrativas', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'admin@test.com' },
      profile: { full_name: 'Admin User' },
      signOut: jest.fn(),
      loading: false
    })
  })

  describe('Dashboard', () => {
    it('deve renderizar dashboard com estatísticas', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 50000,
        activeProducts: 50,
        newCustomers: 25,
        ordersGrowth: 10,
        revenueGrowth: 15,
        productsGrowth: 5,
        customersGrowth: 20
      }

      const { adminService } = require('@/lib/admin-service')
      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument() // Total de pedidos
        expect(screen.getByText('R$ 50,000')).toBeInTheDocument() // Faturamento
        expect(screen.getByText('50')).toBeInTheDocument() // Produtos ativos
        expect(screen.getByText('25')).toBeInTheDocument() // Novos clientes
      })
    })

    it('deve mostrar loading durante carregamento', () => {
      const { adminService } = require('@/lib/admin-service')
      adminService.getStats.mockImplementation(() => new Promise(() => {})) // Promise que nunca resolve

      render(<AdminDashboard />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      // Loading spinner deve estar presente
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('deve mostrar links de acesso rápido', async () => {
      const mockStats = {
        totalOrders: 0,
        totalRevenue: 0,
        activeProducts: 0,
        newCustomers: 0,
        ordersGrowth: 0,
        revenueGrowth: 0,
        productsGrowth: 0,
        customersGrowth: 0
      }

      const { adminService } = require('@/lib/admin-service')
      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Produtos')).toBeInTheDocument()
        expect(screen.getByText('Visualizar Pedidos')).toBeInTheDocument()
        expect(screen.getByText('Gerenciar Categorias')).toBeInTheDocument()
      })
    })
  })

  describe('Página de Produtos', () => {
    it('deve renderizar lista de produtos', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Produto Teste',
          price: 100,
          category: 'Categoria',
          stock: 10,
          status: 'active' as const,
          image: '/test.jpg',
          description: 'Descrição teste',
          createdAt: '2024-01-01',
          sales: 5,
          rating: 4.5
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getProducts.mockResolvedValue(mockProducts)

      render(<ProdutosPage />)

      await waitFor(() => {
        expect(screen.getByText('Produtos')).toBeInTheDocument()
        expect(screen.getByText('Produto Teste')).toBeInTheDocument()
        expect(screen.getByText('R$ 100,00')).toBeInTheDocument()
      })
    })

    it('deve filtrar produtos por categoria', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Produto 1',
          price: 100,
          category: 'Futebol',
          stock: 10,
          status: 'active' as const,
          image: '/test1.jpg',
          description: 'Descrição 1',
          createdAt: '2024-01-01',
          sales: 5,
          rating: 4.5
        },
        {
          id: '2',
          name: 'Produto 2',
          price: 200,
          category: 'Basquete',
          stock: 5,
          status: 'active' as const,
          image: '/test2.jpg',
          description: 'Descrição 2',
          createdAt: '2024-01-01',
          sales: 3,
          rating: 4.0
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getProducts.mockResolvedValue(mockProducts)

      render(<ProdutosPage />)

      await waitFor(() => {
        expect(screen.getByText('Produto 1')).toBeInTheDocument()
        expect(screen.getByText('Produto 2')).toBeInTheDocument()
      })

      // Filtrar por categoria
      const categoryFilter = screen.getByDisplayValue('Todas as Categorias')
      fireEvent.change(categoryFilter, { target: { value: 'Futebol' } })

      await waitFor(() => {
        expect(screen.getByText('Produto 1')).toBeInTheDocument()
        expect(screen.queryByText('Produto 2')).not.toBeInTheDocument()
      })
    })

    it('deve buscar produtos por nome', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Camisa Flamengo',
          price: 100,
          category: 'Futebol',
          stock: 10,
          status: 'active' as const,
          image: '/test1.jpg',
          description: 'Camisa do Flamengo',
          createdAt: '2024-01-01',
          sales: 5,
          rating: 4.5
        },
        {
          id: '2',
          name: 'Camisa Corinthians',
          price: 200,
          category: 'Futebol',
          stock: 5,
          status: 'active' as const,
          image: '/test2.jpg',
          description: 'Camisa do Corinthians',
          createdAt: '2024-01-01',
          sales: 3,
          rating: 4.0
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getProducts.mockResolvedValue(mockProducts)

      render(<ProdutosPage />)

      await waitFor(() => {
        expect(screen.getByText('Camisa Flamengo')).toBeInTheDocument()
        expect(screen.getByText('Camisa Corinthians')).toBeInTheDocument()
      })

      // Buscar por nome
      const searchInput = screen.getByPlaceholderText('Buscar produtos...')
      fireEvent.change(searchInput, { target: { value: 'Flamengo' } })

      await waitFor(() => {
        expect(screen.getByText('Camisa Flamengo')).toBeInTheDocument()
        expect(screen.queryByText('Camisa Corinthians')).not.toBeInTheDocument()
      })
    })

    it('deve atualizar status do produto', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Produto Teste',
          price: 100,
          category: 'Categoria',
          stock: 10,
          status: 'active' as const,
          image: '/test.jpg',
          description: 'Descrição teste',
          createdAt: '2024-01-01',
          sales: 5,
          rating: 4.5
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getProducts.mockResolvedValue(mockProducts)
      adminService.updateProductStatus.mockResolvedValue(true)

      render(<ProdutosPage />)

      await waitFor(() => {
        expect(screen.getByText('Produto Teste')).toBeInTheDocument()
      })

      // Clicar no botão de status
      const statusButton = screen.getByText('Ativo')
      fireEvent.click(statusButton)

      await waitFor(() => {
        expect(adminService.updateProductStatus).toHaveBeenCalledWith('1', 'inactive')
      })
    })
  })

  describe('Página de Pedidos', () => {
    it('deve renderizar lista de pedidos', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'Cliente Teste',
            email: 'cliente@test.com',
            phone: '(11) 99999-9999'
          },
          items: [
            { name: 'Produto 1', quantity: 2, price: 100 }
          ],
          total: 200,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua Teste, 123',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('Pedidos')).toBeInTheDocument()
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
        expect(screen.getByText('Cliente Teste')).toBeInTheDocument()
        expect(screen.getByText('R$ 200,00')).toBeInTheDocument()
      })
    })

    it('deve filtrar pedidos por status', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'cliente1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        },
        {
          id: 'ORD-002',
          customer: { name: 'Cliente 2', email: 'cliente2@test.com', phone: '(11) 88888-8888' },
          items: [{ name: 'Produto 2', quantity: 1, price: 200 }],
          total: 200,
          status: 'confirmed' as const,
          paymentMethod: 'Cartão',
          shippingAddress: 'Rua 2',
          createdAt: '2024-01-01T11:00:00Z',
          updatedAt: '2024-01-01T11:00:00Z'
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
        expect(screen.getByText('ORD-002')).toBeInTheDocument()
      })

      // Filtrar por status
      const statusFilter = screen.getByDisplayValue('Todos os Status')
      fireEvent.change(statusFilter, { target: { value: 'pending' } })

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
        expect(screen.queryByText('ORD-002')).not.toBeInTheDocument()
      })
    })

    it('deve atualizar status do pedido', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente Teste', email: 'cliente@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua Teste',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      const { adminService } = require('@/lib/admin-service')
      adminService.getOrders.mockResolvedValue(mockOrders)
      adminService.updateOrderStatus.mockResolvedValue(true)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Alterar status do pedido
      const statusSelect = screen.getByDisplayValue('Pendente')
      fireEvent.change(statusSelect, { target: { value: 'confirmed' } })

      await waitFor(() => {
        expect(adminService.updateOrderStatus).toHaveBeenCalledWith('ORD-001', 'confirmed')
      })
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve mostrar erro quando falhar ao carregar produtos', async () => {
      const { adminService } = require('@/lib/admin-service')
      adminService.getProducts.mockRejectedValue(new Error('Erro de rede'))

      // Mock do alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<ProdutosPage />)

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Erro ao carregar produtos')
      })

      alertSpy.mockRestore()
    })

    it('deve mostrar erro quando falhar ao carregar pedidos', async () => {
      const { adminService } = require('@/lib/admin-service')
      adminService.getOrders.mockRejectedValue(new Error('Erro de rede'))

      // Mock do alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<PedidosPage />)

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Erro ao carregar pedidos')
      })

      alertSpy.mockRestore()
    })

    it('deve mostrar erro quando falhar ao carregar estatísticas', async () => {
      const { adminService } = require('@/lib/admin-service')
      adminService.getStats.mockRejectedValue(new Error('Erro de rede'))

      // Mock do alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Erro ao carregar dados do dashboard')
      })

      alertSpy.mockRestore()
    })
  })
})

