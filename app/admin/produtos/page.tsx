'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { adminService, AdminProduct } from '@/lib/admin-service'
import Image from 'next/image'

export default function ProdutosPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sizes: [] as string[],
    images: [] as string[]
  })

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const productsData = await adminService.getProducts()
        setProducts(productsData)
        if (productsData.length > 0) {
          setSelectedProduct(productsData[0])
          setFormData({
            name: productsData[0].name,
            description: productsData[0].description,
            price: productsData[0].price.toString(),
            stock: productsData[0].stock.toString(),
            sizes: ['P', 'M', 'G'], // Mock sizes
            images: [productsData[0].image]
          })
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        alert('Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrar produtos por busca
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Selecionar produto
  const handleSelectProduct = (product: AdminProduct) => {
    setSelectedProduct(product)
    setIsEditing(false)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      sizes: ['P', 'M', 'G'], // Mock sizes
      images: [product.image]
    })
  }

  // Iniciar edição
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false)
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price.toString(),
        stock: selectedProduct.stock.toString(),
        sizes: ['P', 'M', 'G'],
        images: [selectedProduct.image]
      })
    }
  }

  // Salvar alterações
  const handleSave = async () => {
    if (!selectedProduct) return

    try {
      setSaving(true)
      // Aqui você implementaria a lógica de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
      
      // Atualizar produto na lista
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, name: formData.name, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : p
      ))

      // Atualizar produto selecionado
      setSelectedProduct(prev => prev ? {
        ...prev,
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      } : null)

      setIsEditing(false)
      alert('Produto salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  // Excluir produto
  const handleDelete = async () => {
    if (!selectedProduct) return

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await adminService.deleteProduct(selectedProduct.id)
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id))
        setSelectedProduct(null)
        alert('Produto excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        alert('Erro ao excluir produto')
      }
    }
  }

  // Adicionar novo produto
  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsEditing(true)
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      sizes: [],
      images: []
    })
  }

  // Adicionar tamanho
  const handleAddSize = (size: string) => {
    if (size && !formData.sizes.includes(size.toUpperCase())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size.toUpperCase()]
      }))
    }
  }

  // Remover tamanho
  const handleRemoveSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-gray-800 text-xl">Carregando produtos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex min-w-72 flex-col">
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Produtos</h1>
            <p className="text-base text-gray-300">Adicione, edite e gerencie todos os produtos da sua loja.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* Painel Esquerdo: Lista de Produtos */}
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="flex flex-col gap-4">
              {/* Busca */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-800 text-white placeholder-gray-400"
                />
              </div>

              {/* Botão Adicionar */}
              <button
                onClick={handleAddNew}
                className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Adicionar Novo Produto</span>
              </button>

              {/* Lista de Produtos */}
              <div className="flex flex-col gap-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-2 border-yellow-500 bg-yellow-500/10'
                        : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-yellow-400">
                        Estoque: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Painel Direito: Formulário de Edição */}
          <div className="lg:col-span-2 xl:col-span-3">
            {selectedProduct ? (
              <div className="flex flex-col gap-6">
                {/* Informações Básicas */}
                <div className="rounded-xl border border-gray-600 bg-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {isEditing ? 'Editar Produto' : 'Visualizar Produto'}
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
                  <p className="text-sm text-gray-300 mb-6">
                    {isEditing ? 'Altere as informações do produto abaixo.' : 'Visualize as informações do produto.'}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Nome do Produto
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-700 disabled:cursor-not-allowed bg-gray-800 text-white placeholder-gray-400"
                        placeholder="Ex: Camiseta Básica Branca"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Descreva os detalhes do produto..."
                      />
                    </div>
                  </div>
                </div>

                {/* Mídia */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mídia</h3>
                  
                  {isEditing ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-600">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-yellow-400">Clique para carregar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute top-0 right-0 z-10 -mt-2 -mr-2 flex items-center justify-center rounded-full bg-red-500 p-1 text-white shadow-md">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="aspect-square w-full rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preço e Estoque */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Preço e Estoque</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preço
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">R$</span>
                        </div>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estoque
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Atributos */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Atributos</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamanhos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.sizes.map((size) => (
                        <span
                          key={size}
                          className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800"
                        >
                          {size}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveSize(size)}
                              className="ml-1 h-3 w-3 rounded-sm hover:bg-yellow-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Adicionar tamanho..."
                          className="w-24 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddSize((e.target as HTMLInputElement).value)
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Barra de Ações */}
                {isEditing && (
                  <div className="sticky bottom-0 bg-gray-100/80 py-4 backdrop-blur-sm dark:bg-gray-800/80">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-transparent hover:bg-gray-200 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
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
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum produto selecionado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Selecione um produto da lista para visualizar ou editar
                </p>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar Novo Produto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}