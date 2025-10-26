/**
 * Testes específicos para redirecionamento após cadastro - AlSports
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import RegisterPage from '@/app/auth/register/page'

// Mock do Next.js router
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/auth/register',
}))

// Mock do AuthContext
const mockSignUp = jest.fn()

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
    signUp: mockSignUp,
  }),
}))

// Mock do window.location
const mockLocation = {
  href: '',
  pathname: '/auth/register',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('Redirecionamento após Cadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.href = '/auth/register'
    mockLocation.pathname = '/auth/register'
  })

  it('deve redirecionar para página inicial após cadastro bem-sucedido', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    
    render(<RegisterPage />)
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome Completo'), { 
      target: { value: 'João Silva' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'joao@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Telefone'), { 
      target: { value: '+5511999999999' } 
    })
    fireEvent.change(screen.getByLabelText('CPF'), { 
      target: { value: '11144477735' } 
    })
    fireEvent.change(screen.getByLabelText('Senha'), { 
      target: { value: 'Password123' } 
    })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { 
      target: { value: 'Password123' } 
    })
    
    // Submeter formulário
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
    
    // Verificar se o loading está ativo
    await waitFor(() => {
      expect(screen.getByText('Criando conta...')).toBeInTheDocument()
    })
    
    // Aguardar o redirecionamento
    await waitFor(() => {
      expect(screen.getByText('Conta criada com sucesso! Redirecionando...')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Verificar se o redirecionamento foi chamado
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?message=Conta criada com sucesso! Bem-vindo ao AL Sports.')
    }, { timeout: 3000 })
  })

  it('deve usar window.location.href como fallback se router.push falhar', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    mockPush.mockImplementation(() => {
      throw new Error('Router push failed')
    })
    
    render(<RegisterPage />)
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome Completo'), { 
      target: { value: 'João Silva' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'joao@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Telefone'), { 
      target: { value: '+5511999999999' } 
    })
    fireEvent.change(screen.getByLabelText('CPF'), { 
      target: { value: '11144477735' } 
    })
    fireEvent.change(screen.getByLabelText('Senha'), { 
      target: { value: 'Password123' } 
    })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { 
      target: { value: 'Password123' } 
    })
    
    // Submeter formulário
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
    
    // Aguardar o redirecionamento
    await waitFor(() => {
      expect(screen.getByText('Conta criada com sucesso! Redirecionando...')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Verificar se window.location.href foi usado como fallback
    await waitFor(() => {
      expect(mockLocation.href).toBe('/?message=Conta criada com sucesso! Bem-vindo ao AL Sports.')
    }, { timeout: 4000 })
  })

  it('deve exibir mensagem de erro se o cadastro falhar', async () => {
    mockSignUp.mockResolvedValue({ 
      error: { message: 'Este email já está cadastrado' } 
    })
    
    render(<RegisterPage />)
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome Completo'), { 
      target: { value: 'João Silva' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'joao@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Telefone'), { 
      target: { value: '+5511999999999' } 
    })
    fireEvent.change(screen.getByLabelText('CPF'), { 
      target: { value: '11144477735' } 
    })
    fireEvent.change(screen.getByLabelText('Senha'), { 
      target: { value: 'Password123' } 
    })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { 
      target: { value: 'Password123' } 
    })
    
    // Submeter formulário
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
    
    // Verificar se o erro é exibido
    await waitFor(() => {
      expect(screen.getByText('Este email já está cadastrado')).toBeInTheDocument()
    })
    
    // Verificar se não houve redirecionamento
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockLocation.href).toBe('/auth/register')
  })

  it('deve redirecionar automaticamente se o usuário já estiver logado', async () => {
    // Mock do usuário já autenticado
    jest.doMock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { id: '123', email: 'test@example.com' },
        profile: { id: '123', full_name: 'Test User' },
        loading: false,
        signUp: mockSignUp,
      }),
    }))
    
    render(<RegisterPage />)
    
    // Verificar se o redirecionamento automático acontece
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?message=Bem-vindo de volta!')
    })
  })

  it('deve exibir indicador de loading durante o redirecionamento', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    
    render(<RegisterPage />)
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome Completo'), { 
      target: { value: 'João Silva' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'joao@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Telefone'), { 
      target: { value: '+5511999999999' } 
    })
    fireEvent.change(screen.getByLabelText('CPF'), { 
      target: { value: '11144477735' } 
    })
    fireEvent.change(screen.getByLabelText('Senha'), { 
      target: { value: 'Password123' } 
    })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { 
      target: { value: 'Password123' } 
    })
    
    // Submeter formulário
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
    
    // Verificar se o botão está desabilitado durante o loading
    expect(screen.getByRole('button', { name: /criando conta/i })).toBeDisabled()
    
    // Verificar se o indicador de redirecionamento aparece
    await waitFor(() => {
      expect(screen.getByText('Conta criada com sucesso! Redirecionando...')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('deve lidar com erros de rede durante o redirecionamento', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    mockPush.mockRejectedValue(new Error('Network error'))
    
    render(<RegisterPage />)
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome Completo'), { 
      target: { value: 'João Silva' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'joao@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Telefone'), { 
      target: { value: '+5511999999999' } 
    })
    fireEvent.change(screen.getByLabelText('CPF'), { 
      target: { value: '11144477735' } 
    })
    fireEvent.change(screen.getByLabelText('Senha'), { 
      target: { value: 'Password123' } 
    })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { 
      target: { value: 'Password123' } 
    })
    
    // Submeter formulário
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
    
    // Aguardar o redirecionamento
    await waitFor(() => {
      expect(screen.getByText('Conta criada com sucesso! Redirecionando...')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Verificar se window.location.href foi usado como fallback
    await waitFor(() => {
      expect(mockLocation.href).toBe('/?message=Conta criada com sucesso! Bem-vindo ao AL Sports.')
    }, { timeout: 4000 })
  })
})
