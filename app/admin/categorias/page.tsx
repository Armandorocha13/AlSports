'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Monitor,
  Shirt,
  Watch,
  Smartphone,
  Laptop,
  Headphones
} from 'lucide-react'

interface Category {
  id: string
  name: string
  type: 'category' | 'subcategory'
  parentId?: string
  productCount: number
  icon: string
}

interface Product {
  id: string
  name: string
  categoryId: string
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    type: 'subcategory' as 'category' | 'subcategory'
  })

  // Produtos associados
  const [associatedProducts, setAssociatedProducts] = useState<Product[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Mock data - em produção viria de uma API
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'Eletrônicos',
            type: 'category',
            productCount: 12,
            icon: 'Monitor'
          },
          {
            id: '2',
            name: 'Celulares',
            type: 'subcategory',
            parentId: '1',
            productCount: 5,
            icon: 'Smartphone'
          },
          {
            id: '3',
            name: 'Notebooks',
            type: 'subcategory',
            parentId: '1',
            productCount: 4,
            icon: 'Laptop'
          },
          {
            id: '4',
            name: 'Acessórios',
            type: 'subcategory',
            parentId: '1',
            productCount: 3,
            icon: 'Headphones'
          },
          {
            id: '5',
            name: 'Roupas',
            type: 'category',
            productCount: 34,
            icon: 'Shirt'
          },
          {
            id: '6',
            name: 'Acessórios',
            type: 'category',
            productCount: 21,
            icon: 'Watch'
          }
        ]

        const mockProducts: Product[] = [
          { id: '1', name: 'Smartphone Modelo Y', categoryId: '2' },
          { id: '2', name: 'Smartphone Modelo Z', categoryId: '2' },
          { id: '3', name: 'Smartphone Plus', categoryId: '2' },
          { id: '4', name: 'Notebook Pro', categoryId: '3' },
          { id: '5', name: 'Fone de Ouvido Sem Fio', categoryId: '4' }
        ]

        setCategories(mockCategories)
        setAvailableProducts(mockProducts)
        
        // Selecionar primeira categoria por padrão
        if (mockCategories.length > 0) {
          const firstCategory = mockCategories.find(c => c.type === 'subcategory') || mockCategories[0]
          setSelectedCategory(firstCategory)
          setFormData({
            name: firstCategory.name,
            parentId: firstCategory.parentId || '',
            type: firstCategory.type
          })
          
          // Carregar produtos associados
          const associated = mockProducts.filter(p => p.categoryId === firstCategory.id)
          setAssociatedProducts(associated)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        alert('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar categorias por busca
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Agrupar categorias por hierarquia
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    if (category.type === 'category') {
      acc[category.id] = {
        category,
        subcategories: categories.filter(c => c.parentId === category.id)
      }
    }
    return acc
  }, {} as Record<string, { category: Category; subcategories: Category[] }>)

  // Selecionar categoria
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditing(false)
    setFormData({
      name: category.name,
      parentId: category.parentId || '',
      type: category.type
    })
    
    // Carregar produtos associados
    const associated = availableProducts.filter(p => p.categoryId === category.id)
    setAssociatedProducts(associated)
  }

  // Iniciar edição
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false)
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        parentId: selectedCategory.parentId || '',
        type: selectedCategory.type
      })
    }
  }

  // Salvar alterações
  const handleSave = async () => {
    if (!selectedCategory) return

    try {
      setSaving(true)
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar categoria na lista
      setCategories(prev => prev.map(c => 
        c.id === selectedCategory.id 
          ? { ...c, name: formData.name, parentId: formData.parentId }
          : c
      ))

      // Atualizar categoria selecionada
      setSelectedCategory(prev => prev ? {
        ...prev,
        name: formData.name,
        parentId: formData.parentId
      } : null)

      setIsEditing(false)
      alert('Categoria salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      alert('Erro ao salvar categoria')
    } finally {
      setSaving(false)
    }
  }

  // Excluir categoria
  const handleDelete = async () => {
    if (!selectedCategory) return

    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        setCategories(prev => prev.filter(c => c.id !== selectedCategory.id))
        setSelectedCategory(null)
        alert('Categoria excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir categoria:', error)
        alert('Erro ao excluir categoria')
      }
    }
  }

  // Adicionar nova categoria
  const handleAddNew = (type: 'category' | 'subcategory') => {
    setSelectedCategory(null)
    setIsEditing(true)
    setFormData({
      name: '',
      parentId: '',
      type
    })
    setAssociatedProducts([])
  }

  // Adicionar produto à categoria
  const handleAddProduct = (productId: string) => {
    const product = availableProducts.find(p => p.id === productId)
    if (product && selectedCategory) {
      setAssociatedProducts(prev => [...prev, { ...product, categoryId: selectedCategory.id }])
    }
  }

  // Remover produto da categoria
  const handleRemoveProduct = (productId: string) => {
    setAssociatedProducts(prev => prev.filter(p => p.id !== productId))
  }

  // Obter ícone da categoria
  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Monitor,
      Shirt,
      Watch,
      Smartphone,
      Laptop,
      Headphones
    }
    return icons[iconName] || Monitor
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-gray-800 text-xl">Carregando categorias...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="text-4xl font-black text-white">
              Categorias e Subcategorias
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddNew('subcategory')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>+ Nova Subcategoria</span>
              </button>
              <button
                onClick={() => handleAddNew('category')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>+ Nova Categoria</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Painel Esquerdo: Lista de Categorias */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 shadow-sm">
                {/* Busca */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Lista de Categorias */}
                <div className="flex flex-col gap-2">
                  {Object.values(groupedCategories).map(({ category, subcategories }) => (
                    <div key={category.id} className="flex flex-col">
                      {/* Categoria Principal */}
                      <div
                        onClick={() => handleSelectCategory(category)}
                        className={`flex items-center justify-between gap-4 rounded-lg px-4 min-h-[72px] py-2 cursor-pointer transition-colors ${
                          selectedCategory?.id === category.id
                            ? 'bg-yellow-500/10'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 shrink-0 size-12">
                            {React.createElement(getCategoryIcon(category.icon), { className: "h-6 w-6" })}
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-white text-base font-medium line-clamp-1">
                              {category.name}
                            </p>
                            <p className="text-yellow-400 text-sm line-clamp-2">
                              {category.productCount} produtos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-yellow-400 p-1 rounded-full">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-red-400 p-1 rounded-full">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategorias */}
                      {subcategories.length > 0 && (
                        <div className="pl-8 pt-2 space-y-2 border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-6">
                          {subcategories.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              onClick={() => handleSelectCategory(subcategory)}
                              className={`flex items-center justify-between gap-4 rounded-lg px-4 min-h-[64px] py-2 cursor-pointer transition-colors ${
                                selectedCategory?.id === subcategory.id
                                  ? 'bg-yellow-500/10'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col justify-center">
                                  <p className="text-gray-900 dark:text-gray-100 text-base font-medium line-clamp-1">
                                    {subcategory.name}
                                  </p>
                                  <p className="text-yellow-400 text-sm line-clamp-2">
                                    {subcategory.productCount} produtos
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="text-gray-400 hover:text-yellow-400 p-1 rounded-full">
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button className="text-gray-500 hover:text-red-500 p-1 rounded-full">
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Painel Direito: Formulário de Edição */}
            <div className="lg:col-span-2">
              {selectedCategory ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {isEditing ? `Editar ${selectedCategory.type === 'category' ? 'Categoria' : 'Subcategoria'}: ${selectedCategory.name}` : `Visualizar ${selectedCategory.type === 'category' ? 'Categoria' : 'Subcategoria'}: ${selectedCategory.name}`}
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Nome da Categoria/Subcategoria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome da {selectedCategory.type === 'category' ? 'Categoria' : 'Subcategoria'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {/* Categoria Pai (apenas para subcategorias) */}
                    {selectedCategory.type === 'subcategory' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Categoria Pai
                        </label>
                        <select
                          value={formData.parentId}
                          onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Nenhuma</option>
                          {categories.filter(c => c.type === 'category').map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Associar Produtos */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Associar Produtos
                      </h3>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Selecione os produtos
                      </label>
                      <div className="relative">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddProduct(e.target.value)
                              e.target.value = ''
                            }
                          }}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Buscar ou selecionar um produto...</option>
                          {availableProducts
                            .filter(p => !associatedProducts.some(ap => ap.id === p.id))
                            .map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Produtos Associados */}
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-gray-200 mb-3">
                        Produtos Associados ({associatedProducts.length})
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {associatedProducts.map((product) => (
                          <div key={product.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-sm text-gray-800 dark:text-gray-200">{product.name}</p>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveProduct(product.id)}
                                className="text-gray-500 hover:text-red-500 text-xs font-semibold"
                              >
                                REMOVER
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Barra de Ações */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Salvando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Salvar Alterações
                          </div>
                        )}
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhuma categoria selecionada
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Selecione uma categoria da lista para visualizar ou editar
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddNew('subcategory')}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Nova Subcategoria
                      </button>
                      <button
                        onClick={() => handleAddNew('category')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Nova Categoria
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
