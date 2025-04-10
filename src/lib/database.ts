import { useState, useEffect } from 'react';

// Tipos para os dados do aplicativo
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export type PaymentMethod = 'Pix' | 'Débito' | 'Dinheiro' | 'Cartão de Crédito';
export type Category = 'Alimentação' | 'Transporte' | 'Moradia' | 'Saúde' | 'Educação' | 'Lazer' | 'Vestuário' | 'Outros' | string;
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

export type Theme = 'light' | 'dark' | 'neon' | 'cyberpunk' | 'aurora' | 'galaxy' | 'quantum';

export type Currency = 'BRL' | 'USD' | 'EUR';

export interface CategoryLimit {
  category: Category;
  limit: number;
}

export interface UserSettings {
  userId: string;
  theme: Theme;
  currency: Currency;
  categoryLimits: CategoryLimit[];
  totalLimit: number;
  receiveNotifications: boolean;
  customCategories: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  total: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  userId: string;
  items: ShoppingItem[];
  isCompleted: boolean;
  totalCost: number;
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

// Função simulada de envio de email (em produção usaríamos um serviço real)
export const sendPasswordResetEmail = (email: string, password: string): boolean => {
  console.log(`Email de recuperação enviado para ${email} com a senha: ${password}`);
  return true; // Em uma aplicação real, retornaria o status do envio
};

// Função para gerar uma senha temporária aleatória
export const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
