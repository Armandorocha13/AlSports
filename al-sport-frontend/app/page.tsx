import BannerCarousel from '@/components/BannerCarousel'
import BottomBannerCarousel from '@/components/BottomBannerCarousel'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import CategoriesCarouselClient from '@/components/CategoriesCarouselClient'
import { getCategorias, getProdutos, getSubcategorias, getBanners } from '@/lib/api'
import { transformStrapiCategoriasToCategories, transformStrapiProdutosToProducts, transformStrapiBannerToAppBanner } from '@/lib/utils/strapi-to-app-types'
import { Category, Product } from '@/lib/types'
import { RotateCcw, Shield, Truck } from 'lucide-react'

// Componente da página inicial da aplicação (Server Component)
export default async function HomePage() {
  // Buscar dados do Strapi
  const [strapiCategorias, strapiProdutos, strapiSubcategorias, strapiBanners] = await Promise.all([
    getCategorias({ revalidate: 60 }),
    getProdutos({ revalidate: 60 }),
    getSubcategorias({ revalidate: 60 }),
    getBanners({ revalidate: 60 })
  ])

  // Transformar dados do Strapi para o formato da aplicação
  const categories = await transformStrapiCategoriasToCategories(strapiCategorias, strapiSubcategorias)
  const allProducts = transformStrapiProdutosToProducts(strapiProdutos)
  
  // Debug: log de todos os produtos e seus status de destaque
  console.log('📦 Total de produtos recebidos:', allProducts.length)
  console.log('📦 Produtos e seus status de destaque:', allProducts.map(p => ({
    id: p.id,
    nome: p.name,
    featured: p.featured,
    featuredType: typeof p.featured
  })))
  
  // Filtrar produtos em destaque (apenas produtos com featured: true, limitar a 8 produtos)
  // IMPORTANTE: Verificar tanto true booleano quanto string 'true'
  const featuredProducts = allProducts
    .filter(product => {
      const isFeatured = product.featured === true || product.featured === 'true' || product.featured === 1
      if (isFeatured) {
        console.log('✅ Produto filtrado como destaque:', product.name, product.id, 'featured:', product.featured)
      } else {
        console.log('❌ Produto NÃO está em destaque:', product.name, product.id, 'featured:', product.featured, 'tipo:', typeof product.featured)
      }
      return isFeatured
    })
    .slice(0, 8)
  
  console.log('⭐ Total de produtos em destaque encontrados:', featuredProducts.length)
  console.log('⭐ IDs dos produtos em destaque:', featuredProducts.map(p => p.id))
  
  // Se não encontrou nenhum, mostrar todos os produtos para debug
  if (featuredProducts.length === 0) {
    console.warn('⚠️ NENHUM PRODUTO EM DESTAQUE ENCONTRADO!')
    console.warn('⚠️ Todos os produtos recebidos:', allProducts.map(p => ({
      id: p.id,
      nome: p.name,
      featured: p.featured,
      featuredType: typeof p.featured
    })))
  }

  // Filtrar categorias (excluir tabela-medidas)
  const displayCategories = categories.filter(category => category.slug !== 'tabela-medidas')

  // Filtrar banners por local - usar os dados originais do Strapi para filtrar
  const topBanners = strapiBanners
    .filter(banner => {
      const isTopoHome = banner.attributes?.Local === 'Topo-Home'
      const isPublished = banner.publishedAt !== null
      if (process.env.NODE_ENV === 'development') {
        console.log('Filtro Topo-Home - Banner:', {
          id: banner.documentId || banner.id,
          local: banner.attributes?.Local,
          publishedAt: banner.publishedAt,
          isTopoHome,
          isPublished,
          passa: isTopoHome && isPublished
        })
      }
      return isTopoHome && isPublished
    })
    .map(transformStrapiBannerToAppBanner)
    .filter(banner => {
      const hasImage = banner.image !== '/images/placeholder.jpg'
      if (process.env.NODE_ENV === 'development' && !hasImage) {
        console.warn('Banner filtrado por falta de imagem:', banner.id)
      }
      return hasImage
    })

  const bottomBanners = strapiBanners
    .filter(banner => {
      const local = banner.attributes?.Local
      const isRodapeOrPromocional = local === 'Rodape' || local === 'Promocional'
      const isPublished = banner.publishedAt !== null
      return isRodapeOrPromocional && isPublished
    })
    .map(transformStrapiBannerToAppBanner)
    .filter(banner => banner.image !== '/images/placeholder.jpg')

  // Debug: log dos banners finais
  if (process.env.NODE_ENV === 'development') {
    console.log('HomePage - Banners finais:', {
      totalStrapiBanners: strapiBanners.length,
      topBanners: topBanners.length,
      bottomBanners: bottomBanners.length,
      topBannersIds: topBanners.map(b => b.id),
      bottomBannersIds: bottomBanners.map(b => b.id)
    })
  }

  return (
    <div className="min-h-screen dark-theme">
      {/* Carrossel de Banners */}
      <BannerCarousel banners={topBanners} />

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
          
          {/* Grid de cards das categorias (desktop) */}
          {displayCategories.length > 0 ? (
            <>
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
              
              {/* Carrossel horizontal para mobile */}
              <div className="md:hidden">
                <CategoriesCarouselClient categories={displayCategories} />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhuma categoria disponível no momento.</p>
            </div>
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
          {featuredProducts.length > 0 ? (
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
      {bottomBanners.length > 0 && <BottomBannerCarousel banners={bottomBanners} />}

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
