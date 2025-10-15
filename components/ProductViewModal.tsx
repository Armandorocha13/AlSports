'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Heart, Share2, ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/data'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface ProductViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductViewModal({ product, isOpen, onClose }: ProductViewModalProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  if (!isOpen || !product) return null

  const getPriceRange = () => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return `R$ ${product.wholesalePrice.toFixed(2)}`
    }
    
    const minPrice = Math.min(...product.priceRanges.map(range => range.price))
    const maxPrice = Math.max(...product.priceRanges.map(range => range.price))
    
    if (minPrice === maxPrice) {
      return `R$ ${minPrice.toFixed(2)}`
    }
    
    return `R$ ${minPrice.toFixed(2)} - R$ ${maxPrice.toFixed(2)}`
  }

  const getCurrentPrice = () => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return product.wholesalePrice
    }
    
    const priceRange = product.priceRanges.find(range => {
      if (range.max) {
        return quantity >= range.min && quantity <= range.max
      } else {
        return quantity >= range.min
      }
    })
    
    return priceRange ? priceRange.price : product.wholesalePrice
  }

  const getTotalPrice = () => {
    return getCurrentPrice() * quantity
  }

  const getDiscountPercentage = () => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return 0
    }
    
    const originalPrice = product.price
    const currentPrice = getCurrentPrice()
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100
    return Math.round(discount)
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho')
      return
    }

    setIsAdding(true)

    // Simular delay de adição
    await new Promise(resolve => setTimeout(resolve, 500))

    // Adicionar ao carrinho
    addItem(product, selectedSize, quantity, selectedColor || undefined)

    setIsAdding(false)
    onClose()
    
    // Redirecionar para a página do carrinho
    router.push('/carrinho')
  }

  const getPriceRangeInfo = () => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return null
    }
    
    const currentRange = product.priceRanges.find(range => {
      if (range.max) {
        return quantity >= range.min && quantity <= range.max
      } else {
        return quantity >= range.min
      }
    })
    
    return currentRange
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes do Produto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Imagem do Produto */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-primary-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Destaque
                      </span>
                    )}
                    {product.onSale && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{getDiscountPercentage()}%
                      </span>
                    )}
                  </div>

                  {/* Botão de Favorito */}
                  <button className="absolute top-4 right-4 p-3 bg-white/80 rounded-full hover:bg-white transition-colors duration-200">
                    <Heart size={20} className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                {/* Galeria de Imagens (placeholder) */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>

              {/* Informações do Produto */}
              <div className="space-y-6">
                {/* Nome e Avaliação */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 text-yellow-400 fill-current">★</div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.8) • 127 avaliações</span>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Preços */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary-600">
                      {getPriceRange()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {product.priceRanges ? 'Preço por faixa de quantidade' : 'Preço de atacado'}
                  </p>
                  
                  {/* Informação da Faixa de Preço */}
                  {getPriceRangeInfo() && (
                    <div className="mt-2">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                        Faixa: {getPriceRangeInfo()!.min}{getPriceRangeInfo()!.max ? `-${getPriceRangeInfo()!.max}` : '+'} peças
                      </span>
                    </div>
                  )}
                </div>

                {/* Seleção de Tamanho */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tamanhos Disponíveis:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                            : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Tamanho {selectedSize} selecionado
                    </p>
                  )}
                </div>

                {/* Simulação de Preço */}
                {product.priceRanges && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Simulação de Preço:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Preço unitário:</span>
                        <span className="font-semibold text-primary-600">
                          R$ {getCurrentPrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <span className="font-semibold">{quantity}x</span>
                      </div>
                      <div className="flex justify-between border-t border-primary-200 pt-2">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-xl text-primary-600">
                          R$ {getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações Adicionais */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Informações do Produto:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Categoria:</span>
                      <span className="font-semibold capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subcategoria:</span>
                      <span className="font-semibold capitalize">{product.subcategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamanhos:</span>
                      <span className="font-semibold">{product.sizes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isAdding}
                    className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                  </button>
                  
                  <button className="w-full border-2 border-primary-600 text-primary-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-600 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2">
                    <Share2 size={20} />
                    Compartilhar Produto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
