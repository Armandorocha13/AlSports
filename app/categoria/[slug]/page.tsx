'use client'

import { categoriesService } from '@/lib/services/categories-service'
import { Category } from '@/lib/types'
import { ArrowLeft, Grid3X3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true)
        const categoryData = await categoriesService.getCategoryBySlug(params.slug)
        if (!categoryData) {
          notFound()
          return
        }
        setCategory(categoryData)
      } catch (error) {
        console.error('Erro ao carregar categoria:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    loadCategory()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando categoria...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-primary-400">
              Início
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/"
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {category.name}
              </h1>
              <p className="text-lg text-gray-400 mt-2">
                {category.subcategories.length} subcategorias disponíveis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Grid3X3 className="text-primary-400" size={24} />
            <h2 className="text-2xl font-semibold text-white">
              Escolha uma Subcategoria
            </h2>
          </div>
          <p className="text-gray-400">
            Clique em uma das subcategorias abaixo para ver os produtos disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/categoria/${category.slug}/${subcategory.slug}`}
              className="group"
            >
              <div className="card h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-700">
                <div className="relative overflow-hidden">
                  <div className="h-80 relative">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-200 drop-shadow-lg">
                          {subcategory.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors duration-200">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Clique para ver os produtos desta subcategoria
                  </p>
                  
                  <div className="flex items-center justify-center text-primary-400 font-medium group-hover:text-primary-300 transition-colors duration-200">
                    <span>Ver Produtos</span>
                    <ArrowLeft className="ml-1 rotate-180" size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Info */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Sobre {category.name}
            </h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              {category.name === 'FUTEBOL' && 
                'Explore nossa ampla seleção de produtos de futebol, incluindo camisas oficiais, lançamentos e versões especiais dos principais times brasileiros e internacionais.'
              }
              {category.name === 'ROUPAS DE TREINO' && 
                'Encontre roupas de treino de alta qualidade para atletas e praticantes de esportes. Conjuntos completos, agasalhos e acessórios para todas as modalidades.'
              }
              {category.name === 'NBA' && 
                'Produtos oficiais da NBA com as melhores tecnologias e designs. Camisas dos principais times e jogadores da liga americana.'
              }
              {category.name === 'CONJUNTOS INFANTIS' && 
                'Roupas esportivas especiais para crianças, com tamanhos adequados e designs atrativos para os pequenos torcedores.'
              }
              {category.name === 'ACESSÓRIOS' && 
                'Complete seu visual esportivo com nossos acessórios: bonés, meias, camisas da NFL e muito mais.'
              }
              {category.name === 'BERMUDAS & SHORTS' && 
                'Shorts e bermudas para todas as atividades esportivas, com modelos masculinos e femininos.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
