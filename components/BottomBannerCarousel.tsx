'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  image: string
  title: string
  description: string
}

const bottomBanners: Banner[] = [
  {
    id: '1',
    image: '/images/Banners/Banner3.jpg',
    title: 'Ofertas Especiais',
    description: 'Confira nossas promoções exclusivas'
  },
  {
    id: '2',
    image: '/images/Banners/Banner4.jpg',
    title: 'Novos Produtos',
    description: 'Lançamentos da temporada'
  }
]

export default function BottomBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === bottomBanners.length - 1 ? 0 : prevIndex + 1
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? bottomBanners.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === bottomBanners.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full h-[670px] overflow-hidden bg-black">
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {bottomBanners.map((banner, index) => (
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
              className="object-contain w-full h-full"
              style={{
                maxWidth: '100%',
                display: 'block'
              }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 bg-opacity-90 hover:bg-opacity-100 text-black p-2 md:p-3 rounded-full transition-all duration-200 shadow-lg z-10"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 bg-opacity-90 hover:bg-opacity-100 text-black p-2 md:p-3 rounded-full transition-all duration-200 shadow-lg z-10"
        aria-label="Próximo banner"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {bottomBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-yellow-400 shadow-lg' 
                : 'bg-white bg-opacity-60 hover:bg-opacity-80'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
