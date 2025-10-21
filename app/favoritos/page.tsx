'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Heart, 
  ArrowLeft, 
  ShoppingCart, 
  Eye, 
  Trash2,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useCart } from '@/contexts/CartContext'
import ProductViewModal from '@/components/ProductViewModal'

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addItem } = useCart()
  
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtrar favoritos baseado na busca
  const filteredFavorites = favorites.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddToCart = (product: any) => {
    // Adicionar ao carrinho com tamanho e cor padrão
    addItem(product, 'M', 1)
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Mobile Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Favoritos</span>
            </button>
            <div className="text-sm text-gray-400">0 itens</div>
          </div>
        </div>

        <div className="bg-gray-800 p-12 text-center">
          <Heart size={64} className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">Nenhum favorito ainda</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Adicione produtos aos seus favoritos clicando no ícone de coração ❤️
          </p>
          
          
          <Link
            href="/"
            className="bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Favoritos</span>
          </button>
          <div className="text-sm text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-4">
        <div className="flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar nos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end">
            <button
              onClick={clearFavorites}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <Trash2 size={16} className="mr-1" />
              <span className="text-sm">Limpar tudo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="p-4">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-400">Tente ajustar sua busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFavorites.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.featured && (
                      <span className="bg-primary-500 text-black text-xs px-2 py-1 rounded-full">
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Remove from Favorites */}
                  <button
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    onClick={() => removeFromFavorites(product.id)}
                  >
                    <Heart size={16} className="text-white fill-white" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-white text-sm leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-primary-400 font-semibold">
                      R$ {product.wholesalePrice.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {product.category}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      <Eye size={14} className="mr-1" />
                      <span className="text-xs">Ver</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center py-2 px-3 bg-primary-500 text-black rounded-lg hover:bg-primary-400 transition-colors duration-200"
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      <span className="text-xs">Carrinho</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}
