'use client'

// Importações necessárias para a página inicial
import BannerCarousel from '@/components/BannerCarousel'
import BottomBannerCarousel from '@/components/BottomBannerCarousel'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import { categoriesService } from '@/lib/services/categories-service'
import { productsService } from '@/lib/services/products-service'
import { Category, Product } from '@/lib/types'
import { RotateCcw, Shield, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Componente da página inicial da aplicação
export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar dados do Strapi
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [categoriesData, productsData] = await Promise.all([
          categoriesService.getAllCategories(),
          productsService.getFeaturedProductsLimited()
        ])
        setCategories(categoriesData)
        setFeaturedProducts(productsData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Em caso de erro, manter arrays vazios para não quebrar a UI
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Função para rolar para a esquerda
  const scrollLeft = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth
      carouselRef.current.scrollBy({
        left: -containerWidth,
        behavior: 'smooth'
      })
    }
  }

  // Função para rolar para a direita
  const scrollRight = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth
      carouselRef.current.scrollBy({
        left: containerWidth,
        behavior: 'smooth'
      })
    }
  }

  // Função para rolar automaticamente
  const autoScroll = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth
      const scrollLeft = carouselRef.current.scrollLeft
      const scrollWidth = carouselRef.current.scrollWidth
      
      // Se chegou ao final, volta para o início
      if (scrollLeft + containerWidth >= scrollWidth - 10) {
        carouselRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      } else {
        carouselRef.current.scrollBy({
          left: containerWidth,
          behavior: 'smooth'
        })
      }
    }
  }

  // useEffect para rolagem automática
  useEffect(() => {
    if (!isAutoScroll) return

    const interval = setInterval(autoScroll, 3000) // 3 segundos

    return () => clearInterval(interval)
  }, [isAutoScroll])

  // Pausar rolagem automática ao interagir
  const handleMouseEnter = () => setIsAutoScroll(false)
  const handleMouseLeave = () => setIsAutoScroll(true)

  return (
    <div className="min-h-screen dark-theme">
      {/* Carrossel de Banners */}
      <BannerCarousel />



        {/* Seção de características da empresa */}
        <section className="hidden md:block py-16 bg-black">
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
                <p className="text-gray-400">Produtos com garantia</p>
              </div>
              {/* Card de trocas */}
              <div className="text-center">
                <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="text-black" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Trocas</h3>
                <p className="text-gray-400">Trocas facilitadas</p>
              </div>
            </div>
          </div>
        </section>

      {/* Seção de categorias de produtos */}
      <section className="py-16 bg-black">
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando categorias...</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.filter(category => category.slug !== 'tabela-medidas').map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
              
              {/* Carrossel horizontal para mobile */}
              <div className="md:hidden">
                <div 
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Seta esquerda */}
                  <button 
                    onClick={scrollLeft}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                    aria-label="Categoria anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                  </button>
                  
                  {/* Seta direita */}
                  <button 
                    onClick={scrollRight}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                    aria-label="Próxima categoria"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                  
                  {/* Container do carrossel */}
                  <div ref={carouselRef} className="flex overflow-x-auto gap-0 pb-4 scrollbar-hide snap-x snap-mandatory">
                    {categories.filter(category => category.slug !== 'tabela-medidas').map((category, index) => (
                      <div key={category.id} className="flex-shrink-0 w-full snap-center px-4">
                        <CategoryCard category={category} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando produtos...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum produto em destaque no momento.</p>
            </div>
          )}
        </div>
      </section>

        {/* Banner promocional */}
        <BottomBannerCarousel />

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
