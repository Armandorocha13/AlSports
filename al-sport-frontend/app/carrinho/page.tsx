'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import {
    ArrowLeft,
    CreditCard,
    Minus,
    Package,
    Plus,
    ShoppingCart,
    Trash2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CarrinhoPage() {
  const { user } = useAuth()
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getSubtotal, 
    getShippingCost, 
    getTotal,
    getTotalItems 
  } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleClearCart = () => {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      clearCart()
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Seu carrinho está vazio!')
      return
    }
    router.push('/checkout')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4 font-bold">Acesso Negado</div>
          <div className="text-gray-300 mb-6">Você precisa estar logado para acessar o carrinho.</div>
          <Link
            href="/auth/login"
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Continuar Comprando
            </Link>
          </div>

          {/* Carrinho vazio */}
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-900 border-2 border-yellow-400 rounded-full flex items-center justify-center">
              <ShoppingCart size={32} className="text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-300 mb-8">
              Que tal adicionar alguns produtos incríveis?
            </p>
            <Link
              href="/"
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Package size={20} />
              Explorar Produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Continuar Comprando
            </Link>
            <div className="h-6 w-px bg-yellow-400"></div>
            <h1 className="text-2xl font-bold text-white">
              Carrinho ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
            </h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-black border-2 border-red-600 text-red-500 hover:bg-red-950 hover:border-red-500 hover:text-red-400 transition-all rounded-lg flex items-center gap-2 font-medium shadow-lg"
              aria-label="Esvaziar carrinho"
            >
              <Trash2 size={16} />
              Esvaziar Carrinho
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="bg-gray-900 rounded-lg border-2 border-yellow-400 p-6 shadow-lg hover:shadow-yellow-400/20 hover:border-yellow-300 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Imagem do produto */}
                    <div className="relative w-20 h-20 flex-shrink-0 border-2 border-yellow-400 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 text-base">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded font-semibold">
                          Tamanho: {item.size}
                        </span>
                        {item.color && (
                          <span className="bg-yellow-400 text-black px-2 py-1 rounded font-semibold">
                            Cor: {item.color}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Preço e controles */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-yellow-400 mb-1">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-300">
                          R$ {item.price.toFixed(2)} cada
                        </div>
                      </div>

                      {/* Controles de quantidade */}
                      <div className="flex items-center gap-2 bg-black rounded-lg px-2 py-1 border-2 border-yellow-400">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-9 h-9 rounded-full border-2 border-yellow-400 bg-black flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-300 transition-all shadow-lg"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={16} className="text-yellow-400 hover:text-black transition-colors" />
                        </button>
                        <span className="w-10 text-center font-bold text-lg text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-9 h-9 rounded-full border-2 border-yellow-400 bg-black flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-300 transition-all shadow-lg"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={16} className="text-yellow-400 hover:text-black transition-colors" />
                        </button>
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3 py-1.5 bg-black border-2 border-red-600 text-red-500 hover:bg-red-950 hover:border-red-500 hover:text-red-400 transition-all rounded-lg flex items-center gap-1.5 font-medium text-sm shadow-lg"
                        aria-label="Remover item do carrinho"
                      >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border-2 border-yellow-400 p-6 sticky top-8 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-6 border-b-2 border-yellow-400 pb-3">
                Resumo do Pedido
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-300">
                    Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
                  </span>
                  <span className="font-medium text-white">
                    R$ {getSubtotal().toFixed(2)}
                  </span>
                </div>

                {/* Linha divisória */}
                <div className="border-t-2 border-yellow-400"></div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-yellow-400">Total</span>
                  <span className="text-yellow-400">
                    R$ {getTotal().toFixed(2)}
                  </span>
                </div>


                {/* Botão de checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400 flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard size={20} />
                  {loading ? 'Processando...' : 'Finalizar Compra'}
                </button>

                {/* Informações de pagamento */}
                <div className="text-xs text-gray-300 text-center">
                  <p>Pagamento seguro via PIX, cartão ou boleto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

