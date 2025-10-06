'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Category } from '@/lib/data'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="card group hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <Link href={`/categoria/${category.slug}`}>
          <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-primary-500 text-black p-4 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">
                  {category.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
                {category.name}
              </h3>
            </div>
          </div>
        </Link>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {category.name}
          </h3>
          <p className="text-sm text-gray-400">
            {category.subcategories.length} subcategorias disponíveis
          </p>
        </div>

        {/* Subcategories Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {category.subcategories.slice(0, 3).map((subcategory) => (
              <span 
                key={subcategory.id}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
              >
                {subcategory.name}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span className="text-xs text-gray-500">
                +{category.subcategories.length - 3} mais
              </span>
            )}
          </div>
        </div>

        <Link 
          href={`/categoria/${category.slug}`}
          className="inline-flex items-center text-primary-400 font-medium hover:text-primary-300 transition-colors duration-200"
        >
          Ver Categoria
          <ArrowRight className="ml-1" size={16} />
        </Link>
      </div>
    </div>
  )
}
