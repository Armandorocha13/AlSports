/**
 * Testes de segurança para o projeto AlSports
 */

import { 
  validatePassword, 
  sanitizeInput, 
  isValidEmail, 
  isValidCPF, 
  isValidCEP,
  containsMaliciousContent 
} from '@/lib/security'

describe('Security Functions', () => {
  describe('validatePassword', () => {
    it('should validate password with minimum length', () => {
      const result = validatePassword('123456')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject password that is too short', () => {
      const result = validatePassword('12345')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Senha deve ter pelo menos 6 caracteres')
    })

    it('should reject password that is too long', () => {
      const longPassword = 'a'.repeat(129)
      const result = validatePassword(longPassword)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Senha deve ter no máximo 128 caracteres')
    })
  })

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const maliciousInput = '<script>alert("xss")</script>'
      const sanitized = sanitizeInput(maliciousInput)
      expect(sanitized).toBe('scriptalert("xss")/script')
    })

    it('should remove javascript: protocol', () => {
      const maliciousInput = 'javascript:alert("xss")'
      const sanitized = sanitizeInput(maliciousInput)
      expect(sanitized).toBe('alert("xss")')
    })

    it('should remove event handlers', () => {
      const maliciousInput = 'onclick=alert("xss")'
      const sanitized = sanitizeInput(maliciousInput)
      expect(sanitized).toBe('')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidCPF', () => {
    it('should validate correct CPF', () => {
      expect(isValidCPF('11144477735')).toBe(true)
      expect(isValidCPF('111.444.777-35')).toBe(true)
    })

    it('should reject invalid CPF', () => {
      expect(isValidCPF('11111111111')).toBe(false)
      expect(isValidCPF('12345678901')).toBe(false)
      expect(isValidCPF('')).toBe(false)
      expect(isValidCPF('123')).toBe(false)
    })
  })

  describe('isValidCEP', () => {
    it('should validate correct CEP formats', () => {
      expect(isValidCEP('20000-000')).toBe(true)
      expect(isValidCEP('20000000')).toBe(true)
    })

    it('should reject invalid CEP', () => {
      expect(isValidCEP('12345')).toBe(false)
      expect(isValidCEP('123456789')).toBe(false)
      expect(isValidCEP('')).toBe(false)
    })
  })

  describe('containsMaliciousContent', () => {
    it('should detect script tags', () => {
      expect(containsMaliciousContent('<script>alert("xss")</script>')).toBe(true)
    })

    it('should detect javascript protocol', () => {
      expect(containsMaliciousContent('javascript:alert("xss")')).toBe(true)
    })

    it('should detect event handlers', () => {
      expect(containsMaliciousContent('onclick=alert("xss")')).toBe(true)
    })

    it('should detect eval functions', () => {
      expect(containsMaliciousContent('eval(alert("xss"))')).toBe(true)
    })

    it('should not flag safe content', () => {
      expect(containsMaliciousContent('Hello world')).toBe(false)
      expect(containsMaliciousContent('Normal text with numbers 123')).toBe(false)
    })
  })
})
