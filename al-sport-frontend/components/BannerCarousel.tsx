'use client'

// Importações necessárias para o componente
import { useState, useEffect } from 'react' // Hooks do React para estado e efeitos
import Image from 'next/image' // Componente otimizado de imagem do Next.js
import { ChevronLeft, ChevronRight } from 'lucide-react' // Ícones de navegação
import { AppBanner } from '@/lib/utils/strapi-to-app-types' // Tipo do banner

// Interface que define as props do componente
interface BannerCarouselProps {
  banners?: AppBanner[] // Array de banners (opcional, com fallback)
}

// Array padrão com os dados dos banners (fallback caso não receba banners)
const defaultBanners: AppBanner[] = [
  {
    id: '1',
    image: '/images/Banners/Banner11.jpg',
    title: 'Loja de Atacado de Roupas Esportivas',
    description: 'Especializada na venda por atacado de roupas esportivas. Encontre as melhores marcas com preços competitivos para revendedores.',
    buttonText: 'Ver Futebol',
    buttonLink: '/categoria/futebol'
  },
  {
    id: '2',
    image: '/images/Banners/Banner22.jpg',
    title: 'Roupas de Treino Premium',
    description: 'Conjuntos completos para treino com qualidade superior. Ideal para academias e atletas profissionais.',
    buttonText: 'Roupas de Treino',
    buttonLink: '/categoria/roupas-treino'
  }
]

// Componente principal do carrossel de banners
export default function BannerCarousel({ banners = defaultBanners }: BannerCarouselProps) {
  // Debug: log dos banners recebidos
  if (process.env.NODE_ENV === 'development') {
    console.log('BannerCarousel - Banners recebidos:', banners.length, banners.map(b => ({ id: b.id, image: b.image })))
  }

  // Estado para controlar qual banner está sendo exibido atualmente
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Se não houver banners, não renderizar nada ou mostrar mensagem
  if (banners.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('BannerCarousel - Nenhum banner recebido, usando banners padrão')
    }
    // Usar banners padrão se não receber nenhum
    const finalBanners = defaultBanners
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden bg-black">
        <div className="relative w-full h-full">
          {finalBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover md:object-contain w-full h-full"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Efeito para rotação automática dos banners a cada 6 segundos
  useEffect(() => {
    if (banners.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1 // Volta para o primeiro banner após o último
      )
    }, 3500) // Intervalo de 3.5 segundos
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval)
  }, [banners.length])

  // Função para navegar para o banner anterior
  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
  }

  // Função para navegar para o próximo banner
  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)
  }

  // Função para ir diretamente para um banner específico (usado pelos dots)
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    // Container principal do carrossel com altura responsiva e fundo preto
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden bg-black">
      {/* Container das imagens dos banners */}
      <div className="relative w-full h-full">
        {/* Mapeia todos os banners e renderiza cada um */}
        {banners.map((banner, index) => (
          <div
            key={banner.id} // Chave única para o React
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0' // Mostra apenas o banner atual
            }`}
          >
            {/* Componente de imagem otimizado do Next.js */}
            <Image
              src={banner.image} // Caminho da imagem
              alt={banner.title} // Texto alternativo para acessibilidade
              fill // Preenche o container pai
              className="object-cover md:object-contain w-full h-full" // Cover para mobile, contain para desktop
              priority={index === 0} // Prioriza carregamento da primeira imagem
              loading={index === 0 ? 'eager' : 'lazy'} // Lazy loading para imagens não prioritárias
              quality={85} // Qualidade otimizada
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Tamanhos responsivos
            />
          </div>
        ))}
      </div>

      {/* Botões de navegação - só aparecem se houver mais de um banner */}
      {banners.length > 1 && (
        <>
          {/* Botão para voltar ao banner anterior */}
          <button
            onClick={goToPrevious} // Chama função de navegação anterior
            className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 bg-opacity-90 hover:bg-opacity-100 text-black p-1.5 md:p-3 rounded-full transition-all duration-200 shadow-lg z-10"
            aria-label="Banner anterior" // Acessibilidade
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" /> {/* Ícone de seta esquerda */}
          </button>
          
          {/* Botão para avançar ao próximo banner */}
          <button
            onClick={goToNext} // Chama função de navegação próxima
            className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 bg-opacity-90 hover:bg-opacity-100 text-black p-1.5 md:p-3 rounded-full transition-all duration-200 shadow-lg z-10"
            aria-label="Próximo banner" // Acessibilidade
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" /> {/* Ícone de seta direita */}
          </button>
        </>
      )}

      {/* Indicadores de posição (dots) - só aparecem se houver mais de um banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-1 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 z-10">
          {/* Mapeia e renderiza um dot para cada banner */}
          {banners.map((_, index) => (
            <button
              key={index} // Chave única para o React
              onClick={() => goToSlide(index)} // Vai diretamente para o banner clicado
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-yellow-400 shadow-lg' // Destaque para o banner atual
                  : 'bg-white bg-opacity-60 hover:bg-opacity-80' // Estilo para banners inativos
              }`}
              aria-label={`Ir para banner ${index + 1}`} // Acessibilidade
            />
          ))}
        </div>
      )}
    </div>
  )
}
