
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, hashPassword, getFromLocalStorage, saveToLocalStorage, generateId } from '@/lib/database';
import { toast } from "@/hooks/use-toast";

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se há um usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = getFromLocalStorage<User[]>('users', []);
    const user = users.find(u => u.username === username);

    if (user && hashPassword(password) === user.passwordHash) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a), ${user.username}!`,
      });
      return true;
    }

    toast({
      title: "Erro no login",
      description: "Nome de usuário ou senha incorretos",
      variant: "destructive",
    });
    return false;
  };

  const register = (username: string, password: string): boolean => {
    const users = getFromLocalStorage<User[]>('users', []);
    
    if (users.some(u => u.username === username)) {
      toast({
        title: "Erro no cadastro",
        description: "Este nome de usuário já está em uso",
        variant: "destructive",
      });
      return false;
    }

    const newUser: User = {
      id: generateId(),
      username,
      passwordHash: hashPassword(password),
    };

    const updatedUsers = [...users, newUser];
    saveToLocalStorage('users', updatedUsers);
    
    toast({
      title: "Cadastro realizado com sucesso",
      description: "Você já pode fazer login!",
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema",
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
