'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AppBanner } from '@/lib/utils/strapi-to-app-types'

interface BottomBannerCarouselProps {
  banners?: AppBanner[]
}

const defaultBottomBanners: AppBanner[] = [
  {
    id: '1',
    image: '/images/Banners/Banner3.jpg',
    title: 'Ofertas Especiais',
    description: 'Confira nossas promoções exclusivas',
    buttonText: 'Ver Ofertas',
    buttonLink: '/produtos'
  },
  {
    id: '2',
    image: '/images/Banners/Banner4.jpg',
    title: 'Novos Produtos',
    description: 'Lançamentos da temporada',
    buttonText: 'Ver Novidades',
    buttonLink: '/produtos'
  }
]

export default function BottomBannerCarousel({ banners = defaultBottomBanners }: BottomBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (banners.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [banners.length])

  const goToPrevious = () => {
    if (banners.length === 0) return
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    if (banners.length === 0) return
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Se não houver banners, não renderizar nada
  if (banners.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-[300px] md:h-[500px] lg:h-[670px] overflow-hidden bg-black">
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
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
              style={{
                maxWidth: '100%',
                display: 'block'
              }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - só aparecem se houver mais de um banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 bg-opacity-90 hover:bg-opacity-100 text-black p-1.5 md:p-3 rounded-full transition-all duration-200 shadow-lg z-10"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-yellow-400 bg-opacity-90 hover:bg-opacity-100 text-black p-1.5 md:p-3 rounded-full transition-all duration-200 shadow-lg z-10"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
      <div className="absolute bottom-1 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-yellow-400 shadow-lg' 
                : 'bg-white bg-opacity-60 hover:bg-opacity-80'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>
      )}
    </div>
  )
}
