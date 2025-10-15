'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw, Star } from 'lucide-react'
import { sampleProducts, categories } from '@/lib/data'
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
    
    const priceRange = product.priceRanges.find(range => {
      if (range.max) {
        return quantity >= range.min && quantity <= range.max
      } else {
        return quantity >= range.min
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Início
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/categoria/${category?.slug}`} className="text-gray-500 hover:text-primary-600">
              {category?.name}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/categoria/${category?.slug}/${subcategory?.slug}`} className="text-gray-500 hover:text-primary-600">
              {subcategory?.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={`/categoria/${category?.slug}/${subcategory?.slug}`}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
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
                className="w-full h-96 lg:h-[500px] object-contain rounded-lg"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                  Destaque
                </span>
              )}
              {product.onSale && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Promoção
                </span>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-lg text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Prices */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-primary-600">
                  {getPriceRange()}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {product.priceRanges ? 'Preço por faixa de quantidade' : 'Preço de atacado'}
              </p>
              {product.priceRanges && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tabela de Preços:</h4>
                  <div className="space-y-1">
                    {product.priceRanges.map((range, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {range.min}{range.max ? `-${range.max}` : '+'} peças:
                        </span>
                        <span className="font-semibold">R$ {range.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Tamanhos Disponíveis
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
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

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quantidade
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Mínimo: 1 unidade
                </span>
              </div>
              {product.priceRanges && (
                <p className="text-sm text-primary-600 mt-2">
                  Preço atual: R$ {getCurrentPrice().toFixed(2)} por unidade
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Entre em Contato para Comprar
              </button>
              
              <div className="flex gap-4">
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                  <Heart size={18} />
                  Favoritar
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="text-primary-600" size={20} />
                <span className="text-sm text-gray-600"></span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-primary-600" size={20} />
                <span className="text-sm text-gray-600">Produto original com garantia</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="text-primary-600" size={20} />
                <span className="text-sm text-gray-600">Trocas e devoluções em até 30 dias</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Detalhes do Produto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Características:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Material de alta qualidade</li>
                  <li>• Tecnologia de secagem rápida</li>
                  <li>• Corte anatômico</li>
                  <li>• Lavagem à máquina</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Especificações:</h4>
                <ul className="space-y-1 text-gray-600">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
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
