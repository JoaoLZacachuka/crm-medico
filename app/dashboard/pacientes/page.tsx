"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus, Users, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10
  const router = useRouter()

  // Estados para edição modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editPatientData, setEditPatientData] = useState<any>(null)

  const fetchPatients = async () => {
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1
    const { data, error, count } = await supabase
      .from("patients")
      .select("*", { count: "exact" })
      .range(from, to)

    if (error) console.error("Erro ao buscar pacientes:", error)
    else {
      setPatients(data || [])
      setTotalPages(Math.ceil((count || 0) / pageSize))
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [currentPage])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    // Como não existe status_pagamento no banco, ignorei o filtro
    const matchesPayment = paymentFilter === "all" // || patient.status_pagamento === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return

    const { error } = await supabase.from("patients").delete().eq("id", id)
    if (error) alert("Erro ao excluir paciente: " + error.message)
    else fetchPatients()
  }

  // Abrir modal e preencher dados para edição
  const handleEdit = (patient: any) => {
    setEditPatientData({
      id: patient.id,
      nome: patient.nome || "",
      email: patient.email || "",
      telefone: patient.telefone || "",
      genero: patient.genero || "",
      idade: patient.idade ? patient.idade.toString() : "",
      status: patient.status || "Ativo",
      // Adicione mais campos se precisar
    })
    setIsEditModalOpen(true)
  }

  // Salvar alterações do paciente editado
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editPatientData) return

    if (!editPatientData.nome.trim() || !editPatientData.email.trim()) {
      alert("Nome e e-mail são obrigatórios.")
      return
    }

    const { error } = await supabase
      .from("patients")
      .update({
        nome: editPatientData.nome.trim(),
        email: editPatientData.email.trim(),
        telefone: editPatientData.telefone.trim(),
        genero: editPatientData.genero.trim(),
        idade: editPatientData.idade ? parseInt(editPatientData.idade) : null,
        status: editPatientData.status,
      })
      .eq("id", editPatientData.id)

    if (error) {
      alert("Erro ao salvar paciente: " + error.message)
    } else {
      setIsEditModalOpen(false)
      setEditPatientData(null)
      fetchPatients()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="mt-2 text-gray-600">Gerencie todos os pacientes do consultório</p>
        </div>
        <Button asChild>
          <a href="/dashboard/novo-paciente">
            <UserPlus className="mr-2 h-4 w-4" /> Cadastrar Novo Paciente
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>Visualize e gerencie todos os pacientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            {/* Como não tem status_pagamento, esse filtro está desativado */}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Contato</TableHead>
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
                          <AvatarFallback>
                            {patient.nome?.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{patient.nome}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.idade} anos</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{patient.telefone}</div>
                        <div className="text-gray-500">{patient.genero}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Removi o botão Visualizar conforme solicitado */}
                          <DropdownMenuItem onClick={() => handleEdit(patient)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(patient.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum paciente encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros ou cadastre um novo paciente.</p>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>Altere os dados do paciente abaixo.</DialogDescription>
          </DialogHeader>

          {editPatientData && (
            <form onSubmit={handleSaveEdit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={editPatientData.nome}
                  onChange={(e) => setEditPatientData({ ...editPatientData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editPatientData.email}
                  onChange={(e) => setEditPatientData({ ...editPatientData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={editPatientData.telefone}
                  onChange={(e) => setEditPatientData({ ...editPatientData, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Input
                  id="genero"
                  value={editPatientData.genero}
                  onChange={(e) => setEditPatientData({ ...editPatientData, genero: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={editPatientData.idade}
                  onChange={(e) => setEditPatientData({ ...editPatientData, idade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={editPatientData.status}
                  onValueChange={(value) => setEditPatientData({ ...editPatientData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
