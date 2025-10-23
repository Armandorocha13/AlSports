'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function AdminDebug() {
  const { user, profile, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    if (user && profile) {
      setDebugInfo({
        user_id: user.id,
        user_email: user.email,
        profile_id: profile.id,
        profile_email: profile.email,
        user_types: profile.user_types,
        full_name: profile.full_name,
        is_admin: profile.user_types === 'admin',
        timestamp: new Date().toISOString()
      })
    }
  }, [user, profile])

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Admin Debug</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {loading ? 'Sim' : 'Não'}</div>
        <div>User: {user ? 'Logado' : 'Não logado'}</div>
        <div>Profile: {profile ? 'Carregado' : 'Não carregado'}</div>
        {profile && (
          <>
            <div>User Type: {profile.user_types || 'undefined'}</div>
            <div>Is Admin: {profile.user_types === 'admin' ? 'Sim' : 'Não'}</div>
            <div>Email: {profile.email}</div>
            <div>Nome: {profile.full_name}</div>
          </>
        )}
        <div className="mt-2 text-yellow-300">
          <strong>Debug Info:</strong>
          <pre className="text-xs mt-1 overflow-auto max-h-32">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
