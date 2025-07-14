"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Plus, Users } from "lucide-react"
import Link from "next/link"

const patients = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    age: 34,
    phone: "(11) 99999-1234",
    lastVisit: "15/01/2024",
    status: "Ativo",
    condition: "Hipertensão",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    age: 45,
    phone: "(11) 99999-5678",
    lastVisit: "14/01/2024",
    status: "Ativo",
    condition: "Diabetes",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    age: 28,
    phone: "(11) 99999-9012",
    lastVisit: "13/01/2024",
    status: "Ativo",
    condition: "Saudável",
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    age: 52,
    phone: "(11) 99999-3456",
    lastVisit: "12/01/2024",
    status: "Inativo",
    condition: "Cardiopatia",
  },
  {
    id: "5",
    name: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    age: 39,
    phone: "(11) 99999-7890",
    lastVisit: "11/01/2024",
    status: "Ativo",
    condition: "Asma",
  },
  {
    id: "6",
    name: "Pedro Almeida",
    email: "pedro.almeida@email.com",
    age: 61,
    phone: "(11) 99999-2345",
    lastVisit: "10/01/2024",
    status: "Ativo",
    condition: "Artrite",
  },
]

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || patient.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerencie todos os pacientes da clínica</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/novo-paciente">
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">+2 novos esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.filter((p) => p.status === "Ativo").length}</div>
            <p className="text-xs text-muted-foreground">83% do total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 ainda pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>Visualize e gerencie todos os pacientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pacientes..."
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
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Última Consulta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{patient.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "Ativo" ? "default" : "secondary"}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum paciente encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
