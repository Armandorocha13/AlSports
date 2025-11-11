/**
 * Testes específicos para cadastro de contas - AlSports
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import RegisterPage from '@/app/auth/register/page'
import { validatePassword, isValidEmail, isValidCPF } from '@/lib/security'

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

// Mock do Supabase
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@/lib/supabase-client', () => ({
  createClient: () => mockSupabase,
}))

describe('Cadastro de Contas - AlSports', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Renderização do Formulário', () => {
    it('deve renderizar todos os campos do formulário de cadastro', () => {
      render(<RegisterPage />)
      
      // Campos obrigatórios
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Senha')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument()
      
      // Campos opcionais
      expect(screen.getByLabelText('Telefone')).toBeInTheDocument()
      expect(screen.getByLabelText('CPF')).toBeInTheDocument()
      expect(screen.getByLabelText('Data de nascimento')).toBeInTheDocument()
      
      // Botão de cadastro
      expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
    })

    it('deve exibir links de navegação', () => {
      render(<RegisterPage />)
      
      expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument()
      expect(screen.getByText('Entrar')).toBeInTheDocument()
    })
  })

  describe('Validações de Formulário', () => {
    it('deve validar campos obrigatórios', async () => {
      render(<RegisterPage />)
      
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
        expect(screen.getByText('Email é obrigatório')).toBeInTheDocument()
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
      })
    })

    it('deve validar formato de email', async () => {
      render(<RegisterPage />)
      
      const emailInput = screen.getByLabelText('Email')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })

    it('deve validar confirmação de senha', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText('Senha')
      const confirmPasswordInput = screen.getByLabelText('Confirmar senha')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
      })
    })

    it('deve validar força da senha', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText('Senha')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(passwordInput, { target: { value: '123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
      })
    })

    it('deve validar formato do CPF', async () => {
      render(<RegisterPage />)
      
      const cpfInput = screen.getByLabelText('CPF')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(cpfInput, { target: { value: '123456789' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('CPF inválido')).toBeInTheDocument()
      })
    })

    it('deve validar formato do telefone', async () => {
      render(<RegisterPage />)
      
      const phoneInput = screen.getByLabelText('Telefone')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(phoneInput, { target: { value: '123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Telefone inválido')).toBeInTheDocument()
      })
    })
  })

  describe('Cadastro Bem-sucedido', () => {
    it('deve cadastrar usuário com dados válidos', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Telefone'), { 
        target: { value: '+5511999999999' } 
      })
      fireEvent.change(screen.getByLabelText('CPF'), { 
        target: { value: '11144477735' } 
      })
      
      // Submeter formulário
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          'joao@example.com',
          'password123',
          {
            full_name: 'João Silva',
            phone: '+5511999999999',
            cpf: '11144477735',
            birth_date: undefined,
          }
        )
      })
    })

    it('deve exibir mensagem de sucesso após cadastro', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      
      render(<RegisterPage />)
      
      // Preencher e submeter formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/conta criada com sucesso/i)).toBeInTheDocument()
      })
    })

    it('deve redirecionar para login após cadastro bem-sucedido', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      
      render(<RegisterPage />)
      
      // Preencher e submeter formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login')
      })
    })
  })

  describe('Erros de Cadastro', () => {
    it('deve exibir erro quando email já existe', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Este email já está cadastrado' } 
      })
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Este email já está cadastrado')).toBeInTheDocument()
      })
    })

    it('deve exibir erro quando CPF já existe', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Este CPF já está cadastrado' } 
      })
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('CPF'), { 
        target: { value: '11144477735' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Este CPF já está cadastrado')).toBeInTheDocument()
      })
    })

    it('deve exibir erro de senha fraca', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'A senha deve ter pelo menos 6 caracteres' } 
      })
      
      render(<RegisterPage />)
      
      // Preencher formulário com senha fraca
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: '123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: '123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
      })
    })

    it('deve exibir erro de email inválido', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Email inválido' } 
      })
      
      render(<RegisterPage />)
      
      // Preencher formulário com email inválido
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'email-invalido' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument()
      })
    })

    it('deve exibir erro de rede', async () => {
      mockSignUp.mockRejectedValue(new Error('Erro de conexão'))
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Erro de conexão. Tente novamente.')).toBeInTheDocument()
      })
    })
  })

  describe('Funcionalidades do Formulário', () => {
    it('deve alternar visibilidade da senha', () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText('Senha')
      const toggleButton = screen.getByRole('button', { name: /mostrar senha/i })
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('deve alternar visibilidade da confirmação de senha', () => {
      render(<RegisterPage />)
      
      const confirmPasswordInput = screen.getByLabelText('Confirmar senha')
      const toggleButton = screen.getByRole('button', { name: /mostrar confirmação/i })
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      
      fireEvent.click(toggleButton)
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')
    })

    it('deve formatar CPF automaticamente', () => {
      render(<RegisterPage />)
      
      const cpfInput = screen.getByLabelText('CPF')
      
      fireEvent.change(cpfInput, { target: { value: '11144477735' } })
      
      expect(cpfInput.value).toBe('111.444.777-35')
    })

    it('deve formatar telefone automaticamente', () => {
      render(<RegisterPage />)
      
      const phoneInput = screen.getByLabelText('Telefone')
      
      fireEvent.change(phoneInput, { target: { value: '11999999999' } })
      
      expect(phoneInput.value).toBe('(11) 99999-9999')
    })

    it('deve redirecionar para página de login', () => {
      render(<RegisterPage />)
      
      const loginLink = screen.getByText('Entrar')
      fireEvent.click(loginLink)
      
      expect(mockPush).toHaveBeenCalledWith('/auth/login')
    })
  })

  describe('Validações de Segurança', () => {
    it('deve validar senha com critérios de segurança', () => {
      const weakPasswords = ['123', 'password', '123456']
      const strongPasswords = ['Password123!', 'MySecurePass1', 'StrongPass2024']
      
      weakPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(false)
      })
      
      strongPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(true)
      })
    })

    it('deve validar email com formato correto', () => {
      const validEmails = [
        'user@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ]
      
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com'
      ]
      
      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
      
      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })

    it('deve validar CPF com algoritmo correto', () => {
      const validCPFs = [
        '11144477735',
        '12345678909',
        '98765432100'
      ]
      
      const invalidCPFs = [
        '11111111111',
        '12345678901',
        '123',
        'abcdefghijk'
      ]
      
      validCPFs.forEach(cpf => {
        expect(isValidCPF(cpf)).toBe(true)
      })
      
      invalidCPFs.forEach(cpf => {
        expect(isValidCPF(cpf)).toBe(false)
      })
    })
  })

  describe('Estados de Loading', () => {
    it('deve exibir loading durante cadastro', async () => {
      mockSignUp.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ error: null }), 1000)
        )
      )
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      expect(screen.getByText('Criando conta...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /criando conta/i })).toBeDisabled()
    })
  })
})
