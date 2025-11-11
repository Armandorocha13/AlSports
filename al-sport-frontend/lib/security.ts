/**
 * Configurações e utilitários de segurança para o projeto AlSports
 */

// Configurações de segurança
export const SECURITY_CONFIG = {
  // Tempo de expiração de sessão (em horas)
  SESSION_TIMEOUT: 24,
  
  // Máximo de tentativas de login
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Tempo de bloqueio após tentativas falhadas (em minutos)
  LOCKOUT_DURATION: 15,
  
  // Tamanho mínimo de senha
  MIN_PASSWORD_LENGTH: 6,
  
  // Tamanho máximo de senha
  MAX_PASSWORD_LENGTH: 128,
  
  // Caracteres especiais obrigatórios na senha
  PASSWORD_REQUIREMENTS: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  }
} as const

/**
 * Valida se uma senha atende aos requisitos de segurança
 * @param password - Senha a ser validada
 * @returns Objeto com resultado da validação
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < SECURITY_CONFIG.PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Senha deve ter pelo menos ${SECURITY_CONFIG.PASSWORD_REQUIREMENTS.minLength} caracteres`)
  }
  
  if (password.length > SECURITY_CONFIG.MAX_PASSWORD_LENGTH) {
    errors.push(`Senha deve ter no máximo ${SECURITY_CONFIG.MAX_PASSWORD_LENGTH} caracteres`)
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 * @param input - String a ser sanitizada
 * @returns String sanitizada
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Valida se um email tem formato válido
 * @param email - Email a ser validado
 * @returns True se o email é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se um CPF tem formato válido
 * @param cpf - CPF a ser validado
 * @returns True se o CPF é válido
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação do algoritmo do CPF
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

/**
 * Valida se um CEP tem formato válido
 * @param cep - CEP a ser validado
 * @returns True se o CEP é válido
 */
export function isValidCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}

/**
 * Gera um token seguro para operações sensíveis
 * @param length - Tamanho do token (padrão: 32)
 * @returns Token seguro
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Verifica se uma string contém conteúdo malicioso
 * @param input - String a ser verificada
 * @returns True se contém conteúdo suspeito
 */
export function containsMaliciousContent(input: string): boolean {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i
  ]
  
  return maliciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Headers de segurança para respostas HTTP
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
} as const

