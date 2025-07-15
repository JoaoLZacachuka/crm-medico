"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
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

  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const supabase = createClientComponentClient()
      setLoading(true)

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError
        if (!session || !session.user) {
          router.push("/login")
          return
        }

        const user = session.user

        // Nome do usuário
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
          .select("*", { count: "exact", head: true })

        if (countError) throw countError

        // Últimos 3 pacientes
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("id, nome, email, criado_em")
          .order("criado_em", { ascending: false })
          .limit(3)

        if (patientsError) throw patientsError

        // Consultas do dia
        const today = new Date()
        const todayStr = today.toISOString().split("T")[0]

        const { data: appointmentsData, error: appointmentsError } =
          await supabase
            .from("appointments")
            .select(`
              id,
              hora,
              tipo_consulta,
              observacoes,
              data,
              patients(nome)
            `)
            .eq("data", todayStr)
            .order("hora")

        if (appointmentsError) throw appointmentsError

        const mappedAppointments =
          appointmentsData?.map((apt: any) => ({
            id: apt.id,
            hora: apt.hora,
            tipo_consulta: apt.tipo_consulta,
            observacoes: apt.observacoes,
            data: apt.data,
            paciente_nome: apt.patients?.nome || "Desconhecido",
          })) || []

        // Receita do mês
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0]
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0]

        const { data: financialData, error: financialError } = await supabase
          .from("financial_records")
          .select("valor")
          .eq("tipo", "Receita")
          .gte("data", firstDay)
          .lte("data", lastDay)

        if (financialError) throw financialError

        const monthlyRevenue = financialData?.reduce(
          (acc, item) => acc + (item.valor || 0),
          0
        ) ?? 0

        setStats({
          totalPatients: totalPatients ?? 0,
          consultationsToday: mappedAppointments.length,
          monthlyRevenue,
          growthRate: 0, // Você pode calcular isso depois
        })

        setRecentPatients(patientsData ?? [])
        setTodayAppointments(mappedAppointments)
      } catch (err: any) {
        console.error(err)
        setError("Erro ao carregar dados do dashboard: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Carregando...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10 font-semibold">{error}</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo, Dr. {userName}</p>
        </div>
        <div className="flex gap-3">
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

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalPatients}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.consultationsToday}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            R$ {stats.monthlyRevenue.toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.growthRate}%
          </CardContent>
        </Card>
      </div>

      {/* Pacientes Recentes e Consultas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pacientes Recentes</CardTitle>
            <CardDescription>Últimos 3 cadastrados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPatients.length === 0 ? (
              <p>Nenhum paciente recente.</p>
            ) : (
              recentPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatar.svg" alt={p.nome} />
                    <AvatarFallback>{p.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{p.nome}</p>
                    <p className="text-sm text-gray-500">{p.email || "Sem e-mail"}</p>
                  </div>
                  <Badge>Ativo</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultas de Hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.length === 0 ? (
              <p>Nenhuma consulta para hoje.</p>
            ) : (
              todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{apt.paciente_nome}</p>
                    <p className="text-sm text-gray-500">
                      {apt.hora} - {apt.tipo_consulta || "Tipo não informado"}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {apt.observacoes || "Sem observações"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
