'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { getProductDimensions } from '@/lib/product-dimensions'
import { ShippingOption, superFreteService } from '@/lib/shipping-service'
import { 
  AlertCircle,
  ArrowLeft, 
  CheckCircle,
  Search, 
  Truck
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const cartSummary = getCartSummary()

  // Gerar ID único do pedido quando entrar no step 3 (resumo)
  useEffect(() => {
    if (step === 3 && !orderId) {
      // Gerar ID único e curto: timestamp (últimos dígitos) + aleatório
      const timestamp = Date.now().toString().slice(-8) // Últimos 8 dígitos do timestamp
      const random = Math.random().toString(36).substring(2, 6).toUpperCase() // 4 caracteres aleatórios
      const uniqueId = `ALS-${timestamp}${random}`
      setOrderId(uniqueId)
    }
  }, [step, orderId])

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
    
    // Validar CEP em tempo real
    const error = validateField('cep', cep)
    if (error) {
      setErrors(prev => ({ ...prev, cep: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.cep
        return newErrors
      })
    }
    
    if (cep.length === 8) {
      try {
        // Buscar CEP via API
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        
        if (!data.erro && data.logradouro) {
          setAddressData(prev => ({
            ...prev,
            address: data.logradouro || prev.address,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state
          }))
          
          // Validar campos preenchidos automaticamente
          if (data.logradouro) handleFieldChange('address', data.logradouro)
          if (data.bairro) handleFieldChange('neighborhood', data.bairro)
          if (data.localidade) handleFieldChange('city', data.localidade)
          if (data.uf) handleFieldChange('state', data.uf)
        } else if (data.erro) {
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP. Verifique e preencha manualmente.' }))
      }
    }
  }

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Nome completo é obrigatório'
        if (value.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres'
        return null
      case 'cep':
        if (!value.trim()) return 'CEP é obrigatório'
        if (value.length !== 8) return 'CEP deve ter 8 dígitos'
        return null
      case 'address':
        if (!value.trim()) return 'Endereço é obrigatório'
        return null
      case 'number':
        if (!value.trim()) return 'Número é obrigatório'
        return null
      case 'neighborhood':
        if (!value.trim()) return 'Bairro é obrigatório'
        return null
      case 'city':
        if (!value.trim()) return 'Cidade é obrigatória'
        return null
      case 'state':
        if (!value.trim()) return 'Estado é obrigatório'
        if (value.length !== 2) return 'Estado deve ter 2 caracteres (ex: SP, RJ)'
        return null
      case 'phone':
        if (!value.trim()) return 'Telefone é obrigatório'
        const phoneNumbers = value.replace(/\D/g, '')
        if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
          return 'Telefone inválido (deve ter 10 ou 11 dígitos)'
        }
        return null
      case 'email':
        if (!value.trim()) return 'E-mail é obrigatório'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'E-mail inválido'
        return null
      default:
        return null
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }))
    
    // Validar em tempo real e remover erro se válido
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    Object.keys(addressData).forEach(key => {
      if (key === 'complement') return // Complemento é opcional
      
      const error = validateField(key, addressData[key as keyof typeof addressData])
      if (error) {
        newErrors[key] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAllFields()) {
      const firstError = Object.values(errors)[0]
      if (firstError) {
        alert(firstError)
      } else {
        alert('Por favor, preencha todos os campos obrigatórios')
      }
      return
    }
    
    // Buscar opções de frete do SuperFrete
    await fetchShippingOptions()
    
    setStep(2)
  }

  const fetchShippingOptions = async () => {
    if (!addressData.cep || addressData.cep.length !== 8) {
      return
    }

    setLoadingShipping(true)
    setShippingError(null)
    setShippingOptions([])

    try {
      // CEP de origem - local de envio dos pacotes
      const fromCep = '26015005' // CEP de origem (26015-005)
      const toCep = addressData.cep.replace(/\D/g, '')

      // Mapear produtos do carrinho para o formato do SuperFrete
      // Usando função dedicada que já inclui as dimensões corretas
      const products = cartSummary.items.map(item => {
        // Tentar extrair categoria do item ou usar padrão
        // A categoria pode vir do item ou ser inferida pelo nome
        const category = (item as any).category || 'default'
        const dimensions = getProductDimensions(category)
        
        return {
          width: dimensions.width,
          height: dimensions.height,
          length: dimensions.length,
          weight: dimensions.weight,
          value: item.price,
          quantity: item.quantity
        }
      })

      console.log('🚚 Calculando frete para CEP:', toCep)
      console.log('📦 Produtos:', products)

      const options = await superFreteService.getShippingOptions(
        fromCep,
        toCep,
        products,
        cartSummary.totalItems
      )

      // Opções já filtradas no service (incluindo remoção de "elem")
      const filteredOptions = options

      if (filteredOptions.length === 0) {
        setShippingError('Nenhuma opção de frete disponível para este CEP. Por favor, verifique o CEP ou tente novamente mais tarde.')
      } else {
        setShippingOptions(filteredOptions)
        // Selecionar automaticamente a opção mais barata
        if (filteredOptions.length > 0) {
          const cheapest = filteredOptions.reduce((prev, current) => 
            prev.price < current.price ? prev : current
          )
          setShippingMethod(String(cheapest.id))
        }
      }
    } catch (error) {
      console.error('❌ Erro ao calcular frete:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao calcular frete'
      setShippingError(`Erro ao calcular frete: ${errorMessage}. Por favor, verifique o CEP e tente novamente.`)
    } finally {
      setLoadingShipping(false)
    }
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar todos os campos obrigatórios antes de finalizar
    if (!validateAllFields()) {
      alert('Por favor, complete todos os campos obrigatórios do endereço antes de finalizar o pedido.')
      setStep(1) // Voltar para o passo do endereço
      return
    }
    
    // Validar método de entrega
    if (!shippingMethod) {
      alert('Por favor, selecione um método de entrega.')
      return
    }
    
    setLoading(true)

    try {
      const selectedShippingOption = shippingOptions.find(opt => String(opt.id) === shippingMethod)
      const shippingPrice = selectedShippingOption?.price || 0
      const totalWithShipping = cartSummary.subtotal + shippingPrice

      // Usar o ID único gerado ou gerar um novo se não existir
      const finalOrderId = orderId || (() => {
        const timestamp = Date.now().toString().slice(-8) // Últimos 8 dígitos do timestamp
        const random = Math.random().toString(36).substring(2, 6).toUpperCase() // 4 caracteres aleatórios
        return `ALS-${timestamp}${random}`
      })()

      const orderData = {
        customer: addressData,
        items: cartSummary.items,
        shipping: {
          method: shippingMethod,
          option: selectedShippingOption,
          price: shippingPrice
        },
        subtotal: cartSummary.subtotal,
        shippingCost: shippingPrice,
        total: totalWithShipping,
        orderId: finalOrderId,
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Acesso Negado</div>
          <div className="text-gray-300 mb-6">Você precisa estar logado para finalizar a compra.</div>
          <Link
            href="/auth/login?redirect=/checkout"
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-black">

      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-2xl flex-1">
          {/* Progress Steps */}
          <div className="flex flex-wrap gap-2 p-4 text-sm sm:text-base">
            <span className={`font-bold ${step >= 1 ? 'text-yellow-400' : 'text-gray-500'}`}>1. Endereço</span>
            <span className="text-gray-500 font-medium">/</span>
            <span className={`font-medium ${step >= 2 ? 'text-yellow-400' : 'text-gray-500'}`}>2. Método de Entrega</span>
            <span className="text-gray-500 font-medium">/</span>
            <span className={`font-medium ${step >= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>3. Finalizar</span>
            </div>
            
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Endereço de Entrega</p>
                <p className="text-gray-400 text-base font-normal leading-normal">Informe onde você quer receber seu pedido.</p>
                </div>
                </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Método de Entrega</p>
                <p className="text-gray-400 text-base font-normal leading-normal">Escolha como você quer receber seu pedido.</p>
                </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Finalizar Pedido</p>
                <p className="text-gray-400 text-base font-normal leading-normal">Revise seu pedido e confirme.</p>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Pedido Confirmado!</p>
                <p className="text-gray-400 text-base font-normal leading-normal">Seu pedido foi enviado para o WhatsApp.</p>
            </div>
          </div>
          )}

          {/* Forms */}
          <div className="mt-6 bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-yellow-400/20">
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col w-full">
                    <p className="text-white text-base font-medium leading-normal pb-2">
                      Nome Completo <span className="text-yellow-400">*</span>
                    </p>
                    <input 
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white bg-gray-800 focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                        errors.fullName 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-700'
                      }`}
                      placeholder="Digite seu nome completo" 
                      value={addressData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </label>
                  
                  <label className="flex flex-col w-full">
                    <p className="text-white text-base font-medium leading-normal pb-2">
                      CEP <span className="text-yellow-400">*</span>
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border border-r-0 focus:border-yellow-400 bg-gray-800 h-12 placeholder:text-gray-500 px-4 pr-2 text-base font-normal leading-normal ${
                          errors.cep 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="00000000" 
                        value={addressData.cep}
                        onChange={(e) => {
                          const cepValue = e.target.value.replace(/\D/g, '')
                          handleCepChange(cepValue)
                          handleFieldChange('cep', cepValue)
                        }}
                        maxLength={8}
                        required
                      />
                      <div className="text-yellow-400 flex border border-l-0 border-gray-700 bg-gray-800 items-center justify-center px-4 rounded-r-lg">
                        <Search className="h-5 w-5" />
        </div>
      </div>
                    {errors.cep && (
                      <p className="text-red-400 text-sm mt-1">{errors.cep}</p>
                    )}
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        Endereço <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          errors.address 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="Rua, Avenida..." 
                        value={addressData.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        required
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                      )}
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        Número <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          errors.number 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="123" 
                        value={addressData.number}
                        onChange={(e) => handleFieldChange('number', e.target.value)}
                        required
                      />
                      {errors.number && (
                        <p className="text-red-400 text-sm mt-1">{errors.number}</p>
                      )}
                    </label>
        </div>

                  <label className="flex flex-col w-full">
                    <p className="text-white text-base font-medium leading-normal pb-2">Complemento (Opcional)</p>
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border border-gray-700 bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal" 
                      placeholder="Apartamento, casa..." 
                      value={addressData.complement}
                      onChange={(e) => setAddressData(prev => ({ ...prev, complement: e.target.value }))}
                    />
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        Bairro <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          errors.neighborhood 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="Centro" 
                        value={addressData.neighborhood}
                        onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
                        required
                      />
                      {errors.neighborhood && (
                        <p className="text-red-400 text-sm mt-1">{errors.neighborhood}</p>
                      )}
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        Cidade <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          errors.city 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="São Paulo" 
                        value={addressData.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        required
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                      )}
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        Estado <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal uppercase ${
                          errors.state 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="SP" 
                        value={addressData.state.toUpperCase()}
                        onChange={(e) => handleFieldChange('state', e.target.value.toUpperCase())}
                        maxLength={2}
                        required
                      />
                      {errors.state && (
                        <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                      )}
                    </label>
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        Telefone <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          errors.phone 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="(11) 99999-9999" 
                        value={addressData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        required
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </label>
                    
                    <label className="flex flex-col w-full">
                      <p className="text-white text-base font-medium leading-normal pb-2">
                        E-mail <span className="text-yellow-400">*</span>
                      </p>
                      <input 
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-yellow-400/50 border bg-gray-800 focus:border-yellow-400 h-12 placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-700'
                        }`}
                        placeholder="seu@email.com" 
                        type="email"
                        value={addressData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </label>
                        </div>
                      </div>

                <div className="flex justify-end">
                    <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0 || !addressData.fullName.trim() || !addressData.cep.trim() || !addressData.address.trim() || !addressData.number.trim() || !addressData.neighborhood.trim() || !addressData.city.trim() || !addressData.state.trim() || !addressData.phone.trim() || !addressData.email.trim()}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
                    >
                    Continuar para Entrega
                    </button>
                  </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleShippingSubmit} className="flex flex-col gap-6">
                {loadingShipping && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                    <p className="text-white">Calculando opções de frete...</p>
                  </div>
                )}

                {cartSummary.totalItems < 20 && (
                  <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-bold mb-1">⚠️ Aviso Importante</p>
                      <p className="text-red-300 text-sm">
                        Transportadoras como JADLOG, LOGGI e outras privadas estão disponíveis apenas para pedidos com <strong className="font-bold">mais de 20 peças</strong>.
                      </p>
                      <p className="text-red-200 text-xs mt-2">
                        Seu pedido atual tem {cartSummary.totalItems} peça{cartSummary.totalItems !== 1 ? 's' : ''}. Adicione mais itens para ver essas opções de frete.
                      </p>
                    </div>
                  </div>
                )}

                {shippingError && !loadingShipping && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                      <p className="text-red-400 font-medium mb-1">Erro ao calcular frete</p>
                      <p className="text-red-300 text-sm">{shippingError}</p>
                      <button
                        type="button"
                        onClick={fetchShippingOptions}
                        className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-medium underline"
                      >
                        Tentar novamente
                      </button>
                    </div>
                      </div>
                )}

                {!loadingShipping && !shippingError && shippingOptions.length === 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-400/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium mb-1">Nenhuma opção de frete disponível</p>
                      <p className="text-yellow-300 text-sm">Não foi possível encontrar opções de frete para este CEP.</p>
                      <button
                        type="button"
                        onClick={fetchShippingOptions}
                        className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-medium underline"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </div>
                )}

                {!loadingShipping && shippingOptions.length > 0 && (
                  <div className="space-y-4">
                    {shippingOptions.map((option, index) => {
                      const deliveryRange = (option as any).delivery_range || { min: option.delivery_time, max: option.delivery_time }
                      const deliveryDays = deliveryRange.min === deliveryRange.max 
                        ? `${deliveryRange.min} dia${deliveryRange.min !== 1 ? 's' : ''} útil${deliveryRange.min !== 1 ? 'eis' : ''}`
                        : `${deliveryRange.min}-${deliveryRange.max} dias úteis`
                      
                      // Verificar se é a opção mais barata (melhor preço)
                      const isBestPrice = index === 0 // Primeira opção após ordenação por preço
                      
                      return (
                        <div
                          key={option.id}
                          className={`border rounded-lg p-4 transition-colors relative ${
                            shippingMethod === String(option.id)
                              ? 'border-yellow-400 bg-yellow-400/10'
                              : 'border-yellow-400/20 hover:border-yellow-400/40'
                          }`}
                        >
                          {isBestPrice && shippingOptions.length > 1 && (
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                              <span>⭐</span>
                              <span>Melhor preço</span>
                            </div>
                          )}
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                              id={`shipping-${option.id}`}
                        name="shipping" 
                              value={String(option.id)}
                              checked={shippingMethod === String(option.id)}
                        onChange={(e) => setShippingMethod(e.target.value)}
                              className="text-yellow-400 focus:ring-yellow-400"
                            />
                            <label htmlFor={`shipping-${option.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                              {option.company?.picture ? (
                                <img 
                                  src={option.company.picture} 
                                  alt={option.company.name}
                                  className="h-8 w-8 object-contain rounded bg-white p-1"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none'
                                  }}
                                />
                              ) : (
                                <Truck className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-white">{option.name}</p>
                                  <div className="text-right">
                                    {option.originalPrice && option.originalPrice > option.price && (
                                      <p className="text-xs text-gray-500 line-through mb-0.5">
                                        R$ {option.originalPrice.toFixed(2)}
                                      </p>
                                    )}
                                    <p className="font-bold text-yellow-400">R$ {option.price.toFixed(2)}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-400">
                                  {option.company?.name || 'Transportadora'}
                                </p>
                      </div>
                      </label>
                    </div>
                  </div>
                      )
                    })}
                </div>
                )}

                <div className="flex justify-between">
                    <button
                    type="button"
                      onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                    <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </button>
                    <button
                    type="submit"
                    disabled={!shippingMethod || loadingShipping || shippingOptions.length === 0}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                    </button>
                  </div>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-yellow-400/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Resumo do Pedido</h3>
                    {orderId && (
                      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2">
                        <p className="text-xs text-gray-400 mb-1">ID do Pedido</p>
                        <p className="text-yellow-400 font-bold text-sm">{orderId}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* Endereço de Entrega */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-yellow-400/10">
                      <h4 className="font-medium mb-2 text-white flex items-center gap-2">
                        <Truck className="h-4 w-4 text-yellow-400" />
                        Endereço de Entrega
                      </h4>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">{addressData.fullName}</span><br />
                        {addressData.address}, {addressData.number}
                        {addressData.complement && ` - ${addressData.complement}`}<br />
                      {addressData.neighborhood}, {addressData.city} - {addressData.state}<br />
                        CEP: {addressData.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}<br />
                        {addressData.phone && `Tel: ${addressData.phone}`}
                        {addressData.email && <><br />Email: {addressData.email}</>}
                      </p>
                    </div>

                    {/* Método de Entrega */}
                    {shippingMethod && shippingOptions.length > 0 && (() => {
                      const selectedOption = shippingOptions.find(opt => String(opt.id) === shippingMethod)
                      if (selectedOption) {
                        const deliveryRange = (selectedOption as any).delivery_range || { min: selectedOption.delivery_time, max: selectedOption.delivery_time }
                        return (
                          <div className="bg-gray-900 p-4 rounded-lg border border-yellow-400/10">
                            <h4 className="font-medium mb-2 text-white flex items-center gap-2">
                              <Truck className="h-4 w-4 text-yellow-400" />
                              Método de Entrega
                            </h4>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-white">{selectedOption.name}</p>
                                <p className="text-xs text-gray-400">{selectedOption.company?.name || 'Transportadora'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-yellow-400">R$ {selectedOption.price.toFixed(2)}</p>
                                {deliveryRange.min === deliveryRange.max ? (
                                  <p className="text-xs text-gray-400">{deliveryRange.min} dia{deliveryRange.min !== 1 ? 's' : ''} útil{deliveryRange.min !== 1 ? 'eis' : ''}</p>
                                ) : (
                                  <p className="text-xs text-gray-400">{deliveryRange.min}-{deliveryRange.max} dias úteis</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Itens do Pedido */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-yellow-400/10">
                      <h4 className="font-medium mb-3 text-white">Itens do Pedido</h4>
                      <div className="space-y-3">
                        {cartSummary.items.map((item, index) => (
                          <div key={index} className="border-b border-yellow-400/20 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{item.name}</p>
                                {item.id && (
                                  <p className="text-xs text-gray-400 mt-1">ID: {item.id}</p>
                                )}
                                {item.size && (
                                  <p className="text-xs text-gray-400">Tamanho: {item.size}</p>
                                )}
                                {item.color && (
                                  <p className="text-xs text-gray-400">Cor: {item.color}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-sm text-gray-400">
                                {item.quantity}x R$ {item.price.toFixed(2)}
                              </p>
                              <p className="text-sm font-bold text-yellow-400">
                                R$ {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                  </div>
                ))}
                      </div>
                    </div>

                    {/* Resumo de Valores */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-yellow-400/10">
                      <h4 className="font-medium mb-3 text-white">Resumo de Valores</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Subtotal ({cartSummary.items.reduce((total, item) => total + item.quantity, 0)} {cartSummary.items.reduce((total, item) => total + item.quantity, 0) === 1 ? 'item' : 'itens'})</span>
                          <span>R$ {cartSummary.subtotal.toFixed(2)}</span>
                        </div>
                        {shippingMethod && shippingOptions.length > 0 && (() => {
                          const selectedOption = shippingOptions.find(opt => String(opt.id) === shippingMethod)
                          const shippingPrice = selectedOption?.price || 0
                          return (
                            <>
                              <div className="flex justify-between text-sm text-gray-300">
                                <span>Frete</span>
                                <span>R$ {shippingPrice.toFixed(2)}</span>
                              </div>
                              <div className="border-t border-yellow-400/20 pt-2 mt-2">
                                <div className="flex justify-between font-semibold text-yellow-400">
                                  <span>Total</span>
                                  <span>R$ {(cartSummary.subtotal + shippingPrice).toFixed(2)}</span>
                                </div>
                              </div>
                            </>
                          )
                        })()}
                        {!shippingMethod && (
                          <div className="flex justify-between text-sm text-gray-300">
                            <span>Total</span>
                            <span>R$ {cartSummary.subtotal.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                </div>
                </div>
              </div>

                <div className="flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <button 
                    type="button"
                    onClick={handleOrderSubmit}
                    disabled={loading}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Ir para Pagamento
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/30">
                  <CheckCircle className="h-8 w-8 text-yellow-400" />
              </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Pedido Confirmado!</h3>
                <p className="text-gray-400 mb-6">
                  Seu pedido foi enviado para o WhatsApp. Em breve entraremos em contato para confirmar os detalhes.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/"
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    Continuar Comprando
                  </Link>
                  <Link
                    href="/minha-conta/pedidos"
                    className="border border-yellow-400/30 text-white px-6 py-3 rounded-lg hover:bg-yellow-400/10 transition-colors font-medium"
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