"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote, Calendar, Download, Plus } from "lucide-react"

const financialStats = [
  {
    title: "Receita Total",
    value: "R$ 45.230",
    change: "+12%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Despesas",
    value: "R$ 18.450",
    change: "+3%",
    changeType: "negative" as const,
    icon: TrendingDown,
  },
  {
    title: "Lucro Líquido",
    value: "R$ 26.780",
    change: "+18%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Consultas Pagas",
    value: "234",
    change: "+8%",
    changeType: "positive" as const,
    icon: CreditCard,
  },
]

const payments = [
  {
    id: "1",
    patient: "Maria Silva",
    service: "Consulta Cardiológica",
    amount: "R$ 180,00",
    date: "15/01/2024",
    method: "Cartão de Crédito",
    status: "Pago",
  },
  {
    id: "2",
    patient: "João Santos",
    service: "Exame de Rotina",
    amount: "R$ 120,00",
    date: "14/01/2024",
    method: "PIX",
    status: "Pago",
  },
  {
    id: "3",
    patient: "Ana Costa",
    service: "Consulta Dermatológica",
    amount: "R$ 200,00",
    date: "13/01/2024",
    method: "Dinheiro",
    status: "Pago",
  },
  {
    id: "4",
    patient: "Carlos Oliveira",
    service: "Retorno Cardiológico",
    amount: "R$ 90,00",
    date: "12/01/2024",
    method: "Cartão de Débito",
    status: "Pendente",
  },
  {
    id: "5",
    patient: "Lucia Ferreira",
    service: "Consulta Pneumológica",
    amount: "R$ 160,00",
    date: "11/01/2024",
    method: "PIX",
    status: "Pago",
  },
  {
    id: "6",
    patient: "Pedro Almeida",
    service: "Exame Cardiológico",
    amount: "R$ 250,00",
    date: "10/01/2024",
    method: "Cartão de Crédito",
    status: "Cancelado",
  },
]

const monthlyData = [
  { month: "Jan", receita: 42000, despesas: 18000 },
  { month: "Fev", receita: 38000, despesas: 16000 },
  { month: "Mar", receita: 45000, despesas: 19000 },
  { month: "Abr", receita: 41000, despesas: 17000 },
  { month: "Mai", receita: 48000, despesas: 20000 },
  { month: "Jun", receita: 45230, despesas: 18450 },
]

export default function FinanceiroPage() {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pago":
        return "default"
      case "pendente":
        return "secondary"
      case "cancelado":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "pix":
        return <Banknote className="h-4 w-4" />
      case "dinheiro":
        return <Banknote className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle financeiro da clínica</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
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
        {/* Revenue Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparativo mensal dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">R$ {(data.receita - data.despesas).toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.receita / 50000) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(data.despesas / 50000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Receita: R$ {data.receita.toLocaleString()}</span>
                    <span>Despesas: R$ {data.despesas.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <span>Receitas</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span>Despesas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Resumo do Mês</CardTitle>
            <CardDescription>Estatísticas financeiras de Janeiro 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">Maior Receita</p>
                <p className="text-lg font-bold text-green-900">R$ 250,00</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-800">Média por Consulta</p>
                <p className="text-lg font-bold text-blue-900">R$ 165,00</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-800">Consultas Realizadas</p>
                <p className="text-lg font-bold text-purple-900">234</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Taxa de Conversão</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Últimas transações financeiras da clínica</CardDescription>
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{payment.patient}</TableCell>
                    <TableCell>{payment.service}</TableCell>
                    <TableCell className="font-medium text-green-600">{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span>{payment.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
