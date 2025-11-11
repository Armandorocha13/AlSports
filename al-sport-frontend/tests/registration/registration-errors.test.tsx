/**
 * Testes de cenários de erro para cadastro de contas - AlSports
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import RegisterPage from '@/app/auth/register/page'

// Mock do Next.js router
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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

describe('Cenários de Erro no Cadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Erros de Validação', () => {
    it('deve exibir erro para nome muito curto', async () => {
      render(<RegisterPage />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(nameInput, { target: { value: 'Jo' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome deve ter pelo menos 3 caracteres')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para nome com caracteres especiais', async () => {
      render(<RegisterPage />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(nameInput, { target: { value: 'João123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome deve conter apenas letras e espaços')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para email com domínio inválido', async () => {
      render(<RegisterPage />)
      
      const emailInput = screen.getByLabelText('Email')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(emailInput, { target: { value: 'user@invalid' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Email deve ter um domínio válido')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para senha sem maiúscula', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText('Senha')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve conter pelo menos uma letra maiúscula')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para senha sem número', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText('Senha')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(passwordInput, { target: { value: 'Password' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve conter pelo menos um número')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para CPF com formato inválido', async () => {
      render(<RegisterPage />)
      
      const cpfInput = screen.getByLabelText('CPF')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(cpfInput, { target: { value: '123456789' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('CPF deve ter 11 dígitos')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para telefone com formato inválido', async () => {
      render(<RegisterPage />)
      
      const phoneInput = screen.getByLabelText('Telefone')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(phoneInput, { target: { value: '123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Telefone deve ter pelo menos 10 dígitos')).toBeInTheDocument()
      })
    })
  })

  describe('Erros de Servidor', () => {
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('CPF'), { 
        target: { value: '11144477735' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Este CPF já está cadastrado')).toBeInTheDocument()
      })
    })

    it('deve exibir erro de servidor interno', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Erro interno do servidor' } 
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Erro interno do servidor')).toBeInTheDocument()
      })
    })

    it('deve exibir erro de conexão', async () => {
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Erro de conexão. Verifique sua internet.')).toBeInTheDocument()
      })
    })

    it('deve exibir erro de timeout', async () => {
      mockSignUp.mockRejectedValue(new Error('Timeout'))
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Tempo limite excedido. Tente novamente.')).toBeInTheDocument()
      })
    })
  })

  describe('Erros de Formato', () => {
    it('deve exibir erro para email com caracteres especiais', async () => {
      render(<RegisterPage />)
      
      const emailInput = screen.getByLabelText('Email')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(emailInput, { target: { value: 'user@example.com<script>' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Email contém caracteres inválidos')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para nome com caracteres especiais perigosos', async () => {
      render(<RegisterPage />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(nameInput, { target: { value: 'João<script>alert("xss")</script>' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome contém caracteres inválidos')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para senha com caracteres especiais perigosos', async () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText('Senha')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      fireEvent.change(passwordInput, { target: { value: 'Password123<script>' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Senha contém caracteres inválidos')).toBeInTheDocument()
      })
    })
  })

  describe('Erros de Limite', () => {
    it('deve exibir erro para nome muito longo', async () => {
      render(<RegisterPage />)
      
      const nameInput = screen.getByLabelText('Nome completo')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      const longName = 'A'.repeat(101) // Nome com mais de 100 caracteres
      fireEvent.change(nameInput, { target: { value: longName } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Nome deve ter no máximo 100 caracteres')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para email muito longo', async () => {
      render(<RegisterPage />)
      
      const emailInput = screen.getByLabelText('Email')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      const longEmail = 'a'.repeat(250) + '@example.com'
      fireEvent.change(emailInput, { target: { value: longEmail } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Email deve ter no máximo 255 caracteres')).toBeInTheDocument()
      })
    })

    it('deve exibir erro para telefone muito longo', async () => {
      render(<RegisterPage />)
      
      const phoneInput = screen.getByLabelText('Telefone')
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      
      const longPhone = '119999999999999999999' // Telefone muito longo
      fireEvent.change(phoneInput, { target: { value: longPhone } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Telefone deve ter no máximo 15 dígitos')).toBeInTheDocument()
      })
    })
  })

  describe('Erros de Concorrência', () => {
    it('deve exibir erro quando usuário tenta cadastrar múltiplas vezes', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Muitas tentativas de cadastro. Tente novamente em 5 minutos.' } 
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Muitas tentativas de cadastro. Tente novamente em 5 minutos.')).toBeInTheDocument()
      })
    })

    it('deve exibir erro quando sistema está em manutenção', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Sistema em manutenção. Tente novamente mais tarde.' } 
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Sistema em manutenção. Tente novamente mais tarde.')).toBeInTheDocument()
      })
    })
  })

  describe('Recuperação de Erros', () => {
    it('deve permitir tentar novamente após erro', async () => {
      mockSignUp
        .mockResolvedValueOnce({ error: { message: 'Erro temporário' } })
        .mockResolvedValueOnce({ error: null })
      
      render(<RegisterPage />)
      
      // Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome completo'), { 
        target: { value: 'João Silva' } 
      })
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao@example.com' } 
      })
      fireEvent.change(screen.getByLabelText('Senha'), { 
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      // Primeira tentativa - erro
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Erro temporário')).toBeInTheDocument()
      })
      
      // Segunda tentativa - sucesso
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/conta criada com sucesso/i)).toBeInTheDocument()
      })
    })

    it('deve limpar erros ao alterar campos', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'Email já existe' } 
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
        target: { value: 'Password123' } 
      })
      fireEvent.change(screen.getByLabelText('Confirmar senha'), { 
        target: { value: 'Password123' } 
      })
      
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Email já existe')).toBeInTheDocument()
      })
      
      // Alterar email deve limpar o erro
      fireEvent.change(screen.getByLabelText('Email'), { 
        target: { value: 'joao.novo@example.com' } 
      })
      
      expect(screen.queryByText('Email já existe')).not.toBeInTheDocument()
    })
  })
})
