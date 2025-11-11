/**
 * Configuração específica para testes de autenticação
 */

import '@testing-library/jest-dom'

// Mock global do Supabase
global.mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    resetPasswordForEmail: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

// Mock do window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  writable: true,
})

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock do fetch para testes de API
global.fetch = jest.fn()

// Mock do console para evitar logs durante testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

// Configurações específicas para testes de autenticação
export const AUTH_TEST_CONFIG = {
  // Usuário de teste padrão
  TEST_USER: {
    id: 'test-user-123',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
      phone: '+5511999999999',
    },
  },
  
  // Perfil de teste padrão
  TEST_PROFILE: {
    id: 'test-user-123',
    email: 'test@example.com',
    full_name: 'Test User',
    phone: '+5511999999999',
    user_types: 'cliente',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  
  // Sessão de teste padrão
  TEST_SESSION: {
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
    },
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
  },
  
  // Dados de teste para formulários
  TEST_FORM_DATA: {
    login: {
      email: 'test@example.com',
      password: 'password123',
    },
    register: {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    },
    resetPassword: {
      email: 'test@example.com',
    },
  },
  
  // URLs de teste
  TEST_URLS: {
    login: '/auth/login',
    register: '/auth/register',
    resetPassword: '/auth/reset-password',
    admin: '/admin',
    userAccount: '/minha-conta',
  },
}

// Funções utilitárias para testes
export const authTestUtils = {
  // Simular login bem-sucedido
  mockSuccessfulLogin: () => {
    global.mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: AUTH_TEST_CONFIG.TEST_USER },
      error: null,
    })
  },
  
  // Simular login falhado
  mockFailedLogin: (errorMessage = 'Credenciais inválidas') => {
    global.mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: errorMessage },
    })
  },
  
  // Simular cadastro bem-sucedido
  mockSuccessfulSignUp: () => {
    global.mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: AUTH_TEST_CONFIG.TEST_USER },
      error: null,
    })
  },
  
  // Simular cadastro falhado
  mockFailedSignUp: (errorMessage = 'Email já cadastrado') => {
    global.mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: errorMessage },
    })
  },
  
  // Simular usuário autenticado
  mockAuthenticatedUser: () => {
    global.mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: AUTH_TEST_CONFIG.TEST_USER },
      error: null,
    })
  },
  
  // Simular usuário não autenticado
  mockUnauthenticatedUser: () => {
    global.mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
  },
  
  // Simular erro de rede
  mockNetworkError: () => {
    global.mockSupabase.auth.getUser.mockRejectedValue(
      new Error('Network error')
    )
  },
  
  // Limpar todos os mocks
  clearAllMocks: () => {
    jest.clearAllMocks()
    localStorageMock.clear()
    sessionStorageMock.clear()
  },
}

// Configuração global para todos os testes de autenticação
beforeEach(() => {
  authTestUtils.clearAllMocks()
})

afterEach(() => {
  authTestUtils.clearAllMocks()
})
