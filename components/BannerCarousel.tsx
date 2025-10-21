'use client'

// Importações necessárias para o componente
import { useState, useEffect } from 'react' // Hooks do React para estado e efeitos
import Image from 'next/image' // Componente otimizado de imagem do Next.js

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

  // Função para ir diretamente para um banner específico (usado pelos dots)
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    // Container principal do carrossel com altura fixa e fundo preto
    <div className="relative w-full h-[450px] overflow-hidden bg-black">
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
              className="object-contain w-full h-full" // Mantém proporção e preenche altura
              priority={index === 0} // Prioriza carregamento da primeira imagem
            />
          </div>
        ))}
      </div>


      {/* Indicadores de posição (dots) - só aparecem se houver mais de um banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {/* Mapeia e renderiza um dot para cada banner */}
          {banners.map((_, index) => (
            <button
              key={index} // Chave única para o React
              onClick={() => goToSlide(index)} // Vai diretamente para o banner clicado
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
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
