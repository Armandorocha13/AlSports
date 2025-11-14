'use client'

import { Category } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import CategoryCard from './CategoryCard'

interface CategoriesCarouselClientProps {
  categories: Category[]
}

export default function CategoriesCarouselClient({ categories }: CategoriesCarouselClientProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)

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
        {categories.map((category, index) => (
          <div key={category.id} className="flex-shrink-0 w-full snap-center px-4">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  )
}





