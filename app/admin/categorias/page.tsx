'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Tag,
  Image,
  Eye,
  Folder
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  product_count: number
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedCategories = data?.map(category => ({
        ...category,
        product_count: category.products?.[0]?.count || 0
      })) || []

      setCategories(formattedCategories)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setCategories(categories.filter(c => c.id !== id))
      alert('Categoria excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      alert('Erro ao excluir categoria')
    }
  }

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      setCategories(categories.map(c => 
        c.id === id ? { ...c, is_active: !currentStatus } : c
      ))
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando categorias...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciar Categorias</h1>
          <p className="text-gray-400">Organize o catálogo por categorias</p>
        </div>
        <Link
          href="/admin/categorias/nova"
          className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Folder className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Categorias</p>
              <p className="text-xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Categorias Ativas</p>
              <p className="text-xl font-bold text-white">
                {categories.filter(c => c.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total de Produtos</p>
              <p className="text-xl font-bold text-white">
                {categories.reduce((sum, c) => sum + c.product_count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
            <div className="relative">
              <img
                src={category.image_url || '/placeholder-category.jpg'}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    category.is_active
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {category.is_active ? 'Ativa' : 'Inativa'}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Tag className="h-4 w-4 mr-1" />
                  {category.product_count} produtos
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(category.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/admin/categorias/editar/${category.id}`}
                  className="flex-1 bg-primary-500 text-black px-3 py-2 rounded text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm 
              ? 'Tente ajustar o termo de busca'
              : 'Comece criando sua primeira categoria'
            }
          </p>
          <Link
            href="/admin/categorias/nova"
            className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Criar Categoria
          </Link>
        </div>
      )}
    </div>
  )
}