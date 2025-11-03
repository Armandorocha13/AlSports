'use client'

import ProductCard from '@/components/ProductCard'
import { getProductByIdOrSlug, getProducts } from '@/lib/product-service'
import { ArrowLeft, Heart, RotateCcw, Share2, Shield, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProductByIdOrSlug(params.id)
        
        if (!productData) {
          notFound()
          return
        }

        // Adicionar compatibilidade com interface antiga
        const productWithCompatibility = {
          ...productData,
          id: productData.id,
          name: productData.name,
          description: productData.description || '',
          image: productData.images && productData.images.length > 0 
            ? productData.images.find((img: any) => img.is_primary)?.image_url || productData.images[0]?.image_url || '/placeholder-product.jpg'
            : '/placeholder-product.jpg',
          images: productData.images?.map((img: any) => img.image_url) || [],
          price: productData.base_price,
          wholesalePrice: productData.base_price,
          sizes: productData.sizes || [],
          featured: productData.is_featured || false,
          onSale: productData.is_on_sale || false,
          category: productData.category?.slug || '',
          subcategory: productData.subcategory?.slug || '',
          stock_quantity: productData.stock_quantity || 0
        }

        setProduct(productWithCompatibility)

        // Buscar produtos relacionados
        if (productData.category_id) {
          const related = await getProducts({
            category: productData.category_id,
            limit: 4
          })
          
          const relatedWithCompatibility = related
            .filter(p => p.id !== productData.id)
            .slice(0, 4)
            .map(p => ({
              ...p,
              id: p.id,
              image: p.images && p.images.length > 0 
                ? p.images.find((img: any) => img.is_primary)?.image_url || p.images[0]?.image_url || '/placeholder-product.jpg'
                : '/placeholder-product.jpg',
              price: p.base_price,
              wholesalePrice: p.base_price,
              sizes: p.sizes || [],
              featured: p.is_featured || false
            }))
          
          setRelatedProducts(relatedWithCompatibility)
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando produto...</div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const getPriceRange = () => {
    return `R$ ${product.price.toFixed(2)}`
  }

  const getCurrentPrice = () => {
    return product.price
  }

  const category = product.category ? { slug: product.category } : null
  const subcategory = product.subcategory ? { slug: product.subcategory } : null

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
            {category && (
              <>
                <Link href={`/categoria/${category.slug}`} className="text-gray-300 hover:text-yellow-400">
                  {category.slug}
                </Link>
                <span className="text-gray-500">/</span>
              </>
            )}
            {subcategory && (
              <>
                <Link href={`/categoria/${category?.slug}/${subcategory.slug}`} className="text-gray-300 hover:text-yellow-400">
                  {subcategory.slug}
                </Link>
                <span className="text-gray-500">/</span>
              </>
            )}
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={category && subcategory ? `/categoria/${category.slug}/${subcategory.slug}` : category ? `/categoria/${category.slug}` : '/'}
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
                src={product.image || '/placeholder-product.jpg'}
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
              {product.onSale && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Promoção
                </span>
              )}
            </div>

            {/* Galeria de imagens adicionais */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img: string, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-yellow-400/30 hover:border-yellow-400 cursor-pointer">
                    <Image
                      src={img}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
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
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Preço unitário
              </p>
              <p className="text-sm text-gray-300">
                Estoque disponível: {product.stock_quantity} unidades
              </p>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Tamanhos Disponíveis
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size: string) => (
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
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Nenhum tamanho disponível</p>
                )}
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
                  {quantity === 1 ? '1 unidade' : `${quantity} unidades`}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-yellow-400">
                  Preço: R$ {getCurrentPrice().toFixed(2)} por unidade
                </p>
                <p className="text-sm text-gray-300">
                  Total: R$ {(getCurrentPrice() * quantity).toFixed(2)}
                </p>
              </div>
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
