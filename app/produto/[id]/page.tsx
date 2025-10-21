'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw, Star } from 'lucide-react'
import { sampleProducts, categories } from '@/lib/data'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ProductCard'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = sampleProducts.find(p => p.id === params.id)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  
  if (!product) {
    notFound()
  }

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

  const category = categories.find(cat => cat.id === product.category)
  const subcategory = category?.subcategories.find(sub => sub.id === product.subcategory)

  // Produtos relacionados (simulação)
  const relatedProducts = sampleProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-black border-b border-yellow-400">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-300 hover:text-yellow-400">
              Início
            </Link>
            <span className="text-gray-500">/</span>
            <Link href={`/categoria/${category?.slug}`} className="text-gray-300 hover:text-yellow-400">
              {category?.name}
            </Link>
            <span className="text-gray-500">/</span>
            <Link href={`/categoria/${category?.slug}/${subcategory?.slug}`} className="text-gray-300 hover:text-yellow-400">
              {subcategory?.name}
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={`/categoria/${category?.slug}/${subcategory?.slug}`}
            className="p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {product.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[600px] object-cover rounded-lg"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-black text-sm px-3 py-1 rounded-full">
                  Destaque
                </span>
              )}
              {product.featured && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Promoção
                </span>
              )}
            </div>
            
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {product.name}
              </h2>
              <p className="text-lg text-gray-300">
                {product.description}
              </p>
            </div>

            {/* Prices */}
            <div className="bg-gray-900 border border-yellow-400 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-yellow-400">
                  {getPriceRange()}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {product.priceRanges ? 'Preço por faixa de quantidade' : 'Preço de atacado'}
              </p>
              {product.priceRanges && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Tabela de Preços:</h4>
                  <div className="space-y-1">
                    {product.priceRanges.map((range, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-300">
                        <span>
                          {range.min}+ peças:
                        </span>
                        <span className="font-semibold text-white">R$ {range.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Tamanhos Disponíveis
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-yellow-400 bg-yellow-400 text-black'
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

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Quantidade
              </h3>
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
              {product.priceRanges && (
                <div className="mt-2">
                  <p className="text-sm text-yellow-400">
                    Preço atual: R$ {getCurrentPrice().toFixed(2)} por unidade
                  </p>
                  <p className="text-sm text-gray-300">
                    Total: R$ {(getCurrentPrice() * quantity).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                className="w-full bg-yellow-400 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Entre em Contato para Comprar
              </button>
              
              <div className="flex gap-4">
                <button className="flex-1 border border-yellow-400 text-yellow-400 py-3 px-6 rounded-lg font-medium hover:bg-yellow-400 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2">
                  <Heart size={18} />
                  Favoritar
                </button>
                <button className="flex-1 border border-yellow-400 text-yellow-400 py-3 px-6 rounded-lg font-medium hover:bg-yellow-400 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="text-yellow-400" size={20} />
                <span className="text-sm text-gray-300">Frete grátis para pedidos acima de R$ 200</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-yellow-400" size={20} />
                <span className="text-sm text-gray-300">Produto original com garantia</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="text-yellow-400" size={20} />
                <span className="text-sm text-gray-300">Trocas e devoluções em até 30 dias</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <div className="bg-gray-900 border border-yellow-400 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Detalhes do Produto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-2">Características:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Material de alta qualidade</li>
                  <li>• Tecnologia de secagem rápida</li>
                  <li>• Corte anatômico</li>
                  <li>• Lavagem à máquina</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Especificações:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Composição: 100% Poliéster</li>
                  <li>• Origem: Importado</li>
                  <li>• Peso: 150g</li>
                  <li>• Cuidados: Lavar à mão</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">
              Produtos Relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
