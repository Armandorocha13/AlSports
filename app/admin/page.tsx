import Link from 'next/link'
import { Package, ShoppingCart, Users, Image, BarChart3, Settings } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <p className="text-gray-300 mb-6">Bem-vindo ao painel administrativo!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/produtos"
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center mb-3">
            <Package className="h-6 w-6 text-primary-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Produtos</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300">Gerenciar produtos do catálogo</p>
        </Link>
        
        <Link 
          href="/admin/pedidos"
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center mb-3">
            <ShoppingCart className="h-6 w-6 text-primary-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Pedidos</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300">Acompanhar pedidos dos clientes</p>
        </Link>
        
        <Link 
          href="/admin/usuarios"
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center mb-3">
            <Users className="h-6 w-6 text-primary-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Usuários</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300">Gerenciar usuários do sistema</p>
        </Link>
        
        <Link 
          href="/admin/categorias"
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center mb-3">
            <Image className="h-6 w-6 text-primary-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Categorias</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300">Gerenciar categorias do catálogo</p>
        </Link>
        
        <Link 
          href="/admin/banners"
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center mb-3">
            <Image className="h-6 w-6 text-primary-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Banners</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300">Gerenciar banners promocionais</p>
        </Link>
        
        <Link 
          href="/admin/relatorios"
          className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 group cursor-pointer"
        >
          <div className="flex items-center mb-3">
            <BarChart3 className="h-6 w-6 text-primary-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Relatórios</h3>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300">Visualizar relatórios e análises</p>
        </Link>
      </div>
    </div>
  )
}