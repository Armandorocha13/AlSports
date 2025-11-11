'use client'

import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Product } from '@/lib/types'
import { Heart, Share2, ShoppingCart, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductViewModal({ product, isOpen, onClose }: ProductViewModalProps) {
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

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
    
    // Ordenar as faixas por min (maior para menor) para priorizar faixas mais específicas
    const sortedRanges = [...product.priceRanges].sort((a, b) => b.min - a.min)
    
    const priceRange = sortedRanges.find(range => {
      return quantity >= range.min
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

    try {
      // Adicionar item ao carrinho
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: getCurrentPrice(),
          image: product.image,
          description: product.description,
          size: selectedSize,
          color: selectedColor
        })
      }
      
      // Feedback visual
      alert(`${quantity}x ${product.name} adicionado(s) ao carrinho!`)
      onClose()
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho')
    } finally {
      setIsAdding(false)
    }
  }

  const getPriceRangeInfo = () => {
    if (!product.priceRanges || product.priceRanges.length === 0) {
      return null
    }
    
    const currentRange = product.priceRanges.find(range => {
      return quantity >= range.min
    })
    
    return currentRange
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-black border-2 border-yellow-400 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-400">
            <h2 className="text-2xl font-bold text-white">Detalhes do Produto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-yellow-400 hover:text-black rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Imagem do Produto */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-800">
                  {product.image && product.image !== '/images/placeholder.jpg' ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem do produto:', product.image)
                        console.error('Erro:', e)
                        // Trocar para placeholder em caso de erro
                        const target = e.target as HTMLImageElement
                        target.src = '/images/placeholder.jpg'
                      }}
                      unoptimized={product.image.startsWith('http://localhost:1337')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                      <span>Imagem não disponível</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Destaque
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{getDiscountPercentage()}%
                      </span>
                    )}
                  </div>

                  {/* Botão de Favorito */}
                  <button 
                    className={`absolute top-4 right-4 p-3 rounded-full transition-colors duration-200 ${
                      isFavorite(product.id) 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-black/80 hover:bg-yellow-400'
                    } ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
                    onClick={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (isTogglingFavorite) return
                      
                      setIsTogglingFavorite(true)
                      try {
                        await toggleFavorite(product)
                      } catch (error) {
                        console.error('Erro ao alternar favorito:', error)
                        alert('Erro ao adicionar aos favoritos. Tente novamente.')
                      } finally {
                        setIsTogglingFavorite(false)
                      }
                    }}
                    disabled={isTogglingFavorite}
                    title={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Heart 
                      size={20} 
                      fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                      className={`${
                        isFavorite(product.id) 
                          ? 'text-white' 
                          : 'text-white hover:text-black'
                      }`} 
                    />
                  </button>
                </div>

              </div>

              {/* Informações do Produto */}
              <div className="space-y-6">
                {/* Nome e Avaliação */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-bold text-white flex-1">
                      {product.name}
                    </h1>
                    {/* Botão de Favorito */}
                    <button 
                      className={`ml-4 p-3 rounded-full transition-all duration-200 ${
                        isFavorite(product.id) 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600'
                      } ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (isTogglingFavorite) return
                        
                        setIsTogglingFavorite(true)
                        try {
                          await toggleFavorite(product)
                        } catch (error) {
                          console.error('Erro ao alternar favorito:', error)
                          alert('Erro ao adicionar aos favoritos. Tente novamente.')
                        } finally {
                          setIsTogglingFavorite(false)
                        }
                      }}
                      disabled={isTogglingFavorite}
                      title={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Heart 
                        size={24} 
                        fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                        className={`${
                          isFavorite(product.id) 
                            ? 'text-white' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 text-yellow-400 fill-current">★</div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">(4.8) • 127 avaliações</span>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Preços */}
                <div className="bg-gray-900 border border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-yellow-400">
                      {getPriceRange()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {product.priceRanges ? 'Preço por faixa de quantidade' : 'Preço de atacado'}
                  </p>
                  
                  {/* Informação da Faixa de Preço */}
                  {getPriceRangeInfo() && (
                    <div className="mt-2">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Faixa: {getPriceRangeInfo()!.min}+ peças
                      </span>
                    </div>
                  )}

                  {/* Tabela de Faixas de Preço */}
                  {product.priceRanges && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Faixas de Preço:</h4>
                      <div className="space-y-1">
                        {product.priceRanges.map((range, index) => (
                          <div key={index} className={`flex justify-between text-sm p-2 rounded ${
                            getPriceRangeInfo()?.min === range.min
                              ? 'bg-yellow-400 text-black font-semibold'
                              : 'bg-gray-800 text-white'
                          }`}>
                            <span>
                              {range.min}+ camisas
                            </span>
                            <span className="font-semibold">
                              R$ {range.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seleção de Tamanho */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tamanhos Disponíveis:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-yellow-400 bg-yellow-400 text-black shadow-md'
                            : 'border-gray-600 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className="text-sm text-yellow-400 mt-2">
                      ✓ Tamanho {selectedSize} selecionado
                    </p>
                  )}
                </div>

                {/* Seletor de Quantidade */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Quantidade:</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-yellow-400 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                        disabled={quantity <= 1}
                      >
                        <span className="text-xl font-bold text-white">-</span>
                      </button>
                      <div className="px-6 py-2 min-w-[60px] text-center">
                        <span className="text-xl font-bold text-white">{quantity}</span>
                      </div>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                      >
                        <span className="text-xl font-bold text-white">+</span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-300">
                      {quantity === 1 && '1 camisa'}
                      {quantity >= 2 && quantity <= 4 && `${quantity} camisas (desconto aplicado!)`}
                      {quantity >= 5 && `${quantity} camisas (máximo desconto!)`}
                    </div>
                  </div>
                </div>

                {/* Simulação de Preço */}
                {product.priceRanges && (
                  <div className="bg-gray-900 border border-yellow-400 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Simulação de Preço:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Preço unitário:</span>
                        <span className="font-semibold text-yellow-400">
                          R$ {getCurrentPrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Quantidade:</span>
                        <span className="font-semibold text-white">{quantity}x</span>
                      </div>
                      {getDiscountPercentage() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Desconto:</span>
                          <span className="font-semibold text-green-400">
                            -{getDiscountPercentage()}%
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-yellow-400 pt-2">
                        <span className="font-semibold text-white">Total:</span>
                        <span className="font-bold text-xl text-yellow-400">
                          R$ {getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações Adicionais */}
                <div className="bg-gray-900 border border-yellow-400 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Informações do Produto:</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Categoria:</span>
                      <span className="font-semibold capitalize text-white">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subcategoria:</span>
                      <span className="font-semibold capitalize text-white">{product.subcategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamanhos:</span>
                      <span className="font-semibold text-white">{product.sizes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isAdding}
                    className="w-full bg-yellow-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                  </button>
                  
                  <button className="w-full border-2 border-yellow-400 text-yellow-400 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2">
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
