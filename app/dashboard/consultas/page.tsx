"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  CalendarPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Appointment {
  id: string
  paciente_id: string
  paciente_nome: string
  data: string
  hora: string
  tipo_consulta: string
  observacoes: string | null
  status: string
}

interface Patient {
  id: string
  nome: string
}

const statusOptions = ["Agendado", "Confirmado", "Concluído", "Cancelado"]
const appointmentTypes = ["Consulta", "Retorno", "Exame", "Emergência"]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

  // Para autocomplete pacientes na nova consulta
  const [patientSearch, setPatientSearch] = useState("")
  const [patientSuggestions, setPatientSuggestions] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const [newAppointment, setNewAppointment] = useState({
    data: "",
    hora: "",
    tipo_consulta: "",
    observacoes: "",
  })

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [errorEdit, setErrorEdit] = useState("")
  const [successEdit, setSuccessEdit] = useState("")

  // Busca consultas do Supabase
  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          paciente_id,
          data,
          hora,
          tipo_consulta,
          observacoes,
          status,
          patients!inner(nome)
        `)
        .order("data", { ascending: false })
        .order("hora", { ascending: true })

      if (error) throw error

      const mapped = (data || []).map((a: any) => ({
        id: a.id,
        paciente_id: a.paciente_id,
        paciente_nome: a.patients?.nome ?? "Desconhecido",
        data: a.data,
        hora: a.hora,
        tipo_consulta: a.tipo_consulta,
        observacoes: a.observacoes,
        status: a.status ?? "Agendado",
      }))

      setAppointments(mapped)
    } catch (error) {
      console.error("Erro ao buscar consultas:", error)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Buscar pacientes para autocomplete ao digitar
  useEffect(() => {
    if (patientSearch.trim().length === 0) {
      setPatientSuggestions([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, nome")
        .ilike("nome", `%${patientSearch}%`)
        .limit(10)

      if (error) {
        console.error("Erro ao buscar pacientes:", error)
        setPatientSuggestions([])
      } else {
        setPatientSuggestions(data || [])
      }
    }, 300) // debounce 300ms

    return () => clearTimeout(delayDebounceFn)
  }, [patientSearch])

  // Filtra consultas conforme os filtros aplicados
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate = !dateFilter || appointment.data === dateFilter

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendado":
        return "bg-blue-100 text-blue-800"
      case "Confirmado":
        return "bg-green-100 text-green-800"
      case "Concluído":
        return "bg-gray-100 text-gray-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Consulta":
        return "bg-blue-100 text-blue-800"
      case "Retorno":
        return "bg-green-100 text-green-800"
      case "Exame":
        return "bg-purple-100 text-purple-800"
      case "Emergência":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Criar nova consulta
  const handleNewAppointment = async () => {
    try {
      if (!selectedPatient) {
        alert("Selecione um paciente válido")
        return
      }
      if (!newAppointment.data.trim()) {
        alert("Informe a data")
        return
      }
      if (!newAppointment.hora.trim()) {
        alert("Informe o horário")
        return
      }
      if (!newAppointment.tipo_consulta.trim()) {
        alert("Informe o tipo de consulta")
        return
      }

      const { error } = await supabase.from("appointments").insert([
        {
          paciente_id: selectedPatient.id,
          data: newAppointment.data,
          hora: newAppointment.hora,
          tipo_consulta: newAppointment.tipo_consulta,
          observacoes: newAppointment.observacoes,
          status: "Agendado",
        },
      ])

      if (error) throw error

      alert("Consulta agendada com sucesso!")
      setIsNewAppointmentOpen(false)
      setNewAppointment({
        data: "",
        hora: "",
        tipo_consulta: "",
        observacoes: "",
      })
      setSelectedPatient(null)
      setPatientSearch("")
      setPatientSuggestions([])
      fetchAppointments()
    } catch (error: any) {
      alert("Erro ao agendar consulta: " + error.message)
    }
  }

  // Abrir modal edição
  function openEditModal(appointment: Appointment) {
    setErrorEdit("")
    setSuccessEdit("")
    setEditingAppointment(appointment)
  }

  function closeEditModal() {
    setEditingAppointment(null)
    setErrorEdit("")
    setSuccessEdit("")
  }

  async function handleUpdateAppointment() {
    if (!editingAppointment) return

    const { paciente_nome, data, hora, tipo_consulta } = editingAppointment
    if (!paciente_nome.trim()) return setErrorEdit("Informe o nome do paciente.")
    if (!data.trim()) return setErrorEdit("Informe a data da consulta.")
    if (!hora.trim()) return setErrorEdit("Informe o horário da consulta.")
    if (!tipo_consulta.trim()) return setErrorEdit("Selecione o tipo de consulta.")

    setLoadingEdit(true)
    setErrorEdit("")
    setSuccessEdit("")

    try {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("id")
        .eq("nome", paciente_nome)
        .single()

      if (patientError || !patientData) {
        setErrorEdit("Paciente não encontrado. Cadastre o paciente antes.")
        setLoadingEdit(false)
        return
      }

      const { error } = await supabase
        .from("appointments")
        .update({
          paciente_id: patientData.id,
          data,
          hora,
          tipo_consulta,
          observacoes: editingAppointment.observacoes,
        })
        .eq("id", editingAppointment.id)

      if (error) {
        setErrorEdit("Erro ao atualizar consulta: " + error.message)
      } else {
        setSuccessEdit("Consulta atualizada com sucesso!")
        fetchAppointments()
        setTimeout(() => {
          closeEditModal()
        }, 1500)
      }
    } catch (error: any) {
      setErrorEdit("Erro inesperado: " + error.message)
    } finally {
      setLoadingEdit(false)
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const confirmCancel = confirm("Tem certeza que deseja cancelar esta consulta?")
    if (!confirmCancel) return

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "Cancelado" })
        .eq("id", appointmentId)

      if (error) {
        alert("Erro ao cancelar consulta: " + error.message)
      } else {
        alert("Consulta cancelada com sucesso!")
        fetchAppointments()
      }
    } catch (error: any) {
      alert("Erro inesperado: " + error.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultas</h1>
          <p className="mt-2 text-gray-600">Gerencie a agenda de consultas</p>
        </div>
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
              <DialogDescription>
                Preencha os dados para agendar uma nova consulta
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2 relative">
                <Label htmlFor="patient">Paciente</Label>
                <Input
                  id="patient"
                  placeholder="Digite o nome do paciente"
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value)
                    setSelectedPatient(null) // limpa seleção se o usuário editar texto
                  }}
                  autoComplete="off"
                />
                {patientSuggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-white shadow-lg">
                    {patientSuggestions.map((p) => (
                      <li
                        key={p.id}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                        onClick={() => {
                          setSelectedPatient(p)
                          setPatientSearch(p.nome)
                          setPatientSuggestions([])
                        }}
                      >
                        {p.nome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.data}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, data: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.hora}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, hora: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Consulta</Label>
                <Select
                  value={newAppointment.tipo_consulta}
                  onValueChange={(value) =>
                    setNewAppointment((prev) => ({ ...prev, tipo_consulta: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Observações sobre a consulta"
                  value={newAppointment.observacoes}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, observacoes: e.target.value }))
                  }
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleNewAppointment}>
                Agendar Consulta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de edição */}
      <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && closeEditModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Consulta</DialogTitle>
            <DialogDescription>Altere os dados da consulta abaixo</DialogDescription>
          </DialogHeader>

          {errorEdit && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorEdit}</AlertDescription>
            </Alert>
          )}

          {successEdit && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>{successEdit}</AlertDescription>
            </Alert>
          )}

          {editingAppointment && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patient">Paciente *</Label>
                <Input
                  id="edit-patient"
                  value={editingAppointment.paciente_nome}
                  onChange={(e) =>
                    setEditingAppointment((prev) =>
                      prev ? { ...prev, paciente_nome: e.target.value } : null
                    )
                  }
                  disabled={loadingEdit}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Data *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingAppointment.data}
                    onChange={(e) =>
                      setEditingAppointment((prev) =>
                        prev ? { ...prev, data: e.target.value } : null
                      )
                    }
                    disabled={loadingEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Horário *</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingAppointment.hora}
                    onChange={(e) =>
                      setEditingAppointment((prev) =>
                        prev ? { ...prev, hora: e.target.value } : null
                      )
                    }
                    disabled={loadingEdit}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo de Consulta *</Label>
                <Select
                  value={editingAppointment.tipo_consulta}
                  onValueChange={(value) =>
                    setEditingAppointment((prev) =>
                      prev ? { ...prev, tipo_consulta: value } : null
                    )
                  }
                  disabled={loadingEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-observations">Observações</Label>
                <Textarea
                  id="edit-observations"
                  value={editingAppointment.observacoes || ""}
                  onChange={(e) =>
                    setEditingAppointment((prev) =>
                      prev ? { ...prev, observacoes: e.target.value } : null
                    )
                  }
                  disabled={loadingEdit}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleUpdateAppointment} disabled={loadingEdit}>
              {loadingEdit ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre consultas para encontrar facilmente</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar paciente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 sm:col-span-2"
            icon={<Search className="h-4 w-4" />}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter} className="col-span-1">
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="col-span-1 sm:col-span-1"
          />
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
          <CardDescription>Lista das consultas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Nenhuma consulta encontrada.
                  </TableCell>
                </TableRow>
              )}
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.paciente_nome}</TableCell>
                  <TableCell>{appointment.data}</TableCell>
                  <TableCell>{appointment.hora}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(appointment.tipo_consulta)}>
                      {appointment.tipo_consulta}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert("Ver detalhes em breve")}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(appointment)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
