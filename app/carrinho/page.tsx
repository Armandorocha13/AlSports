'use client'

import { useState, useEffect } from 'react'
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
  MapPin,
  Heart,
  Star,
  Clock,
  Gift,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Save,
  Share2,
  Eye,
  X
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { DiscountCalculator } from '@/lib/discount-calculator'
import { sampleProducts } from '@/lib/data'
import { shippingService } from '@/lib/shipping'
import ShippingCalculator from '@/components/ShippingCalculator'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPieces,
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
    saveOrderToDatabase,
    getDiscountSummary,
    getItemDiscount,
    getNextDiscountThreshold
  } = useCart()

  const [isLoading, setIsLoading] = useState(false)
  const [savedCarts, setSavedCarts] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [cepCode, setCepCode] = useState('')
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [showStockAlert, setShowStockAlert] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = useState<any>(null)
  
  const shippingInfo = getShippingInfo()
  const discountSummary = getDiscountSummary()

  // Funções para novas funcionalidades
  const getRelatedProducts = () => {
    if (items.length === 0) return []
    const currentCategories = Array.from(new Set(items.map(item => item.product.category)))
    return sampleProducts
      .filter(product => 
        currentCategories.includes(product.category) && 
        !items.some(item => item.product.id === product.id)
      )
      .slice(0, 4)
  }

  const handleSaveCart = () => {
    if (!user) {
      alert('Faça login para salvar seu carrinho')
      return
    }
    const cartData = {
      id: Date.now().toString(),
      name: `Carrinho ${new Date().toLocaleDateString()}`,
      items: items,
      total: getTotal(),
      savedAt: new Date()
    }
    setSavedCarts(prev => [...prev, cartData])
    alert('Carrinho salvo com sucesso!')
  }

  const handleApplyCoupon = () => {
    const validCoupons: { [key: string]: number } = {
      'DESCONTO10': 10,
      'ATACADO15': 15,
      'PRIMEIRA20': 20,
      'FREEGRATIS': 0 // Frete grátis
    }
    
    if (validCoupons[couponCode.toUpperCase()] !== undefined) {
      setCouponDiscount(validCoupons[couponCode.toUpperCase()])
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponCode('')
      alert(`Cupom ${couponCode.toUpperCase()} aplicado com sucesso!`)
    } else {
      alert('Cupom inválido')
    }
  }

  const handleAddToFavorites = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getFinalShippingCost = () => {
    if (selectedShippingOption) {
      return selectedShippingOption.price
    }
    return getShippingCost()
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCepCode(formatCep(value))
    setCepError('')
  }

  const handleCepSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cepCode || cepCode.length < 9) {
      setCepError('CEP deve ter 8 dígitos')
      return
    }

    setCepLoading(true)
    setCepError('')
    
    try {
      // Aqui você pode implementar a lógica para buscar informações do CEP
      // Por enquanto, vamos apenas simular um sucesso
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('CEP consultado:', cepCode)
    } catch (error) {
      setCepError('Erro ao consultar CEP')
    } finally {
      setCepLoading(false)
    }
  }


  const handleWhatsAppOrder = async () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/carrinho')
      return
    }

    setIsLoading(true)
    try {
      const customerInfo = {
        name: user.user_metadata?.full_name || 'Cliente',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      }

      console.log('👤 Dados do cliente:', customerInfo)

      const order = createOrder(
        customerInfo,
        undefined,
        'WhatsApp',
        'Pedido finalizado via WhatsApp',
        cepCode
      )

      console.log('📦 Pedido criado:', order)

      // Salvar pedido no banco de dados
      console.log('💾 Salvando pedido...')
      const savedOrder = await saveOrderToDatabase(customerInfo, order)
      console.log('✅ Pedido salvo:', savedOrder)

      alert(
        `🎉 Pedido Criado! Seu número de pedido é: *${order.code}*\n\n` +
        `📝 *INSTRUÇÕES IMPORTANTES:*\n` +
        `• Anote o número do pedido.\n` +
        `• Envie o comprovante de pagamento junto com este número via WhatsApp.\n` +
        `• Aguarde a confirmação do pagamento.\n\n` +
        `✅ *Pedido salvo! Você pode acompanhar na aba "Meus Pedidos".*`
      )

      const phoneNumber = '5521990708854'
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `Olá! Tenho um novo pedido para você:\n\n` +
        `*Número do Pedido:* ${order.code}\n` +
        `*Total:* R$ ${getTotal().toFixed(2)}\n` +
        `*CEP para entrega:* ${cepCode || 'Não informado'}\n` +
        `*Itens:*\n${order.items.map((item: any) => `- ${item.quantity}x ${item.productName} (${item.size}) - R$ ${item.totalPrice.toFixed(2)}`).join('\n')}\n\n` +
        `Por favor, aguardo as instruções para pagamento e envio do comprovante.`
      )}`
      window.open(whatsappUrl, '_blank')

      clearCart()
      router.push('/minha-conta/pedidos')
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error)
      alert('Ocorreu um erro ao finalizar seu pedido. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueShopping = () => {
    router.push('/')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Mobile Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Carrinho</span>
            </button>
            <div className="text-sm text-gray-400">0 itens</div>
          </div>
        </div>

        <div className="bg-gray-800 p-12 text-center">
          <ShoppingCart size={64} className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Adicione alguns produtos incríveis ao seu carrinho e aproveite nossos preços especiais de atacado.</p>
          <button
            onClick={handleContinueShopping}
            className="bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors duration-200"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Carrinho</span>
          </button>
          <div className="text-sm text-gray-400">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>

      {/* Product Items */}
      <div className="bg-gray-800">
        {items.map((item, index) => {
          const discountInfo = getItemDiscount(item.product, item.quantity)
          
          return (
            <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor || 'default'}`} className="border-b border-gray-700 p-4">
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                             <h3 className="font-medium text-white text-sm leading-tight">
                               {item.product.name}
                             </h3>
                             <p className="text-xs text-gray-400 mt-1">
                               {item.selectedSize} • {item.selectedColor || 'Cor padrão'}
                             </p>
                             <p className="text-xs text-gray-400 mt-1">
                               2-5 Dias úteis após a confirmação do pagamento
                             </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1, item.selectedColor)}
                               className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-full hover:bg-gray-700"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1, item.selectedColor)}
                               className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-full hover:bg-gray-700"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                             <div className="text-sm font-semibold text-white">
                        R$ {(discountInfo.discountedPrice * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                      {discountInfo.discountPercentage > 0 && (
                        <div className="text-xs text-green-600">
                          Economia: R$ {discountInfo.savings.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Shipping Calculator */}
      <div className="mt-4">
        <ShippingCalculator
          products={items.map(item => ({
            category: item.product.category,
            value: getItemPrice(item.product, item.quantity),
            quantity: item.quantity
          }))}
          totalPieces={getTotalPieces()}
          onShippingSelect={setSelectedShippingOption}
        />
      </div>

      {/* CEP Section */}
      <div className="bg-gray-800 mt-4 p-4">
        <h3 className="font-medium text-white mb-3">CEP para envio do pedido</h3>
        <form onSubmit={handleCepSubmit} className="flex space-x-3">
          <input
            type="text"
            placeholder="Digite seu CEP (ex: 12345-678)"
            value={cepCode}
            onChange={handleCepChange}
            maxLength={9}
            className="flex-1 px-3 py-2 border border-gray-600 rounded-lg text-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={cepLoading}
            className="bg-primary-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cepLoading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>
        {cepError && (
          <div className="mt-2 text-sm text-red-400">
            {cepError}
          </div>
        )}
        {cepCode && !cepError && (
          <div className="mt-2 text-sm text-green-400">
            CEP {cepCode} consultado com sucesso!
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-800 mt-4 p-4">
        <h3 className="font-medium text-white mb-3">Resumo do Pedido</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({getTotalItems()} itens)</span>
            <span>R$ {getSubtotal().toFixed(2).replace('.', ',')}</span>
          </div>
          
          
          <div className="flex justify-between text-sm">
            <span>Frete</span>
            <span>
              {selectedShippingOption ? (
                `R$ ${selectedShippingOption.price.toFixed(2).replace('.', ',')}`
              ) : (
                `R$ ${getShippingCost().toFixed(2).replace('.', ',')}`
              )}
            </span>
          </div>
          
          
          {/* Total Destacado */}
          <div className="border-t border-gray-600 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total a pagar:</span>
              <span className="text-xl font-bold text-primary-400">R$ {getTotal().toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Total a pagar:</span>
          <span className="text-lg font-bold text-white">R$ {getTotal().toFixed(2).replace('.', ',')}</span>
        </div>
        <button
          onClick={handleWhatsAppOrder}
          disabled={isLoading}
          className="w-full bg-primary-500 text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-400 transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <MessageCircle size={20} />
          )}
          Fechar pedido
        </button>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind fixed button */}
      <div className="h-24"></div>
    </div>
  )
}