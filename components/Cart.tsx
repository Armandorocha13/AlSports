'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingCart, Trash2, MessageCircle, Package, Truck } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getTotal,
    getItemPrice,
    getShippingInfo,
    getShippingCost,
    canUseTransportadora,
    getMissingForTransportadora,
    createOrder,
    clearCart,
    getCartSummary
  } = useCart()

  const shippingInfo = getShippingInfo()
  const cartSummary = getCartSummary()

  const getTotalPieces = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/checkout')
      return
    }
    
    router.push('/checkout')
    onClose()
  }

  const generateWhatsAppMessage = () => {
    const order = createOrder()
    const totalPieces = getTotalPieces()
    
    let message = `🛒 *NOVO PEDIDO - ${order.code}*\n\n`
    message += `📋 *RESUMO DO PEDIDO:*\n`
    message += `• Total de itens: ${order.totalItems}\n`
    message += `• Total de peças: ${totalPieces}\n`
    message += `• Subtotal: R$ ${order.subtotal.toFixed(2)}\n`
    message += `• Frete: R$ ${order.shipping.toFixed(2)}\n`
    message += `• *TOTAL: R$ ${order.total.toFixed(2)}*\n\n`
    
    message += `🚚 *FRETE:*\n`
    if (shippingInfo.method === 'transportadora') {
      message += `• Método: Transportadora (GRÁTIS)\n`
      message += `• Prazo: ${shippingInfo.estimatedDays}\n`
    } else {
      message += `• Método: Super Frete\n`
      message += `• Valor: R$ ${shippingInfo.cost.toFixed(2)}\n`
      message += `• Prazo: ${shippingInfo.estimatedDays}\n`
      message += `• Faltam ${getMissingForTransportadora()} peças para frete grátis\n`
    }
    
    message += `\n📦 *ITENS DO PEDIDO:*\n`
    items.forEach((item, index) => {
      const price = getItemPrice(item.product, item.quantity)
      message += `${index + 1}. ${item.product.name}\n`
      message += `   • Tamanho: ${item.selectedSize}\n`
      if (item.selectedColor) {
        message += `   • Cor: ${item.selectedColor}\n`
      }
      message += `   • Quantidade: ${item.quantity}x\n`
      message += `   • Preço unit.: R$ ${price.toFixed(2)}\n`
      message += `   • Subtotal: R$ ${(price * item.quantity).toFixed(2)}\n\n`
    })
    
    message += `\n👤 *DADOS DO CLIENTE:*\n`
    message += `• Nome: [NOME DO CLIENTE]\n`
    message += `• Email: [EMAIL DO CLIENTE]\n`
    message += `• Telefone: [TELEFONE DO CLIENTE]\n`
    message += `• Endereço: [ENDEREÇO COMPLETO]\n\n`
    
    message += `💳 *FORMA DE PAGAMENTO:*\n`
    message += `• [PIX/CARTÃO/BOLETO]\n\n`
    
    message += `📝 *OBSERVAÇÕES:*\n`
    message += `• [OBSERVAÇÕES DO CLIENTE]\n\n`
    
    message += `✅ *CONFIRMAÇÃO:*\n`
    message += `• Cliente confirma o pedido\n`
    message += `• Dados de entrega corretos\n`
    message += `• Forma de pagamento escolhida\n\n`
    
    message += `_Pedido gerado em ${new Date().toLocaleString('pt-BR')}_`
    
    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage()
    const whatsappNumber = '5511999999999' // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
              <h2 className="ml-2 text-lg font-semibold text-gray-900">
                Carrinho ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-500 mb-6">
                  Adicione alguns produtos para começar sua compra
                </p>
                <button
                  onClick={onClose}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor || 'default'}`} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Tamanho: {item.selectedSize}
                      </p>
                      {item.selectedColor && (
                        <p className="text-sm text-gray-500">
                          Cor: {item.selectedColor}
                        </p>
                      )}
                      <p className="text-sm font-medium text-primary-600">
                        R$ {getItemPrice(item.product, item.quantity).toFixed(2)} cada
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(
                          item.product.id, 
                          item.selectedSize, 
                          item.quantity - 1,
                          item.selectedColor
                        )}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(
                          item.product.id, 
                          item.selectedSize, 
                          item.quantity + 1,
                          item.selectedColor
                        )}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(
                        item.product.id, 
                        item.selectedSize,
                        item.selectedColor
                      )}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {shippingInfo.method === 'transportadora' ? (
                      <Truck className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {shippingInfo.method === 'transportadora' ? 'Transportadora' : 'Super Frete'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {shippingInfo.method === 'transportadora' ? 'GRÁTIS' : `R$ ${shippingInfo.cost.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {shippingInfo.estimatedDays}
                </p>
                {!canUseTransportadora() && (
                  <p className="text-xs text-primary-600 mt-1">
                    Faltam {getMissingForTransportadora()} peças para frete grátis
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getTotalItems()} itens)</span>
                  <span>R$ {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span>
                    {shippingInfo.method === 'transportadora' ? 'GRÁTIS' : `R$ ${getShippingCost().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Finalizar Compra
                </button>
                
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Pedir pelo WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
