'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Truck,
  CreditCard,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { getCartSummary, createOrder, openWhatsAppOrder } = useCart()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [addressData, setAddressData] = useState({
    fullName: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    phone: '',
    email: ''
  })
  const [shippingMethod, setShippingMethod] = useState('')
  const [orderSummary, setOrderSummary] = useState<any>(null)

  const cartSummary = getCartSummary()

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [user, router])

  // Preencher dados do usuário se disponível
  useEffect(() => {
    if (profile) {
      setAddressData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        email: user?.email || ''
      }))
    }
  }, [profile, user])

  const handleCepChange = async (cep: string) => {
    setAddressData(prev => ({ ...prev, cep }))
    
    if (cep.length === 8) {
      try {
        // Simular busca de CEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          setAddressData(prev => ({
            ...prev,
            address: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        customer: addressData,
        items: cartSummary.items,
        shipping: shippingMethod,
        total: cartSummary.total,
        orderId: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString()
      }

      const result = await createOrder(orderData)
      
      if (result.success) {
        setOrderSummary(orderData)
        openWhatsAppOrder(orderData)
        setStep(4)
      } else {
        alert('Erro ao criar pedido: ' + result.error)
      }
    } catch (error) {
      console.error('Erro no checkout:', error)
      alert('Erro ao processar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-text-light-primary dark:text-text-dark-primary text-xl mb-4">Acesso Negado</div>
          <div className="text-text-light-secondary dark:text-text-dark-secondary mb-6">Você precisa estar logado para finalizar a compra.</div>
          <Link
            href="/auth/login?redirect=/checkout"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 sm:px-10 py-3">
        <div className="flex items-center gap-4 text-gray-900 dark:text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Sua Loja</h2>
          </Link>
        </div>
        <Link href="/carrinho" className="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </Link>
      </header>

      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-2xl flex-1">
          {/* Progress Steps */}
          <div className="flex flex-wrap gap-2 p-4 text-sm sm:text-base">
            <span className={`font-bold ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>1. Endereço</span>
            <span className="text-gray-400 dark:text-gray-500 font-medium">/</span>
            <span className={`font-medium ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>2. Resumo</span>
            <span className="text-gray-400 dark:text-gray-500 font-medium">/</span>
            <span className={`font-medium ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>3. Finalizar</span>
            </div>
            
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Endereço de Entrega</p>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Informe onde você quer receber seu pedido.</p>
                </div>
                </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Método de Entrega</p>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Escolha como você quer receber seu pedido.</p>
                </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Finalizar Pedido</p>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Revise seu pedido e confirme.</p>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Pedido Confirmado!</p>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Seu pedido foi enviado para o WhatsApp.</p>
            </div>
          </div>
          )}

          {/* Forms */}
          <div className="mt-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col w-full">
                    <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Nome Completo</p>
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                      placeholder="Digite seu nome completo" 
                      value={addressData.fullName}
                      onChange={(e) => setAddressData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </label>
                  
                  <label className="flex flex-col w-full">
                    <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">CEP</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-r-0 border-gray-300 dark:border-gray-700 dark:focus:border-primary bg-white dark:bg-gray-800 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 pr-2 text-base font-normal leading-normal" 
                        placeholder="00000-000" 
                        value={addressData.cep}
                        onChange={(e) => handleCepChange(e.target.value.replace(/\D/g, ''))}
                        maxLength={8}
                        required
                      />
                      <div className="text-gray-500 dark:text-gray-400 flex border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 items-center justify-center px-4 rounded-r-lg">
                        <Search className="h-5 w-5" />
        </div>
      </div>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Endereço</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="Rua, Avenida..." 
                        value={addressData.address}
                        onChange={(e) => setAddressData(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Número</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="123" 
                        value={addressData.number}
                        onChange={(e) => setAddressData(prev => ({ ...prev, number: e.target.value }))}
                        required
                      />
                    </label>
        </div>

                  <label className="flex flex-col w-full">
                    <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Complemento (Opcional)</p>
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                      placeholder="Apartamento, casa..." 
                      value={addressData.complement}
                      onChange={(e) => setAddressData(prev => ({ ...prev, complement: e.target.value }))}
                    />
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Bairro</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="Centro" 
                        value={addressData.neighborhood}
                        onChange={(e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                        required
                      />
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Cidade</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="São Paulo" 
                        value={addressData.city}
                        onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Estado</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="SP" 
                        value={addressData.state}
                        onChange={(e) => setAddressData(prev => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    </label>
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Telefone</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="(11) 99999-9999" 
                        value={addressData.phone}
                        onChange={(e) => setAddressData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">E-mail</p>
                      <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                        placeholder="seu@email.com" 
                        type="email"
                        value={addressData.email}
                        onChange={(e) => setAddressData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </label>
                        </div>
                      </div>

                <div className="flex justify-end">
                    <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                    Continuar
                    </button>
                  </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleShippingSubmit} className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        id="transportadora" 
                        name="shipping" 
                        value="transportadora"
                        checked={shippingMethod === 'transportadora'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor="transportadora" className="flex items-center gap-3 cursor-pointer">
                        <Truck className="h-5 w-5 text-primary" />
                      <div>
                          <p className="font-medium">Transportadora</p>
                          <p className="text-sm text-gray-500">Frete grátis - 3-5 dias úteis</p>
                      </div>
                      </label>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        id="superfrete" 
                        name="shipping" 
                        value="superfrete"
                        checked={shippingMethod === 'superfrete'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor="superfrete" className="flex items-center gap-3 cursor-pointer">
                        <MapPin className="h-5 w-5 text-primary" />
                      <div>
                          <p className="font-medium">Super Frete</p>
                          <p className="text-sm text-gray-500">R$ 15,00 - 5-7 dias úteis</p>
                      </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                    <button
                    type="button"
                      onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                    <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </button>
                    <button
                    type="submit"
                    disabled={!shippingMethod}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                    </button>
                  </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleOrderSubmit} className="flex flex-col gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Resumo do Pedido</h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Endereço de Entrega</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {addressData.fullName}<br />
                      {addressData.address}, {addressData.number}<br />
                      {addressData.neighborhood}, {addressData.city} - {addressData.state}<br />
                      CEP: {addressData.cep}
                      </p>
                    </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Método de Entrega</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {shippingMethod === 'transportadora' ? 'Transportadora - Frete Grátis' : 'Super Frete - R$ 15,00'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Itens do Pedido</h4>
                    {cartSummary.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                    <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>R$ {cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                        <span>Frete:</span>
                        <span>{cartSummary.shipping === 0 ? 'Grátis' : `R$ ${cartSummary.shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>R$ {cartSummary.total.toFixed(2)}</span>
                      </div>
                </div>
                </div>
              </div>

                <div className="flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Finalizar Pedido
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
                <h3 className="text-xl font-semibold mb-2">Pedido Confirmado!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Seu pedido foi enviado para o WhatsApp. Em breve entraremos em contato para confirmar os detalhes.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/"
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Continuar Comprando
                  </Link>
                  <Link
                    href="/minha-conta/pedidos"
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    Ver Pedidos
                  </Link>
            </div>
          </div>
            )}
        </div>
      </div>
      </main>
    </div>
  )
}