
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, hashPassword, getFromLocalStorage, saveToLocalStorage, generateId } from '@/lib/database';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  resetPassword: (username: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário logado no localStorage
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    try {
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
    } catch (error) {
      console.error("Erro no processo de login:", error);
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro ao processar o login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = (username: string, password: string): boolean => {
    try {
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
    } catch (error) {
      console.error("Erro no processo de cadastro:", error);
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro ao processar o cadastro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
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
  
  const resetPassword = (username: string): boolean => {
    try {
      const users = getFromLocalStorage<User[]>('users', []);
      const user = users.find(u => u.username === username);
      
      // Em uma aplicação real, enviaríamos um e-mail com instruções para redefinir a senha
      // Como este é um exemplo simplificado, apenas retornamos true para simular sucesso
      
      // Não revelamos se o usuário existe ou não por questões de segurança
      toast({
        title: "Instruções enviadas",
        description: "Se o usuário existir, um e-mail com instruções para redefinição de senha foi enviado.",
      });
      return true;
    } catch (error) {
      console.error("Erro no processo de redefinição de senha:", error);
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro ao processar a solicitação. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      resetPassword,
      isLoading 
    }}>
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
