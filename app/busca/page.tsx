'use client'

import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { Filter, Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  // Buscar todos os produtos ativos da API
  const { products: allProducts, loading: productsLoading } = useProducts({
    is_active: true
  })
  
  const [searchTerm, setSearchTerm] = useState(query)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [showFeatured, setShowFeatured] = useState(false)

  // Converter produtos da API para formato compatível
  const convertedProducts = allProducts.map(product => ({
    ...product,
    id: product.id,
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
    price: product.base_price || product.price || 0,
    wholesalePrice: product.base_price || product.price || 0,
    sizes: product.sizes || [],
    featured: product.is_featured || false,
    onSale: product.is_on_sale || false,
    category: product.category?.slug || '',
    subcategory: product.subcategory?.slug || '',
    description: product.description || '',
    priceRanges: [] // Adicionar priceRanges vazio para compatibilidade
  }))

  // Filtrar produtos baseado na busca
  const filteredProducts = convertedProducts.filter(product => {
    // Busca por texto
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Filtro de preço
    const matchesPrice = product.wholesalePrice >= priceRange.min && product.wholesalePrice <= priceRange.max
    
    // Filtro de destaque
    const matchesFeatured = !showFeatured || product.featured
    
    // Filtro de tamanhos
    const matchesSizes = selectedSizes.length === 0 || 
      (product.sizes && selectedSizes.some(size => product.sizes.includes(size)))
    
    return matchesSearch && matchesPrice && matchesFeatured && matchesSizes
  })

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.wholesalePrice - b.wholesalePrice
      case 'price-high':
        return b.wholesalePrice - a.wholesalePrice
      case 'name':
        return a.name.localeCompare(b.name)
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      default:
        return 0
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Atualizar a URL com o termo de busca
      const url = new URL(window.location.href)
      url.searchParams.set('q', searchTerm.trim())
      window.history.pushState({}, '', url.toString())
    }
  }

  // Atualizar o termo de busca quando a URL mudar
  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 1000 })
    setSelectedSizes([])
    setShowFeatured(false)
    setSortBy('recent')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Search className="text-primary-400" size={24} />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Resultados da Busca
              </h1>
              <p className="text-gray-400 mt-1">
                {filteredProducts.length} produto(s) encontrado(s)
                {searchTerm && ` para "${searchTerm}"`}
                {(priceRange.min > 0 || priceRange.max < 1000 || selectedSizes.length > 0 || showFeatured) && 
                  ' (com filtros aplicados)'
                }
              </p>
            </div>
          </div>

          {/* Barra de busca */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Filtros ativos */}
          {(priceRange.min > 0 || priceRange.max < 1000 || selectedSizes.length > 0 || showFeatured) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {priceRange.min > 0 && (
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Preço: R$ {priceRange.min}+
                  <button
                    onClick={() => setPriceRange(prev => ({ ...prev, min: 0 }))}
                    className="text-primary-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {priceRange.max < 1000 && (
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Preço: até R$ {priceRange.max}
                  <button
                    onClick={() => setPriceRange(prev => ({ ...prev, max: 1000 }))}
                    className="text-primary-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedSizes.map(size => (
                <span key={size} className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Tamanho: {size}
                  <button
                    onClick={() => setSelectedSizes(prev => prev.filter(s => s !== size))}
                    className="text-primary-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {showFeatured && (
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Apenas em Destaque
                  <button
                    onClick={() => setShowFeatured(false)}
                    className="text-primary-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Ordenação */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="recent">Mais recentes</option>
                    <option value="name">Nome A-Z</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                    <option value="featured">Em destaque</option>
                  </select>
                </div>

                {/* Faixa de preço */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Faixa de preço
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tamanhos */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Tamanhos
                  </label>
                  <div className="space-y-2">
                    {['P', 'M', 'G', 'GG'].map(size => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSizes(prev => [...prev, size])
                            } else {
                              setSelectedSizes(prev => prev.filter(s => s !== size))
                            }
                          }}
                          className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-white text-sm ml-2">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apenas em destaque */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-white text-sm ml-2">Apenas em Destaque</span>
                  </label>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? `Não encontramos produtos para "${searchTerm}"`
                    : 'Tente ajustar seus filtros'
                  }
                </p>
                
                {/* Sugestões de busca */}
                {searchTerm && (
                  <div className="max-w-md mx-auto">
                    <p className="text-gray-400 text-sm mb-3">Tente buscar por:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Flamengo', 'Brasil', 'NBA', 'Camisa', 'Short'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchTerm(suggestion)}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Botão para limpar filtros */}
                {(priceRange.min > 0 || priceRange.max < 1000 || selectedSizes.length > 0 || showFeatured) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-400 transition-colors duration-200"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando busca...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
