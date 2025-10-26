'use client'

import React, { useState, useEffect } from 'react'
import { 
  Upload, 
  Palette, 
  Mail, 
  Phone, 
  Instagram,
  Save,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface AppearanceSettings {
  banner: string | null
  primaryColor: string
  secondaryColor: string
  whatsapp: string
  email: string
  instagram: string
}

export default function AparenciaPage() {
  const [settings, setSettings] = useState<AppearanceSettings>({
    banner: null,
    primaryColor: '#137fec',
    secondaryColor: '#f6f7f8',
    whatsapp: '',
    email: '',
    instagram: ''
  })

  const [saving, setSaving] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    banners: true,
    colors: false,
    contact: false
  })

  // Carregar configurações salvas
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('appearance-settings')
        if (saved) {
          setSettings(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }

    loadSettings()
  }, [])

  // Salvar configurações
  const handleSave = async () => {
    try {
      setSaving(true)
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Salvar no localStorage (em produção seria uma API)
      localStorage.setItem('appearance-settings', JSON.stringify(settings))
      
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  // Atualizar configuração
  const updateSetting = (key: keyof AppearanceSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Toggle seção expandida
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Upload de banner
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updateSetting('banner', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Aplicar cores ao preview
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', settings.primaryColor)
    root.style.setProperty('--secondary-color', settings.secondaryColor)
  }, [settings.primaryColor, settings.secondaryColor])

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-4 pb-6 border-b border-gray-600 items-center">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Personalizar Aparência da Loja
            </h1>
            <p className="text-base text-gray-300">
              Altere banners, cores e informações de contato para deixar a loja com a sua cara.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Salvar Alterações</span>
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-8 mt-8">
          {/* Left Column: Settings */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            {/* Accordions */}
            <div className="flex flex-col gap-3">
              {/* Banners e Imagens */}
              <details className="flex flex-col rounded-lg border border-gray-600 bg-gray-800 group" open={expandedSections.banners}>
                <summary 
                  className="flex cursor-pointer items-center justify-between gap-6 p-4"
                  onClick={() => toggleSection('banners')}
                >
                  <p className="text-base font-medium text-white">Banners e Imagens</p>
                  {expandedSections.banners ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </summary>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-6">
                  {/* File Upload */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Banner Principal</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">Recomendado: 1920x1080px.</p>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" htmlFor="dropzone-file">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG ou GIF (MAX. 5MB)</p>
                        </div>
                        <input 
                          className="hidden" 
                          id="dropzone-file" 
                          type="file" 
                          accept="image/*"
                          onChange={handleBannerUpload}
                        />
                      </label>
                    </div>
                    {settings.banner && (
                      <div className="mt-4">
                        <img 
                          src={settings.banner} 
                          alt="Banner preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* Cores do Tema */}
              <details className="flex flex-col rounded-lg border border-gray-600 bg-gray-800 group" open={expandedSections.colors}>
                <summary 
                  className="flex cursor-pointer items-center justify-between gap-6 p-4"
                  onClick={() => toggleSection('colors')}
                >
                  <p className="text-base font-medium text-white">Cores do Tema</p>
                  {expandedSections.colors ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </summary>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-4">
                  {/* Color Pickers */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="primary-color">
                      Cor Primária
                    </label>
                    <div className="relative">
                      <input
                        className="p-1 h-8 w-14 block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-pointer rounded-lg"
                        id="primary-color"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="secondary-color">
                      Cor Secundária
                    </label>
                    <div className="relative">
                      <input
                        className="p-1 h-8 w-14 block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-pointer rounded-lg"
                        id="secondary-color"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </details>

              {/* Informações de Contato */}
              <details className="flex flex-col rounded-lg border border-gray-600 bg-gray-800 group" open={expandedSections.contact}>
                <summary 
                  className="flex cursor-pointer items-center justify-between gap-6 p-4"
                  onClick={() => toggleSection('contact')}
                >
                  <p className="text-base font-medium text-white">Informações de Contato</p>
                  {expandedSections.contact ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </summary>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-4">
                  {/* Input Fields */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white" htmlFor="whatsapp">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        className="py-3 px-4 pl-11 block w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:text-gray-400"
                        id="whatsapp"
                        placeholder="+55 (00) 00000-0000"
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => updateSetting('whatsapp', e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white" htmlFor="email">
                      E-mail de Contato
                    </label>
                    <div className="relative">
                      <input
                        className="py-3 px-4 pl-11 block w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:text-gray-400"
                        id="email"
                        placeholder="contato@sualoja.com"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white" htmlFor="instagram">
                      Instagram
                    </label>
                    <div className="relative">
                      <input
                        className="py-3 px-4 pl-11 block w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:text-gray-400"
                        id="instagram"
                        placeholder="https://instagram.com/sualoja"
                        type="text"
                        value={settings.instagram}
                        onChange={(e) => updateSetting('instagram', e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                        <Instagram className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="hidden lg:block xl:col-span-3">
            <div className="sticky top-8">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pré-visualização da Loja</p>
              <div className="w-full h-[75vh] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                {/* Browser Header */}
                <div className="h-12 bg-gray-100 dark:bg-gray-800 flex items-center px-4 gap-2">
                  <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <div className="ml-4 flex-1 bg-gray-200 dark:bg-gray-700 h-6 rounded"></div>
                </div>
                
                {/* Iframe content (simulated) */}
                <div className="h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
                  {/* Store Header */}
                  <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex justify-between items-center">
                    <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="flex gap-4">
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                  </header>
                  
                  {/* Main Banner */}
                  <div 
                    className="w-full h-56 bg-center bg-cover flex items-center justify-center"
                    style={{ 
                      backgroundColor: settings.primaryColor,
                      backgroundImage: settings.banner ? `url(${settings.banner})` : 'none'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-black/20">
                      <h2 className="text-white text-3xl font-bold">Promoção Imperdível!</h2>
                    </div>
                  </div>
                  
                  {/* Product Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {/* Product Cards */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
                          <div className="w-full h-32 bg-gray-200 dark:bg-gray-700"></div>
                          <div className="p-4">
                            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                            <div 
                              className="h-6 w-1/2 rounded"
                              style={{ backgroundColor: `${settings.primaryColor}20` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8 p-6 text-center">
                    <div className="h-4 w-1/3 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
