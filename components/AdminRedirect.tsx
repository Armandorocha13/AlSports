'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminRedirect() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Só redirecionar se não estiver carregando e o usuário estiver logado
    if (!loading && user && profile) {
      // Verificar se é o email do admin
      if (user.email === 'almundodabola@gmail.com') {
        // Verificar se já está na página admin
        if (window.location.pathname !== '/admin') {
          console.log('🔄 Redirecionando admin para o painel...')
          router.push('/admin')
        }
      }
    }
  }, [user, profile, loading, router])

  // Este componente não renderiza nada
  return null
}
