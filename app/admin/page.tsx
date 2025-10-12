import Link from 'next/link'
import { ShoppingCart, Clock, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Pedidos</h1>
          <p className="text-gray-300">Acompanhe os pedidos dos clientes em tempo real</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-primary-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Total de Pedidos</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Pedidos Pendentes</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Receita Hoje</p>
                <p className="text-2xl font-bold text-white">R$ 0,00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/admin/pedidos"
            className="bg-primary-500 text-black px-8 py-4 rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center text-lg font-semibold"
          >
            <ShoppingCart className="h-6 w-6 mr-3" />
            Ver Todos os Pedidos
          </Link>
        </div>
      </div>
    </div>
  )
}