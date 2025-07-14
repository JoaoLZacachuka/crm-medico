"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const paymentMethods = ["PIX", "Cartão", "Dinheiro", "Transferência"]

export default function FinancialPage() {
  const [financialData, setFinancialData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [editTransactionId, setEditTransactionId] = useState<number | null>(null)
  const [newTransaction, setNewTransaction] = useState({
    patient: "",
    description: "",
    amount: "",
    date: "",
    status: "Pago",
    method: "",
    type: "Receita",
  })

  // Buscar dados financeiros com relacionamento paciente
  const fetchFinancialData = async () => {
    const { data, error } = await supabase
      .from("financial_records")
      .select(`
        *,
        paciente:paciente_id (
          nome
        )
      `)
      .order("data", { ascending: false })

    if (error) {
      console.error("Erro ao buscar dados financeiros:", error)
      return
    }

    const dataWithNames = data.map((item) => ({
      ...item,
      patient: item.paciente?.nome || "-",
    }))
    setFinancialData(dataWithNames)
  }

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const handleSaveTransaction = async () => {
    const payload = {
      paciente_id: newTransaction.patient || null,
      descricao: newTransaction.description,
      valor: parseFloat(newTransaction.amount),
      data: newTransaction.date,
      tipo: newTransaction.type,
      status: newTransaction.status,
      metodo: newTransaction.method,
    }

    // Validação simples
    if (
      !payload.paciente_id ||
      !payload.descricao ||
      isNaN(payload.valor) ||
      !payload.data ||
      !payload.tipo ||
      !payload.status ||
      !payload.metodo
    ) {
      alert("Por favor, preencha todos os campos corretamente.")
      return
    }

    let result
    if (editTransactionId) {
      result = await supabase.from("financial_records").update(payload).eq("id", editTransactionId)
    } else {
      result = await supabase.from("financial_records").insert([payload])
    }

    if (result.error) {
      console.error("Erro ao salvar transação:", result.error)
      alert(`Erro ao salvar transação: ${result.error.message}`)
    } else {
      setIsNewTransactionOpen(false)
      setNewTransaction({ patient: "", description: "", amount: "", date: "", status: "Pago", method: "", type: "Receita" })
      setEditTransactionId(null)
      fetchFinancialData()
    }
  }

  const handleEdit = (item: any) => {
    setNewTransaction({
      patient: item.paciente_id || "",
      description: item.descricao,
      amount: item.valor.toString(),
      date: item.data,
      status: item.status,
      method: item.metodo,
      type: item.tipo,
    })
    setEditTransactionId(item.id)
    setIsNewTransactionOpen(true)
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("financial_records").delete().eq("id", id)
    if (error) {
      console.error("Erro ao excluir:", error)
      alert(`Erro ao excluir transação: ${error.message}`)
    } else {
      fetchFinancialData()
    }
  }

  const filteredData = financialData.filter((item) => {
    const matchesSearch =
      item.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.tipo === typeFilter
    const matchesDate = !dateFilter || item.data === dateFilter
    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const getStatusColor = (status: string) => (status === "Pago" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800")
  const getTypeColor = (type: string) => (type === "Receita" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "PIX":
        return <Smartphone className="h-4 w-4" />
      case "Cartão":
        return <CreditCard className="h-4 w-4" />
      case "Dinheiro":
        return <Banknote className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <Dialog
          open={isNewTransactionOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditTransactionId(null)
              setNewTransaction({ patient: "", description: "", amount: "", date: "", status: "Pago", method: "", type: "Receita" })
            }
            setIsNewTransactionOpen(open)
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> {editTransactionId ? "Editar" : "Nova"} Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editTransactionId ? "Editar Transação" : "Nova Transação"}</DialogTitle>
              <DialogDescription>Preencha os dados da transação</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input value={newTransaction.description} onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction((prev) => ({ ...prev, date: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Método</Label>
                  <Select value={newTransaction.method} onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, method: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Método" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newTransaction.status} onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveTransaction}>{editTransactionId ? "Salvar Alterações" : "Adicionar Transação"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-semibold">{item.descricao}</div>
                      {item.patient !== "-" && <div className="text-sm text-gray-500">{item.patient}</div>}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge className={getTypeColor(item.tipo)}>{item.tipo}</Badge> R$ {item.valor.toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(item.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      {getMethodIcon(item.metodo)}
                      <span>{item.metodo}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredData.length === 0 && (
              <div className="text-center py-4 text-sm text-gray-500">Nenhuma transação encontrada.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
