import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Calendar, Clock, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

// Mock data
const stats = [
  {
    title: "Total de Pacientes",
    value: "1.234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Consultas de Hoje",
    value: "18",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Consultas Pendentes",
    value: "7",
    change: "-2",
    changeType: "negative" as const,
    icon: Clock,
  },
  {
    title: "Receita Mensal",
    value: "R$ 45.230",
    change: "+8%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const recentPatients = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 34,
    lastVisit: "15/01/2024",
    condition: "Consulta de Rotina",
    status: "concluída",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 45,
    lastVisit: "14/01/2024",
    condition: "Acompanhamento Hipertensão",
    status: "concluída",
  },
  {
    id: "3",
    name: "Emily Davis",
    age: 28,
    lastVisit: "13/01/2024",
    condition: "Exame Físico Anual",
    status: "concluída",
  },
  {
    id: "4",
    name: "Robert Wilson",
    age: 52,
    lastVisit: "12/01/2024",
    condition: "Controle de Diabetes",
    status: "acompanhamento",
  },
]

const upcomingAppointments = [
  {
    id: "1",
    patient: "Lisa Anderson",
    time: "09:00",
    type: "Consulta",
    duration: "30 min",
  },
  {
    id: "2",
    patient: "David Brown",
    time: "10:30",
    type: "Retorno",
    duration: "15 min",
  },
  {
    id: "3",
    patient: "Maria Garcia",
    time: "14:00",
    type: "Exame Físico",
    duration: "45 min",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel</h1>
          <p className="text-gray-600">Bem-vindo de volta, Dr. Silva</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
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
              <p className="text-xs text-gray-600">
                <span className={`font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>{" "}
                em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes Recentes</CardTitle>
            <CardDescription>Últimas consultas e visitas de pacientes</CardDescription>
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
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      Age {patient.age} • {patient.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{patient.lastVisit}</p>
                    <Badge variant={patient.status === "concluída" ? "default" : "secondary"} className="text-xs">
                      {patient.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/patients">Ver Todos os Pacientes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas de Hoje</CardTitle>
            <CardDescription>Consultas agendadas para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.type} • {appointment.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <Badge variant="outline" className="text-xs">
                      Agendado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/appointments">Ver Todas as Consultas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
