'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  ArrowLeft,
  Package,
  Truck,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

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
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-text-light-primary dark:text-text-dark-primary text-xl mb-4">Acesso Negado</div>
          <div className="text-text-light-secondary dark:text-text-dark-secondary mb-6">Você precisa estar logado para acessar o carrinho.</div>
          <Link
            href="/auth/login"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Continuar Comprando
            </Link>
          </div>

          {/* Carrinho vazio */}
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-8">
              Que tal adicionar alguns produtos incríveis?
            </p>
            <Link
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Continuar Comprando
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Carrinho ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
            </h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
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
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex gap-4">
                    {/* Imagem do produto */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="80px"
                      />
                    </div>

                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        <span>Tamanho: {item.size}</span>
                        <span>Cor: {item.color}</span>
                      </div>
                    </div>

                    {/* Preço e controles */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          R$ {item.price.toFixed(2)} cada
                        </div>
                      </div>

                      {/* Controles de quantidade */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium text-text-light-primary dark:text-text-dark-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
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
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">
                    Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
                  </span>
                  <span className="font-medium text-text-light-primary dark:text-text-dark-primary">
                    R$ {getSubtotal().toFixed(2)}
                  </span>
                </div>

                {/* Frete */}
                <div className="flex justify-between">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">
                    Frete
                  </span>
                  <span className="font-medium text-text-light-primary dark:text-text-dark-primary">
                    {getShippingCost() === 0 ? 'Grátis' : `R$ ${getShippingCost().toFixed(2)}`}
                  </span>
                </div>

                {/* Linha divisória */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-text-light-primary dark:text-text-dark-primary">Total</span>
                  <span className="text-text-light-primary dark:text-text-dark-primary">
                    R$ {getTotal().toFixed(2)}
                  </span>
                </div>

                {/* Informações de frete */}
                {getSubtotal() < 200 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
                      <Truck size={16} />
                      <span>Frete grátis a partir de R$ 200,00</span>
                    </div>
                    <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                      Faltam R$ {(200 - getSubtotal()).toFixed(2)} para frete grátis
                    </div>
                  </div>
                )}

                {/* Botão de checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  {loading ? 'Processando...' : 'Finalizar Compra'}
                </button>

                {/* Informações de pagamento */}
                <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary text-center">
                  <p>Pagamento seguro via PIX, cartão ou boleto</p>
                  <p>Entrega em 3-5 dias úteis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

