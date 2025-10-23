'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  ArrowLeft,
  Check,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'

interface Address {
  id: string
  user_id: string
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export default function AddressesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    is_default: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fromCheckout, setFromCheckout] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/minha-conta/enderecos')
      return
    }

    if (user) {
      fetchAddresses()
    }
  }, [user, authLoading])

  // Verificar se veio do checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const redirectTo = urlParams.get('redirectTo')
    const message = urlParams.get('message')
    
    if (redirectTo === '/checkout') {
      setFromCheckout(true)
      if (message) {
        setSuccess(decodeURIComponent(message))
      }
    }
  }, [])

  const fetchAddresses = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar endereços:', error)
        setError('Erro ao carregar endereços')
        return
      }

      setAddresses(data || [])
    } catch (error) {
      console.error('Erro ao buscar endereços:', error)
      setError('Erro ao carregar endereços')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value)
    setFormData(prev => ({
      ...prev,
      zip_code: formatted
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      is_default: false
    })
    setEditingAddress(null)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) return

    // Validações
    if (!formData.name.trim()) {
      setError('Nome do endereço é obrigatório')
      return
    }
    if (!formData.street.trim()) {
      setError('Rua é obrigatória')
      return
    }
    if (!formData.number.trim()) {
      setError('Número é obrigatório')
      return
    }
    if (!formData.neighborhood.trim()) {
      setError('Bairro é obrigatório')
      return
    }
    if (!formData.city.trim()) {
      setError('Cidade é obrigatória')
      return
    }
    if (!formData.state.trim()) {
      setError('Estado é obrigatório')
      return
    }
    if (!formData.zip_code.trim()) {
      setError('CEP é obrigatório')
      return
    }

    try {
      if (editingAddress) {
        // Atualizar endereço existente
        const { error } = await supabase
          .from('addresses')
          .update({
            name: formData.name,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            is_default: formData.is_default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAddress.id)

        if (error) {
          setError('Erro ao atualizar endereço')
          return
        }

        setSuccess('Endereço atualizado com sucesso!')
      } else {
        // Criar novo endereço
        const { error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            name: formData.name,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            is_default: formData.is_default
          })

        if (error) {
          setError('Erro ao criar endereço')
          return
        }

        if (fromCheckout) {
          setSuccess('Endereço criado com sucesso! Agora você pode finalizar seu pedido.')
        } else {
          setSuccess('Endereço criado com sucesso!')
        }
      }

      // Se este endereço foi marcado como padrão, remover padrão dos outros
      if (formData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', editingAddress?.id || '')
      }

      resetForm()
      setShowForm(false)
      fetchAddresses()
    } catch (error) {
      console.error('Erro ao salvar endereço:', error)
      setError('Erro interno do servidor')
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_default: address.is_default
    })
    setEditingAddress(address)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) return

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)

      if (error) {
        setError('Erro ao excluir endereço')
        return
      }

      setSuccess('Endereço excluído com sucesso!')
      fetchAddresses()
    } catch (error) {
      console.error('Erro ao excluir endereço:', error)
      setError('Erro interno do servidor')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      // Remover padrão de todos os endereços
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user!.id)

      // Definir este como padrão
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)

      if (error) {
        setError('Erro ao definir endereço padrão')
        return
      }

      setSuccess('Endereço padrão atualizado!')
      fetchAddresses()
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error)
      setError('Erro interno do servidor')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={fromCheckout ? "/carrinho" : "/minha-conta"}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              {fromCheckout ? "Voltar ao Carrinho" : "Voltar"}
            </Link>
            {fromCheckout && addresses.length > 0 && (
              <Link
                href="/checkout"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Finalizar Pedido
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meus Endereços
          </h1>
          <p className="text-gray-600">
            {fromCheckout 
              ? "Cadastre um endereço para finalizar seu pedido" 
              : "Gerencie seus endereços de entrega"
            }
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {success}
            </div>
          </div>
        )}

        {/* Add Address Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Endereço
          </button>
        </div>

        {/* Address Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Endereço *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Casa, Trabalho, etc."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleZipCodeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                  Rua *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="123"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complement"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Apto, Bloco, etc."
                  />
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nome do bairro"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nome da cidade"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Selecione o estado</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                  Definir como endereço padrão
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  {editingAddress ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-6">
          {addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum endereço cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione um endereço para facilitar suas compras.
              </p>
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Adicionar Primeiro Endereço
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {address.name.toLowerCase().includes('casa') || address.name.toLowerCase().includes('home') ? (
                        <Home className="h-6 w-6 text-gray-600" />
                      ) : (
                        <Building className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {address.name}
                        </h3>
                        {address.is_default && (
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                            Padrão
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 space-y-1">
                        <p>
                          {address.street}, {address.number}
                          {address.complement && `, ${address.complement}`}
                        </p>
                        <p>
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p>CEP: {address.zip_code}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Definir como padrão
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
