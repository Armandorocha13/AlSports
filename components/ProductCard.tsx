'use client'

import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Product } from '@/lib/types'
import { Eye, Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import ProductViewModal from './ProductViewModal'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleViewProduct = () => {
    setIsModalOpen(true)
  }

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.wholesalePrice,
      image: product.image,
      description: product.description,
      size: product.sizes[0] // Tamanho padrão
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(product)
  }

  const getPriceRange = () => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return `R$ ${product.wholesalePrice.toFixed(2)}`
    }
    
    const minPrice = Math.min(...product.priceRanges.map((range: any) => range.price))
    const maxPrice = Math.max(...product.priceRanges.map((range: any) => range.price))
    
    if (minPrice === maxPrice) {
      return `R$ ${minPrice.toFixed(2)}`
    }
    
    return `R$ ${minPrice.toFixed(2)} - R$ ${maxPrice.toFixed(2)}`
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className="card group cursor-pointer" onClick={handleCardClick}>
          <div className="flex gap-4 p-4">
            {/* Imagem */}
            <div className="relative flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={120}
                height={120}
                className="w-30 h-30 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-1 left-1 flex flex-col gap-1">
                {product.featured && (
                  <span className="bg-primary-500 text-black text-xs px-1 py-0.5 rounded-full">
                    Destaque
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button 
                className={`absolute top-1 right-1 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isFavorite(product.id) 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={handleToggleFavorite}
              >
                <Heart size={12} className={isFavorite(product.id) ? 'text-white' : 'text-gray-300'} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-1 line-clamp-1 hover:text-primary-400 transition-colors duration-200">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {product.description}
              </p>

              {/* Sizes */}
              <div className="flex flex-wrap gap-1 mb-2">
                {product.sizes.slice(0, 6).map((size: string) => (
                  <span key={size} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    {size}
                  </span>
                ))}
                {product.sizes.length > 6 && (
                  <span className="text-xs text-gray-500">+{product.sizes.length - 6}</span>
                )}
              </div>

              {/* Prices */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary-400">
                      {getPriceRange()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {product.priceRanges ? 'Preço por faixa de quantidade' : 'Preço de atacado'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddToCart}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-1"
                  >
                    <ShoppingCart size={14} />
                    Adicionar
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewProduct()
                    }}
                    className="bg-primary-500 text-black py-2 px-3 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center gap-1"
                  >
                    <Eye size={14} />
                    Ver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="card group cursor-pointer" onClick={handleCardClick}>
        <div className="relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <span className="bg-primary-500 text-black text-xs px-2 py-1 rounded-full">
                Destaque
              </span>
            )}
            {product.featured && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Promoção
              </span>
            )}
          </div>

        </div>

        <div className="p-3">
          <h3 className="font-semibold text-white mb-2 line-clamp-2 hover:text-primary-400 transition-colors duration-200">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* Sizes */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.sizes.slice(0, 4).map((size: string) => (
              <span key={size} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
            )}
          </div>

            {/* Prices */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-400">
                  {getPriceRange()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {product.priceRanges ? 'Preço por faixa de quantidade' : 'Preço de atacado'}
              </p>
            </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <ShoppingCart size={14} />
              Adicionar
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleViewProduct()
              }}
              className="flex-1 bg-primary-500 text-black py-2 px-3 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <Eye size={14} />
              Ver
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Visualização do Produto */}
      <ProductViewModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}