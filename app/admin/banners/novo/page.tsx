'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { 
  Save, 
  ArrowLeft,
  Upload,
  Calendar,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface BannerForm {
  title: string
  description: string
  image_url: string
  link_url: string
  position: string
  is_active: boolean
  start_date: string
  end_date: string
}

const bannerPositions = [
  { value: 'hero', label: 'Hero (Principal)' },
  { value: 'top', label: 'Topo' },
  { value: 'middle', label: 'Meio' },
  { value: 'bottom', label: 'Rodapé' },
  { value: 'sidebar', label: 'Sidebar' }
]

export default function NewBanner() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<BannerForm>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: 'hero',
    is_active: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  })
  const supabase = createClient()

  const handleInputChange = (field: keyof BannerForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('banners')
        .insert([{
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          link_url: formData.link_url,
          position: formData.position,
          is_active: formData.is_active,
          start_date: formData.start_date,
          end_date: formData.end_date
        }])

      if (error) throw error

      router.push('/admin/banners')
    } catch (error) {
      console.error('Error creating banner:', error)
      alert('Erro ao criar banner')
    } finally {
      setLoading(false)
    }
  }

  const isBannerActive = () => {
    const now = new Date()
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    
    return formData.is_active && now >= startDate && now <= endDate
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/banners"
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Novo Banner</h1>
            <p className="text-gray-400 mt-2">Adicione um novo banner ao site</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Banner'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Título do Banner *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: Promoção de Verão"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Descrição do banner..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    URL da Imagem *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://exemplo.com/banner.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Link de Destino
                  </label>
                  <input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => handleInputChange('link_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://exemplo.com/promocao"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Posição no Site *
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {bannerPositions.map(position => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Agendamento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Data de Fim *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Banner Ativo</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('is_active', !formData.is_active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      formData.is_active ? 'bg-primary-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        formData.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium text-white">Status Atual</span>
                  </div>
                  <div className="text-sm">
                    {isBannerActive() ? (
                      <span className="text-green-400">Banner ativo e visível</span>
                    ) : (
                      <span className="text-gray-400">Banner inativo ou fora do período</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.image_url && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {formData.link_url && (
                  <div className="mt-3 flex items-center space-x-2 text-sm">
                    <ExternalLink className="w-4 h-4 text-primary-400" />
                    <span className="text-gray-400">Link:</span>
                    <a 
                      href={formData.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 truncate"
                    >
                      {formData.link_url}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Banner Info */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Posição:</span>
                  <span className="text-white">
                    {bannerPositions.find(p => p.value === formData.position)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Período:</span>
                  <span className="text-white">
                    {new Date(formData.start_date).toLocaleDateString('pt-BR')} - {new Date(formData.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duração:</span>
                  <span className="text-white">
                    {Math.ceil((new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">Dicas</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use imagens de alta qualidade</li>
                <li>• Mantenha o texto legível</li>
                <li>• Teste em diferentes dispositivos</li>
                <li>• Defina períodos apropriados</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
