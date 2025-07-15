"use client"

import React, { useEffect, useState } from "react"
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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [userId, setUserId] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    phone: "",
    specialty: "",
    crm: "",
  })

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      setError("")

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        router.push("/login")
        return
      }

      const user = session.user
      setUserId(user.id)

      const { data, error } = await supabase
        .from("profiles")
        .select("nome, email, phone, specialty, crm")
        .eq("id", user.id)
        .maybeSingle()

      if (error) {
        setError("Erro ao buscar perfil: " + error.message)
        setIsLoading(false)
        return
      }

      setProfileData({
        nome: data?.nome || "",
        email: data?.email || user.email || "",
        phone: data?.phone || "",
        specialty: data?.specialty || "",
        crm: data?.crm || "",
      })

      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!userId) {
      setError("Usuário não autenticado")
      setIsLoading(false)
      return
    }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          nome: profileData.nome,
          email: profileData.email,
          phone: profileData.phone,
          specialty: profileData.specialty,
          crm: profileData.crm,
        },
        { onConflict: "id" }
      )

    if (upsertError) {
      setError("Erro ao atualizar perfil: " + upsertError.message)
    } else {
      setSuccess("Perfil atualizado com sucesso!")
    }

    setIsLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <p className="text-gray-600">Atualize suas informações pessoais</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            type="text"
            value={profileData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
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
            onChange={(e) => handleChange("email", e.target.value)}
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
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="specialty">Especialidade</Label>
          <Input
            id="specialty"
            type="text"
            value={profileData.specialty}
            onChange={(e) => handleChange("specialty", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="crm">CRM</Label>
          <Input
            id="crm"
            type="text"
            value={profileData.crm}
            onChange={(e) => handleChange("crm", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  )
}
