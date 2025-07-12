"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, Eye } from "lucide-react"

// Mock data
const patients = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 34,
    gender: "Feminino",
    phone: "+55 (11) 99999-9999",
    email: "sarah.johnson@email.com",
    lastVisit: "15/01/2024",
    condition: "Consulta de Rotina",
    status: "ativo",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 45,
    gender: "Masculino",
    phone: "+55 (11) 88888-8888",
    email: "michael.chen@email.com",
    lastVisit: "14/01/2024",
    condition: "Hipertensão",
    status: "ativo",
  },
  {
    id: "3",
    name: "Emily Davis",
    age: 28,
    gender: "Feminino",
    phone: "+55 (11) 77777-7777",
    email: "emily.davis@email.com",
    lastVisit: "13/01/2024",
    condition: "Exame Físico Anual",
    status: "ativo",
  },
  {
    id: "4",
    name: "Robert Wilson",
    age: 52,
    gender: "Masculino",
    phone: "+55 (11) 66666-6666",
    email: "robert.wilson@email.com",
    lastVisit: "12/01/2024",
    condition: "Diabetes",
    status: "acompanhamento",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    age: 39,
    gender: "Feminino",
    phone: "+55 (11) 55555-5555",
    email: "lisa.anderson@email.com",
    lastVisit: "10/01/2024",
    condition: "Consulta",
    status: "ativo",
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerencie os registros e informações dos seus pacientes</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Diretório de Pacientes</CardTitle>
          <CardDescription>Pesquise e filtre através da sua base de dados de pacientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar pacientes por nome, e-mail ou condição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Última Consulta</TableHead>
                <TableHead>Condição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
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
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{patient.phone}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === "active" ? "default" : "secondary"}>{patient.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/patients/${patient.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredPatients.length} de {patients.length} pacientes
      </div>
    </div>
  )
}
