'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { 
  Save, 
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface ProductForm {
  name: string
  description: string
  price: number
  category_id: string
  image_url: string
  is_active: boolean
  sizes: string[]
  colors: string[]
  price_ranges: Array<{
    min_quantity: number
    max_quantity: number
    price: number
  }>
}

export default function NewProduct() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image_url: '',
    is_active: true,
    sizes: [],
    colors: [],
    price_ranges: [
      { min_quantity: 1, max_quantity: 9, price: 0 },
      { min_quantity: 10, max_quantity: 19, price: 0 },
      { min_quantity: 20, max_quantity: 49, price: 0 },
      { min_quantity: 50, max_quantity: 99, price: 0 },
      { min_quantity: 100, max_quantity: 999, price: 0 }
    ]
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'sizes' | 'colors', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      }
    })
  }

  const handlePriceRangeChange = (index: number, field: 'min_quantity' | 'max_quantity' | 'price', value: number) => {
    setFormData(prev => ({
      ...prev,
      price_ranges: prev.price_ranges.map((range, i) => 
        i === index ? { ...range, [field]: value } : range
      )
    }))
  }

  const addPriceRange = () => {
    setFormData(prev => ({
      ...prev,
      price_ranges: [
        ...prev.price_ranges,
        { min_quantity: 0, max_quantity: 0, price: 0 }
      ]
    }))
  }

  const removePriceRange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      price_ranges: prev.price_ranges.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category_id: formData.category_id,
          image_url: formData.image_url,
          is_active: formData.is_active,
          sizes: formData.sizes,
          colors: formData.colors,
          price_ranges: formData.price_ranges
        }])

      if (error) throw error

      router.push('/admin/produtos')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }

  const availableSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
  const availableColors = ['Branco', 'Preto', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Cinza']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/produtos"
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Novo Produto</h1>
            <p className="text-gray-400 mt-2">Adicione um novo produto ao catálogo</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Produto'}
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
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: Camisa Flamengo 2024/25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Descreva o produto..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Preço Base (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Categoria *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Price Ranges */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Faixas de Preço</h2>
                <button
                  type="button"
                  onClick={addPriceRange}
                  className="bg-primary-500 text-black px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.price_ranges.map((range, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Quantidade Mínima
                      </label>
                      <input
                        type="number"
                        value={range.min_quantity}
                        onChange={(e) => handlePriceRangeChange(index, 'min_quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Quantidade Máxima
                      </label>
                      <input
                        type="number"
                        value={range.max_quantity}
                        onChange={(e) => handlePriceRangeChange(index, 'max_quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Preço (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={range.price}
                        onChange={(e) => handlePriceRangeChange(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removePriceRange(index)}
                        className="w-full bg-red-500/10 text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/20 transition-colors duration-200 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Produto Ativo</span>
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
            </div>

            {/* Sizes */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tamanhos</h3>
              <div className="space-y-2">
                {availableSizes.map(size => (
                  <label key={size} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={(e) => handleArrayChange('sizes', size, e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-white">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cores</h3>
              <div className="space-y-2">
                {availableColors.map(color => (
                  <label key={color} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color)}
                      onChange={(e) => handleArrayChange('colors', color, e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-white">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            {formData.image_url && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
