'use server'

import { supabase } from "@/utils/supabase"

// Login do usuário
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data.user // retorna o usuário logado
}

// Signup e criação do perfil
export async function signup(email: string, password: string, full_name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name }, // vai para user_metadata
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

// Envia link de redefinição de senha
export async function sendResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

// Atualiza a senha do usuário logado
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

// Busca o perfil do usuário logado (full_name)
export async function getUserProfile() {
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

// Cria novo paciente
export async function createPatient(data: any) {
  const { error } = await supabase.from("patients").insert([data])
  if (error) throw new Error(error.message)
}

// Cria nova consulta
export async function createAppointment(data: any) {
  const { error } = await supabase.from("appointments").insert([data])
  if (error) throw new Error(error.message)
}

// Cria novo registro financeiro
export async function createFinancialRecord(data: any) {
  const { error } = await supabase.from("financial_records").insert([data])
  if (error) throw new Error(error.message)
}
