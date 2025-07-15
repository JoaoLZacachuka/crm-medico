'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Cria cliente server-side com cookies
const createServerClient = () => createServerActionClient({ cookies })

// LOGIN
export async function login(email: string, password: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { session: data.session, error }
}

// LOGOUT
export async function logout() {
  const supabase = createServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// SIGNUP
export async function signup(email: string, password: string, full_name: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  })

  if (error) throw new Error(error.message)

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name,
        email,
      })

    if (profileError) throw new Error(profileError.message)
  }

  return data
}

// RESET DE SENHA
export async function sendResetEmail(email: string) {
  const supabase = createServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

// UPDATE DE SENHA
export async function updatePassword(newPassword: string) {
  const supabase = createServerClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

// BUSCA PERFIL DO USUÁRIO
export async function getUserProfile() {
  const supabase = createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw new Error(userError.message)
  if (!user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  if (error) throw new Error(error.message)

  return data
}

// CRIA PACIENTE
export async function createPatient(data: any) {
  const supabase = createServerClient()
  const { error } = await supabase.from("patients").insert([data])
  if (error) throw new Error(error.message)
}

// CRIA CONSULTA
export async function createAppointment(data: any) {
  const supabase = createServerClient()
  const { error } = await supabase.from("appointments").insert([data])
  if (error) throw new Error(error.message)
}

// CRIA REGISTRO FINANCEIRO
export async function createFinancialRecord(data: any) {
  const supabase = createServerClient()
  const { error } = await supabase.from("financial_records").insert([data])
  if (error) throw new Error(error.message)
}
