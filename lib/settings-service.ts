/**
 * Serviço para gerenciar configurações do sistema (settings)
 */
import { createClient } from './supabase-client'

class SettingsService {
  private supabase = createClient()
  private cache: Map<string, any> = new Map()
  private cacheTime: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutos

  /**
   * Busca uma configuração específica
   */
  async getSetting(key: string, defaultValue?: any): Promise<any> {
    try {
      // Verificar cache
      const cached = this.cache.get(key)
      const cacheTimestamp = this.cacheTime.get(key)
      
      if (cached && cacheTimestamp && Date.now() - cacheTimestamp < this.CACHE_TTL) {
        return cached
      }

      const { data, error } = await this.supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

      if (error) {
        console.warn(`Configuração ${key} não encontrada, usando valor padrão:`, defaultValue)
        return defaultValue
      }

      // Parse do JSONB
      let value = data?.value
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch {
          // Se não for JSON válido, usar como string
        }
      }

      // Atualizar cache
      this.cache.set(key, value)
      this.cacheTime.set(key, Date.now())

      return value || defaultValue
    } catch (error) {
      console.error(`Erro ao buscar configuração ${key}:`, error)
      return defaultValue
    }
  }

  /**
   * Salva uma configuração
   */
  async setSetting(key: string, value: any, description?: string): Promise<boolean> {
    try {
      // Converter valor para JSONB
      const jsonbValue = typeof value === 'string' ? value : JSON.stringify(value)

      const { error } = await this.supabase
        .from('settings')
        .upsert({
          key,
          value: jsonbValue as any,
          description: description || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })

      if (error) {
        console.error(`Erro ao salvar configuração ${key}:`, error)
        return false
      }

      // Atualizar cache
      this.cache.set(key, value)
      this.cacheTime.set(key, Date.now())

      return true
    } catch (error) {
      console.error(`Erro ao salvar configuração ${key}:`, error)
      return false
    }
  }

  /**
   * Busca o número do WhatsApp para envio de pedidos
   */
  async getWhatsAppNumber(): Promise<string> {
    try {
      console.log('📱 [SettingsService] Buscando número do WhatsApp do banco...')
      
      // Buscar diretamente do banco (sem cache inicial para garantir valor atualizado)
      const { data, error } = await this.supabase
        .from('settings')
        .select('value, key')
        .eq('key', 'whatsapp_number')
        .single()

      if (error) {
        console.error('❌ [SettingsService] Erro ao buscar:', error)
        console.warn('⚠️ [SettingsService] Usando número padrão')
        return '5521994595532'
      }

      console.log('📱 [SettingsService] Dados retornados do banco:', {
        key: data?.key,
        value: data?.value,
        tipo_value: typeof data?.value
      })

      // Parse do JSONB
      // O Supabase pode retornar como string JSON ("5521994595532") ou já como string (5521994595532)
      let value = data?.value
      
      // Se for string, tentar fazer parse JSON
      if (typeof value === 'string') {
        // Remover aspas extras se houver
        const trimmed = value.trim()
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          try {
            value = JSON.parse(trimmed)
          } catch {
            // Se falhar, remover aspas manualmente
            value = trimmed.slice(1, -1)
          }
        } else {
          // Pode ser string JSON que precisa parse
          try {
            value = JSON.parse(value)
          } catch {
            // Se não for JSON válido, usar como string direto
            value = value
          }
        }
      }

      console.log('📱 [SettingsService] Valor após parse:', value, 'tipo:', typeof value)

      // Remover tudo que não for número
      const cleanNumber = typeof value === 'string' 
        ? value.replace(/\D/g, '')
        : String(value || '').replace(/\D/g, '')

      console.log('📱 [SettingsService] Número limpo:', cleanNumber)

      if (cleanNumber && cleanNumber.length >= 10) {
        // Atualizar cache
        this.cache.set('whatsapp_number', cleanNumber)
        this.cacheTime.set('whatsapp_number', Date.now())
        console.log('✅ [SettingsService] Número do WhatsApp carregado do banco:', cleanNumber)
        return cleanNumber
      }

      console.warn('⚠️ [SettingsService] Número do WhatsApp inválido no banco, usando padrão')
      console.warn('   Número limpo:', cleanNumber, 'comprimento:', cleanNumber.length)
      return '5521994595532'
    } catch (error) {
      console.error('❌ [SettingsService] Erro ao buscar número do WhatsApp:', error)
      return '5521994595532'
    }
  }

  /**
   * Salva o número do WhatsApp
   */
  async setWhatsAppNumber(number: string): Promise<boolean> {
    // Remover caracteres especiais, apenas números
    const cleanNumber = number.replace(/\D/g, '')
    
    if (!cleanNumber || cleanNumber.length < 10) {
      console.error('Número de WhatsApp inválido')
      return false
    }

    return await this.setSetting('whatsapp_number', cleanNumber, 'Número do WhatsApp para recebimento de pedidos')
  }

  /**
   * Limpa o cache
   */
  clearCache() {
    this.cache.clear()
    this.cacheTime.clear()
  }
}

export const settingsService = new SettingsService()

