'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Filter, Grid, List, X } from 'lucide-react'
import { categories, sampleProducts } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import { useState, useMemo, useEffect } from 'react'

interface SubcategoryPageProps {
  params: {
    slug: string
    subcategory: string
  }
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.slug)
  
  if (!category) {
    notFound()
  }

  const subcategory = category.subcategories.find(sub => sub.slug === params.subcategory)
  
  if (!subcategory) {
    notFound()
  }

  // Estados para controles
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [showFeatured, setShowFeatured] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState(8) // Quantidade inicial de produtos visíveis

  // Filtrar produtos da subcategoria (simulação)
  const products = sampleProducts.filter(product => 
    product.category === category.id && product.subcategory === subcategory.id
  )

  // Se não houver produtos específicos, mostrar alguns produtos da categoria
  const baseProducts = products.length > 0 ? products : sampleProducts.filter(product => 
    product.category === category.id
  ).slice(0, 8)

  // Aplicar filtros e ordenação
  const filteredProducts = useMemo(() => {
    let filtered = [...baseProducts]

    // Filtro por preço
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Filtro por tamanhos
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        selectedSizes.some(size => product.sizes.includes(size))
      )
    }

    // Filtro por produtos em destaque
    if (showFeatured) {
      filtered = filtered.filter(product => product.featured)
    }

    // Ordenação
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'recent':
        // Manter ordem original (mais recentes primeiro)
        break
      case 'popular':
        // Simular popularidade baseada em featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default:
        break
    }

    return filtered
  }, [baseProducts, priceRange, selectedSizes, showFeatured, sortBy])

  // Produtos visíveis (paginados)
  const displayProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProducts)
  }, [filteredProducts, visibleProducts])

  // Função para carregar mais produtos
  const handleLoadMore = () => {
    setVisibleProducts(prev => Math.min(prev + 8, filteredProducts.length))
  }

  // Verificar se há mais produtos para carregar
  const hasMoreProducts = visibleProducts < filteredProducts.length

  // Resetar paginação quando filtros mudarem
  useEffect(() => {
    setVisibleProducts(8)
  }, [priceRange, selectedSizes, showFeatured, sortBy])

  // Obter tamanhos únicos dos produtos
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>()
    baseProducts.forEach(product => {
      product.sizes.forEach(size => sizes.add(size))
    })
    return Array.from(sizes).sort()
  }, [baseProducts])

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-primary-400">
              Início
            </Link>
            <span className="text-gray-600">/</span>
            <Link href={`/categoria/${category.slug}`} className="text-gray-400 hover:text-primary-400">
              {category.name}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{subcategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Subcategory Header */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href={`/categoria/${category.slug}`}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {subcategory.name}
              </h1>
              <p className="text-lg text-gray-400 mt-2">
                {displayProducts.length} produtos encontrados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                  showFilters 
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                    : 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <Filter size={16} />
                Filtros
                {showFilters && <X size={16} />}
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 border rounded-lg transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Mais Recentes</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="popular">Mais Vendidos</option>
              </select>
            </div>
          </div>

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Filtro por Preço */}
                <div>
                  <h4 className="text-white font-medium mb-3">Faixa de Preço</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Filtro por Tamanhos */}
                <div>
                  <h4 className="text-white font-medium mb-3">Tamanhos</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev => 
                            prev.includes(size) 
                              ? prev.filter(s => s !== size)
                              : [...prev, size]
                          )
                        }}
                        className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                          selectedSizes.includes(size)
                            ? 'bg-primary-500 text-black'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro por Destaque */}
                <div>
                  <h4 className="text-white font-medium mb-3">Outros Filtros</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-white text-sm">Apenas em Destaque</span>
                  </label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 1000 })
                    setSelectedSizes([])
                    setShowFeatured(false)
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-primary-500 text-black rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Display */}
      <div className="container mx-auto px-4 py-12">
        {displayProducts.length > 0 ? (
          <>
            {/* Contador de resultados */}
            <div className="mb-6">
              <p className="text-gray-400">
                Mostrando {displayProducts.length} de {filteredProducts.length} produtos
                {(selectedSizes.length > 0 || showFeatured || priceRange.min > 0 || priceRange.max < 1000) && (
                  <span className="text-primary-400"> (filtrados)</span>
                )}
                {hasMoreProducts && (
                  <span className="text-gray-500"> • {filteredProducts.length - visibleProducts} restantes</span>
                )}
              </p>
            </div>

            {/* Grid ou Lista */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {displayProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreProducts && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  className="bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
                >
                  Carregar Mais Produtos
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  +{Math.min(8, filteredProducts.length - visibleProducts)} produtos
                </p>
              </div>
            )}

            {/* Todos os produtos carregados */}
            {!hasMoreProducts && filteredProducts.length > 8 && (
              <div className="text-center mt-12">
                <p className="text-gray-400">
                  ✅ Todos os {filteredProducts.length} produtos foram carregados
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Nenhum produto encontrado
            </h3>
            <p className="text-lg text-gray-400 mb-8">
              Não encontramos produtos nesta subcategoria no momento.
            </p>
            <Link 
              href={`/categoria/${category.slug}`}
              className="inline-flex items-center bg-primary-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2" size={16} />
              Voltar para {category.name}
            </Link>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Outras Subcategorias de {category.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {category.subcategories
              .filter(sub => sub.id !== subcategory.id)
              .map((relatedSub) => (
                <Link
                  key={relatedSub.id}
                  href={`/categoria/${category.slug}/${relatedSub.slug}`}
                  className="text-gray-300 hover:text-primary-400 font-medium text-sm transition-colors duration-200 px-3 py-2 hover:bg-gray-800 rounded-lg"
                >
                  {relatedSub.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
