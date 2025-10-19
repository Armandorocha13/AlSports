'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/data'

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
  }>;
};

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="card group hover:shadow-xl transition-all duration-300 border border-gray-700">
      <div className="relative overflow-hidden">
        <Link href={`/categoria/${category.slug}`}>
          <div className="h-96 relative">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors duration-200 drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="p-6 text-center">
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
          <div className="flex flex-wrap gap-1 justify-center">
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
