"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Calendar, Phone, Mail, MapPin, Heart, Plus } from "lucide-react"

// Mock patient data
const patient = {
  id: "1",
  name: "Sarah Johnson",
  age: 34,
  gender: "Feminino",
  dateOfBirth: "15/05/1989",
  phone: "+55 (11) 99999-9999",
  email: "sarah.johnson@email.com",
  address: "Rua Principal, 123, São Paulo, SP 01234-567",
  bloodType: "A+",
  allergies: "Penicilina, Frutos do Mar",
  emergencyContact: {
    name: "John Johnson",
    phone: "+55 (11) 88888-8888",
    relation: "Cônjuge",
  },
  insurance: {
    provider: "Unimed",
    number: "UN123456789",
  },
  status: "ativo",
}

const medicalHistory = [
  {
    id: "1",
    date: "15/01/2024",
    type: "Consulta de Rotina",
    doctor: "Dr. Silva",
    diagnosis: "Saudável",
    notes: "Exame físico anual. Todos os sinais vitais normais. Continuar rotina de exercícios atual.",
    prescriptions: [],
  },
  {
    id: "2",
    date: "22/08/2023",
    type: "Retorno",
    doctor: "Dr. Silva",
    diagnosis: "Hipertensão - Controlada",
    notes: "Pressão arterial bem controlada com medicação atual. Continuar Losartana 50mg diariamente.",
    prescriptions: ["Losartana 50mg diariamente"],
  },
  {
    id: "3",
    date: "10/03/2023",
    type: "Consulta",
    doctor: "Dr. Johnson",
    diagnosis: "Enxaqueca",
    notes: "Paciente relata dores de cabeça frequentes. Prescrito Sumatriptana para episódios agudos.",
    prescriptions: ["Sumatriptana 50mg conforme necessário"],
  },
]

const upcomingAppointments = [
  {
    id: "1",
    date: "15/02/2024",
    time: "10:00",
    type: "Retorno",
    doctor: "Dr. Silva",
    status: "agendado",
  },
  {
    id: "2",
    date: "15/05/2024",
    time: "09:00",
    type: "Exame Físico Anual",
    doctor: "Dr. Silva",
    status: "agendado",
  },
]

const currentMedications = [
  {
    name: "Losartana",
    dosage: "50mg",
    frequency: "Uma vez ao dia",
    prescribedDate: "22/08/2023",
    prescribedBy: "Dr. Silva",
  },
  {
    name: "Multivitamínico",
    dosage: "1 comprimido",
    frequency: "Uma vez ao dia",
    prescribedDate: "15/01/2024",
    prescribedBy: "Dr. Silva",
  },
]

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  const [newNote, setNewNote] = useState("")

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note logic here
      setNewNote("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="text-lg">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">
                {patient.age} anos • {patient.gender} • ID do Paciente: {patient.id}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Consulta
          </Button>
        </div>
      </div>

      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informações de Contato</CardTitle>
            <Phone className="h-4 w-4 ml-auto text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informações Médicas</CardTitle>
            <Heart className="h-4 w-4 ml-auto text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Tipo Sanguíneo: </span>
                <span className="text-sm">{patient.bloodType}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Alergias: </span>
                <span className="text-sm text-red-600">{patient.allergies}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Status: </span>
                <Badge variant="default">{patient.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contato de Emergência</CardTitle>
            <Phone className="h-4 w-4 ml-auto text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Nome: </span>
                <span className="text-sm">{patient.emergencyContact.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Telefone: </span>
                <span className="text-sm">{patient.emergencyContact.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Parentesco: </span>
                <span className="text-sm">{patient.emergencyContact.relation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Histórico Médico</TabsTrigger>
          <TabsTrigger value="medications">Medicamentos</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Médico</CardTitle>
              <CardDescription>Histórico médico completo e consultas anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {medicalHistory.map((visit) => (
                  <div key={visit.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{visit.type}</Badge>
                        <span className="text-sm text-gray-500">{visit.date}</span>
                      </div>
                      <span className="text-sm text-gray-500">Dr. {visit.doctor}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{visit.diagnosis}</h4>
                    <p className="text-sm text-gray-600 mb-2">{visit.notes}</p>
                    {visit.prescriptions.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700">Prescriptions: </span>
                        <span className="text-sm text-gray-600">{visit.prescriptions.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Atuais</CardTitle>
              <CardDescription>Prescrições ativas e medicamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Dosagem</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Prescrito por</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMedications.map((medication, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.frequency}</TableCell>
                      <TableCell>{medication.prescribedBy}</TableCell>
                      <TableCell>{medication.prescribedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Próximas Consultas</CardTitle>
                  <CardDescription>Consultas e exames agendados</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agendar Nova
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">with {appointment.doctor}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{appointment.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anotações Clínicas</CardTitle>
              <CardDescription>Adicione anotações e observações sobre o paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newNote">Nova Anotação</Label>
                <Textarea
                  id="newNote"
                  placeholder="Digite anotações clínicas, observações ou informações importantes..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Anotação
                </Button>
              </div>

              <div className="space-y-4 mt-6">
                <h4 className="font-medium text-gray-900">Anotações Recentes</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Dr. Silva</span>
                      <span className="text-xs text-gray-500">2024-01-15 10:30 AM</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Paciente relata estar se sentindo bem desde a última consulta. Pressão arterial estável.
                      Recomendado continuar rotina atual de exercícios e modificações na dieta.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Dr. Smith</span>
                      <span className="text-xs text-gray-500">2023-12-10 2:15 PM</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Acompanhamento dos episódios de enxaqueca. Paciente relata melhora significativa com medicação
                      prescrita. Nenhum efeito adverso observado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
