'use client'

// Importações necessárias para o componente Header
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, User, LogOut, Settings, Heart, ShoppingCart, Shield } from 'lucide-react'
import { categories } from '@/lib/data'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'

// Componente do cabeçalho da aplicação
export default function Header() {
  // Estados para controlar abertura/fechamento de menus
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Menu mobile
  const [isSearchOpen, setIsSearchOpen] = useState(false) // Barra de pesquisa
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false) // Menu do usuário
  const [searchTerm, setSearchTerm] = useState('') // Termo de busca

  // Função para fechar a barra de busca
  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchTerm('')
  }
  
  // Hooks para autenticação, carrinho e favoritos
  const { user, profile, signOut } = useAuth()
  const { getTotalItems, getTotal } = useCart()
  const { getFavoritesCount } = useFavorites()

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800">
      {/* Cabeçalho principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo da empresa */}
          <Link href="/" className="flex items-center">
            <div className="w-24 h-16 flex items-center justify-center">
              <Image
                src="/images/Logo/Monograma2.png"
                alt="AlSports Logo"
                width={200}
                height={160}
                className="object-contain"
                priority
                quality={90}
                sizes="(max-width: 768px) 150px, 200px"
              />
            </div>
          </Link>

          {/* Navegação desktop - Links para categorias */}
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

          {/* Área de ações: pesquisa, carrinho e menu do usuário */}
          <div className="flex items-center space-x-4">
            {/* Botão de pesquisa */}
            <button
              onClick={() => isSearchOpen ? closeSearch() : setIsSearchOpen(true)}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <Search size={20} />
            </button>

            {/* Link do carrinho com contador */}
            <Link
              href="/carrinho"
              className="relative p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200 group"
              title={`Carrinho: ${getTotalItems()} item(s) - R$ ${getTotal().toFixed(2)}`}
            >
              <ShoppingCart size={20} />
              {/* Contador de itens no carrinho */}
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Link dos favoritos com contador */}
            <a
              href="/favoritos"
              className="relative p-2 text-gray-400 hover:text-red-400 transition-colors duration-200 group"
              title={`Favoritos: ${getFavoritesCount()} item(s)`}
            >
              <Heart size={20} />
              {/* Contador de favoritos */}
              {getFavoritesCount() > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                    {getFavoritesCount()}
                  </span>
                  {/* Tooltip com informações dos favoritos */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="p-3 space-y-1">
                      <div className="font-semibold text-red-400">Favoritos</div>
                      <div className="text-gray-300">
                        {getFavoritesCount()} item(s) nos favoritos
                      </div>
                    </div>
                  </div>
                </>
              )}
            </a>

            {/* Menu do usuário - exibe se estiver logado */}
            {user ? (
              <div className="relative">
                {/* Botão do menu do usuário */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  <User size={20} />
                  <span className="hidden md:block text-sm">
                    {profile?.full_name || user.email}
                  </span>
                </button>

                {/* Menu dropdown do usuário */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {/* Link para área do usuário */}
                    <Link
                      href="/minha-conta"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Minha Conta
                    </Link>
                    {/* Link para pedidos do usuário */}
                    <Link
                      href="/minha-conta/pedidos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Meus Pedidos
                    </Link>
                    {/* Link para favoritos do usuário */}
                    <Link
                      href="/favoritos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Favoritos
                    </Link>
                    
                    {/* Link para painel administrativo */}
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Painel Admin
                      </div>
                    </Link>
                    
                    {/* Botão de logout */}
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
              /* Links de login e cadastro para usuários não logados */
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

            {/* Botão do menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Barra de pesquisa - exibe quando ativada */}
        {isSearchOpen && (
          <div className="mt-4 pb-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchTerm.trim()) {
                  window.location.href = `/busca?q=${encodeURIComponent(searchTerm.trim())}`
                }
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 pr-12"
                autoFocus
              />
              <div className="absolute right-3 top-2.5 flex items-center gap-2">
                <button
                  type="submit"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  <Search size={20} />
                </button>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Menu mobile - navegação para dispositivos móveis */}
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

    </header>
  )
}
