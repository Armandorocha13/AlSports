'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Smartphone, Barcode, Truck, Package, CheckCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { createClient } from '@/lib/supabase-client'
import { Order, OrderItem, Address } from '@/lib/types/database'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { 
    items, 
    getCartSummary, 
    clearCart,
    getTotalItems,
    getSubtotal,
    getTotal,
    getShippingCost,
    createOrder,
    openWhatsAppOrder
  } = useCart()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia'>('pix')
  const [orderNotes, setOrderNotes] = useState('')
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderData, setOrderData] = useState<Order | null>(null)

  const supabase = createClient()
  const cartSummary = getCartSummary()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirectTo=/checkout')
      return
    }

    if (items.length === 0) {
      router.push('/')
      return
    }

    fetchAddresses()
  }, [user, items])

  // Verificar se usuário tem endereços cadastrados
  useEffect(() => {
    if (addresses.length === 0 && user && items.length > 0) {
      // Se não tem endereços, redirecionar para cadastro
      router.push('/minha-conta/enderecos?redirectTo=/checkout&message=Para finalizar seu pedido, você precisa cadastrar um endereço de entrega.')
    }
  }, [addresses, user, items, router])

  const fetchAddresses = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (error) {
      console.error('Erro ao buscar endereços:', error)
      return
    }

    setAddresses(data || [])
    setSelectedAddress(data?.[0] || null)
  }

  const handleCreateOrder = async () => {
    if (!user || !selectedAddress || items.length === 0) {
      if (!selectedAddress) {
        alert('Por favor, selecione um endereço de entrega ou cadastre um novo endereço.')
        router.push('/minha-conta/enderecos?redirectTo=/checkout')
        return
      }
      return
    }

    setLoading(true)

    try {
      // Criar pedido no banco de dados
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'aguardando_pagamento',
          subtotal: getSubtotal(),
          shipping_cost: getShippingCost(),
          discount_amount: 0,
          total_amount: getTotal(),
          shipping_address: {
            name: selectedAddress.name,
            street: selectedAddress.street,
            number: selectedAddress.number,
            complement: selectedAddress.complement,
            neighborhood: selectedAddress.neighborhood,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip_code: selectedAddress.zip_code
          },
          notes: orderNotes
        })
        .select()
        .single()

      if (orderError) {
        throw orderError
      }

      // Criar itens do pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.id || '',
        product_image_url: item.product.image,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unit_price: cartSummary.subtotal / cartSummary.totalItems, // Preço médio
        total_price: (cartSummary.subtotal / cartSummary.totalItems) * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw itemsError
      }

      // Criar registro de pagamento
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          method: paymentMethod,
          status: 'pendente',
          amount: getTotal()
        })

      if (paymentError) {
        throw paymentError
      }

      setOrderData(order)
      setOrderCreated(true)
      clearCart()
      
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppOrder = () => {
    if (!user || !selectedAddress) {
      alert('Por favor, selecione um endereço de entrega')
      return
    }

    // Criar pedido com todos os dados
    const order = createOrder(
      {
        name: profile?.full_name || user.user_metadata?.full_name || 'Cliente',
        email: user.email || '',
        phone: profile?.phone || user.user_metadata?.phone || ''
      },
      {
        name: selectedAddress.name,
        street: selectedAddress.street,
        number: selectedAddress.number,
        complement: selectedAddress.complement,
        neighborhood: selectedAddress.neighborhood,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip_code: selectedAddress.zip_code
      },
      paymentMethod,
      orderNotes
    )

    // Abrir WhatsApp com o pedido completo
    openWhatsAppOrder(order)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Você precisa estar logado para finalizar a compra.</p>
          <Link
            href="/auth/login?redirectTo=/checkout"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrinho Vazio</h2>
          <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
          <Link
            href="/"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    )
  }

  // Verificar se não há endereços cadastrados
  if (addresses.length === 0 && user && items.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Endereço Obrigatório</h2>
          <p className="text-gray-600 mb-6">
            Para finalizar seu pedido, você precisa cadastrar pelo menos um endereço de entrega.
          </p>
          <div className="space-y-3">
            <Link
              href="/minha-conta/enderecos?redirectTo=/checkout"
              className="block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Cadastrar Endereço
            </Link>
            <Link
              href="/carrinho"
              className="block text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              Voltar ao Carrinho
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderCreated && orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pedido Criado com Sucesso!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Seu pedido <span className="font-semibold text-primary-600">{orderData.order_number}</span> foi criado e está aguardando pagamento.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">📝 Instruções Importantes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Anote o número do pedido:</strong> {orderData.order_number}</li>
                <li>• Envie o comprovante de pagamento junto com este número</li>
                <li>• Aguarde a confirmação do pagamento</li>
                <li>• Você receberá atualizações por email</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>R$ {orderData.shipping_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>R$ {orderData.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/minha-conta/pedidos"
                className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Acompanhar Pedido
              </Link>
              <Link
                href="/"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 ml-4">
            Finalizar Compra
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Endereço de Entrega */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Endereço de Entrega
                </h2>
                
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                          selectedAddress?.id === address.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{address.name}</h3>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.number}
                              {address.complement && `, ${address.complement}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-gray-600">CEP: {address.zip_code}</p>
                          </div>
                          {address.is_default && (
                            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                              Padrão
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Link
                      href="/minha-conta/enderecos"
                      className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600 hover:border-gray-400 transition-colors duration-200"
                    >
                      + Adicionar Novo Endereço
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Nenhum endereço cadastrado</p>
                    <Link
                      href="/minha-conta/enderecos"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Cadastrar Endereço
                    </Link>
                  </div>
                )}

                {selectedAddress ? (
                  <div className="mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                    >
                      Continuar para Pagamento
                    </button>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Você precisa selecionar um endereço de entrega para continuar.
                      </p>
                    </div>
                    <Link
                      href="/minha-conta/enderecos?redirectTo=/checkout"
                      className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 inline-block text-center"
                    >
                      Cadastrar Endereço
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Método de Pagamento */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Método de Pagamento
                </h2>

                <div className="space-y-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'pix'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className="flex items-center">
                      <Smartphone className="h-6 w-6 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">PIX</h3>
                        <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'cartao_credito'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cartao_credito')}
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Cartão de Crédito</h3>
                        <p className="text-sm text-gray-600">Parcelamento disponível</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'boleto'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('boleto')}
                  >
                    <div className="flex items-center">
                      <Barcode className="h-6 w-6 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Boleto Bancário</h3>
                        <p className="text-sm text-gray-600">Pagamento em até 3 dias úteis</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="mt-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Observações do Pedido (opcional)
                  </label>
                  <textarea
                    id="notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Instruções especiais para entrega, observações sobre o pedido, etc."
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleCreateOrder}
                      disabled={loading}
                      className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processando...' : 'Finalizar Pedido'}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Finalizar pelo WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo do Pedido
              </h3>

              {/* Itens */}
              <div className="space-y-3 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.selectedSize} • {item.quantity}x
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      R$ {(cartSummary.subtotal / cartSummary.totalItems * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getTotalItems()} itens)</span>
                  <span>R$ {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span>
                    {cartSummary.shippingInfo.method === 'transportadora' 
                      ? 'GRÁTIS' 
                      : `R$ ${getShippingCost().toFixed(2)}`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Informações de Frete */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  {cartSummary.shippingInfo.method === 'transportadora' ? (
                    <Truck className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Package className="h-4 w-4 mr-2 text-primary-400" />
                  )}
                  <span>
                    {cartSummary.shippingInfo.method === 'transportadora' 
                      ? 'Transportadora (GRÁTIS)' 
                      : 'Super Frete'
                    }
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {cartSummary.shippingInfo.estimatedDays}
                </p>
                {!cartSummary.canUseTransportadora && (
                  <p className="text-xs text-primary-600 mt-1">
                    Faltam {cartSummary.missingForTransportadora} peças para frete grátis
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
