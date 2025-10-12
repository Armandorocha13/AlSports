'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Image,
  Upload,
  ExternalLink,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import Link from 'next/link'

interface Banner {
  id: string
  title: string
  description: string
  image_url: string
  link_url: string
  position: string
  is_active: boolean
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

const bannerPositions = [
  { value: 'hero', label: 'Hero (Principal)' },
  { value: 'top', label: 'Topo' },
  { value: 'middle', label: 'Meio' },
  { value: 'bottom', label: 'Rodapé' },
  { value: 'sidebar', label: 'Sidebar' }
]

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', bannerId)

      if (error) throw error

      setBanners(banners.filter(b => b.id !== bannerId))
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Erro ao excluir banner')
    }
  }

  const handleToggleActive = async (bannerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !currentStatus })
        .eq('id', bannerId)

      if (error) throw error

      setBanners(banners.map(b => 
        b.id === bannerId ? { ...b, is_active: !currentStatus } : b
      ))
    } catch (error) {
      console.error('Error updating banner status:', error)
      alert('Erro ao atualizar status do banner')
    }
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPosition = !positionFilter || banner.position === positionFilter
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && banner.is_active) ||
      (statusFilter === 'inactive' && !banner.is_active)
    
    return matchesSearch && matchesPosition && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isBannerActive = (banner: Banner) => {
    const now = new Date()
    const startDate = new Date(banner.start_date)
    const endDate = new Date(banner.end_date)
    
    return banner.is_active && now >= startDate && now <= endDate
  }

  const getPositionLabel = (position: string) => {
    const pos = bannerPositions.find(p => p.value === position)
    return pos?.label || position
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Carregando banners...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Banners</h1>
          <p className="text-gray-400 mt-2">Gerencie banners e promoções do site</p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Banner
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Position Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas as posições</option>
            {bannerPositions.map(position => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>

          {/* Actions */}
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors duration-200">
            {/* Banner Image */}
            <div className="h-48 bg-gray-700 flex items-center justify-center relative">
              {banner.image_url ? (
                <img 
                  src={banner.image_url} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image className="w-12 h-12 text-gray-400" />
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {isBannerActive(banner) ? (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Ativo
                  </span>
                ) : (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    Inativo
                  </span>
                )}
              </div>
            </div>

            {/* Banner Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white line-clamp-1">{banner.title}</h3>
                <button
                  onClick={() => handleToggleActive(banner.id, banner.is_active)}
                  className="text-gray-400 hover:text-white"
                >
                  {banner.is_active ? (
                    <ToggleRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {banner.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Posição:</span>
                  <span className="text-white">{getPositionLabel(banner.position)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Período:</span>
                  <span className="text-white">
                    {formatDate(banner.start_date)} - {formatDate(banner.end_date)}
                  </span>
                </div>
                {banner.link_url && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Link:</span>
                    <a 
                      href={banner.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver link
                    </a>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/admin/banners/${banner.id}`}
                  className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Link>
                <Link
                  href={`/admin/banners/${banner.id}/editar`}
                  className="flex-1 bg-primary-500 text-black py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="bg-red-500/10 text-red-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors duration-200 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBanners.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum banner encontrado</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || positionFilter || statusFilter 
              ? 'Tente ajustar os filtros de busca' 
              : 'Comece criando seu primeiro banner'
            }
          </p>
          {!searchTerm && !positionFilter && !statusFilter && (
            <Link
              href="/admin/banners/novo"
              className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Banner
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Banners</p>
              <p className="text-2xl font-bold text-white">{banners.length}</p>
            </div>
            <Image className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Banners Ativos</p>
              <p className="text-2xl font-bold text-white">
                {banners.filter(b => isBannerActive(b)).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Hero Banners</p>
              <p className="text-2xl font-bold text-white">
                {banners.filter(b => b.position === 'hero').length}
              </p>
            </div>
            <ExternalLink className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Banners Expirados</p>
              <p className="text-2xl font-bold text-white">
                {banners.filter(b => new Date(b.end_date) < new Date()).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
