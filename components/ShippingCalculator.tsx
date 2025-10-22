'use client'

import { useState } from 'react'
import { Truck, Clock, Package, AlertCircle, MapPin } from 'lucide-react'
import { useShipping } from '@/hooks/useShipping'
import { ShippingOption } from '@/lib/shipping-service'

interface ShippingCalculatorProps {
  products: Array<{
    category: string
    value: number
    quantity: number
  }>
  totalPieces?: number
  onShippingSelect?: (option: ShippingOption | null) => void
}

export default function ShippingCalculator({ products, totalPieces = 0, onShippingSelect }: ShippingCalculatorProps) {
  const [toCep, setToCep] = useState('')
  const fromCep = '26015-005' // Nova Iguaçu - RJ (fixo)
  
  const { shippingOptions, loading, error, selectedOption, setSelectedOption } = useShipping({
    fromCep,
    toCep,
    products,
    totalPieces
  })

  const handleOptionSelect = (option: ShippingOption) => {
    setSelectedOption(option)
    onShippingSelect?.(option)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDeliveryTime = (days: number) => {
    if (days === 1) return '1 dia útil'
    return `${days} dias úteis`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary-400" />
        Calcular Frete
      </h3>

      <div className="mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            CEP de Destino
          </label>
          <input
            type="text"
            placeholder="00000-000"
            value={toCep}
            onChange={(e) => setToCep(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enviando de Nova Iguaçu - RJ (26015-005)
          </p>
        </div>
      </div>

      {/* Opção de Retirada */}
      <div className="mb-6">
        <div className="border border-gray-600 rounded-lg p-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:border-primary-500 hover:bg-primary-500/5 hover:scale-[1.01]"
             onClick={() => handleOptionSelect({
               id: 'pickup',
               name: 'Retirada',
               company: { name: 'Loja Física' },
               price: 0,
               delivery_time: 0,
               service_code: 'pickup'
             })}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-600">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              
              <div>
                <h5 className="font-medium text-white">Retirada na Loja</h5>
                <p className="text-sm text-gray-400">Nova Iguaçu - RJ</p>
                <p className="text-xs text-green-400 font-medium">Frete Grátis</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                R$ 0,00
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                Imediato
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          <span className="ml-2 text-gray-400">Calculando frete...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Erro ao calcular frete</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {shippingOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-white mb-3">Opções de Frete:</h4>
          
          {/* Aviso sobre transportadoras privadas */}
          {totalPieces < 20 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-400">
                    🚚 Transportadoras Privadas
                  </h4>
                  <p className="text-xs text-red-300 mt-1">
                    <strong>Jadlog, Total Express e Loggi</strong> aparecem apenas para pedidos com <strong>20 peças ou mais</strong>.
                    <br />
                    <span className="text-gray-400">Atual: {totalPieces} peças no carrinho</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {shippingOptions
            .filter(option => {
              // Filtrar transportadoras privadas se não tiver 20+ peças
              const isPrivateCarrier = ['Jadlog', 'Total Express', 'Loggi'].some(name => 
                option.name.includes(name) || option.company.name.includes(name)
              )
              
              if (isPrivateCarrier && totalPieces < 20) {
                return false // Não mostrar transportadoras privadas se não tiver 20+ peças
              }
              
              return true
            })
            .map((option) => {
            const isSelected = selectedOption && selectedOption.id === option.id
            return (
              <div
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ease-in-out transform ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10 ring-2 ring-primary-500/20 scale-[1.02] shadow-lg'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 hover:scale-[1.01]'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    isSelected 
                      ? 'bg-primary-500' 
                      : 'bg-gray-700'
                  }`}>
                    <Package className={`w-5 h-5 transition-colors duration-200 ${
                      isSelected 
                        ? 'text-white' 
                        : 'text-primary-400'
                    }`} />
                  </div>
                  
                  <div>
                    <h5 className={`font-medium transition-colors duration-200 ${
                      isSelected ? 'text-primary-400' : 'text-white'
                    }`}>{option.name}</h5>
                    <p className="text-sm text-gray-400">{option.company.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold transition-colors duration-200 ${
                    isSelected ? 'text-primary-400' : 'text-primary-400'
                  }`}>
                    {formatPrice(option.price)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {formatDeliveryTime(option.delivery_time)}
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs text-primary-400 mt-1">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                      <span>Selecionado</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}

      {selectedOption && (
        <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-white">Frete Selecionado</h5>
              <p className="text-sm text-gray-400">{selectedOption.name}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-400">
                {formatPrice(selectedOption.price)}
              </div>
              <div className="text-sm text-gray-400">
                {formatDeliveryTime(selectedOption.delivery_time)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
