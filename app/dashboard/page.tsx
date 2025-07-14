"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  nome: string
  email: string | null
  criado_em?: string
}

interface Appointment {
  id: string
  paciente_nome: string
  hora: string
  tipo_consulta: string | null
  observacoes: string | null
  data: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    consultationsToday: 0,
    monthlyRevenue: 0,
    growthRate: 0,
  })

  const [recentPatients, setRecentPatients] = useState<Patient[]>([])
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [userName, setUserName] = useState<string>("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUserAndData() {
      setLoading(true)
      setError("")

      try {
        // Pega o usuário logado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error("Usuário não autenticado")

        // Busca o perfil (nome) na tabela profiles usando o user.id
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()

        if (profileError) throw profileError
        setUserName(profileData?.full_name ?? "")

        // Total de pacientes
        const { count: totalPatients, error: countError } = await supabase
          .from("patients")
          .select("id", { count: "exact", head: true })

        if (countError) throw countError

        // Pacientes recentes
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("id, nome, email, criado_em")
          .order("criado_em", { ascending: false })
          .limit(3)

        if (patientsError) throw patientsError

        // Consultas do dia
        const today = new Date()
        const todayString = today.toISOString().slice(0, 10) // 'YYYY-MM-DD'

        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select(`
            id,
            hora,
            tipo_consulta,
            observacoes,
            data,
            paciente:patients(nome)
          `)
          .eq("data", todayString)
          .order("hora")

        if (appointmentsError) throw appointmentsError

        setStats({
          totalPatients: totalPatients || 0,
          consultationsToday: appointmentsData?.length || 0,
          monthlyRevenue: 45231, // aqui você pode puxar da tabela financeira se quiser
          growthRate: 12.5,
        })

        setRecentPatients(patientsData || [])

        setTodayAppointments(
          (appointmentsData || []).map((apt) => ({
            id: apt.id,
            paciente_nome: apt.paciente?.nome ?? "Desconhecido",
            hora: apt.hora,
            tipo_consulta: apt.tipo_consulta,
            observacoes: apt.observacoes,
            data: apt.data,
          }))
        )
      } catch (err: any) {
        setError("Erro ao carregar dados: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Carregando dados do dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center py-8">{error}</div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Bem-vindo de volta, Dr. {userName}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button asChild>
            <Link href="/dashboard/novo-paciente">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/consultas">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Pacientes
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalPatients}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Consultas Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.consultationsToday}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5% em relação à semana passada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {stats.monthlyRevenue.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Crescimento
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.growthRate}%
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              +2.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Pacientes Recentes
            </CardTitle>
            <CardDescription>Últimos pacientes cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.length === 0 && <p>Nenhum paciente recente encontrado.</p>}
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>
                      {patient.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {patient.nome}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {patient.email ?? "-"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="default">Ativo</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {patient.criado_em
                        ? new Date(patient.criado_em).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/pacientes">Ver todos os pacientes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Consultas de Hoje
            </CardTitle>
            <CardDescription>
              Agenda do dia {new Date().toLocaleDateString("pt-BR")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length === 0 && <p>Nenhuma consulta para hoje.</p>}
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.paciente_nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.hora} - {appointment.tipo_consulta}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={appointment.observacoes ? "default" : "secondary"}
                    className="flex items-center"
                  >
                    {appointment.observacoes || "Sem observações"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/consultas">Ver todas as consultas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
