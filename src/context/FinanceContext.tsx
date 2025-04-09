
import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage, Expense, Income, FixedExpense, Category, PaymentMethod, IncomeSource, Periodicity, generateId } from '@/lib/database';
import { useAuth } from './AuthContext';
import { toast } from "@/hooks/use-toast";

interface FinanceContextProps {
  // Despesas
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'userId'>>) => void;
  deleteExpense: (id: string) => void;
  
  // Entradas
  incomes: Income[];
  addIncome: (income: Omit<Income, 'id' | 'userId'>) => void;
  updateIncome: (id: string, income: Partial<Omit<Income, 'id' | 'userId'>>) => void;
  deleteIncome: (id: string) => void;
  
  // Despesas fixas
  fixedExpenses: FixedExpense[];
  addFixedExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  updateFixedExpense: (id: string, expense: Partial<Omit<FixedExpense, 'id'>>) => void;
  deleteFixedExpense: (id: string) => void;
  
  // Categorias disponíveis
  categories: Category[];
  paymentMethods: PaymentMethod[];
  incomeSources: IncomeSource[];
  periodicities: Periodicity[];
  
  // Cálculos financeiros
  getTotalExpenses: (month?: number, year?: number) => number;
  getTotalIncomes: (month?: number, year?: number) => number;
  getBalance: (month?: number, year?: number) => number;
  getExpensesByCategory: (month?: number, year?: number) => Record<Category, number>;
  getExpensesByUser: (month?: number, year?: number) => Record<string, number>;
  getIncomesByUser: (month?: number, year?: number) => Record<string, number>;
  getExpensesByPaymentMethod: (month?: number, year?: number) => Record<PaymentMethod, number>;
  getFutureExpenses: (months: number) => Expense[];
}

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
  const [fixedExpenses, setFixedExpenses] = useLocalStorage<FixedExpense[]>('fixedExpenses', []);

  const categories: Category[] = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros'];
  const paymentMethods: PaymentMethod[] = ['Pix', 'Débito', 'Dinheiro', 'Cartão de Crédito'];
  const incomeSources: IncomeSource[] = ['Salário', 'Freelance', 'Presente', 'Outros'];
  const periodicities: Periodicity[] = ['Diário', 'Semanal', 'Mensal', 'Anual'];

  // Adicionar uma nova despesa
  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!currentUser) return;

    // Se for cartão de crédito e tem parcelas
    if (expense.paymentMethod === 'Cartão de Crédito' && expense.installments && expense.installments > 1 && expense.totalValue) {
      const installmentValue = expense.totalValue / expense.installments;

      // Criar múltiplas parcelas como despesas individuais
      for (let i = 1; i <= expense.installments; i++) {
        const installmentDate = new Date(expense.date);
        installmentDate.setMonth(installmentDate.getMonth() + (i - 1));

        const newExpense: Expense = {
          ...expense,
          id: generateId(),
          userId: currentUser.id,
          installmentNumber: i,
          installmentValue: installmentValue,
          value: installmentValue,
          date: installmentDate.toISOString().split('T')[0],
        };

        setExpenses(prev => [...prev, newExpense]);
      }

      toast({
        title: "Despesa parcelada adicionada",
        description: `${expense.installments} parcelas registradas com sucesso`,
      });
    } else {
      // Despesa normal (não parcelada)
      const newExpense: Expense = {
        ...expense,
        id: generateId(),
        userId: currentUser.id,
      };

      setExpenses(prev => [...prev, newExpense]);
      toast({
        title: "Despesa adicionada",
        description: "Registro de despesa salvo com sucesso",
      });
    }
  };

  // Atualizar uma despesa existente
  const updateExpense = (id: string, expense: Partial<Omit<Expense, 'id' | 'userId'>>) => {
    setExpenses(prev => prev.map(item => 
      item.id === id ? { ...item, ...expense } : item
    ));
    toast({
      title: "Despesa atualizada",
      description: "As alterações foram salvas com sucesso",
    });
  };

  // Excluir uma despesa
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Despesa excluída",
      description: "A despesa foi removida com sucesso",
    });
  };

  // Adicionar uma nova entrada
  const addIncome = (income: Omit<Income, 'id' | 'userId'>) => {
    if (!currentUser) return;

    const newIncome: Income = {
      ...income,
      id: generateId(),
      userId: currentUser.id,
    };

    setIncomes(prev => [...prev, newIncome]);
    toast({
      title: "Entrada registrada",
      description: "Nova entrada de receita adicionada com sucesso",
    });
  };

  // Atualizar uma entrada existente
  const updateIncome = (id: string, income: Partial<Omit<Income, 'id' | 'userId'>>) => {
    setIncomes(prev => prev.map(item => 
      item.id === id ? { ...item, ...income } : item
    ));
    toast({
      title: "Entrada atualizada",
      description: "As alterações foram salvas com sucesso",
    });
  };

  // Excluir uma entrada
  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
    toast({
      title: "Entrada excluída",
      description: "A entrada foi removida com sucesso",
    });
  };

  // Adicionar uma nova despesa fixa
  const addFixedExpense = (expense: Omit<FixedExpense, 'id'>) => {
    const newFixedExpense: FixedExpense = {
      ...expense,
      id: generateId(),
    };

    setFixedExpenses(prev => [...prev, newFixedExpense]);
    toast({
      title: "Despesa fixa adicionada",
      description: "Nova despesa fixa registrada com sucesso",
    });
  };

  // Atualizar uma despesa fixa existente
  const updateFixedExpense = (id: string, expense: Partial<Omit<FixedExpense, 'id'>>) => {
    setFixedExpenses(prev => prev.map(item => 
      item.id === id ? { ...item, ...expense } : item
    ));
    toast({
      title: "Despesa fixa atualizada",
      description: "As alterações foram salvas com sucesso",
    });
  };

  // Excluir uma despesa fixa
  const deleteFixedExpense = (id: string) => {
    setFixedExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Despesa fixa excluída",
      description: "A despesa fixa foi removida com sucesso",
    });
  };

  // Filtrar transações por mês e ano
  const filterByMonth = <T extends { date: string }>(items: T[], month?: number, year?: number): T[] => {
    if (month === undefined || year === undefined) {
      const today = new Date();
      month = today.getMonth() + 1; // Janeiro é 0
      year = today.getFullYear();
    }

    return items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
    });
  };

  // Obter o total de despesas para um mês específico
  const getTotalExpenses = (month?: number, year?: number): number => {
    const filteredExpenses = filterByMonth(expenses, month, year);
    return filteredExpenses.reduce((total, expense) => total + expense.value, 0);
  };

  // Obter o total de entradas para um mês específico
  const getTotalIncomes = (month?: number, year?: number): number => {
    const filteredIncomes = filterByMonth(incomes, month, year);
    return filteredIncomes.reduce((total, income) => total + income.value, 0);
  };

  // Calcular o saldo (entradas - despesas)
  const getBalance = (month?: number, year?: number): number => {
    return getTotalIncomes(month, year) - getTotalExpenses(month, year);
  };

  // Agrupar despesas por categoria
  const getExpensesByCategory = (month?: number, year?: number): Record<Category, number> => {
    const filteredExpenses = filterByMonth(expenses, month, year);
    
    const result: Record<string, number> = {};
    categories.forEach(category => {
      result[category] = 0;
    });

    filteredExpenses.forEach(expense => {
      result[expense.category] = (result[expense.category] || 0) + expense.value;
    });

    return result as Record<Category, number>;
  };

  // Agrupar despesas por usuário
  const getExpensesByUser = (month?: number, year?: number): Record<string, number> => {
    const filteredExpenses = filterByMonth(expenses, month, year);
    
    const result: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      result[expense.userId] = (result[expense.userId] || 0) + expense.value;
    });

    return result;
  };

  // Agrupar entradas por usuário
  const getIncomesByUser = (month?: number, year?: number): Record<string, number> => {
    const filteredIncomes = filterByMonth(incomes, month, year);
    
    const result: Record<string, number> = {};
    filteredIncomes.forEach(income => {
      result[income.userId] = (result[income.userId] || 0) + income.value;
    });

    return result;
  };

  // Agrupar despesas por método de pagamento
  const getExpensesByPaymentMethod = (month?: number, year?: number): Record<PaymentMethod, number> => {
    const filteredExpenses = filterByMonth(expenses, month, year);
    
    const result: Record<string, number> = {};
    paymentMethods.forEach(method => {
      result[method] = 0;
    });

    filteredExpenses.forEach(expense => {
      result[expense.paymentMethod] = (result[expense.paymentMethod] || 0) + expense.value;
    });

    return result as Record<PaymentMethod, number>;
  };

  // Obter projeção de despesas futuras (parcelas de cartão + despesas fixas)
  const getFutureExpenses = (months: number): Expense[] => {
    const today = new Date();
    const futureExpenses: Expense[] = [];

    // Filtrar parcelas de cartão de crédito futuras
    expenses.forEach(expense => {
      if (expense.paymentMethod === 'Cartão de Crédito' &&
          expense.installmentNumber && expense.installments) {
        const expenseDate = new Date(expense.date);
        if (expenseDate > today) {
          futureExpenses.push(expense);
        }
      }
    });

    // Adicionar despesas fixas projetadas para os próximos meses
    fixedExpenses.forEach(fixedExpense => {
      for (let i = 0; i < months; i++) {
        const projectionDate = new Date();
        projectionDate.setMonth(today.getMonth() + i);

        const projectedExpense: Expense = {
          id: `projection-${fixedExpense.id}-${i}`,
          value: fixedExpense.value,
          paymentMethod: 'Débito',
          date: projectionDate.toISOString().split('T')[0],
          category: fixedExpense.category,
          description: `${fixedExpense.name} (Despesa fixa)`,
          userId: 'system',
        };

        futureExpenses.push(projectedExpense);
      }
    });

    return futureExpenses;
  };

  return (
    <FinanceContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      
      incomes,
      addIncome,
      updateIncome,
      deleteIncome,
      
      fixedExpenses,
      addFixedExpense,
      updateFixedExpense,
      deleteFixedExpense,
      
      categories,
      paymentMethods,
      incomeSources,
      periodicities,
      
      getTotalExpenses,
      getTotalIncomes,
      getBalance,
      getExpensesByCategory,
      getExpensesByUser,
      getIncomesByUser,
      getExpensesByPaymentMethod,
      getFutureExpenses
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
