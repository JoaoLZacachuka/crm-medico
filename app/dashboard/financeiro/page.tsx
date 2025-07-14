"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados simulados
const financialData = [
  {
    id: 1,
    patient: "Maria Silva",
    description: "Consulta médica",
    amount: 150.0,
    date: "2024-01-20",
    status: "Pago",
    method: "PIX",
    type: "Receita",
  },
  {
    id: 2,
    patient: "João Santos",
    description: "Exame de rotina",
    amount: 200.0,
    date: "2024-01-19",
    status: "Pendente",
    method: "Cartão",
    type: "Receita",
  },
  {
    id: 3,
    patient: "-",
    description: "Material médico",
    amount: 350.0,
    date: "2024-01-18",
    status: "Pago",
    method: "Transferência",
    type: "Despesa",
  },
  {
    id: 4,
    patient: "Ana Costa",
    description: "Consulta especializada",
    amount: 300.0,
    date: "2024-01-17",
    status: "Pago",
    method: "Dinheiro",
    type: "Receita",
  },
  {
    id: 5,
    patient: "-",
    description: "Aluguel do consultório",
    amount: 2500.0,
    date: "2024-01-15",
    status: "Pago",
    method: "Transferência",
    type: "Despesa",
  },
]

const stats = [
  {
    title: "Receita Mensal",
    value: "R$ 45.230",
    change: "+12%",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Despesas Mensais",
    value: "R$ 18.450",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingDown,
    color: "text-red-600",
  },
  {
    title: "Lucro Líquido",
    value: "R$ 26.780",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-blue-600",
  },
  {
    title: "Pagamentos Pendentes",
    value: "R$ 3.200",
    change: "-8%",
    changeType: "negative" as const,
    icon: DollarSign,
    color: "text-yellow-600",
  },
]

const paymentMethods = ["PIX", "Cartão", "Dinheiro", "Transferência"]

export default function FinancialPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    patient: "",
    description: "",
    amount: "",
    date: "",
    status: "Pago",
    method: "",
    type: "Receita",
  })

  const filteredData = financialData.filter((item) => {
    const matchesSearch =
      item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesDate = !dateFilter || item.date === dateFilter

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const getStatusColor = (status: string) => {
    return status === "Pago" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const getTypeColor = (type: string) => {
    return type === "Receita" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

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

  const handleNewTransaction = () => {
    // Aqui seria a integração com Supabase
    console.log("Nova transação:", newTransaction)
    setIsNewTransactionOpen(false)
    setNewTransaction({
      patient: "",
      description: "",
      amount: "",
      date: "",
      status: "Pago",
      method: "",
      type: "Receita",
    })
  }

  // Cálculo do gráfico simples
  const totalReceitas = financialData
    .filter((item) => item.type === "Receita" && item.status === "Pago")
    .reduce((sum, item) => sum + item.amount, 0)

  const totalDespesas = financialData
    .filter((item) => item.type === "Despesa")
    .reduce((sum, item) => sum + item.amount, 0)

  const receitaPercentage = (totalReceitas / (totalReceitas + totalDespesas)) * 100
  const despesaPercentage = (totalDespesas / (totalReceitas + totalDespesas)) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="mt-2 text-gray-600">Controle financeiro do consultório</p>
        </div>
        <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>Adicione uma nova receita ou despesa</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newTransaction.type === "Receita" && (
                <div className="space-y-2">
                  <Label htmlFor="patient">Paciente</Label>
                  <Input
                    id="patient"
                    placeholder="Nome do paciente"
                    value={newTransaction.patient}
                    onChange={(e) => setNewTransaction((prev) => ({ ...prev, patient: e.target.value }))}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição da transação"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Método</Label>
                  <Select
                    value={newTransaction.method}
                    onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Método de pagamento" />
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTransaction.status}
                    onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, status: value }))}
                  >
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
              <Button type="submit" onClick={handleNewTransaction}>
                Adicionar Transação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p
                className={`text-xs flex items-center mt-1 ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico Visual Simples */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Distribuição financeira mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Receitas</span>
                  <span className="font-medium">R$ {totalReceitas.toLocaleString("pt-BR")}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${receitaPercentage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Despesas</span>
                  <span className="font-medium">R$ {totalDespesas.toLocaleString("pt-BR")}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${despesaPercentage}%` }}></div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lucro Líquido</span>
                  <span className="text-lg font-bold text-blue-600">
                    R$ {(totalReceitas - totalDespesas).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Transações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Histórico de receitas e despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-[150px]"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
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
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{item.description}</div>
                          {item.patient !== "-" && <div className="text-sm text-gray-500">{item.patient}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          <span
                            className={`font-medium ${item.type === "Receita" ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.type === "Receita" ? "+" : "-"}R$ {item.amount.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getMethodIcon(item.method)}
                          <span>{item.method}</span>
                        </div>
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma transação encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros ou adicione uma nova transação.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
