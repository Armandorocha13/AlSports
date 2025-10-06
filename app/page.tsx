'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { sampleProducts, categories } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'

export default function HomePage() {
  const featuredProducts = sampleProducts.filter(product => product.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AL Sports
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-400">
              Loja de Atacado de Roupas Esportivas
            </p>
            <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
              Especializada na venda por atacado de roupas esportivas. 
              Encontre as melhores marcas com preços competitivos para revendedores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/categoria/futebol" 
                className="bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
              >
                Ver Futebol
              </Link>
              <Link 
                href="/categoria/roupas-treino" 
                className="border-2 border-primary-500 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-500 hover:text-black transition-colors duration-200"
              >
                Roupas de Treino
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Frete Grátis</h3>
              <p className="text-gray-400">Para pedidos acima de R$ 500,00</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Garantia</h3>
              <p className="text-gray-400">Produtos originais com garantia</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Trocas</h3>
              <p className="text-gray-400">Política de trocas facilitada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nossas Categorias
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore nossa ampla variedade de produtos esportivos organizados por categoria
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Os produtos mais procurados pelos nossos clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/produtos" 
              className="inline-flex items-center bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🎉 Promoção Especial
          </h2>
          <p className="text-xl mb-6 text-primary-400">
            Até 50% de desconto em produtos selecionados
          </p>
          <p className="text-lg mb-8 text-gray-300">
            Aproveite nossa promoção de fim de temporada e garante os melhores preços
          </p>
          <Link 
            href="/categoria/futebol?promocao=true" 
            className="inline-flex items-center bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
          >
            Ver Promoções
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Fique por Dentro das Novidades
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Receba ofertas exclusivas e seja o primeiro a saber sobre novos produtos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
              />
              <button className="bg-primary-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
