/**
 * Testes de funcionalidade para a Página de Pedidos Admin
 */

import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import PedidosPage from '@/app/admin/pedidos/page'
import { adminService } from '@/lib/admin-service'
import '@testing-library/jest-dom'

// Mock do admin service
jest.mock('@/lib/admin-service', () => ({
  adminService: {
    getOrders: jest.fn(),
    updateOrderStatus: jest.fn(),
    deleteOrder: jest.fn()
  }
}))

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('Página de Pedidos - Funcionalidades', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.confirm = jest.fn(() => true)
    global.alert = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Carregamento de Pedidos', () => {
    it('deve exibir lista de pedidos', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'João Silva',
            email: 'joao@test.com',
            phone: '(11) 99999-9999'
          },
          items: [
            { name: 'Camisa Flamengo', quantity: 2, price: 89.90 }
          ],
          total: 179.80,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua Teste, 123 - São Paulo, SP',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T10:30:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('Pedidos')).toBeInTheDocument()
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
        expect(screen.getByText('João Silva')).toBeInTheDocument()
      })
    })

    it('deve mostrar loading durante carregamento', () => {
      adminService.getOrders.mockImplementation(() => new Promise(() => {}))

      render(<PedidosPage />)

      // Verificar se spinner de loading está presente
      const loadingSpinner = document.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
    })

    it('deve exibir mensagem quando não houver pedidos', async () => {
      adminService.getOrders.mockResolvedValue([])

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument()
        expect(screen.getByText('Ainda não há pedidos em sua loja')).toBeInTheDocument()
      })
    })
  })

  describe('Cards de Estatísticas', () => {
    it('deve exibir card de Total de Pedidos', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      await act(async () => {
        render(<PedidosPage />)
      })

      await waitFor(() => {
        expect(screen.getByText('Total de Pedidos')).toBeInTheDocument()
        // Usar getAllByText para encontrar o primeiro elemento com "1"
        const totalElements = screen.getAllByText('1')
        expect(totalElements.length).toBeGreaterThan(0)
      })
    })

    it('deve exibir card de Pendentes', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('Pendentes')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Enviados', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'shipped' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('Enviados')).toBeInTheDocument()
      })
    })

    it('deve exibir card de Faturamento', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      await act(async () => {
        render(<PedidosPage />)
      })

      await waitFor(() => {
        expect(screen.getByText('Faturamento')).toBeInTheDocument()
        // Usar getAllByText para encontrar elementos com R$ 100
        const revenueElements = screen.getAllByText(/R\$ 100/)
        expect(revenueElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Filtros e Busca', () => {
    it('deve permitir buscar pedidos por nome do cliente', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'João Silva', email: 'joao@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Buscar pedidos...')
      fireEvent.change(searchInput, { target: { value: 'João' } })

      // Verificar se o pedido ainda aparece após a busca
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('deve filtrar pedidos por status', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
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
          customer: { name: 'Cliente 2', email: 'c2@test.com', phone: '(11) 88888-8888' },
          items: [{ name: 'Produto 2', quantity: 1, price: 200 }],
          total: 200,
          status: 'confirmed' as const,
          paymentMethod: 'Cartão',
          shippingAddress: 'Rua 2',
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
        expect(screen.getByText('ORD-002')).toBeInTheDocument()
      })

      // Filtrar por status pending
      const statusFilter = screen.getByDisplayValue('Todos os Status')
      fireEvent.change(statusFilter, { target: { value: 'pending' } })

      // Verificar que o pedido filtrado ainda aparece
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })
  })

  describe('Atualização de Status', () => {
    it('deve permitir alterar status do pedido', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)
      adminService.updateOrderStatus.mockResolvedValue(true)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Alterar status
      const statusSelect = screen.getByDisplayValue('Pendente')
      fireEvent.change(statusSelect, { target: { value: 'confirmed' } })

      await waitFor(() => {
        expect(adminService.updateOrderStatus).toHaveBeenCalledWith('ORD-001', 'confirmed')
      })
    })

    it('deve mostrar feedback visual durante atualização', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)
      adminService.updateOrderStatus.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(true), 100))
      )

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Alterar status
      const statusSelect = screen.getByDisplayValue('Pendente')
      fireEvent.change(statusSelect, { target: { value: 'confirmed' } })

      // Verificar se o select está desabilitado durante atualização
      const disabledSelect = screen.getByDisplayValue('Pendente')
      expect(disabledSelect).toHaveAttribute('disabled')
    })
  })

  describe('Visualização de Detalhes', () => {
    it('deve abrir modal ao clicar no botão Ver', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      await act(async () => {
        render(<PedidosPage />)
      })

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Clicar no botão de visualizar
      const viewButton = screen.getByTitle('Ver detalhes')
      await act(async () => {
        fireEvent.click(viewButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Detalhes do Pedido - ORD-001')).toBeInTheDocument()
        // Usar getAllByText para encontrar elementos com "Cliente"
        const clienteElements = screen.getAllByText('Cliente')
        expect(clienteElements.length).toBeGreaterThan(0)
        expect(screen.getByText('Endereço de Entrega')).toBeInTheDocument()
        // Verificar se existe algum texto relacionado a itens usando getAllByText
        const produtoElements = screen.getAllByText(/Produto/)
        expect(produtoElements.length).toBeGreaterThan(0)
      })
    })

    it('deve exibir informações completas no modal', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'João Silva', email: 'joao@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Camisa Flamengo', quantity: 2, price: 89.90 }],
          total: 179.80,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua Teste, 123 - São Paulo, SP',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      await act(async () => {
        render(<PedidosPage />)
      })

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Abrir modal
      const viewButton = screen.getByTitle('Ver detalhes')
      await act(async () => {
        fireEvent.click(viewButton)
      })

      await waitFor(() => {
        // Verificar informações do cliente usando getAllByText
        const joaoElements = screen.getAllByText('João Silva')
        expect(joaoElements.length).toBeGreaterThan(0)
        
        // Usar getAllByText para email também
        const emailElements = screen.getAllByText('joao@test.com')
        expect(emailElements.length).toBeGreaterThan(0)
        
        // Verificar endereço
        expect(screen.getByText('Rua Teste, 123 - São Paulo, SP')).toBeInTheDocument()
        
        // Verificar itens usando getAllByText
        const camisaElements = screen.getAllByText('Camisa Flamengo')
        expect(camisaElements.length).toBeGreaterThan(0)
        
        // Verificar total usando getAllByText
        const totalElements = screen.getAllByText(/R\$ 179\.80/)
        expect(totalElements.length).toBeGreaterThan(0)
      })
    })

    it('deve fechar modal ao clicar no botão Fechar', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Abrir modal
      const viewButton = screen.getByTitle('Ver detalhes')
      fireEvent.click(viewButton)

      await waitFor(() => {
        expect(screen.getByText('Detalhes do Pedido - ORD-001')).toBeInTheDocument()
      })

      // Fechar modal
      const closeButton = screen.getAllByText('Fechar')[0]
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Detalhes do Pedido - ORD-001')).not.toBeInTheDocument()
      })
    })
  })

  describe('Exclusão de Pedidos', () => {
    it('deve permitir excluir pedido', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)
      adminService.deleteOrder.mockResolvedValue(true)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Clicar no botão de excluir
      const deleteButton = screen.getByTitle('Excluir pedido')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(adminService.deleteOrder).toHaveBeenCalledWith('ORD-001')
      })
    })

    it('deve mostrar confirmação antes de excluir', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)
      adminService.deleteOrder.mockResolvedValue(true)

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      // Clicar no botão de excluir
      const deleteButton = screen.getByTitle('Excluir pedido')
      fireEvent.click(deleteButton)

      // Verificar se foi chamado confirm
      expect(global.confirm).toHaveBeenCalled()
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve lidar com erro ao carregar pedidos', async () => {
      adminService.getOrders.mockRejectedValue(new Error('Erro ao carregar'))

      render(<PedidosPage />)

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Erro ao carregar pedidos')
      })
    })

    it('deve lidar com erro ao atualizar status', async () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: { name: 'Cliente 1', email: 'c1@test.com', phone: '(11) 99999-9999' },
          items: [{ name: 'Produto 1', quantity: 1, price: 100 }],
          total: 100,
          status: 'pending' as const,
          paymentMethod: 'PIX',
          shippingAddress: 'Rua 1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      adminService.getOrders.mockResolvedValue(mockOrders)
      adminService.updateOrderStatus.mockRejectedValue(new Error('Erro ao atualizar'))

      render(<PedidosPage />)

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
      })

      const statusSelect = screen.getByDisplayValue('Pendente')
      fireEvent.change(statusSelect, { target: { value: 'confirmed' } })

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Erro ao atualizar status do pedido')
      })
    })
  })
})

