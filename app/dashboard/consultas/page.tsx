"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Plus, Calendar, Clock, Users } from "lucide-react"

const appointments = [
  {
    id: "1",
    patient: "Maria Silva",
    doctor: "Dr. Silva",
    date: "15/01/2024",
    time: "09:00",
    duration: "30 min",
    type: "Consulta",
    status: "Agendado",
  },
  {
    id: "2",
    patient: "João Santos",
    doctor: "Dr. Silva",
    date: "15/01/2024",
    time: "10:30",
    duration: "15 min",
    type: "Retorno",
    status: "Concluído",
  },
  {
    id: "3",
    patient: "Ana Costa",
    doctor: "Dr. Silva",
    date: "15/01/2024",
    time: "14:00",
    duration: "45 min",
    type: "Exame",
    status: "Agendado",
  },
  {
    id: "4",
    patient: "Carlos Oliveira",
    doctor: "Dr. Silva",
    date: "16/01/2024",
    time: "08:30",
    duration: "30 min",
    type: "Consulta",
    status: "Agendado",
  },
  {
    id: "5",
    patient: "Lucia Ferreira",
    doctor: "Dr. Silva",
    date: "16/01/2024",
    time: "11:00",
    duration: "20 min",
    type: "Retorno",
    status: "Cancelado",
  },
  {
    id: "6",
    patient: "Pedro Almeida",
    doctor: "Dr. Silva",
    date: "16/01/2024",
    time: "15:30",
    duration: "30 min",
    type: "Consulta",
    status: "Agendado",
  },
]

export default function ConsultasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || appointment.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "agendado":
        return "default"
      case "concluído":
        return "secondary"
      case "cancelado":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">Gerencie a agenda de consultas da clínica</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">consultas agendadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+12% vs semana passada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">aguardando confirmação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2% vs mês passado</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Consultas</CardTitle>
          <CardDescription>Visualize e gerencie todas as consultas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar consultas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="concluído">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>
                            {appointment.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{appointment.patient}</div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.time}</div>
                        <div className="text-sm text-muted-foreground">{appointment.duration}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(appointment.status)}>{appointment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma consulta encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
