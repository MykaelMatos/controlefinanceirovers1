
import { useState, useEffect } from 'react';

// Tipos para os dados do aplicativo
export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export type PaymentMethod = 'Pix' | 'Débito' | 'Dinheiro' | 'Cartão de Crédito';
export type Category = 'Alimentação' | 'Transporte' | 'Moradia' | 'Lazer' | 'Saúde' | 'Educação' | 'Outros';
export type IncomeSource = 'Salário' | 'Freelance' | 'Presente' | 'Outros';
export type Periodicity = 'Diário' | 'Semanal' | 'Mensal' | 'Anual';

export interface Expense {
  id: string;
  value: number;
  paymentMethod: PaymentMethod;
  date: string;
  category: Category;
  description: string;
  userId: string;
  installments?: number;
  installmentValue?: number;
  installmentNumber?: number;
  totalValue?: number;
}

export interface Income {
  id: string;
  value: number;
  date: string;
  source: IncomeSource;
  description: string;
  userId: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  value: number;
  periodicity: Periodicity;
  category: Category;
  dueDay?: number;
}

export interface CategoryLimit {
  category: Category;
  limit: number;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'neon' | 'cyberpunk';
  currency: 'BRL' | 'USD' | 'EUR';
  categoryLimits: CategoryLimit[];
  totalLimit: number;
  receiveNotifications: boolean;
  customCategories: string[];
}

// Banco de dados local usando localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Hook para manipular dados no localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromLocalStorage(key, initialValue);
  });

  useEffect(() => {
    saveToLocalStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// Gera um ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Função para hash de senha (em produção usaríamos bcrypt)
export const hashPassword = (password: string): string => {
  // Implementação simples de hash para demonstração
  // Em produção, use uma biblioteca de criptografia robusta
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};
