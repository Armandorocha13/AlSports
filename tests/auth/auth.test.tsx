/**
 * Testes de autenticação para o projeto AlSports
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'

// Mock do Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@/lib/supabase-client', () => ({
  createClient: jest.fn(() => mockSupabase),
}))

// Mock do window.location
const mockLocation = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.href = ''
  })

  describe('Initial State', () => {
    it('should initialize with null user and loading true', () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.profile).toBeNull()
      expect(result.current.session).toBeNull()
      expect(result.current.loading).toBe(true)
    })
  })

  describe('Sign Up', () => {
    it('should successfully sign up a new user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      }

      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        user_types: 'cliente',
      }

      // Mock successful sign up
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      // Mock profile creation
      mockSupabase.from().insert().mockResolvedValue({
        data: [mockProfile],
        error: null,
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.signUp(
          'test@example.com',
          'password123',
          { full_name: 'Test User' }
        )
        expect(error).toBeNull()
      })

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
            phone: undefined,
          },
        },
      })
    })

    it('should handle sign up with existing email', async () => {
      // Mock existing profile
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { email: 'test@example.com' },
        error: null,
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.signUp(
          'test@example.com',
          'password123',
          { full_name: 'Test User' }
        )
        expect(error).toBeTruthy()
        expect(error?.message).toBe('Este email já está cadastrado')
      })
    })

    it('should handle sign up with existing CPF', async () => {
      // Mock no existing email
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows found' },
      })

      // Mock existing CPF
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { cpf: '12345678901' },
        error: null,
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.signUp(
          'test@example.com',
          'password123',
          { full_name: 'Test User', cpf: '12345678901' }
        )
        expect(error).toBeTruthy()
        expect(error?.message).toBe('Este CPF já está cadastrado')
      })
    })

    it('should handle sign up errors', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid email' },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.signUp(
          'invalid-email',
          'password123',
          { full_name: 'Test User' }
        )
        expect(error).toBeTruthy()
        expect(error?.message).toBe('Invalid email')
      })
    })
  })

  describe('Sign In', () => {
    it('should successfully sign in a user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.signIn(
          'test@example.com',
          'password123'
        )
        expect(error).toBeNull()
      })

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should handle sign in errors', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.signIn(
          'test@example.com',
          'wrongpassword'
        )
        expect(error).toBeTruthy()
        expect(error?.message).toBe('Invalid credentials')
      })
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out a user', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(mockLocation.href).toBe('/auth/login')
    })

    it('should handle sign out errors gracefully', async () => {
      mockSupabase.auth.signOut.mockRejectedValue(new Error('Network error'))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      // Should still redirect even if signOut fails
      expect(mockLocation.href).toBe('/auth/login')
    })
  })

  describe('Update Profile', () => {
    it('should successfully update user profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        user_types: 'cliente',
      }

      // Mock user state
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      // Mock profile fetch
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null,
      })

      // Mock profile update
      mockSupabase.from().update().eq().mockResolvedValue({
        data: null,
        error: null,
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.user).toBeTruthy()
      })

      await act(async () => {
        const { error } = await result.current.updateProfile({
          full_name: 'Updated Name',
        })
        expect(error).toBeNull()
      })

      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        full_name: 'Updated Name',
        updated_at: expect.any(String),
      })
    })

    it('should handle update profile when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        const { error } = await result.current.updateProfile({
          full_name: 'Updated Name',
        })
        expect(error).toBeTruthy()
        expect(error?.message).toBe('Usuário não autenticado')
      })
    })

    it('should handle update profile errors', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockSupabase.from().update().eq().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toBeTruthy()
      })

      await act(async () => {
        const { error } = await result.current.updateProfile({
          full_name: 'Updated Name',
        })
        expect(error).toBeTruthy()
        expect(error?.message).toBe('Database error')
      })
    })
  })

  describe('Auth State Changes', () => {
    it('should handle auth state changes', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      const mockSession = {
        user: mockUser,
        access_token: 'token',
      }

      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        user_types: 'cliente',
      }

      // Mock initial state
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      // Mock profile fetch
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null,
      })

      // Mock auth state change
      const mockOnAuthStateChange = jest.fn()
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        // Simulate auth state change
        setTimeout(() => {
          callback('SIGNED_IN', mockSession)
        }, 100)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toBeTruthy()
        expect(result.current.session).toBeTruthy()
        expect(result.current.profile).toBeTruthy()
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Network error'))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('should handle profile fetch errors', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockSupabase.from().select().eq().single.mockRejectedValue(
        new Error('Profile fetch error')
      )

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toBeTruthy()
        expect(result.current.profile).toBeNull()
      })
    })
  })
})
