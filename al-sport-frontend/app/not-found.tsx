'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página não encontrada
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            <Home className="mr-2" size={18} />
            Voltar ao Início
          </Link>
          
          <div>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2" size={18} />
              Voltar à página anterior
            </button>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  )
}
