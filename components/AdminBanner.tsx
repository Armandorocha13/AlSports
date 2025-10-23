'use client'

import Link from 'next/link'
import { Shield, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminBanner() {
  const { profile } = useAuth()

  // Debug info
  console.log('AdminBanner - profile:', profile)
  console.log('AdminBanner - user_types:', profile?.user_types)

  // Só mostra o banner se o usuário for admin
  if (profile?.user_types !== 'admin') {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-black py-3 px-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          <span className="font-semibold">Painel Administrativo</span>
        </div>
        <Link
          href="/admin"
          className="flex items-center bg-black text-primary-500 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium"
        >
          Acessar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  )
}
