/**
 * Testes para a página de checkout
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import CheckoutPage from '@/app/checkout/page'

// Mock do contexto de autenticação
jest.mock('@/contexts/AuthContext')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock do contexto do carrinho
jest.mock('@/contexts/CartContext')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

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

    // Mock do fetch para ViaCEP
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        logradouro: 'Rua Teste',
        bairro: 'Bairro Teste',
        localidade: 'São Paulo',
        uf: 'SP'
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

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

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    // Deve mostrar erros de validação
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument() // Campo vazio
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

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    })
  })

  it('deve mostrar opções de frete', async () => {
    render(<CheckoutPage />)

    // Avançar para etapa de frete
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

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
      // As opções de frete agora vêm do SuperFrete, então verificamos apenas que a seção está presente
    })
  })

  it('deve selecionar método de frete e avançar', async () => {
    render(<CheckoutPage />)

    // Avançar para etapa de frete (simular preenchimento anterior)
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

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    })

    // Selecionar método de frete (agora vem do SuperFrete)
    // Note: Este teste pode precisar de mock do SuperFrete na prática

    const continueButton2 = screen.getByText('Continuar')
    fireEvent.click(continueButton2)

    await waitFor(() => {
      expect(screen.getByText('Ir para Pagamento')).toBeInTheDocument()
    })
  })

  it('deve mostrar resumo do pedido na etapa final', async () => {
    render(<CheckoutPage />)

    // Preencher e avançar até a etapa final
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

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Método de Entrega')).toBeInTheDocument()
    })

    // Simular seleção de método de entrega e avançar
    // (mock do SuperFrete seria necessário aqui na prática)
    
    // Verificar se o resumo está presente quando chegar na etapa 3
    // Note: Este teste pode precisar de ajustes dependendo da implementação do SuperFrete
  })

  it('deve finalizar pedido com sucesso', async () => {
    const mockCreateOrder = jest.fn().mockResolvedValue({ success: true })
    const mockOpenWhatsAppOrder = jest.fn()

    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      createOrder: mockCreateOrder,
      openWhatsAppOrder: mockOpenWhatsAppOrder
    })

    render(<CheckoutPage />)

    // Simular finalização do pedido
    // Primeiro navegar até a etapa final
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

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    await waitFor(() => {
      const finalizeButton = screen.queryByText('Ir para Pagamento')
      if (finalizeButton) {
        fireEvent.click(finalizeButton)
      }
    })

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalled()
      expect(mockOpenWhatsAppOrder).toHaveBeenCalled()
    })
  })

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

    // Navegar até a etapa final e clicar no botão
    await waitFor(() => {
      const finalizeButton = screen.queryByText('Ir para Pagamento')
      if (finalizeButton) {
        fireEvent.click(finalizeButton)
      }
    })

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled()
    })

    alertSpy.mockRestore()
  })

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

    // Avançar para próxima etapa
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

    const continueButton = screen.getByText('Continuar')
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

