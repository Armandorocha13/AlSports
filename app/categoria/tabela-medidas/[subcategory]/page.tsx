'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Ruler, Download } from 'lucide-react'
import { categories } from '@/lib/data'

interface SubcategoryPageProps {
  params: {
    subcategory: string
  }
}

export default function MedidasSubcategoryPage({ params }: SubcategoryPageProps) {
  const category = categories.find(cat => cat.slug === 'tabela-medidas')
  
  if (!category) {
    notFound()
  }

  const subcategory = category.subcategories.find(sub => sub.slug === params.subcategory)
  
  if (!subcategory) {
    notFound()
  }

  const getTableData = () => {
    switch (params.subcategory) {
      case 'medidas-camisas':
        return {
          title: 'Medidas de Camisas',
          description: 'Tabela de medidas para camisas de futebol e NBA',
          headers: ['Tamanho', 'Peito (cm)', 'Comprimento (cm)', 'Manga (cm)'],
          rows: [
            ['P', '50-52', '68-70', '20-21'],
            ['M', '54-56', '70-72', '21-22'],
            ['G', '58-60', '72-74', '22-23'],
            ['GG', '62-64', '74-76', '23-24']
          ]
        }
      case 'medidas-shorts':
        return {
          title: 'Medidas de Shorts',
          description: 'Tabela de medidas para shorts e bermudas',
          headers: ['Tamanho', 'Cintura (cm)', 'Quadril (cm)', 'Comprimento (cm)'],
          rows: [
            ['P', '70-74', '84-88', '42-44'],
            ['M', '76-80', '90-94', '44-46'],
            ['G', '82-86', '96-100', '46-48'],
            ['GG', '88-92', '102-106', '48-50']
          ]
        }
      case 'medidas-bones':
        return {
          title: 'Medidas de Bonés',
          description: 'Tabela de medidas para bonés',
          headers: ['Tamanho', 'Perímetro (cm)', 'Descrição'],
          rows: [
            ['Único', '54-60', 'Ajustável com fita']
          ]
        }
      default:
        return null
    }
  }

  const tableData = getTableData()

  if (!tableData) {
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
            <Link href="/categoria/tabela-medidas" className="text-gray-400 hover:text-primary-400">
              Tabela de Medidas
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{subcategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/categoria/tabela-medidas"
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {subcategory.name}
              </h1>
              <p className="text-lg text-gray-400 mt-2">
                {tableData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Medidas */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="text-primary-400" size={24} />
            <h2 className="text-2xl font-semibold text-white">
              {tableData.title}
            </h2>
          </div>
          <p className="text-gray-400">
            Todas as medidas são em centímetros. Consulte a tabela abaixo para escolher o tamanho ideal.
          </p>
        </div>

        {/* Tabela */}
        <div className="mb-12">
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  {tableData.headers.map((header, index) => (
                    <th 
                      key={index}
                      className={`px-4 py-3 font-semibold text-white ${
                        index === 0 ? 'text-left' : 'text-center'
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={`border-t border-gray-700 ${
                      rowIndex % 2 === 1 ? 'bg-gray-800' : ''
                    }`}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className={`px-4 py-3 ${
                          cellIndex === 0 ? 'text-white font-medium' : 'text-gray-300 text-center'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dicas de Medidas */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Como Medir</h3>
          <div className="text-gray-400">
            {params.subcategory === 'medidas-camisas' && (
              <ul className="space-y-2">
                <li>• <strong>Peito:</strong> Meça a parte mais larga do peito, passando a fita métrica pelas axilas</li>
                <li>• <strong>Comprimento:</strong> Meça do ombro até a barra da camisa</li>
                <li>• <strong>Manga:</strong> Meça do ombro até o punho, com o braço ligeiramente dobrado</li>
              </ul>
            )}
            {params.subcategory === 'medidas-shorts' && (
              <ul className="space-y-2">
                <li>• <strong>Cintura:</strong> Meça a circunferência da cintura, onde você normalmente usa o short</li>
                <li>• <strong>Quadril:</strong> Meça a parte mais larga do quadril</li>
                <li>• <strong>Comprimento:</strong> Meça da cintura até a barra do short</li>
              </ul>
            )}
            {params.subcategory === 'medidas-bones' && (
              <ul className="space-y-2">
                <li>• <strong>Perímetro:</strong> Meça a circunferência da cabeça, passando a fita métrica pela testa e nuca</li>
                <li>• <strong>Dica:</strong> Nossos bonés são ajustáveis, então se encaixam na maioria dos tamanhos</li>
              </ul>
            )}
          </div>
        </div>

        {/* Botão de Download */}
        <div className="text-center">
          <button className="inline-flex items-center bg-primary-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200">
            <Download className="mr-2" size={20} />
            Baixar Tabela (PDF)
          </button>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Produtos Tailandeses de Qualidade
            </h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              Todos os nossos produtos são importados da Tailândia, garantindo alta qualidade 
              e acabamento impecável. As medidas podem variar ligeiramente entre lotes, 
              mas sempre dentro dos padrões de excelência.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
