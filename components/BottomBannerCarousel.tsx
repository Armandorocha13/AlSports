'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
