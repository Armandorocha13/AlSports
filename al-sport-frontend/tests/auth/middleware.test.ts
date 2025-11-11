/**
 * Testes para o middleware de autenticação
 */

import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

// Mock do Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
}

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => mockSupabase),
}))

// Mock do NextResponse
const mockNextResponse = {
  next: jest.fn(() => ({
    headers: {
      set: jest.fn(),
    },
  })),
  redirect: jest.fn(),
  json: jest.fn(),
}

jest.mock('next/server', () => ({
  NextResponse: mockNextResponse,
}))

describe('Middleware Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Public Routes', () => {
    it('should allow access to public routes without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to auth pages without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/auth/login')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should redirect to login when accessing admin routes without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/admin')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/auth/login',
          searchParams: expect.any(URLSearchParams),
        })
      )
    })

    it('should redirect to login when accessing user account routes without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/minha-conta')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/auth/login',
          searchParams: expect.any(URLSearchParams),
        })
      )
    })

    it('should allow access to protected routes with authentication', async () => {
      const request = new NextRequest('http://localhost:3000/admin')
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })
  })

  describe('API Routes', () => {
    it('should return 401 for admin API routes without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    })

    it('should allow access to admin API routes with authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users')
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('Security Headers', () => {
    it('should add security headers to all responses', async () => {
      const request = new NextRequest('http://localhost:3000/')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      }

      mockNextResponse.next.mockReturnValue(mockResponse)

      await middleware(request)

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Content-Type-Options',
        'nosniff'
      )
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-Frame-Options',
        'DENY'
      )
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'X-XSS-Protection',
        '1; mode=block'
      )
    })
  })

  describe('Redirect Parameters', () => {
    it('should preserve redirectTo parameter when redirecting to login', async () => {
      const request = new NextRequest('http://localhost:3000/admin/dashboard')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await middleware(request)

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/auth/login',
          searchParams: expect.objectContaining({
            redirectTo: '/admin/dashboard',
          }),
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/admin')
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Auth service unavailable'))

      await middleware(request)

      // Should still redirect to login even if auth check fails
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle network errors gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/')
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Network error'))

      await middleware(request)

      // Should still allow access to public routes
      expect(mockNextResponse.next).toHaveBeenCalled()
    })
  })
})
