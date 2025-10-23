'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Save, 
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Database,
  Key,
  AlertTriangle
} from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState('general')
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // In a real app, you would fetch from a settings table
      // For now, we'll use the default values
      console.log('Loading settings...')
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // In a real app, you would save to a settings table
      console.log('Saving settings:', settings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setLoading(false)
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
                      />
                      <label
                        htmlFor="logo-upload"
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200 flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </label>
                      {settings.site_logo && (
                        <img src={settings.site_logo} alt="Logo" className="w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
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
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={settings.whatsapp_number}
                      onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
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
