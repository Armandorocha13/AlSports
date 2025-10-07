'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingCart, Trash2, MessageCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalItems, 
    getSubtotal,
    getItemPrice,
    generateOrderCode,
    clearCart
  } = useCart()

  const getShipping = () => {
    return 25 // Frete fixo para atacado
  }

  const getTotal = () => {
    return getSubtotal() + getShipping()
  }

  const getTotalPieces = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    
    // Gerar código único do pedido
    const orderCode = generateOrderCode()
    
    // Criar mensagem para WhatsApp
    const totalPieces = getTotalPieces()
    const shippingMethod = totalPieces >= 20 ? 'Transportadora' : 'Super Frete'
    
    let message = `🛒 *PEDIDO AL SPORTS - ${orderCode}*\n\n`
    message += `📋 *RESUMO DO PEDIDO:*\n`
    
    items.forEach((item, index) => {
      const price = getItemPrice(item.product, item.quantity)
      message += `${index + 1}. ${item.product.name}\n`
      message += `   Tamanho: ${item.selectedSize}\n`
      message += `   Quantidade: ${item.quantity}x\n`
      message += `   Preço unit.: R$ ${price.toFixed(2)}\n`
      message += `   Subtotal: R$ ${(price * item.quantity).toFixed(2)}\n\n`
    })
    
    message += `💰 *VALORES:*\n`
    message += `Subtotal: R$ ${getSubtotal().toFixed(2)}\n`
    message += `Frete: R$ ${getShipping().toFixed(2)}\n`
    message += `*TOTAL: R$ ${getTotal().toFixed(2)}*\n\n`
    message += `🚚 *ENVIO:* ${shippingMethod}\n`
    message += `📦 Total de peças: ${totalPieces}\n\n`
    message += `✅ Confirme os dados e finalize o pagamento via PIX.`
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Limpar carrinho
    clearCart()
    setIsLoading(false)
    onClose()
    
    // Mostrar alerta com instruções
    alert(`🚨 Atenção! Anote o número do pedido (${orderCode}) e envie no WhatsApp para a finalização do mesmo. Certifique-se que a seleção dos produtos está correta.`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl border-l border-gray-800">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">
              Carrinho ({getTotalItems()})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-400 mb-6">
                  Adicione alguns produtos para começar sua compra
                </p>
                <button
                  onClick={onClose}
                  className="bg-primary-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Tamanho: {item.selectedSize}
                      </p>
                        <p className="text-sm font-semibold text-primary-400">
                          R$ {getItemPrice(item.product, item.quantity).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-600 rounded hover:bg-gray-700 text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-gray-600 rounded hover:bg-gray-700 text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white">
                  <span>Subtotal:</span>
                  <span>R$ {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white">
                  <span>Frete:</span>
                  <span>R$ {getShipping().toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {getTotalPieces() >= 20 ? (
                    <span className="text-green-400">✓ Envio por transportadora (20+ peças)</span>
                  ) : (
                    <span>Envio via Super Frete (abaixo de 20 peças)</span>
                  )}
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-800 pt-2 text-white">
                  <span>Total:</span>
                  <span>R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Processando...'
                ) : (
                  <>
                    <MessageCircle size={20} />
                    Finalizar via WhatsApp
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
