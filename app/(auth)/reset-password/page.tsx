'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

function ResetPasswordContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('access_token')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        const { error } = await supabase.auth.exchangeCodeForSession(token)
        if (error) {
          console.error('Erro ao trocar o token:', error.message)
        }
      }
      setLoading(false)
    }

    restoreSession()
  }, [token])

  if (loading) return <p>Carregando...</p>

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>
      <AuthForm type="reset" />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Carregando página...</p>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
