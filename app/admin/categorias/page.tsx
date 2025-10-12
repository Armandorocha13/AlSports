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
  Package,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  products_count?: number
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      let query = supabase
        .from('categories')
        .select(`
          *,
          products_count:products(count)
        `)
        .order('name')

      if (!showInactive) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      setCategories(categories.filter(c => c.id !== categoryId))
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erro ao excluir categoria')
    }
  }

  const handleToggleActive = async (categoryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', categoryId)

      if (error) throw error

      setCategories(categories.map(c => 
        c.id === categoryId ? { ...c, is_active: !currentStatus } : c
      ))
    } catch (error) {
      console.error('Error updating category status:', error)
      alert('Erro ao atualizar status da categoria')
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Carregando categorias...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Categorias</h1>
          <p className="text-gray-400 mt-2">Organize seus produtos por categorias</p>
        </div>
        <Link
          href="/admin/categorias/nova"
          className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Show Inactive */}
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
            />
            <span>Mostrar inativas</span>
          </label>

          {/* Actions */}
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors duration-200">
            {/* Category Image */}
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              {category.image_url ? (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Category Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                <button
                  onClick={() => handleToggleActive(category.id, category.is_active)}
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.is_active 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                >
                  {category.is_active ? 'Ativa' : 'Inativa'}
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {category.products_count || 0} produtos
                </span>
                <span>Slug: {category.slug}</span>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/admin/categorias/${category.id}`}
                  className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Link>
                <Link
                  href={`/admin/categorias/${category.id}/editar`}
                  className="flex-1 bg-primary-500 text-black py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500/10 text-red-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors duration-200 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm 
              ? 'Tente ajustar os filtros de busca' 
              : 'Comece criando sua primeira categoria'
            }
          </p>
          {!searchTerm && (
            <Link
              href="/admin/categorias/nova"
              className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Categorias</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <Image className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Categorias Ativas</p>
              <p className="text-2xl font-bold text-white">
                {categories.filter(c => c.is_active).length}
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
              <p className="text-gray-400 text-sm">Total de Produtos</p>
              <p className="text-2xl font-bold text-white">
                {categories.reduce((sum, c) => sum + (c.products_count || 0), 0)}
              </p>
            </div>
            <Package className="w-8 h-8 text-primary-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
