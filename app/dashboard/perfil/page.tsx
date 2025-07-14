"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")

  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    phone: "",
    specialty: "",
    crm: "",
  })

  // Carrega perfil do usuário
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true)
      setProfileError("")

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      const user = session?.user
      if (sessionError || !user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("nome, email, phone, specialty, crm")
        .eq("id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        setProfileError("Erro ao carregar perfil: " + error.message)
        setIsLoading(false)
        return
      }

      setProfileData({
        nome: data?.nome || user.user_metadata?.full_name || user.email || "",
        email: data?.email || user.email || "",
        phone: data?.phone || "",
        specialty: data?.specialty || "",
        crm: data?.crm || "",
      })

      setIsLoading(false)
    }

    fetchProfile()
  }, [router])

  // Atualiza perfil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setProfileError("")
    setProfileSuccess("")

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    const user = session?.user

    if (sessionError || !user) {
      router.push("/login")
      return
    }

    // Atualiza a tabela profiles
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          nome: profileData.nome,
          email: profileData.email,
          phone: profileData.phone,
          specialty: profileData.specialty,
          crm: profileData.crm,
        },
        { onConflict: "id" }
      )

    if (error) {
      setProfileError("Erro ao atualizar perfil: " + error.message)
      setIsLoading(false)
      return
    }

    // Atualiza email no auth, se necessário
    if (user.email !== profileData.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profileData.email,
      })
      if (emailError) {
        setProfileError("Erro ao atualizar e-mail: " + emailError.message)
        setIsLoading(false)
        return
      }
    }

    setProfileSuccess("Perfil atualizado com sucesso!")
    setIsLoading(false)
    setTimeout(() => setProfileSuccess(""), 3000)
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Atualiza estado dos inputs
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    if (profileError) setProfileError("")
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <p className="mt-1 text-gray-600">Gerencie suas informações pessoais e configurações</p>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="mt-4 sm:mt-0">
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </header>

      {profileSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{profileSuccess}</AlertDescription>
        </Alert>
      )}

      {profileError && (
        <Alert variant="destructive">
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleProfileUpdate} className="space-y-5">
        <div>
          <Label htmlFor="nome">Nome completo</Label>
          <Input
            id="nome"
            type="text"
            value={profileData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="specialty">Especialidade</Label>
          <Input
            id="specialty"
            type="text"
            value={profileData.specialty}
            onChange={(e) => handleInputChange("specialty", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="crm">CRM</Label>
          <Input
            id="crm"
            type="text"
            value={profileData.crm}
            onChange={(e) => handleInputChange("crm", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Perfil"}
        </Button>
      </form>
    </div>
  )
}
