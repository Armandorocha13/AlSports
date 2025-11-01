'use client'

import { createClient } from '@/lib/supabase-client'
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    CreditCard,
    Database,
    Globe,
    Mail,
    Save,
    Shield,
    Truck,
    Upload,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface SiteSettings {
  site_name: string
  site_description: string
  site_logo: string
  contact_email: string
  contact_phone: string
  contact_address: string
  whatsapp_number: string
  instagram_url: string
  facebook_url: string
  twitter_url: string
  payment_methods: string[]
  shipping_methods: string[]
  free_shipping_threshold: number
  tax_rate: number
  currency: string
  timezone: string
  maintenance_mode: boolean
  allow_registration: boolean
  require_email_verification: boolean
  superfrete_api_key: string
  supabase_url: string
  supabase_anon_key: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'AL Sports',
    site_description: 'Loja de Atacado de Roupas Esportivas',
    site_logo: '',
    contact_email: 'contato@alsports.com.br',
    contact_phone: '(21) 99459-5532',
    contact_address: 'Cidade da Moda, 13900 - Nova Iguaçu - RJ',
    whatsapp_number: '5521994595532',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    payment_methods: ['pix', 'cartao', 'boleto'],
    shipping_methods: ['pac', 'sedex', 'transportadora'],
    free_shipping_threshold: 200,
    tax_rate: 0,
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    maintenance_mode: false,
    allow_registration: true,
    require_email_verification: false,
    superfrete_api_key: '',
    supabase_url: '',
    supabase_anon_key: ''
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
        site_logo: (typeof settingsMap.site_logo === 'string' ? settingsMap.site_logo : prev.site_logo) || prev.site_logo || '',
        contact_email: (typeof settingsMap.contact_email === 'string' ? settingsMap.contact_email : prev.contact_email) || prev.contact_email,
        contact_phone: (typeof settingsMap.contact_phone === 'string' ? settingsMap.contact_phone : prev.contact_phone) || prev.contact_phone,
        contact_address: (typeof settingsMap.contact_address === 'string' ? settingsMap.contact_address : prev.contact_address) || prev.contact_address,
        // Garantir que whatsapp_number seja string antes de usar replace
        whatsapp_number: (typeof settingsMap.whatsapp_number === 'string' 
          ? settingsMap.whatsapp_number.replace(/\D/g, '')
          : settingsMap.whatsapp_number 
            ? String(settingsMap.whatsapp_number).replace(/\D/g, '')
            : prev.whatsapp_number),
        instagram_url: (typeof settingsMap.instagram_url === 'string' ? settingsMap.instagram_url : prev.instagram_url) || prev.instagram_url,
        facebook_url: (typeof settingsMap.facebook_url === 'string' ? settingsMap.facebook_url : prev.facebook_url) || prev.facebook_url,
        twitter_url: (typeof settingsMap.twitter_url === 'string' ? settingsMap.twitter_url : prev.twitter_url) || prev.twitter_url,
        free_shipping_threshold: settingsMap.shipping_free_minimum || prev.free_shipping_threshold,
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
      console.log('🖼️ Logo:', settings.site_logo ? 'URL definida' : 'Não definida')
      console.log('📧 Email:', settings.contact_email)
      console.log('📱 Telefone:', settings.contact_phone)
      console.log('📍 Endereço:', settings.contact_address)
      console.log('💬 WhatsApp:', whatsappClean)
      console.log('📷 Instagram:', settings.instagram_url)
      console.log('👥 Facebook:', settings.facebook_url)
      console.log('🐦 Twitter:', settings.twitter_url)
      
      const settingsToSave = [
        // Informações gerais
        { key: 'site_name', value: settings.site_name || '', description: 'Nome do site' },
        { key: 'site_description', value: settings.site_description || '', description: 'Descrição do site' },
        { key: 'site_logo', value: settings.site_logo || '', description: 'URL da logo do site' },
        
        // Informações de contato
        { key: 'contact_email', value: settings.contact_email || '', description: 'Email de contato' },
        { key: 'contact_phone', value: settings.contact_phone || '', description: 'Telefone de contato' },
        { key: 'contact_address', value: settings.contact_address || '', description: 'Endereço de contato' },
        { 
          key: 'whatsapp_number', 
          value: whatsappClean, // Apenas números
          description: 'Número do WhatsApp para recebimento de pedidos' 
        },
        
        // Redes sociais
        { key: 'instagram_url', value: settings.instagram_url || '', description: 'URL do Instagram' },
        { key: 'facebook_url', value: settings.facebook_url || '', description: 'URL do Facebook' },
        { key: 'twitter_url', value: settings.twitter_url || '', description: 'URL do Twitter' },
        
        // Configurações de frete
        { key: 'shipping_free_minimum', value: settings.free_shipping_threshold.toString(), description: 'Valor mínimo para frete grátis' },
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
          } else if (['instagram_url', 'facebook_url', 'twitter_url'].includes(setting.key)) {
            // Validar URLs se fornecidas
            if (setting.value && !setting.value.startsWith('http://') && !setting.value.startsWith('https://') && setting.value.length > 0) {
              console.warn(`⚠️ ${setting.key} pode precisar de http:// ou https://: ${setting.value}`)
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

  const handleArrayChange = (field: keyof SiteSettings, value: string, checked: boolean) => {
    setSettings(prev => {
      const currentArray = prev[field] as string[]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      }
    })
  }

  const tabs = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'contact', label: 'Contato', icon: Mail },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
    { id: 'shipping', label: 'Frete', icon: Truck },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'integrations', label: 'Integrações', icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-900 px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-2 border-green-500 text-green-900 px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 mt-2">Gerencie as configurações do seu site</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-black'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Configurações Gerais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nome do Site
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Moeda
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="BRL">Real (BRL)</option>
                      <option value="USD">Dólar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Descrição do Site
                    </label>
                    <textarea
                      value={settings.site_description}
                      onChange={(e) => handleInputChange('site_description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Logo do Site
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          // Validar arquivo
                          const maxSize = 5 * 1024 * 1024 // 5MB
                          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
                          
                          if (file.size > maxSize) {
                            setError('Arquivo muito grande. Máximo 5MB.')
                            setTimeout(() => setError(''), 5000)
                            return
                          }
                          
                          if (!allowedTypes.includes(file.type)) {
                            setError('Tipo de arquivo não suportado. Use JPG, PNG, WEBP ou SVG.')
                            setTimeout(() => setError(''), 5000)
                            return
                          }

                          try {
                            setLoading(true)
                            setError('')
                            
                            // Fazer upload para Supabase Storage
                            const { uploadImage, generateFileName, STORAGE_BUCKETS } = await import('@/lib/storage')
                            const fileName = generateFileName(file.name)
                            const path = `site-logo/${fileName}`
                            
                            console.log('📤 Fazendo upload da logo...')
                            const result = await uploadImage(file, STORAGE_BUCKETS.LOGOS, path)
                            
                            console.log('✅ Logo enviada com sucesso:', result.url)
                            
                            // Atualizar estado imediatamente
                            setSettings(prev => ({
                              ...prev,
                              site_logo: result.url
                            }))
                            
                            setSuccess('Logo enviada com sucesso! Clique em "Salvar" para persistir.')
                            setTimeout(() => setSuccess(''), 5000)
                          } catch (error: any) {
                            console.error('Erro ao fazer upload da logo:', error)
                            setError(`Erro ao enviar logo: ${error?.message || 'Erro desconhecido'}`)
                            setTimeout(() => setError(''), 5000)
                          } finally {
                            setLoading(false)
                          }
                        }}
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {loading ? 'Enviando...' : 'Upload'}
                      </label>
                      {settings.site_logo && (
                        <div className="relative">
                          <img 
                            src={settings.site_logo} 
                            alt="Logo" 
                            className="w-16 h-16 object-contain rounded-lg border border-gray-600"
                          />
                          <button
                            onClick={() => {
                              setSettings(prev => ({ ...prev, site_logo: '' }))
                              setSuccess('Logo removida. Clique em "Salvar" para confirmar.')
                              setTimeout(() => setSuccess(''), 5000)
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            title="Remover logo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Formatos aceitos: JPG, PNG, WEBP, SVG. Máximo 5MB.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Fuso Horário
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                      <option value="America/New_York">Nova York (GMT-5)</option>
                      <option value="Europe/London">Londres (GMT+0)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Configurações do Sistema</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Modo de Manutenção
                      </label>
                      <p className="text-xs text-gray-500">O site ficará indisponível para visitantes</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('maintenance_mode', !settings.maintenance_mode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        settings.maintenance_mode ? 'bg-primary-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-400">
                        Permitir Cadastro
                      </label>
                      <p className="text-xs text-gray-500">Novos usuários podem se cadastrar</p>
                    </div>
                    <button
                      onClick={() => handleInputChange('allow_registration', !settings.allow_registration)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        settings.allow_registration ? 'bg-primary-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
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
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Informações de Contato</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email de Contato
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={settings.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      WhatsApp (Número para Recebimento de Pedidos)
                    </label>
                    <input
                      type="tel"
                      value={settings.whatsapp_number}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      placeholder="5521994595532"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Digite apenas números (ex: 5521994595532). Este número receberá as mensagens dos pedidos via WhatsApp.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Endereço
                    </label>
                    <textarea
                      value={settings.contact_address}
                      onChange={(e) => handleInputChange('contact_address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Redes Sociais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.instagram_url}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                        placeholder="https://instagram.com/seusite"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.facebook_url}
                        onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                        placeholder="https://facebook.com/seusite"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={settings.twitter_url}
                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                        placeholder="https://twitter.com/seusite"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Configurações de Pagamento</h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Métodos de Pagamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: 'pix', label: 'PIX' },
                      { value: 'cartao', label: 'Cartão de Crédito' },
                      { value: 'boleto', label: 'Boleto Bancário' },
                      { value: 'debito', label: 'Cartão de Débito' }
                    ].map((method) => (
                      <label key={method.value} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.payment_methods.includes(method.value)}
                          onChange={(e) => handleArrayChange('payment_methods', method.value, e.target.checked)}
                          className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-white">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Taxa de Juros (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.tax_rate}
                      onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Configurações de Frete</h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Métodos de Entrega</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: 'pac', label: 'PAC' },
                      { value: 'sedex', label: 'SEDEX' },
                      { value: 'transportadora', label: 'Transportadora' },
                      { value: 'retirada', label: 'Retirada no Local' }
                    ].map((method) => (
                      <label key={method.value} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.shipping_methods.includes(method.value)}
                          onChange={(e) => handleArrayChange('shipping_methods', method.value, e.target.checked)}
                          className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-white">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Valor Mínimo para Frete Grátis (R$)
                    </label>
                    <input
                      type="number"
                      value={settings.free_shipping_threshold}
                      onChange={(e) => handleInputChange('free_shipping_threshold', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Integrações</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center space-x-3 mb-3">
                      <Truck className="w-5 h-5 text-primary-400" />
                      <h3 className="text-lg font-medium text-white">Superfrete API</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure sua chave da API do Superfrete para cálculo automático de frete
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Chave da API
                      </label>
                      <input
                        type="password"
                        value={settings.superfrete_api_key}
                        onChange={(e) => handleInputChange('superfrete_api_key', e.target.value)}
                        placeholder="Sua chave da API do Superfrete"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center space-x-3 mb-3">
                      <Database className="w-5 h-5 text-primary-400" />
                      <h3 className="text-lg font-medium text-white">Supabase</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Configurações do banco de dados Supabase
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          URL do Supabase
                        </label>
                        <input
                          type="url"
                          value={settings.supabase_url}
                          onChange={(e) => handleInputChange('supabase_url', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Chave Anônima
                        </label>
                        <input
                          type="password"
                          value={settings.supabase_anon_key}
                          onChange={(e) => handleInputChange('supabase_anon_key', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="text-yellow-400 font-medium">Atenção</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        Alterações nas configurações de integração podem afetar o funcionamento do site. 
                        Certifique-se de que as informações estão corretas antes de salvar.
                      </p>
                    </div>
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
