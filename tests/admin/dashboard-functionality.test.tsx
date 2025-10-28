/**
 * Testes de funcionalidade para o Dashboard Admin
 */

import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import AdminDashboard from '@/app/admin/page'
import { adminService } from '@/lib/admin-service'

// Mock do admin service
jest.mock('@/lib/admin-service', () => ({
  adminService: {
    getStats: jest.fn()
  }
}))

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('Dashboard Admin - Funcionalidades', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.confirm = jest.fn(() => true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Carregamento de Estatísticas', () => {
    it('deve exibir todas as estatísticas do dashboard', async () => {
      const mockStats = {
        totalOrders: 1250,
        totalRevenue: 45890,
        activeProducts: 312,
        newCustomers: 78,
        ordersGrowth: 5.2,
        revenueGrowth: 8.1,
        productsGrowth: -1.5,
        customersGrowth: 12.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      await act(async () => {
        render(<AdminDashboard />)
      })

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('1.250')).toBeInTheDocument()
        expect(screen.getByText('312')).toBeInTheDocument()
        expect(screen.getByText('78')).toBeInTheDocument()
      })
    })

    it('deve exibir crescimento positivo nas estatísticas', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 10000,
        activeProducts: 50,
        newCustomers: 10,
        ordersGrowth: 10.5,
        revenueGrowth: 15.2,
        productsGrowth: 5.0,
        customersGrowth: 20.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        // Verificar se os textos de crescimento positivo aparecem
        const growthTexts = screen.getAllByText(/\+.*% vs\. mês passado/)
        expect(growthTexts.length).toBeGreaterThan(0)
      })
    })

    it('deve exibir crescimento negativo nas estatísticas', async () => {
      const mockStats = {
        totalOrders: 80,
        totalRevenue: 8500,
        activeProducts: 45,
        newCustomers: 8,
        ordersGrowth: -5.5,
        revenueGrowth: -10.2,
        productsGrowth: -2.0,
        customersGrowth: -5.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        // Verificar se os textos de crescimento negativo aparecem
        const negativeGrowth = screen.getAllByText(/^-.+% vs\. mês passado/)
        expect(negativeGrowth.length).toBeGreaterThanOrEqual(0)
      })
    })

    it('deve mostrar loading durante carregamento', () => {
      adminService.getStats.mockImplementation(() => new Promise(() => {}))

      render(<AdminDashboard />)

      // Verificar se spinner de loading está presente
      const loadingSpinner = document.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
    })
  })

  describe('Cards de Estatísticas', () => {
    it('deve exibir card de Total de Pedidos', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 10000,
        activeProducts: 50,
        newCustomers: 10,
        ordersGrowth: 10.0,
        revenueGrowth: 15.0,
        productsGrowth: 5.0,
        customersGrowth: 20.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Total de Pedidos')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Faturamento Total', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 45890,
        activeProducts: 50,
        newCustomers: 10,
        ordersGrowth: 10.0,
        revenueGrowth: 15.0,
        productsGrowth: 5.0,
        customersGrowth: 20.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Faturamento Total')).toBeInTheDocument()
        expect(screen.getByText(/R\$ 45.890/)).toBeInTheDocument()
      })
    })

    it('deve exibir card de Produtos Ativos', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 10000,
        activeProducts: 312,
        newCustomers: 10,
        ordersGrowth: 10.0,
        revenueGrowth: 15.0,
        productsGrowth: 5.0,
        customersGrowth: 20.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Produtos Ativos')).toBeInTheDocument()
        expect(screen.getByText('312')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Usuários Ativos', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 10000,
        activeProducts: 50,
        newCustomers: 78,
        ordersGrowth: 10.0,
        revenueGrowth: 15.0,
        productsGrowth: 5.0,
        customersGrowth: 20.0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Usuários Ativos')).toBeInTheDocument()
        expect(screen.getByText('78')).toBeInTheDocument()
      })
    })
  })

  describe('Acesso Rápido', () => {
    it('deve exibir seção de Acesso Rápido', async () => {
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

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Acesso Rápido')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Gerenciar Produtos', async () => {
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

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Produtos')).toBeInTheDocument()
        expect(screen.getByText('Adicione, edite e remova produtos')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Visualizar Pedidos', async () => {
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

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Visualizar Pedidos')).toBeInTheDocument()
        expect(screen.getByText('Acompanhe novos e antigos pedidos')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Gerenciar Categorias', async () => {
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

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Gerenciar Categorias')).toBeInTheDocument()
        expect(screen.getByText('Organize seus produtos em categorias')).toBeInTheDocument()
      })
    })

    it('deve ter links funcionais para os cards de acesso rápido', async () => {
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

      adminService.getStats.mockResolvedValue(mockStats)

      await act(async () => {
        render(<AdminDashboard />)
      })

      await waitFor(() => {
        // Usar getAllByText para encontrar todos os links "Acessar"
        const accessLinks = screen.getAllByText('Acessar')
        expect(accessLinks.length).toBeGreaterThan(0)
        
        // Verificar se pelo menos um link aponta para produtos
        const productLink = accessLinks.find(link => 
          link.closest('a')?.getAttribute('href') === '/admin/produtos'
        )
        expect(productLink).toBeDefined()
      })
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve lidar com erro ao carregar estatísticas', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
      
      adminService.getStats.mockRejectedValue(new Error('Erro ao carregar'))

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled()
      })

      alertSpy.mockRestore()
    })

    it('deve exibir valores zerados quando não houver dados', async () => {
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

      adminService.getStats.mockResolvedValue(mockStats)

      await act(async () => {
        render(<AdminDashboard />)
      })

      await waitFor(() => {
        // Usar getAllByText para encontrar elementos com "0"
        const zeroElements = screen.getAllByText('0')
        expect(zeroElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Formatação de Valores', () => {
    it('deve formatar valores monetários corretamente', async () => {
      const mockStats = {
        totalOrders: 0,
        totalRevenue: 123456,
        activeProducts: 0,
        newCustomers: 0,
        ordersGrowth: 0,
        revenueGrowth: 0,
        productsGrowth: 0,
        customersGrowth: 0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText(/R\$ 123.456/)).toBeInTheDocument()
      })
    })

    it('deve formatar números grandes corretamente', async () => {
      const mockStats = {
        totalOrders: 1234567,
        totalRevenue: 0,
        activeProducts: 0,
        newCustomers: 0,
        ordersGrowth: 0,
        revenueGrowth: 0,
        productsGrowth: 0,
        customersGrowth: 0
      }

      adminService.getStats.mockResolvedValue(mockStats)

      render(<AdminDashboard />)

      await waitFor(() => {
        expect(screen.getByText('1.234.567')).toBeInTheDocument()
      })
    })
  })
})

