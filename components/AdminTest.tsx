'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

export default function AdminTest() {
  const { user, profile, loading } = useAuth()
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    if (user && profile) {
      setTestResults({
        user_id: user.id,
        user_email: user.email,
        profile_id: profile.id,
        profile_email: profile.email,
        user_type: profile.user_type,
        full_name: profile.full_name,
        is_admin: profile.user_type === 'admin',
        timestamp: new Date().toISOString(),
        raw_profile: profile
      })
    }
  }, [user, profile])

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2 text-red-200">🔧 Admin Test</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {loading ? 'Sim' : 'Não'}</div>
        <div>User: {user ? 'Logado' : 'Não logado'}</div>
        <div>Profile: {profile ? 'Carregado' : 'Não carregado'}</div>
        {profile && (
          <>
            <div>User Type: <span className={profile.user_type === 'admin' ? 'text-green-400' : 'text-red-400'}>{profile.user_type || 'undefined'}</span></div>
            <div>Is Admin: <span className={profile.user_type === 'admin' ? 'text-green-400' : 'text-red-400'}>{profile.user_type === 'admin' ? 'SIM' : 'NÃO'}</span></div>
            <div>Email: {profile.email}</div>
            <div>Nome: {profile.full_name}</div>
          </>
        )}
        <div className="mt-2 text-yellow-300">
          <strong>Raw Profile:</strong>
          <pre className="text-xs mt-1 overflow-auto max-h-32 bg-black p-2 rounded">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
