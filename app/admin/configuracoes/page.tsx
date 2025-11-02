'use client'

import { createClient } from '@/lib/supabase-client'
import {
    AlertTriangle,
    CheckCircle,
    Globe,
    Mail,
    Save,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface SiteSettings {
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  contact_address: string
  whatsapp_number: string
  currency: string
  maintenance_mode: boolean
  allow_registration: boolean
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'AL Sports',
    site_description: 'Loja de Atacado de Roupas Esportivas',
    contact_email: 'contato@alsports.com.br',
    contact_phone: '(21) 99459-5532',
    contact_address: 'Cidade da Moda, 13900 - Nova Iguaçu - RJ',
    whatsapp_number: '5521994595532',
    currency: 'BRL',
    maintenance_mode: false,
    allow_registration: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Buscar configurações da tabela settings
      const { data: settingsData, error } = await supabase
        .from('settings')
        .select('key, value')

      if (error) {
        console.error('Erro ao buscar configurações:', error)
        return
      }

      // Mapear configurações
      const settingsMap: Record<string, any> = {}
      settingsData?.forEach(item => {
        let value = item.value
        
        // Para JSONB, o Supabase pode retornar string JSON ou já parseado
        if (typeof value === 'string') {
          // Se começa e termina com aspas, é string JSON
          const trimmed = value.trim()
          if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            try {
              value = JSON.parse(trimmed)
            } catch {
              // Se falhar, remover aspas manualmente
              value = trimmed.slice(1, -1)
            }
          } else {
            // Tentar parse JSON
            try {
              value = JSON.parse(value)
            } catch {
              // Se não for JSON válido, usar como string direto
              value = value
            }
          }
        }
        settingsMap[item.key] = value
      })
      
      console.log('📋 Configurações mapeadas:', settingsMap)

      // Atualizar estado com valores do banco ou padrões
      setSettings(prev => ({
        ...prev,
        site_name: settingsMap.site_name || prev.site_name,
        site_description: settingsMap.site_description || prev.site_description,
        contact_email: (typeof settingsMap.contact_email === 'string' ? settingsMap.contact_email : prev.contact_email) || prev.contact_email,
        contact_phone: (typeof settingsMap.contact_phone === 'string' ? settingsMap.contact_phone : prev.contact_phone) || prev.contact_phone,
        contact_address: (typeof settingsMap.contact_address === 'string' ? settingsMap.contact_address : prev.contact_address) || prev.contact_address,
        // Garantir que whatsapp_number seja string antes de usar replace
        whatsapp_number: (typeof settingsMap.whatsapp_number === 'string' 
          ? settingsMap.whatsapp_number.replace(/\D/g, '')
          : settingsMap.whatsapp_number 
            ? String(settingsMap.whatsapp_number).replace(/\D/g, '')
            : prev.whatsapp_number),
      }))

      console.log('✅ Configurações carregadas')
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    // Timeout de segurança (30 segundos)
    let timeoutId: NodeJS.Timeout | null = null
    timeoutId = setTimeout(() => {
      setLoading(false)
      setError('⏱️ Timeout: A operação demorou mais de 30 segundos. Verifique se a tabela settings existe no banco de dados. Veja database/migrations/README_003.md para criar a tabela.')
      console.error('⏱️ Timeout ao salvar configurações')
    }, 30000)

    try {
      // Preparar configurações para salvar
      const whatsappClean = settings.whatsapp_number.replace(/\D/g, '')
      
      console.log('💾 Salvando todas as configurações...')
      console.log('🏷️ Nome do site:', settings.site_name)
      console.log('📄 Descrição:', settings.site_description)
      console.log('📧 Email:', settings.contact_email)
      console.log('📱 Telefone:', settings.contact_phone)
      console.log('📍 Endereço:', settings.contact_address)
      console.log('💬 WhatsApp:', whatsappClean)
      
      const settingsToSave = [
        // Informações gerais
        { key: 'site_name', value: settings.site_name || '', description: 'Nome do site' },
        { key: 'site_description', value: settings.site_description || '', description: 'Descrição do site' },
        
        // Informações de contato
        { key: 'contact_email', value: settings.contact_email || '', description: 'Email de contato' },
        { key: 'contact_phone', value: settings.contact_phone || '', description: 'Telefone de contato' },
        { key: 'contact_address', value: settings.contact_address || '', description: 'Endereço de contato' },
        { 
          key: 'whatsapp_number', 
          value: whatsappClean, // Apenas números
          description: 'Número do WhatsApp para recebimento de pedidos' 
        },
      ]

      // Verificar se a tabela settings existe primeiro
      console.log('🔍 Verificando se tabela settings existe...')
      const { data: tableCheck, error: tableError } = await supabase
        .from('settings')
        .select('key')
        .limit(1)

      if (tableError) {
        console.error('❌ ERRO: Tabela settings não encontrada!', tableError)
        clearTimeout(timeoutId)
        
        if (tableError.code === 'PGRST204' || tableError.code === '42P01' || tableError.message?.includes('Could not find the table') || tableError.message?.includes('relation') || tableError.message?.includes('does not exist')) {
          const errorMsg = `❌ ERRO: A tabela 'settings' não existe no banco de dados!\n\nPor favor:\n1. Acesse o Supabase Dashboard > SQL Editor\n2. Execute o arquivo: database/migrations/003_create_settings_table.sql\n3. Depois tente salvar novamente\n\nVeja database/migrations/README_003.md para instruções detalhadas.`
          setError(errorMsg)
          setLoading(false)
          return
        } else {
          throw tableError
        }
      }

      console.log('✅ Tabela settings existe, continuando salvamento...')

      // Salvar cada configuração
      const errors: string[] = []
      for (const setting of settingsToSave) {
        // Para JSONB, o Supabase espera valores JSON válidos
        let valueToSave: any = setting.value
        
        console.log(`💾 Salvando ${setting.key}:`, {
          valor: setting.value,
          tipo_original: typeof setting.value
        })
        
        const { data, error } = await supabase
          .from('settings')
          .upsert({
            key: setting.key,
            value: valueToSave, // Supabase trata string como JSONB automaticamente
            description: setting.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          })
          .select()

        if (error) {
          console.error(`❌ Erro ao salvar ${setting.key}:`, error)
          console.error('Código:', error.code)
          console.error('Mensagem:', error.message)
          console.error('Detalhes:', JSON.stringify(error, null, 2))
          errors.push(`${setting.key}: ${error.message}`)
        } else {
          const returnedValue = data?.[0]?.value
          console.log(`✅ ${setting.key} salvo com sucesso`)
          console.log(`   Valor retornado:`, returnedValue)
          console.log(`   Tipo retornado:`, typeof returnedValue)
          
          // Verificar se foi salvo corretamente (validações específicas)
          if (setting.key === 'whatsapp_number') {
            // Verificar se o número está correto
            const returnedNumber = typeof returnedValue === 'string' 
              ? returnedValue.replace(/\D/g, '')
              : String(returnedValue || '').replace(/\D/g, '')
            
            if (returnedNumber !== whatsappClean) {
              console.error(`❌ NÚMERO SALVO INCORRETAMENTE!`)
              console.error(`   Esperado: ${whatsappClean}`)
              console.error(`   Salvo: ${returnedNumber}`)
              console.error(`   Valor bruto: ${returnedValue}`)
              errors.push(`whatsapp_number: Valor salvo não corresponde ao esperado`)
            } else {
              console.log(`✅ Número verificado e correto: ${returnedNumber}`)
            }
          } else if (setting.key === 'contact_email') {
            // Validar formato de email se fornecido
            if (setting.value && !setting.value.includes('@')) {
              console.warn(`⚠️ Email pode estar em formato inválido: ${setting.value}`)
            }
          }
        }
      }

      // Se houver erros, mostrar
      if (errors.length > 0) {
        throw new Error(`Erros ao salvar: ${errors.join('; ')}`)
      }

      // Limpar cache do settings service se existir
      try {
        const { settingsService } = await import('@/lib/settings-service')
        settingsService.clearCache()
      } catch {
        // Ignorar se o módulo não existir
      }

      // Recarregar configurações do banco
      console.log('🔄 Recarregando configurações do banco...')
      await fetchSettings()
      
      clearTimeout(timeoutId)
      setSuccess('✅ Configurações salvas com sucesso!')
      setTimeout(() => setSuccess(''), 5000)
    } catch (error: any) {
      clearTimeout(timeoutId)
      console.error('❌ Erro ao salvar configurações:', error)
      const errorMessage = error?.message || 'Erro desconhecido ao salvar configurações'
      
      // Mensagem mais detalhada se for erro de tabela
      if (errorMessage.includes('Could not find the table') || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        setError(`❌ ERRO: A tabela 'settings' não existe no banco de dados!\n\nPor favor, execute a migração 003_create_settings_table.sql no Supabase Dashboard > SQL Editor.\n\nVeja database/migrations/README_003.md para instruções.`)
      } else {
        setError(`Erro ao salvar: ${errorMessage}`)
      }
      
      setTimeout(() => setError(''), 10000)
    } finally {
      setLoading(false)
      clearTimeout(timeoutId)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const tabs = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'contact', label: 'Contato', icon: Mail }
  ]

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-black border-2 border-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-500" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-white hover:text-yellow-500 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-black border-2 border-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-500" />
              <span className="font-medium">{success}</span>
            </div>
            <button onClick={() => setSuccess('')} className="text-white hover:text-yellow-500 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-yellow-500/20">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-white/70">Gerencie as configurações do seu site</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 flex items-center disabled:opacity-50 shadow-lg hover:shadow-yellow-500/50 disabled:shadow-none"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-black rounded-lg border-2 border-yellow-500/30 p-4 shadow-lg">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                        : 'text-white hover:bg-yellow-500/20 hover:text-yellow-500 border border-transparent hover:border-yellow-500/30'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-lg border-2 border-yellow-500/30 p-8 shadow-lg">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-yellow-500 pb-3">Configurações Gerais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Nome do Site
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200"
                      placeholder="Nome do seu site"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Moeda
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="BRL" className="bg-black">Real (BRL)</option>
                      <option value="USD" className="bg-black">Dólar (USD)</option>
                      <option value="EUR" className="bg-black">Euro (EUR)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Descrição do Site
                    </label>
                    <textarea
                      value={settings.site_description}
                      onChange={(e) => handleInputChange('site_description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200 resize-none"
                      placeholder="Descrição do seu site"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-yellow-500/20">
                  <h3 className="text-xl font-bold text-white">Configurações do Sistema</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-black border-2 border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-all duration-200">
                    <div>
                      <label className="text-sm font-semibold text-white block mb-1">
                        Modo de Manutenção
                      </label>
                      <p className="text-xs text-white/60">O site ficará indisponível para visitantes</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('maintenance_mode', !settings.maintenance_mode)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-lg ${
                        settings.maintenance_mode ? 'bg-yellow-500' : 'bg-black border-2 border-yellow-500/30'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                          settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black border-2 border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-all duration-200">
                    <div>
                      <label className="text-sm font-semibold text-white block mb-1">
                        Permitir Cadastro
                      </label>
                      <p className="text-xs text-white/60">Novos usuários podem se cadastrar</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('allow_registration', !settings.allow_registration)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-lg ${
                        settings.allow_registration ? 'bg-yellow-500' : 'bg-black border-2 border-yellow-500/30'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                          settings.allow_registration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-yellow-500 pb-3">Informações de Contato</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Email de Contato
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200"
                      placeholder="contato@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={settings.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      WhatsApp (Número para Recebimento de Pedidos)
                    </label>
                    <input
                      type="tel"
                      value={settings.whatsapp_number}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      placeholder="5521994595532"
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200"
                    />
                    <p className="mt-2 text-xs text-white/60">
                      Digite apenas números (ex: 5521994595532). Este número receberá as mensagens dos pedidos via WhatsApp.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Endereço
                    </label>
                    <textarea
                      value={settings.contact_address}
                      onChange={(e) => handleInputChange('contact_address', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-black border-2 border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all duration-200 resize-none"
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
