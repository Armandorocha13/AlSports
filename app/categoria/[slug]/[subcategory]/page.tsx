'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Filter, Grid, List } from 'lucide-react'
import { categories, sampleProducts } from '@/lib/data'
import ProductCard from '@/components/ProductCard'

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

  // Filtrar produtos da subcategoria (simulação)
  const products = sampleProducts.filter(product => 
    product.category === category.id && product.subcategory === subcategory.id
  )

  // Se não houver produtos específicos, mostrar alguns produtos da categoria
  const displayProducts = products.length > 0 ? products : sampleProducts.filter(product => 
    product.category === category.id
  ).slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Início
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/categoria/${category.slug}`} className="text-gray-500 hover:text-primary-600">
              {category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{subcategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Subcategory Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href={`/categoria/${category.slug}`}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {subcategory.name}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {displayProducts.length} produtos encontrados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Filter size={16} />
                Filtros
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Grid size={16} />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <List size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Ordenar por</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Mais Recentes</option>
                <option>Mais Vendidos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {displayProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
                Carregar Mais Produtos
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum produto encontrado
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Não encontramos produtos nesta subcategoria no momento.
            </p>
            <Link 
              href={`/categoria/${category.slug}`}
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2" size={16} />
              Voltar para {category.name}
            </Link>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Outras Subcategorias de {category.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {category.subcategories
              .filter(sub => sub.id !== subcategory.id)
              .slice(0, 6)
              .map((relatedSub) => (
                <Link
                  key={relatedSub.id}
                  href={`/categoria/${category.slug}/${relatedSub.slug}`}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary-600 font-bold">
                      {relatedSub.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {relatedSub.name}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
