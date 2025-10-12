'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User, LogOut, ShoppingCart } from 'lucide-react'
import { categories } from '@/lib/data'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { getTotalItems, getTotal, getShippingInfo } = useCart()

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-800">
      {/* Top Bar */}
      <div className="bg-primary-500 text-black py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <p>🛒 Venda por Atacado - Preços Especiais para Revendedores</p>
            <div className="hidden md:flex items-center space-x-4">
              <span>📞 (11) 99999-9999</span>
              <span>✉️ contato@alsports.com.br</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-black text-lg">AL</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="text-gray-300 hover:text-primary-400 font-medium text-sm transition-colors duration-200"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <Search size={20} />
            </button>

            {/* Cart Link */}
            <a
              href="/carrinho"
              className="relative p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200 group"
              title={`Carrinho: ${getTotalItems()} item(s) - R$ ${getTotal().toFixed(2)}`}
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                    {getTotalItems()}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="p-3 space-y-1">
                      <div className="font-semibold text-primary-400">Carrinho</div>
                      <div className="text-gray-300">
                        {getTotalItems()} item(s) no carrinho
                      </div>
                      <div className="text-gray-300">
                        Total: R$ {getTotal().toFixed(2)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {getShippingInfo().method === 'transportadora' ? '🚛 Transportadora' : '📦 Super Frete'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </a>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  <User size={20} />
                  <span className="hidden md:block text-sm">
                    {profile?.full_name || user.email}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/minha-conta"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Minha Conta
                    </Link>
                    <Link
                      href="/minha-conta/pedidos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <Link
                      href="/minha-conta/enderecos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Endereços
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        signOut()
                        setIsUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Entrar
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  href="/auth/register"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700">
          <nav className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="block py-2 text-gray-300 hover:text-primary-400 font-medium text-sm transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Floating Cart Button for Mobile */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <a
            href="/carrinho"
            className="bg-primary-500 hover:bg-primary-400 text-black p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 block"
          >
            <div className="flex flex-col items-center">
              <ShoppingCart size={24} />
              <span className="text-xs font-semibold mt-1">
                {getTotalItems()}
              </span>
            </div>
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
          </a>
        </div>
      )}
    </header>
  )
}
