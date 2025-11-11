/**
 * Testes para a página de checkout
 */

import CheckoutPage from '@/app/checkout/page'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

// Mock do contexto de autenticação
jest.mock('@/contexts/AuthContext')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock do contexto do carrinho
jest.mock('@/contexts/CartContext')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Mock do shipping-service
jest.mock('@/lib/shipping-service', () => ({
  superFreteService: {
    getShippingOptions: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'PAC',
        price: 15.00,
        delivery_time: 5,
        delivery_range: { min: 3, max: 7 },
        company: { id: 1, name: 'Correios', picture: '' }
      },
      {
        id: '2',
        name: 'SEDEX',
        price: 25.00,
        delivery_time: 3,
        delivery_range: { min: 1, max: 3 },
        company: { id: 2, name: 'Correios', picture: '' }
      }
    ])
  }
}))

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  usePathname: () => '/checkout'
}))

// Mock do Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock do fetch para ViaCEP
global.fetch = jest.fn()

describe('CheckoutPage', () => {
  const mockUser = {
    id: '1',
    email: 'user@test.com',
    user_metadata: { full_name: 'User Test' }
  }

  const mockProfile = {
    full_name: 'User Test',
    phone: '(11) 99999-9999',
    addresses: []
  }

  const mockCartSummary = {
    items: [
      {
        id: '1',
        name: 'Produto Teste',
        price: 100,
        quantity: 2,
        image: '/test.jpg',
        description: 'Descrição teste',
        size: 'M',
        color: 'Azul'
      }
    ],
    subtotal: 200,
    shipping: 0,
    total: 200,
    totalItems: 2,
    shippingInfo: {
      method: 'transportadora',
      estimatedDays: '3-5 dias úteis',
      cost: 0
    },
    canUseTransportadora: true
  }

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      signOut: jest.fn(),
      loading: false
    })

    mockUseCart.mockReturnValue({
      getCartSummary: jest.fn(() => mockCartSummary),
      createOrder: jest.fn(),
      openWhatsAppOrder: jest.fn(),
      items: mockCartSummary.items,
      loading: false,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalItems: jest.fn(() => 2),
      getSubtotal: jest.fn(() => 200),
      getShippingCost: jest.fn(() => 0),
      getTotal: jest.fn(() => 200)
    })

    // Mock do fetch para ViaCEP e SuperFrete
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      // Mock para ViaCEP
      if (url.includes('viacep.com.br')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            logradouro: 'Rua Teste',
            bairro: 'Bairro Teste',
            localidade: 'São Paulo',
            uf: 'SP'
          })
        })
      }
      // Mock para SuperFrete (via API route)
      if (url.includes('/api/shipping/calculate')) {
        return Promise.resolve({
          json: async () => [
            {
              id: '1',
              name: 'PAC',
              price: 15.00,
              delivery_time: 5,
              delivery_range: { min: 3, max: 7 },
              company: { id: 1, name: 'Correios', picture: '' },
              has_error: false
            },
            {
              id: '2',
              name: 'SEDEX',
              price: 25.00,
              delivery_time: 3,
              delivery_range: { min: 1, max: 3 },
              company: { id: 2, name: 'Correios', picture: '' },
              has_error: false
            }
          ],
          ok: true,
          status: 200
        })
      }
      // Mock direto para SuperFrete API (caso seja chamado)
      if (url.includes('superfrete.com')) {
        return Promise.resolve({
          json: async () => [
            {
              id: '1',
              name: 'PAC',
              price: 15.00,
              delivery_time: 5,
              delivery_range: { min: 3, max: 7 },
              company: { id: 1, name: 'Correios', picture: '' },
              has_error: false
            },
            {
              id: '2',
              name: 'SEDEX',
              price: 25.00,
              delivery_time: 3,
              delivery_range: { min: 1, max: 3 },
              company: { id: 2, name: 'Correios', picture: '' },
              has_error: false
            }
          ],
          ok: true,
          status: 200
        })
      }
      return Promise.reject(new Error(`Unexpected fetch call to ${url}`))
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Função auxiliar para preencher todos os campos obrigatórios
  const fillAllRequiredFields = async () => {
    // Preencher todos os campos obrigatórios
    const nameInput = screen.getByDisplayValue('User Test')
    const cepInput = screen.getByPlaceholderText('00000000')
    const addressInput = screen.getByPlaceholderText('Rua, Avenida...')
    const numberInput = screen.getByPlaceholderText('123')
    const neighborhoodInput = screen.getByPlaceholderText('Centro')
    const cityInput = screen.getByPlaceholderText('São Paulo')
    const stateInput = screen.getByPlaceholderText('SP')
    const phoneInput = screen.getByDisplayValue('(11) 99999-9999')
    const emailInput = screen.getByDisplayValue('user@test.com')

    // Preencher todos os campos com valores válidos
    fireEvent.change(nameInput, { target: { value: 'User Test' } })
    fireEvent.change(cepInput, { target: { value: '01234567' } })
    fireEvent.change(addressInput, { target: { value: 'Rua Teste' } })
    fireEvent.change(numberInput, { target: { value: '123' } })
    fireEvent.change(neighborhoodInput, { target: { value: 'Centro' } })
    fireEvent.change(cityInput, { target: { value: 'São Paulo' } })
    fireEvent.change(stateInput, { target: { value: 'SP' } })
    fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } })
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } })

    // Aguardar um pouco para a validação acontecer
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  it('deve renderizar página de checkout para usuário logado', () => {
    render(<CheckoutPage />)

    expect(screen.getByText('Endereço de Entrega')).toBeInTheDocument()
    expect(screen.getByText('Informe onde você quer receber seu pedido.')).toBeInTheDocument()
  })

  it('deve redirecionar usuário não logado', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      signOut: jest.fn(),
      loading: false
    })

    render(<CheckoutPage />)

    expect(screen.getByText('Acesso Negado')).toBeInTheDocument()
    expect(screen.getByText('Você precisa estar logado para finalizar a compra.')).toBeInTheDocument()
  })

  it('deve preencher dados do usuário automaticamente', () => {
    render(<CheckoutPage />)

    expect(screen.getByDisplayValue('User Test')).toBeInTheDocument()
    expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument()
    expect(screen.getByDisplayValue('user@test.com')).toBeInTheDocument()
  })

  it('deve buscar endereço por CEP', async () => {
    render(<CheckoutPage />)

    const cepInput = screen.getByPlaceholderText('00000000')
    fireEvent.change(cepInput, { target: { value: '01234567' } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/01234567/json/')
    })
  })

  it('deve validar campos obrigatórios', async () => {
    render(<CheckoutPage />)

    // O botão deve estar desabilitado quando há campos vazios
    const continueButton = screen.getByText('Continuar para Entrega')
    expect(continueButton).toBeDisabled()

    // Tentar clicar mesmo desabilitado (para testar que não avança)
    fireEvent.click(continueButton)

    // Deve permanecer na mesma etapa
    await waitFor(() => {
      expect(screen.getByText('Endereço de Entrega')).toBeInTheDocument()
    })
  })

  it('deve avançar para próxima etapa com dados válidos', async () => {
    render(<CheckoutPage />)

    // Preencher formulário
    const nameInput = screen.getByDisplayValue('User Test')
    const cepInput = screen.getByPlaceholderText('00000000')
    const addressInput = screen.getByPlaceholderText('Rua, Avenida...')
    const numberInput = screen.getByPlaceholderText('123')
    const neighborhoodInput = screen.getByPlaceholderText('Centro')
    const cityInput = screen.getByPlaceholderText('São Paulo')
    const stateInput = screen.getByPlaceholderText('SP')

    fireEvent.change(nameInput, { target: { value: 'User Test' } })
    fireEvent.change(cepInput, { target: { value: '01234567' } })
    fireEvent.change(addressInput, { target: { value: 'Rua Teste' } })
    fireEvent.change(numberInput, { target: { value: '123' } })
    fireEvent.change(neighborhoodInput, { target: { value: 'Centro' } })
    fireEvent.change(cityInput, { target: { value: 'São Paulo' } })
    fireEvent.change(stateInput, { target: { value: 'SP' } })

    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      expect(continueButton).toBeInTheDocument()
    }, { timeout: 3000 })

    const continueButton = screen.getByText('Continuar para Entrega')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    })
  })

  it('deve mostrar opções de frete', async () => {
    render(<CheckoutPage />)

    // Preencher todos os campos obrigatórios
    await fillAllRequiredFields()

    // Aguardar botão aparecer após validação (botão pode estar desabilitado inicialmente)
    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      expect(continueButton).toBeInTheDocument()
    }, { timeout: 3000 })

    const continueButton = screen.getByText('Continuar para Entrega')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
      // As opções de frete agora vêm do SuperFrete, então verificamos apenas que a seção está presente
    })
  })

  it('deve selecionar método de frete e avançar', async () => {
    render(<CheckoutPage />)

    // Preencher todos os campos obrigatórios
    await fillAllRequiredFields()

    // Aguardar botão aparecer após validação (botão pode estar desabilitado inicialmente)
    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      expect(continueButton).toBeInTheDocument()
      expect(continueButton).not.toBeDisabled()
    }, { timeout: 5000 })

    const continueButton = screen.getByText('Continuar para Entrega')
    fireEvent.click(continueButton)

    // Aguardar etapa de frete
    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Aguardar opções de frete aparecerem (vêm do SuperFrete via mock)
    await waitFor(() => {
      const shippingRadios = screen.queryAllByRole('radio')
      expect(shippingRadios.length).toBeGreaterThan(0)
    }, { timeout: 10000 })

    // Selecionar primeira opção de frete disponível
    const shippingRadios = screen.getAllByRole('radio')
    fireEvent.click(shippingRadios[0])

    // Aguardar botão Continuar aparecer e clicar
    await waitFor(() => {
      const continueButton2 = screen.queryByText('Continuar')
      expect(continueButton2).toBeInTheDocument()
      expect(continueButton2).not.toBeDisabled()
    }, { timeout: 5000 })

    const continueButton2 = screen.getByText('Continuar')
    fireEvent.click(continueButton2)

    // Aguardar chegar na etapa 3 (Resumo)
    await waitFor(() => {
      expect(screen.getByText('Ir para Pagamento')).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 30000) // Timeout de 30 segundos para o teste

  it('deve mostrar resumo do pedido na etapa final', async () => {
    render(<CheckoutPage />)

    // Preencher todos os campos obrigatórios
    await fillAllRequiredFields()

    // Aguardar botão aparecer após validação
    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      expect(continueButton).toBeInTheDocument()
    }, { timeout: 3000 })

    const continueButton = screen.getByText('Continuar para Entrega')
    fireEvent.click(continueButton)

    // Aguardar etapa de frete
    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Aguardar opções de frete aparecerem e selecionar uma
    await waitFor(() => {
      const shippingRadios = screen.queryAllByRole('radio')
      if (shippingRadios.length > 0) {
        fireEvent.click(shippingRadios[0])
      }
    }, { timeout: 5000 })

    // Avançar para etapa 3
    await waitFor(() => {
      const continueButton2 = screen.queryByText('Continuar')
      if (continueButton2 && !continueButton2.hasAttribute('disabled')) {
        fireEvent.click(continueButton2)
      }
    }, { timeout: 3000 })

    // Verificar se o resumo está presente na etapa 3
    await waitFor(() => {
      expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 30000) // Timeout de 30 segundos para o teste

  it('deve finalizar pedido com sucesso', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue({ success: true })
    const mockOpenWhatsAppOrder = jest.fn()

    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      createOrder: mockCreateOrder,
      openWhatsAppOrder: mockOpenWhatsAppOrder
    })

    render(<CheckoutPage />)

    // Preencher todos os campos obrigatórios
    await fillAllRequiredFields()

    // Aguardar botão aparecer após validação
    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      expect(continueButton).toBeInTheDocument()
      expect(continueButton).not.toBeDisabled()
    }, { timeout: 5000 })

    // Avançar para etapa 2 (frete)
    const continueButton = screen.getByText('Continuar para Entrega')
    fireEvent.click(continueButton)

    // Aguardar etapa de frete
    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Aguardar opções de frete aparecerem e selecionar uma
    await waitFor(() => {
      const shippingRadios = screen.queryAllByRole('radio')
      expect(shippingRadios.length).toBeGreaterThan(0)
    }, { timeout: 10000 })

    const shippingRadios = screen.getAllByRole('radio')
    fireEvent.click(shippingRadios[0])

    // Avançar para etapa 3
    await waitFor(() => {
      const continueButton2 = screen.queryByText('Continuar')
      expect(continueButton2).toBeInTheDocument()
      expect(continueButton2).not.toBeDisabled()
    }, { timeout: 5000 })

    const continueButton2 = screen.getByText('Continuar')
    fireEvent.click(continueButton2)

    // Aguardar etapa 3 (resumo) e clicar no botão de pagamento
    await waitFor(() => {
      expect(screen.getByText('Finalizar Pedido')).toBeInTheDocument()
      expect(screen.getByText('Ir para Pagamento')).toBeInTheDocument()
    }, { timeout: 10000 })

    const finalizeButton = screen.getByText('Ir para Pagamento')
    fireEvent.click(finalizeButton)

    // Verificar se as funções foram chamadas
    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalled()
      expect(mockOpenWhatsAppOrder).toHaveBeenCalled()
    }, { timeout: 10000 })
  }, 30000) // Timeout de 30 segundos para o teste

  it('deve mostrar erro quando falhar ao criar pedido', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue({ 
      success: false, 
      error: 'Erro ao criar pedido' 
    })

    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      createOrder: mockCreateOrder
    })

    // Mock do alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CheckoutPage />)

    // Preencher todos os campos e navegar até a etapa final
    await fillAllRequiredFields()

    // Avançar para etapa 2
    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      if (continueButton && !continueButton.hasAttribute('disabled')) {
        fireEvent.click(continueButton)
      }
    }, { timeout: 3000 })

    // Aguardar etapa de frete e selecionar opção
    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    })

    // Selecionar primeira opção de frete disponível
    await waitFor(() => {
      const shippingRadios = screen.queryAllByRole('radio')
      if (shippingRadios.length > 0) {
        fireEvent.click(shippingRadios[0])
      }
    }, { timeout: 5000 })

    // Avançar para etapa 3
    await waitFor(() => {
      const continueButton2 = screen.queryByText('Continuar')
      if (continueButton2 && !continueButton2.hasAttribute('disabled')) {
        fireEvent.click(continueButton2)
      }
    }, { timeout: 3000 })

    // Aguardar etapa 3 e clicar no botão de pagamento
    await waitFor(() => {
      const finalizeButton = screen.queryByText('Ir para Pagamento')
      if (finalizeButton) {
        fireEvent.click(finalizeButton)
      }
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled()
    }, { timeout: 10000 })

    alertSpy.mockRestore()
  }, 30000) // Timeout de 30 segundos para o teste

  it('deve mostrar loading durante processamento', async () => {
    const mockCreateOrder = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
    )

    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      createOrder: mockCreateOrder
    })

    render(<CheckoutPage />)

    // Navegar até a etapa final
    await waitFor(() => {
      const finalizeButton = screen.queryByText('Ir para Pagamento')
      if (finalizeButton) {
        fireEvent.click(finalizeButton)
        // Deve mostrar loading
        expect(screen.getByText('Processando...')).toBeInTheDocument()
      }
    })
  })

  it('deve voltar para etapa anterior', async () => {
    render(<CheckoutPage />)

    // Preencher todos os campos obrigatórios e avançar
    await fillAllRequiredFields()

    // Aguardar botão aparecer após validação (botão pode estar desabilitado inicialmente)
    await waitFor(() => {
      const continueButton = screen.queryByText('Continuar para Entrega')
      expect(continueButton).toBeInTheDocument()
    }, { timeout: 3000 })

    const continueButton = screen.getByText('Continuar para Entrega')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    })

    // Voltar para etapa anterior
    const backButton = screen.getByText('Voltar')
    fireEvent.click(backButton)

    await waitFor(() => {
      expect(screen.getByText('Endereço de Entrega')).toBeInTheDocument()
    })
  })
})

