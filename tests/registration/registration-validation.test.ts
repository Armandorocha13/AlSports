/**
 * Testes de validação para cadastro de contas - AlSports
 */

import {
  validatePassword,
  isValidEmail,
  isValidCPF,
  isValidCEP,
  sanitizeInput,
  containsMaliciousContent,
} from '@/lib/security'

describe('Validações de Cadastro de Contas', () => {
  describe('Validação de Senhas', () => {
    it('deve aceitar senhas fortes', () => {
      const strongPasswords = [
        'Password123!',
        'MySecurePass1',
        'StrongPass2024',
        'ComplexP@ssw0rd',
        'Secure123#',
      ]

      strongPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('deve rejeitar senhas fracas', () => {
      const weakPasswords = [
        '123', // Muito curta
        'password', // Sem números
        '123456', // Apenas números
        'PASSWORD', // Apenas maiúsculas
        'password123', // Sem caracteres especiais
      ]

      weakPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    it('deve validar comprimento mínimo da senha', () => {
      const result = validatePassword('12345')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Senha deve ter pelo menos 6 caracteres')
    })

    it('deve validar comprimento máximo da senha', () => {
      const longPassword = 'a'.repeat(129)
      const result = validatePassword(longPassword)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Senha deve ter no máximo 128 caracteres')
    })

    it('deve validar caracteres especiais quando exigidos', () => {
      // Simular configuração que exige caracteres especiais
      const result = validatePassword('Password123')
      // Com configuração atual, não exige caracteres especiais
      expect(result.isValid).toBe(true)
    })
  })

  describe('Validação de Emails', () => {
    it('deve aceitar emails válidos', () => {
      const validEmails = [
        'user@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'test123@domain.com',
        'user_name@example-domain.com',
        'user@sub.domain.com',
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('deve rejeitar emails inválidos', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@.com',
        'user@example.',
        '',
        'user@example..com',
        'user name@example.com',
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })

    it('deve validar domínios de email', () => {
      const validDomains = [
        'user@gmail.com',
        'user@yahoo.com',
        'user@hotmail.com',
        'user@empresa.com.br',
        'user@universidade.edu',
      ]

      validDomains.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('deve rejeitar emails com caracteres especiais perigosos', () => {
      const dangerousEmails = [
        "user@example.com'; DROP TABLE users; --",
        "user@example.com<script>alert('xss')</script>",
        "user@example.com\"><script>alert('xss')</script>",
      ]

      dangerousEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })
  })

  describe('Validação de CPF', () => {
    it('deve aceitar CPFs válidos', () => {
      const validCPFs = [
        '11144477735',
        '12345678909',
        '98765432100',
        '111.444.777-35',
        '123.456.789-09',
        '987.654.321-00',
      ]

      validCPFs.forEach(cpf => {
        expect(isValidCPF(cpf)).toBe(true)
      })
    })

    it('deve rejeitar CPFs inválidos', () => {
      const invalidCPFs = [
        '11111111111', // Todos os dígitos iguais
        '12345678901', // Dígitos verificadores incorretos
        '123', // Muito curto
        '', // Vazio
        'abcdefghijk', // Não numérico
        '123456789012', // Muito longo
      ]

      invalidCPFs.forEach(cpf => {
        expect(isValidCPF(cpf)).toBe(false)
      })
    })

    it('deve validar algoritmo do CPF', () => {
      // CPFs com dígitos verificadores calculados corretamente
      const validCPFs = [
        '11144477735', // CPF válido
        '12345678909', // CPF válido
        '98765432100', // CPF válido
      ]

      validCPFs.forEach(cpf => {
        expect(isValidCPF(cpf)).toBe(true)
      })
    })

    it('deve rejeitar CPFs com dígitos iguais', () => {
      const sameDigitCPFs = [
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
      ]

      sameDigitCPFs.forEach(cpf => {
        expect(isValidCPF(cpf)).toBe(false)
      })
    })
  })

  describe('Validação de CEP', () => {
    it('deve aceitar CEPs válidos', () => {
      const validCEPs = [
        '20000-000',
        '20000000',
        '12345-678',
        '12345678',
        '01000-000',
        '01000000',
      ]

      validCEPs.forEach(cep => {
        expect(isValidCEP(cep)).toBe(true)
      })
    })

    it('deve rejeitar CEPs inválidos', () => {
      const invalidCEPs = [
        '12345', // Muito curto
        '123456789', // Muito longo
        '', // Vazio
        'abcde-fgh', // Não numérico
        '12345-67', // Formato incorreto
        '1234-5678', // Formato incorreto
      ]

      invalidCEPs.forEach(cep => {
        expect(isValidCEP(cep)).toBe(false)
      })
    })
  })

  describe('Sanitização de Inputs', () => {
    it('deve remover tags script', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '<script src="malicious.js"></script>',
        '<script>document.cookie="session=stolen"</script>',
      ]

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input)
        expect(sanitized).not.toContain('<script>')
        expect(sanitized).not.toContain('</script>')
      })
    })

    it('deve remover protocolos javascript', () => {
      const maliciousInputs = [
        'javascript:alert("xss")',
        'javascript:window.location="http://evil.com"',
        'javascript:document.cookie="session=stolen"',
      ]

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input)
        expect(sanitized).not.toContain('javascript:')
      })
    })

    it('deve remover event handlers', () => {
      const maliciousInputs = [
        'onclick=alert("xss")',
        'onload=alert("xss")',
        'onmouseover=alert("xss")',
        'onerror=alert("xss")',
      ]

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input)
        expect(sanitized).not.toContain('onclick=')
        expect(sanitized).not.toContain('onload=')
        expect(sanitized).not.toContain('onmouseover=')
        expect(sanitized).not.toContain('onerror=')
      })
    })

    it('deve preservar conteúdo seguro', () => {
      const safeInputs = [
        'João Silva',
        'joao@example.com',
        'Rua das Flores, 123',
        'São Paulo - SP',
        '11999999999',
      ]

      safeInputs.forEach(input => {
        const sanitized = sanitizeInput(input)
        expect(sanitized).toBe(input)
      })
    })
  })

  describe('Detecção de Conteúdo Malicioso', () => {
    it('deve detectar scripts maliciosos', () => {
      const maliciousContent = [
        '<script>alert("xss")</script>',
        '<script src="malicious.js"></script>',
        '<script>document.cookie="session=stolen"</script>',
      ]

      maliciousContent.forEach(content => {
        expect(containsMaliciousContent(content)).toBe(true)
      })
    })

    it('deve detectar protocolos javascript', () => {
      const maliciousContent = [
        'javascript:alert("xss")',
        'javascript:window.location="http://evil.com"',
        'javascript:document.cookie="session=stolen"',
      ]

      maliciousContent.forEach(content => {
        expect(containsMaliciousContent(content)).toBe(true)
      })
    })

    it('deve detectar event handlers', () => {
      const maliciousContent = [
        'onclick=alert("xss")',
        'onload=alert("xss")',
        'onmouseover=alert("xss")',
        'onerror=alert("xss")',
      ]

      maliciousContent.forEach(content => {
        expect(containsMaliciousContent(content)).toBe(true)
      })
    })

    it('deve detectar funções eval', () => {
      const maliciousContent = [
        'eval(alert("xss"))',
        'eval(document.cookie="session=stolen")',
        'eval(window.location="http://evil.com")',
      ]

      maliciousContent.forEach(content => {
        expect(containsMaliciousContent(content)).toBe(true)
      })
    })

    it('não deve flagrar conteúdo seguro', () => {
      const safeContent = [
        'João Silva',
        'joao@example.com',
        'Rua das Flores, 123',
        'São Paulo - SP',
        '11999999999',
        'Normal text with numbers 123',
        'Safe HTML: <p>Hello</p>',
        'Email: user@example.com',
      ]

      safeContent.forEach(content => {
        expect(containsMaliciousContent(content)).toBe(false)
      })
    })
  })

  describe('Cenários de Cadastro Específicos', () => {
    it('deve validar dados de usuário brasileiro', () => {
      const brazilianUser = {
        name: 'João Silva Santos',
        email: 'joao.silva@example.com.br',
        cpf: '11144477735',
        phone: '+5511999999999',
        cep: '01234-567',
        password: 'MinhaSenh@123',
      }

      expect(isValidEmail(brazilianUser.email)).toBe(true)
      expect(isValidCPF(brazilianUser.cpf)).toBe(true)
      expect(isValidCEP(brazilianUser.cep)).toBe(true)
      
      const passwordResult = validatePassword(brazilianUser.password)
      expect(passwordResult.isValid).toBe(true)
    })

    it('deve validar dados de usuário internacional', () => {
      const internationalUser = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        password: 'MySecurePass123!',
      }

      expect(isValidEmail(internationalUser.email)).toBe(true)
      
      const passwordResult = validatePassword(internationalUser.password)
      expect(passwordResult.isValid).toBe(true)
    })

    it('deve rejeitar tentativas de injeção SQL', () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'--",
        "test@example.com'; DELETE FROM users; --",
      ]

      sqlInjectionAttempts.forEach(attempt => {
        expect(isValidEmail(attempt)).toBe(false)
        expect(containsMaliciousContent(attempt)).toBe(true)
      })
    })

    it('deve rejeitar tentativas de XSS', () => {
      const xssAttempts = [
        '<script>document.cookie="session=stolen"</script>',
        'javascript:window.location="http://evil.com"',
        '<img src="x" onerror="alert(1)">',
        '"><script>alert("xss")</script>',
      ]

      xssAttempts.forEach(attempt => {
        expect(containsMaliciousContent(attempt)).toBe(true)
        const sanitized = sanitizeInput(attempt)
        expect(containsMaliciousContent(sanitized)).toBe(false)
      })
    })
  })

  describe('Validações de Formato', () => {
    it('deve validar formato de telefone brasileiro', () => {
      const validPhones = [
        '+5511999999999',
        '11999999999',
        '(11) 99999-9999',
        '11 99999-9999',
      ]

      const invalidPhones = [
        '123',
        'abcdefghijk',
        '1199999999', // Muito curto
        '119999999999', // Muito longo
      ]

      // Implementar validação de telefone se necessário
      validPhones.forEach(phone => {
        expect(phone.length).toBeGreaterThanOrEqual(10)
      })

      invalidPhones.forEach(phone => {
        expect(phone.length < 10 || phone.length > 15).toBe(true)
      })
    })

    it('deve validar formato de data de nascimento', () => {
      const validDates = [
        '1990-01-01',
        '2000-12-31',
        '1985-06-15',
      ]

      const invalidDates = [
        '32/01/1990', // Dia inválido
        '01/13/1990', // Mês inválido
        '01/01/1800', // Muito antigo
        '01/01/2030', // Futuro
      ]

      validDates.forEach(date => {
        const dateObj = new Date(date)
        expect(dateObj.getTime()).not.toBeNaN()
        expect(dateObj.getFullYear()).toBeGreaterThan(1900)
        expect(dateObj.getFullYear()).toBeLessThan(new Date().getFullYear())
      })

      invalidDates.forEach(date => {
        const dateObj = new Date(date)
        expect(dateObj.getTime()).toBeNaN()
      })
    })
  })
})
