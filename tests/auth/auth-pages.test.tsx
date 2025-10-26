/**
 * Testes para as páginas de autenticação
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/app/auth/login/page'
import RegisterPage from '@/app/auth/register/page'
import ResetPasswordPage from '@/app/auth/reset-password/page'

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
}))

// Mock do AuthContext
const mockSignIn = jest.fn()
const mockSignUp = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: mockSignOut,
  }),
}))

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Entrar na sua conta')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    mockSignIn.mockResolvedValue({ error: null })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should display error message on login failure', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Credenciais inválidas' } })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })

  it('should toggle password visibility', () => {
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText('Senha')
    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i })
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('should redirect to register page', () => {
    render(<LoginPage />)
    
    const registerLink = screen.getByText('Criar conta')
    fireEvent.click(registerLink)
    
    expect(mockPush).toHaveBeenCalledWith('/auth/register')
  })
})

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render register form', () => {
    render(<RegisterPage />)
    
    expect(screen.getByText('Criar nova conta')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    
    render(<RegisterPage />)
    
    const nameInput = screen.getByLabelText('Nome completo')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha')
    const submitButton = screen.getByRole('button', { name: /criar conta/i })
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        { full_name: 'Test User' }
      )
    })
  })

  it('should validate password confirmation', async () => {
    render(<RegisterPage />)
    
    const passwordInput = screen.getByLabelText('Senha')
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha')
    const submitButton = screen.getByRole('button', { name: /criar conta/i })
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
    })
  })

  it('should display error message on registration failure', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'Email já cadastrado' } })
    
    render(<RegisterPage />)
    
    const nameInput = screen.getByLabelText('Nome completo')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha')
    const submitButton = screen.getByRole('button', { name: /criar conta/i })
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email já cadastrado')).toBeInTheDocument()
    })
  })

  it('should redirect to login page', () => {
    render(<RegisterPage />)
    
    const loginLink = screen.getByText('Já tem uma conta?')
    fireEvent.click(loginLink)
    
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })
})

describe('Reset Password Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render reset password form', () => {
    render(<ResetPasswordPage />)
    
    expect(screen.getByText('Redefinir senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar link/i })).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    // Mock do Supabase para reset password
    const mockResetPassword = jest.fn().mockResolvedValue({ error: null })
    
    // Mock do createClient para incluir resetPassword
    jest.doMock('@/lib/supabase-client', () => ({
      createClient: () => ({
        auth: {
          resetPasswordForEmail: mockResetPassword,
        },
      }),
    }))
    
    render(<ResetPasswordPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /enviar link/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/link de redefinição enviado/i)).toBeInTheDocument()
    })
  })

  it('should display error message on reset failure', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ 
      error: { message: 'Email não encontrado' } 
    })
    
    jest.doMock('@/lib/supabase-client', () => ({
      createClient: () => ({
        auth: {
          resetPasswordForEmail: mockResetPassword,
        },
      }),
    }))
    
    render(<ResetPasswordPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /enviar link/i })
    
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email não encontrado')).toBeInTheDocument()
    })
  })

  it('should redirect to login page', () => {
    render(<ResetPasswordPage />)
    
    const loginLink = screen.getByText('Voltar ao login')
    fireEvent.click(loginLink)
    
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })
})

describe('Form Validation', () => {
  it('should validate email format in login', async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })
  })

  it('should validate required fields in register', async () => {
    render(<RegisterPage />)
    
    const submitButton = screen.getByRole('button', { name: /criar conta/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
    })
  })

  it('should validate password strength', async () => {
    render(<RegisterPage />)
    
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: /criar conta/i })
    
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
    })
  })
})
