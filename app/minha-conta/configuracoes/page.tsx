'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import {
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    Key,
    Save,
    Settings,
    Shield,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/minha-conta/configuracoes')
      return
    }
  }, [user, authLoading])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validação da força da senha
  const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' }
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' }
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula' }
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos um número' }
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos um caractere especial' }
    }
    return { valid: true, message: '' }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validações básicas
    if (!passwordForm.currentPassword.trim()) {
      setError('Senha atual é obrigatória')
      setLoading(false)
      return
    }

    if (!passwordForm.newPassword.trim()) {
      setError('Nova senha é obrigatória')
      setLoading(false)
      return
    }

    // Verificar se a nova senha é diferente da atual
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setError('A nova senha deve ser diferente da senha atual')
      setLoading(false)
      return
    }

    // Validar força da senha
    const passwordValidation = validatePasswordStrength(passwordForm.newPassword)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message)
      setLoading(false)
      return
    }

    // Verificar se as senhas coincidem
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      // Primeiro, verificar se a senha atual está correta
      // Fazemos isso tentando fazer login com a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user!.email!,
        password: passwordForm.currentPassword
      })

      if (signInError) {
        // Mensagens de erro mais específicas
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Senha atual incorreta')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Confirme seu email antes de alterar a senha')
        } else {
          setError('Erro ao verificar senha atual. Tente novamente.')
        }
        setLoading(false)
        return
      }

      // Atualizar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (updateError) {
        // Mensagens de erro mais específicas
        if (updateError.message.includes('same')) {
          setError('A nova senha deve ser diferente da senha atual')
        } else if (updateError.message.includes('weak')) {
          setError('A senha é muito fraca. Use uma senha mais forte.')
        } else {
          setError(`Erro ao atualizar senha: ${updateError.message}`)
        }
        setLoading(false)
        return
      }

      // Sucesso!
      setSuccess('Senha atualizada com sucesso! Você precisará fazer login novamente.')
      
      // Limpar formulário
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
      
      // Fazer logout após 2 segundos para forçar novo login
      setTimeout(async () => {
        await signOut()
        router.push('/auth/login?message=Senha alterada com sucesso')
      }, 2000)

    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error)
      setError(error?.message || 'Erro interno do servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return
    }

    if (!confirm('ATENÇÃO: Todos os seus dados serão perdidos permanentemente. Digite "CONFIRMAR" para continuar.')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Aqui você implementaria a lógica para excluir a conta
      // Por segurança, isso geralmente requer confirmação por email
      setError('Para excluir sua conta, entre em contato com o suporte.')
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/minha-conta"
              className="flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Configurações
          </h1>
          <p className="text-gray-700 text-lg">
            Gerencie as configurações da sua conta
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-900 px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border-2 border-green-500 text-green-900 px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-200">
              <div className="p-3 bg-blue-500 rounded-lg mr-4 shadow-md">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Segurança
                </h2>
                <p className="text-gray-700 font-medium">
                  Gerencie a segurança da sua conta
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 border-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <Key className="h-6 w-6 text-gray-700 mr-4" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Senha</h3>
                    <p className="text-sm text-gray-700 font-medium mt-1">
                      Atualize sua senha de acesso
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm)
                    if (showPasswordForm) {
                      // Limpar formulário e erros ao cancelar
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })
                      setError('')
                      setSuccess('')
                    }
                  }}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {showPasswordForm ? 'Cancelar' : 'Alterar'}
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="p-6 border-2 border-gray-300 rounded-lg bg-white shadow-inner">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-900 mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 pr-12 bg-white text-gray-900 font-medium"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-bold text-gray-900 mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 pr-12 bg-white text-gray-900 font-medium"
                          required
                          minLength={8}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordForm.newPassword && (
                        <div className="mt-3 p-3 bg-gray-100 border-2 border-gray-300 rounded-lg">
                          <p className="mb-2 font-bold text-gray-900 text-sm">A senha deve conter:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li className={`font-medium ${passwordForm.newPassword.length >= 8 ? 'text-green-700' : 'text-gray-700'}`}>
                              Pelo menos 8 caracteres {passwordForm.newPassword.length >= 8 ? '✓' : '○'}
                            </li>
                            <li className={`font-medium ${/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-700' : 'text-gray-700'}`}>
                              Uma letra maiúscula {/[A-Z]/.test(passwordForm.newPassword) ? '✓' : '○'}
                            </li>
                            <li className={`font-medium ${/[a-z]/.test(passwordForm.newPassword) ? 'text-green-700' : 'text-gray-700'}`}>
                              Uma letra minúscula {/[a-z]/.test(passwordForm.newPassword) ? '✓' : '○'}
                            </li>
                            <li className={`font-medium ${/[0-9]/.test(passwordForm.newPassword) ? 'text-green-700' : 'text-gray-700'}`}>
                              Um número {/[0-9]/.test(passwordForm.newPassword) ? '✓' : '○'}
                            </li>
                            <li className={`font-medium ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? 'text-green-700' : 'text-gray-700'}`}>
                              Um caractere especial {/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? '✓' : '○'}
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-900 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 pr-12 bg-white text-gray-900 font-medium ${
                            passwordForm.confirmPassword && 
                            passwordForm.newPassword !== passwordForm.confirmPassword
                              ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-600' 
                              : passwordForm.confirmPassword && 
                                passwordForm.newPassword === passwordForm.confirmPassword
                                ? 'border-green-500 bg-green-50 focus:ring-green-500 focus:border-green-600'
                                : 'border-gray-400 focus:ring-primary-500 focus:border-primary-600'
                          }`}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordForm.confirmPassword && passwordForm.newPassword && (
                        <div className="mt-2 p-2 rounded-lg bg-gray-100 border border-gray-300">
                          {passwordForm.newPassword === passwordForm.confirmPassword ? (
                            <p className="text-green-700 font-bold text-sm">✓ As senhas coincidem</p>
                          ) : (
                            <p className="text-red-700 font-bold text-sm">✗ As senhas não coincidem</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t-2 border-gray-300">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          })
                        }}
                        className="px-6 py-3 border-2 border-gray-400 text-gray-900 font-bold rounded-lg hover:bg-gray-200 hover:border-gray-500 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Salvar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-200">
              <div className="p-3 bg-red-500 rounded-lg mr-4 shadow-md">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ações da Conta
                </h2>
                <p className="text-gray-700 font-medium">
                  Gerenciar sua conta
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 border-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Sair da Conta</h3>
                  <p className="text-sm text-gray-700 font-medium mt-1">
                    Faça logout da sua conta
                  </p>
                </div>
                <button
                  onClick={signOut}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sair
                </button>
              </div>

              <div className="flex items-center justify-between p-5 border-2 border-red-500 rounded-lg bg-red-100 hover:bg-red-50 transition-colors">
                <div>
                  <h3 className="font-bold text-red-900 text-base">Excluir Conta</h3>
                  <p className="text-sm text-red-800 font-medium mt-1">
                    Exclua permanentemente sua conta e todos os dados
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
