'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/lib/data'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    // Usar o primeiro tamanho disponível como padrão
    const defaultSize = product.sizes[0] || 'M'
    addItem(product, defaultSize)
  }

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <Link href={`/produto/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-primary-500 text-black text-xs px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
          {product.onSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Promoção
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2 bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700">
          <Heart size={16} className="text-gray-300" />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-semibold text-white mb-2 line-clamp-2 hover:text-primary-400 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sizes.slice(0, 4).map((size) => (
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
              R$ {product.wholesalePrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-400">Preço de atacado</p>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-primary-500 text-black py-2 px-4 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  )
}
