'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Image,
  Eye,
  EyeOff,
  Calendar,
  ExternalLink
} from 'lucide-react'

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
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
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
      console.error('Erro ao buscar banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setBanners(banners.filter(b => b.id !== id))
      alert('Banner excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir banner:', error)
      alert('Erro ao excluir banner')
    }
  }

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      setBanners(banners.map(b => 
        b.id === id ? { ...b, is_active: !currentStatus } : b
      ))
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error)
    }
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = !positionFilter || banner.position === positionFilter
    return matchesSearch && matchesPosition
  })

  const getStats = () => {
    return {
      total: banners.length,
      active: banners.filter(b => b.is_active).length,
      inactive: banners.filter(b => !b.is_active).length,
      hero: banners.filter(b => b.position === 'hero').length,
      sidebar: banners.filter(b => b.position === 'sidebar').length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando banners...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciar Banners</h1>
          <p className="text-gray-400">Gerencie banners promocionais do site</p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Banner
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Banners</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Banners Ativos</p>
              <p className="text-xl font-bold text-white">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <ExternalLink className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Hero Section</p>
              <p className="text-xl font-bold text-white">{stats.hero}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <EyeOff className="h-8 w-8 text-red-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Banners Inativos</p>
              <p className="text-xl font-bold text-white">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buscar Banner
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por Posição
            </label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">Todas as posições</option>
              <option value="hero">Hero Section</option>
              <option value="sidebar">Sidebar</option>
              <option value="footer">Footer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
            <div className="relative">
              <img
                src={banner.image_url || '/placeholder-banner.jpg'}
                alt={banner.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    banner.is_active
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {banner.is_active ? 'Ativo' : 'Inativo'}
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded">
                  {banner.position}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {banner.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {banner.description}
              </p>
              
              {banner.link_url && (
                <div className="flex items-center text-sm text-primary-400 mb-4">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="truncate">
                    {banner.link_url}
                  </a>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(banner.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/admin/banners/editar/${banner.id}`}
                  className="flex-1 bg-primary-500 text-black px-3 py-2 rounded text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBanners.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum banner encontrado</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || positionFilter 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro banner'
            }
          </p>
          <Link
            href="/admin/banners/novo"
            className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Criar Banner
          </Link>
        </div>
      )}
    </div>
  )
}