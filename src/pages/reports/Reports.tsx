
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { 
    expenses, 
    incomes, 
    getTotalExpenses, 
    getTotalIncomes, 
    getBalance 
  } = useFinance();
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Filtros
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Funções de filtro para despesas
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const isCurrentMonth = expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    
    const categoryMatches = categoryFilter === "all" || expense.category === categoryFilter;
    const paymentMethodMatches = paymentMethodFilter === "all" || expense.paymentMethod === paymentMethodFilter;
    
    return isCurrentMonth && categoryMatches && paymentMethodMatches;
  });

  // Filtrar receitas do mês atual
  const filteredIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });

  // Dados para o gráfico de balanço mensal (últimos 6 meses)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  }).reverse();

  const balanceChartData = {
    labels: last6Months.map(date => format(date, "MMM yy", { locale: ptBR })),
    datasets: [
      {
        label: 'Receitas',
        data: last6Months.map(date => getTotalIncomes(date.getMonth() + 1, date.getFullYear())),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Despesas',
        data: last6Months.map(date => getTotalExpenses(date.getMonth() + 1, date.getFullYear())),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Dados do relatório para exportação
  const exportReport = () => {
    const reportData = {
      month: format(currentDate, "MMMM yyyy", { locale: ptBR }),
      totalIncomes: getTotalIncomes(currentMonth + 1, currentYear),
      totalExpenses: getTotalExpenses(currentMonth + 1, currentYear),
      balance: getBalance(currentMonth + 1, currentYear),
      expenses: filteredExpenses,
      incomes: filteredIncomes
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `financas-${format(currentDate, "yyyy-MM", { locale: ptBR })}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Categorias e métodos de pagamento para os filtros
  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));
  const uniquePaymentMethods = Array.from(new Set(expenses.map(expense => expense.paymentMethod)));

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">
            Análise detalhada das suas finanças
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium px-2">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth} 
            disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Entradas</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {formatCurrency(getTotalIncomes(currentMonth + 1, currentYear))}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Saídas</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {formatCurrency(getTotalExpenses(currentMonth + 1, currentYear))}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo do Mês</CardDescription>
            <CardTitle className={`text-2xl ${getBalance(currentMonth + 1, currentYear) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(getBalance(currentMonth + 1, currentYear))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Evolução Financeira</CardTitle>
          <CardDescription>
            Comparativo dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Line 
            data={balanceChartData} 
            options={{ 
              responsive: true,
              maintainAspectRatio: false,
            }} 
          />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="expenses" className="mb-8">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="incomes">Entradas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <CardTitle>Lista de Despesas</CardTitle>
                  <CardDescription>
                    Despesas registradas em {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                  </CardDescription>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {uniqueCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {uniquePaymentMethods.map(method => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Nenhuma despesa encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                              {expense.description}
                              {expense.installmentNumber && expense.installments && (
                                <span className="text-xs ml-2 text-muted-foreground">
                                  {expense.installmentNumber}/{expense.installments}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{format(new Date(expense.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{expense.paymentMethod}</TableCell>
                            <TableCell className="text-right font-medium text-red-500">
                              {formatCurrency(expense.value)}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Entradas</CardTitle>
              <CardDescription>
                Entradas registradas em {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncomes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Nenhuma entrada encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncomes
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((income) => (
                          <TableRow key={income.id}>
                            <TableCell className="font-medium">{income.description}</TableCell>
                            <TableCell>{format(new Date(income.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{income.source}</TableCell>
                            <TableCell className="text-right font-medium text-green-500">
                              {formatCurrency(income.value)}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
