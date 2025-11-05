'use client'

import { useCategories } from '@/hooks/useCategories'
import Link from 'next/link'

export default function Footer() {
  // Buscar categorias do banco de dados
  const { categories, loading: categoriesLoading } = useCategories({
    is_active: true
  })
  
  // Filtrar categorias (excluir tabela-medidas)
  const displayCategories = categories.filter(cat => cat.slug !== 'tabela-medidas')
  
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3 mb-4">
            <span className="font-bold text-black text-sm"><img src="/images/Logo/Monograma2.png" alt="AL Sports Logo Completo" className="rounded-full w-60 h-60" /></span>
            </div>
            
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorias</h4>
            {categoriesLoading ? (
              <ul className="space-y-2">
                <li className="text-gray-400">Carregando...</li>
              </ul>
            ) : displayCategories.length > 0 ? (
              <ul className="space-y-2">
                {displayCategories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/categoria/${category.slug}`} 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                <li className="text-gray-400">Nenhuma categoria disponível</li>
              </ul>
            )}
          </div>

          {/* Additional Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informações</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/categoria/tabela-medidas" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tabela de Medidas
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Carrinho
                </Link>
              </li>
              
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AL Mundo da bola . Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido por BeArts Media para o AL Mundo da Bola
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
