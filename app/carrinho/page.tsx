'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  Package, 
  Truck, 
  Percent, 
  Tag,
  ArrowLeft,
  CreditCard,
  MapPin
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { DiscountCalculator } from '@/lib/discount-calculator'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
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
    openWhatsAppOrder,
    getDiscountSummary,
    getItemDiscount,
    getNextDiscountThreshold
  } = useCart()

  const [isLoading, setIsLoading] = useState(false)
  const shippingInfo = getShippingInfo()
  const discountSummary = getDiscountSummary()

  const handleWhatsAppOrder = () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/carrinho')
      return
    }

    // Criar pedido com dados básicos
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

  const handleContinueShopping = () => {
    router.push('/')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Adicione alguns produtos incríveis ao seu carrinho e aproveite nossos preços especiais de atacado.
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          <p className="text-gray-600 mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} no seu carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Itens do Carrinho</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => {
                  const discountInfo = getItemDiscount(item.product, item.quantity)
                  const nextThreshold = getNextDiscountThreshold(item.product, item.quantity)
                  
                  return (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor || 'default'}`} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {item.product.name}
                          </h3>
                          <div className="space-y-1 mb-3">
                            <p className="text-sm text-gray-600">
                              Tamanho: <span className="font-medium">{item.selectedSize}</span>
                            </p>
                            {item.selectedColor && (
                              <p className="text-sm text-gray-600">
                                Cor: <span className="font-medium">{item.selectedColor}</span>
                              </p>
                            )}
                          </div>
                          
                          {/* Price and Discount */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-semibold text-primary-600">
                                R$ {discountInfo.discountedPrice.toFixed(2)} cada
                              </span>
                              {discountInfo.discountPercentage > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  <Percent size={14} className="mr-1" />
                                  -{discountInfo.discountPercentage}%
                                </span>
                              )}
                            </div>
                            
                            {discountInfo.discountPercentage > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                De: R$ {discountInfo.originalPrice.toFixed(2)}
                              </p>
                            )}
                            
                            {nextThreshold && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-700">
                                  <Tag size={14} className="inline mr-1" />
                                  <strong>Dica:</strong> Compre mais {nextThreshold.neededQuantity} peça(s) para pagar apenas R$ {nextThreshold.nextPrice.toFixed(2)} cada e economizar R$ {nextThreshold.totalSavings.toFixed(2)} no total!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end space-y-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(
                                item.product.id, 
                                item.selectedSize, 
                                item.quantity - 1,
                                item.selectedColor
                              )}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center text-lg font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(
                                item.product.id, 
                                item.selectedSize, 
                                item.quantity + 1,
                                item.selectedColor
                              )}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              R$ {(discountInfo.discountedPrice * item.quantity).toFixed(2)}
                            </p>
                            {discountInfo.discountPercentage > 0 && (
                              <p className="text-sm text-green-600">
                                Economia: R$ {((discountInfo.originalPrice - discountInfo.discountedPrice) * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => removeItem(
                              item.product.id, 
                              item.selectedSize,
                              item.selectedColor
                            )}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Discount Summary */}
                {discountSummary.totalSavings > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Percent className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">Você economizou</span>
                      </div>
                      <span className="text-xl font-bold text-green-800">
                        R$ {discountSummary.totalSavings.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {discountSummary.totalSavingsPercentage}% de desconto aplicado
                    </p>
                  </div>
                )}

                {/* Shipping Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {shippingInfo.method === 'transportadora' ? (
                        <Truck className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <Package className="h-5 w-5 text-blue-600 mr-2" />
                      )}
                      <span className="font-medium text-gray-900">
                        {shippingInfo.method === 'transportadora' ? 'Transportadora' : 'Super Frete'}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {shippingInfo.method === 'transportadora' ? 'GRÁTIS' : `R$ ${shippingInfo.cost.toFixed(2)}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {shippingInfo.estimatedDays}
                  </p>
                  {!canUseTransportadora() && (
                    <p className="text-sm text-primary-600 mt-2">
                      Faltam {getMissingForTransportadora()} peças para frete grátis
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-3">
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
                  <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Important Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle size={24} />
                    Finalizar pelo WhatsApp
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}