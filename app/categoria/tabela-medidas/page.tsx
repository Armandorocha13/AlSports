'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Ruler, Download } from 'lucide-react'
import { categories } from '@/lib/data'

export default function TabelaMedidasPage() {
  const category = categories.find(cat => cat.slug === 'tabela-medidas')

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

      {/* Header */}
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
                Consulte as medidas dos nossos produtos tailandeses
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
              Guia de Medidas
            </h2>
          </div>
          <p className="text-gray-400">
            Todas as medidas são em centímetros. Consulte a tabela abaixo para escolher o tamanho ideal.
          </p>
        </div>

        {/* Tabela de Camisas */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">Camisas de Futebol e NBA</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-3 text-left text-white font-semibold">Tamanho</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Peito (cm)</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Comprimento (cm)</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Manga (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-3 text-white font-medium">P</td>
                  <td className="px-4 py-3 text-center text-gray-300">50-52</td>
                  <td className="px-4 py-3 text-center text-gray-300">68-70</td>
                  <td className="px-4 py-3 text-center text-gray-300">20-21</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800">
                  <td className="px-4 py-3 text-white font-medium">M</td>
                  <td className="px-4 py-3 text-center text-gray-300">54-56</td>
                  <td className="px-4 py-3 text-center text-gray-300">70-72</td>
                  <td className="px-4 py-3 text-center text-gray-300">21-22</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-3 text-white font-medium">G</td>
                  <td className="px-4 py-3 text-center text-gray-300">58-60</td>
                  <td className="px-4 py-3 text-center text-gray-300">72-74</td>
                  <td className="px-4 py-3 text-center text-gray-300">22-23</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800">
                  <td className="px-4 py-3 text-white font-medium">GG</td>
                  <td className="px-4 py-3 text-center text-gray-300">62-64</td>
                  <td className="px-4 py-3 text-center text-gray-300">74-76</td>
                  <td className="px-4 py-3 text-center text-gray-300">23-24</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela de Shorts */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">Shorts e Bermudas</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-3 text-left text-white font-semibold">Tamanho</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Cintura (cm)</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Quadril (cm)</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Comprimento (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-3 text-white font-medium">P</td>
                  <td className="px-4 py-3 text-center text-gray-300">70-74</td>
                  <td className="px-4 py-3 text-center text-gray-300">84-88</td>
                  <td className="px-4 py-3 text-center text-gray-300">42-44</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800">
                  <td className="px-4 py-3 text-white font-medium">M</td>
                  <td className="px-4 py-3 text-center text-gray-300">76-80</td>
                  <td className="px-4 py-3 text-center text-gray-300">90-94</td>
                  <td className="px-4 py-3 text-center text-gray-300">44-46</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-3 text-white font-medium">G</td>
                  <td className="px-4 py-3 text-center text-gray-300">82-86</td>
                  <td className="px-4 py-3 text-center text-gray-300">96-100</td>
                  <td className="px-4 py-3 text-center text-gray-300">46-48</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800">
                  <td className="px-4 py-3 text-white font-medium">GG</td>
                  <td className="px-4 py-3 text-center text-gray-300">88-92</td>
                  <td className="px-4 py-3 text-center text-gray-300">102-106</td>
                  <td className="px-4 py-3 text-center text-gray-300">48-50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela de Bonés */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">Bonés</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-3 text-left text-white font-semibold">Tamanho</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Perímetro (cm)</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-3 text-white font-medium">Único</td>
                  <td className="px-4 py-3 text-center text-gray-300">54-60</td>
                  <td className="px-4 py-3 text-center text-gray-300">Ajustável com fita</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dicas de Medidas */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Dicas para Medir</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-primary-400 mb-2">Camisas</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• <strong>Peito:</strong> Meça a parte mais larga do peito</li>
                <li>• <strong>Comprimento:</strong> Do ombro até a barra</li>
                <li>• <strong>Manga:</strong> Do ombro até o punho</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-primary-400 mb-2">Shorts</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• <strong>Cintura:</strong> Circunferência da cintura</li>
                <li>• <strong>Quadril:</strong> Circunferência do quadril</li>
                <li>• <strong>Comprimento:</strong> Da cintura até a barra</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botão de Download */}
        <div className="text-center">
          <button className="inline-flex items-center bg-primary-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200">
            <Download className="mr-2" size={20} />
            Baixar Tabela de Medidas (PDF)
          </button>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Sobre Nossos Produtos Tailandeses
            </h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              Todos os nossos produtos são importados da Tailândia, conhecida pela alta qualidade 
              e acabamento impecável. As medidas podem variar ligeiramente entre diferentes lotes, 
              mas sempre dentro dos padrões de qualidade. Em caso de dúvidas sobre medidas, 
              entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
