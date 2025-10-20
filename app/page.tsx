'use client'

// Importações necessárias para a página inicial
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { sampleProducts, categories, getFeaturedProductsLimited } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import AdminBanner from '@/components/AdminBanner'
import BannerCarousel from '@/components/BannerCarousel'

// Componente da página inicial da aplicação
export default function HomePage() {
  // Filtra produtos em destaque limitados a 2 por subcategoria
  const featuredProducts = getFeaturedProductsLimited()

  return (
    <div className="min-h-screen dark-theme">
      {/* Carrossel de Banners */}
      <BannerCarousel />

      {/* Banner administrativo - Exibe informações para administradores */}
      <div className="container mx-auto px-4">
        <AdminBanner />
      </div>

        {/* Seção de características da empresa */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card de entrega rápida */}
              <div className="text-center">
                <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="text-black" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Entrega Rápida</h3>
                <p className="text-gray-400">Tenha seu pedido nas suas mãos no menor prazo possível</p>
              </div>
              {/* Card de garantia */}
              <div className="text-center">
                <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-black" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Garantia</h3>
                <p className="text-gray-400">Produtos originais com garantia</p>
              </div>
              {/* Card de trocas */}
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

      {/* Seção de categorias de produtos */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Cabeçalho da seção de categorias */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nossas Categorias
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore nossa ampla variedade de produtos esportivos organizados por categoria
            </p>
          </div>
          
          {/* Grid de cards das categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de produtos em destaque */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          {/* Cabeçalho da seção de produtos em destaque */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Os produtos mais procurados pelos nossos clientes
            </p>
          </div>
          
          {/* Grid de cards dos produtos em destaque */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

        {/* Banner promocional */}
        <section className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden bg-black">
          <Image
            src="/images/Banners/Banner4.jpg"
            alt="Banner Promocional"
            fill
            className="object-cover"
            priority
          />
        </section>

      {/* Seção de newsletter */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Título da seção de newsletter */}
            <h2 className="text-3xl font-bold text-white mb-4">
              Fique por Dentro das Novidades
            </h2>
            {/* Descrição da newsletter */}
            <p className="text-lg text-gray-400 mb-8">
              Receba ofertas exclusivas e seja o primeiro a saber sobre novos produtos
            </p>
            {/* Formulário de inscrição na newsletter */}
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
