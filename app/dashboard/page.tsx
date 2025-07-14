"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, TrendingUp, UserPlus, CalendarPlus, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

// Dados simulados
const stats = [
  {
    title: "Total de Pacientes",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Consultas Hoje",
    value: "23",
    change: "+5%",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Receita Mensal",
    value: "R$ 45.231",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Taxa de Crescimento",
    value: "12.5%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const recentPatients = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    lastVisit: "2024-01-15",
    status: "Ativo",
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    lastVisit: "2024-01-14",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    lastVisit: "2024-01-13",
    status: "Pendente",
  },
]

const todayAppointments = [
  {
    id: 1,
    patient: "Carlos Oliveira",
    time: "09:00",
    type: "Consulta",
    status: "Confirmado",
  },
  {
    id: 2,
    patient: "Lucia Ferreira",
    time: "10:30",
    type: "Retorno",
    status: "Confirmado",
  },
  {
    id: 3,
    patient: "Pedro Almeida",
    time: "14:00",
    type: "Consulta",
    status: "Pendente",
  },
  {
    id: 4,
    patient: "Sofia Lima",
    time: "15:30",
    type: "Exame",
    status: "Confirmado",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Bem-vindo de volta, Dr. Silva</p>
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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Patients */}
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
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                    <p className="text-sm text-gray-500 truncate">{patient.email}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={patient.status === "Ativo" ? "default" : "secondary"}>{patient.status}</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(patient.lastVisit).toLocaleDateString("pt-BR")}
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
            <CardDescription>Agenda do dia {new Date().toLocaleDateString("pt-BR")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={appointment.status === "Confirmado" ? "default" : "secondary"}
                    className="flex items-center"
                  >
                    {appointment.status === "Confirmado" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {appointment.status}
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
