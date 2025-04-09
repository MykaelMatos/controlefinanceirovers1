
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/context/FinanceContext";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, DollarSign, BarChart2, CreditCard, Calendar, PiggyBank, ArrowUp, ArrowDown } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    expenses, 
    incomes, 
    getTotalExpenses, 
    getTotalIncomes, 
    getBalance, 
    getExpensesByCategory,
    getExpensesByPaymentMethod,
    getExpensesByUser,
    getIncomesByUser
  } = useFinance();
  const { userSettings, getTotalLimitPercentage } = useSettings();
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Cálculos financeiros
  const totalExpenses = getTotalExpenses(currentMonth + 1, currentYear);
  const totalIncomes = getTotalIncomes(currentMonth + 1, currentYear);
  const balance = getBalance(currentMonth + 1, currentYear);
  const expensesByCategory = getExpensesByCategory(currentMonth + 1, currentYear);
  const expensesByPaymentMethod = getExpensesByPaymentMethod(currentMonth + 1, currentYear);
  const expensesByUser = getExpensesByUser(currentMonth + 1, currentYear);
  const incomesByUser = getIncomesByUser(currentMonth + 1, currentYear);
  
  const totalLimitPercentage = getTotalLimitPercentage(totalExpenses);
  const totalLimit = userSettings?.totalLimit || 0;

  // Dados para o gráfico de despesas por categoria
  const categoryChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Despesas por Categoria',
        data: Object.values(expensesByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de formas de pagamento
  const paymentMethodChartData = {
    labels: Object.keys(expensesByPaymentMethod),
    datasets: [
      {
        label: 'Despesas por Forma de Pagamento',
        data: Object.values(expensesByPaymentMethod),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="container">
      {/* Cabeçalho com resumo financeiro e controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a), {currentUser?.username}! Aqui está o resumo das suas finanças.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium px-2">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}>
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Cards de resumo financeiro */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className={`${balance >= 0 ? 'border-green-500/50' : 'border-red-500/50'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Saldo do Mês</CardDescription>
            <CardTitle className={`text-2xl ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Entradas: {formatCurrency(totalIncomes)}</span>
              <span>Saídas: {formatCurrency(totalExpenses)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/reports")}>
              <BarChart2 className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Limite de Gastos</CardDescription>
            <CardTitle className="text-2xl">
              {totalLimit > 0 ? (
                <>{formatCurrency(totalExpenses)} de {formatCurrency(totalLimit)}</>
              ) : (
                "Sem limite definido"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            {totalLimit > 0 ? (
              <>
                <Progress value={totalLimitPercentage} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  {totalLimitPercentage.toFixed(0)}% do limite utilizado
                </div>
              </>
            ) : (
              <div className="text-xs text-muted-foreground">
                Configure um limite mensal nas configurações
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/limits")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Gerenciar Limites
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ações Rápidas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate("/expenses/add")}>
              <ArrowDown className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
            <Button variant="outline" onClick={() => navigate("/incomes/add")}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Nova Entrada
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos e análises */}
      <Tabs defaultValue="expenses" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="payments">Formas de Pagamento</TabsTrigger>
          <TabsTrigger value="users">Por Usuário</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>
                Distribuição dos seus gastos no mês de {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {Object.keys(expensesByCategory).length > 0 ? (
                <Doughnut 
                  data={categoryChartData} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                  }} 
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <PiggyBank className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma despesa registrada neste mês</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Por Forma de Pagamento</CardTitle>
              <CardDescription>
                Como você está pagando suas despesas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {Object.values(expensesByPaymentMethod).some(value => value > 0) ? (
                <Bar 
                  data={paymentMethodChartData} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                  }} 
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma despesa registrada neste mês</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações por Usuário</CardTitle>
              <CardDescription>
                Comparação de despesas e entradas por usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(expensesByUser).length > 0 || Object.keys(incomesByUser).length > 0 ? (
                  <>
                    <div>
                      <h3 className="font-medium mb-2">Gastos por usuário</h3>
                      {Object.entries(expensesByUser).map(([userId, value]) => {
                        const username = userId === currentUser?.id ? currentUser.username : "Outro usuário";
                        return (
                          <div key={`expense-${userId}`} className="flex justify-between items-center mb-2">
                            <span>{username}</span>
                            <span className="font-medium">{formatCurrency(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Entradas por usuário</h3>
                      {Object.entries(incomesByUser).map(([userId, value]) => {
                        const username = userId === currentUser?.id ? currentUser.username : "Outro usuário";
                        return (
                          <div key={`income-${userId}`} className="flex justify-between items-center mb-2">
                            <span>{username}</span>
                            <span className="font-medium">{formatCurrency(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-center text-muted-foreground py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma movimentação registrada neste mês</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Últimas transações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
          <CardDescription>
            Suas movimentações financeiras recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...expenses, ...incomes]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((item) => {
                const isExpense = 'category' in item;
                return (
                  <div key={item.id} className="flex justify-between items-center p-2 border-b">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${isExpense ? 'bg-red-100' : 'bg-green-100'} mr-3`}>
                        {isExpense ? (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(item.date), "dd/MM/yyyy")} • 
                          {isExpense ? ` ${(item as typeof expenses[0]).category}` : ` ${(item as typeof incomes[0]).source}`}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium ${isExpense ? 'text-red-500' : 'text-green-500'}`}>
                      {isExpense ? '-' : '+'}{formatCurrency(item.value)}
                    </p>
                  </div>
                );
              })}
              
            {[...expenses, ...incomes].length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <PiggyBank className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma transação registrada</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/expenses/add")}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar primeira transação
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/reports")}>
            Ver Todas as Transações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
