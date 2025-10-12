'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingCart, Trash2, MessageCircle, Package, Truck, Percent, Tag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { DiscountCalculator } from '@/lib/discount-calculator'

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
    getCartSummary,
    openWhatsAppOrder,
    getDiscountSummary,
    getItemDiscount,
    getNextDiscountThreshold
  } = useCart()

  const shippingInfo = getShippingInfo()
  const cartSummary = getCartSummary()
  const discountSummary = getDiscountSummary()

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

  const handleWhatsAppOrder = () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/checkout')
      return
    }

    // Criar pedido com dados básicos (sem endereço e pagamento)
    const order = createOrder(
      {
        name: user.user_metadata?.full_name || 'Cliente',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      }
    )

    // Mostrar ID do pedido e instruções importantes
    alert(`🛒 PEDIDO CRIADO COM SUCESSO!

📋 NÚMERO DO PEDIDO: ${order.code}

⚠️ INSTRUÇÕES IMPORTANTES:
• ANOTE este número do pedido: ${order.code}
• Envie o comprovante de pagamento junto com este número
• Aguarde a confirmação do pagamento
• Você receberá atualizações por email

Agora você será redirecionado para o WhatsApp com todos os detalhes do pedido.`)

    // Abrir WhatsApp com o pedido
    openWhatsAppOrder(order)
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
                      
                      {/* Preços e desconto */}
                      {(() => {
                        const discountInfo = getItemDiscount(item.product, item.quantity)
                        const nextThreshold = getNextDiscountThreshold(item.product, item.quantity)
                        
                        return (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-primary-600">
                                R$ {discountInfo.discountedPrice.toFixed(2)} cada
                              </span>
                              {discountInfo.discountPercentage > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Percent size={12} className="mr-1" />
                                  -{discountInfo.discountPercentage}%
                                </span>
                              )}
                            </div>
                            
                            {discountInfo.discountPercentage > 0 && (
                              <p className="text-xs text-gray-500 line-through">
                                De: R$ {discountInfo.originalPrice.toFixed(2)}
                              </p>
                            )}
                            
                            {nextThreshold && (
                              <p className="text-xs text-blue-600">
                                <Tag size={12} className="inline mr-1" />
                                Compre mais {nextThreshold.neededQuantity} para pagar R$ {nextThreshold.nextPrice.toFixed(2)} cada
                              </p>
                            )}
                          </div>
                        )
                      })()}
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

              {/* Discount Summary */}
              {discountSummary.totalSavings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Percent className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Você economizou</span>
                    </div>
                    <span className="text-sm font-bold text-green-800">
                      R$ {discountSummary.totalSavings.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    {discountSummary.totalSavingsPercentage}% de desconto aplicado
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-2">
                {discountSummary.totalSavings > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal original</span>
                    <span className="line-through">R$ {discountSummary.totalOriginalPrice.toFixed(2)}</span>
                  </div>
                )}
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

              {/* Order ID and Important Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ INSTRUÇÕES IMPORTANTES:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• <strong>Anote o número do pedido</strong> que será gerado</li>
                      <li>• Envie o comprovante de pagamento junto com este número</li>
                      <li>• Aguarde a confirmação do pagamento</li>
                      <li>• Você receberá atualizações por email</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg"
                >
                  <MessageCircle size={24} className="mr-2" />
                  Finalizar pelo WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
