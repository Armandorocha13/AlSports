'use client'

// Importações necessárias para o componente
import { useState, useEffect } from 'react' // Hooks do React para estado e efeitos
import Image from 'next/image' // Componente otimizado de imagem do Next.js
import { ChevronLeft, ChevronRight } from 'lucide-react' // Ícones de navegação

// Interface que define a estrutura de um banner
interface Banner {
  id: string // Identificador único do banner
  image: string // Caminho da imagem do banner
  title: string // Título principal do banner
  description: string // Descrição do banner
  buttonText: string // Texto do botão de ação
  buttonLink: string // Link para onde o botão redireciona
}

// Array com os dados dos banners que serão exibidos no carrossel
const banners: Banner[] = [
  {
    id: '1',
    image: '/images/Banners/Banner11.jpg', // Imagem do primeiro banner
    title: 'Loja de Atacado de Roupas Esportivas',
    description: 'Especializada na venda por atacado de roupas esportivas. Encontre as melhores marcas com preços competitivos para revendedores.',
    buttonText: 'Ver Futebol', // Texto do botão de ação
    buttonLink: '/categoria/futebol' // Link para categoria de futebol
  },
  {
    id: '2',
    image: '/images/Banners/Banner22.jpg', // Imagem do segundo banner
    title: 'Roupas de Treino Premium',
    description: 'Conjuntos completos para treino com qualidade superior. Ideal para academias e atletas profissionais.',
    buttonText: 'Roupas de Treino', // Texto do botão de ação
    buttonLink: '/categoria/roupas-treino' // Link para categoria de roupas de treino
  }
]

// Componente principal do carrossel de banners
export default function BannerCarousel() {
  // Estado para controlar qual banner está sendo exibido atualmente
  const [currentIndex, setCurrentIndex] = useState(0)

  // Efeito para rotação automática dos banners a cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1 // Volta para o primeiro banner após o último
      )
    }, 3500) // Intervalo de 4 segundos
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval)
  }, [])

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
