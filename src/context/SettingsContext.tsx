
import React, { createContext, useContext } from 'react';
import { useLocalStorage, UserSettings, CategoryLimit, Category } from '@/lib/database';
import { useAuth } from './AuthContext';
import { toast } from "@/hooks/use-toast";

interface SettingsContextProps {
  userSettings: UserSettings | null;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  addCategoryLimit: (category: Category, limit: number) => void;
  updateCategoryLimit: (category: Category, limit: number) => void;
  removeCategoryLimit: (category: Category) => void;
  updateTotalLimit: (limit: number) => void;
  addCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
  getCategoryLimit: (category: Category) => number;
  getLimitPercentage: (category: Category, currentSpent: number) => number;
  getTotalLimitPercentage: (totalSpent: number) => number;
}

const defaultSettings: UserSettings = {
  userId: '',
  theme: 'light',
  currency: 'BRL',
  categoryLimits: [],
  totalLimit: 0,
  receiveNotifications: true,
  customCategories: []
};

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [allSettings, setAllSettings] = useLocalStorage<UserSettings[]>('userSettings', []);

  // Obter as configurações do usuário atual
  const userSettings = currentUser 
    ? allSettings.find(s => s.userId === currentUser.id) || { ...defaultSettings, userId: currentUser.id }
    : null;

  // Atualizar as configurações do usuário
  const updateUserSettings = (settings: Partial<UserSettings>) => {
    if (!currentUser || !userSettings) return;

    const updatedSettings = { ...userSettings, ...settings };
    
    setAllSettings(prev => {
      const existingIndex = prev.findIndex(s => s.userId === currentUser.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedSettings;
        return updated;
      } else {
        return [...prev, updatedSettings];
      }
    });

    toast({
      title: "Configurações atualizadas",
      description: "Suas preferências foram salvas com sucesso",
    });
  };

  // Adicionar limite para uma categoria
  const addCategoryLimit = (category: Category, limit: number) => {
    if (!currentUser || !userSettings) return;

    const newLimit: CategoryLimit = { category, limit };
    const updatedLimits = [...userSettings.categoryLimits.filter(l => l.category !== category), newLimit];
    updateUserSettings({ categoryLimits: updatedLimits });

    toast({
      title: "Limite adicionado",
      description: `Limite de R$ ${limit.toFixed(2)} para ${category} configurado`,
    });
  };

  // Atualizar limite para uma categoria
  const updateCategoryLimit = (category: Category, limit: number) => {
    if (!currentUser || !userSettings) return;

    const updatedLimits = userSettings.categoryLimits.map(l => 
      l.category === category ? { ...l, limit } : l
    );
    updateUserSettings({ categoryLimits: updatedLimits });

    toast({
      title: "Limite atualizado",
      description: `Limite para ${category} atualizado para R$ ${limit.toFixed(2)}`,
    });
  };

  // Remover limite para uma categoria
  const removeCategoryLimit = (category: Category) => {
    if (!currentUser || !userSettings) return;

    const updatedLimits = userSettings.categoryLimits.filter(l => l.category !== category);
    updateUserSettings({ categoryLimits: updatedLimits });

    toast({
      title: "Limite removido",
      description: `Limite para ${category} foi removido`,
    });
  };

  // Atualizar limite total
  const updateTotalLimit = (limit: number) => {
    if (!currentUser || !userSettings) return;

    updateUserSettings({ totalLimit: limit });

    toast({
      title: "Limite total atualizado",
      description: `Limite total atualizado para R$ ${limit.toFixed(2)}`,
    });
  };

  // Adicionar categoria personalizada
  const addCustomCategory = (category: string) => {
    if (!currentUser || !userSettings) return;

    if (userSettings.customCategories.includes(category)) {
      toast({
        title: "Categoria já existe",
        description: "Esta categoria já foi adicionada anteriormente",
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = [...userSettings.customCategories, category];
    updateUserSettings({ customCategories: updatedCategories });

    toast({
      title: "Categoria adicionada",
      description: `A categoria ${category} foi adicionada com sucesso`,
    });
  };

  // Remover categoria personalizada
  const removeCustomCategory = (category: string) => {
    if (!currentUser || !userSettings) return;

    const updatedCategories = userSettings.customCategories.filter(c => c !== category);
    updateUserSettings({ customCategories: updatedCategories });

    toast({
      title: "Categoria removida",
      description: `A categoria ${category} foi removida`,
    });
  };

  // Obter limite para uma categoria
  const getCategoryLimit = (category: Category): number => {
    if (!userSettings) return 0;

    const limitItem = userSettings.categoryLimits.find(l => l.category === category);
    return limitItem ? limitItem.limit : 0;
  };

  // Calcular percentual de uso do limite de uma categoria
  const getLimitPercentage = (category: Category, currentSpent: number): number => {
    const limit = getCategoryLimit(category);
    if (limit <= 0) return 0;
    return Math.min(100, (currentSpent / limit) * 100);
  };

  // Calcular percentual de uso do limite total
  const getTotalLimitPercentage = (totalSpent: number): number => {
    if (!userSettings || userSettings.totalLimit <= 0) return 0;
    return Math.min(100, (totalSpent / userSettings.totalLimit) * 100);
  };

  return (
    <SettingsContext.Provider value={{
      userSettings,
      updateUserSettings,
      addCategoryLimit,
      updateCategoryLimit,
      removeCategoryLimit,
      updateTotalLimit,
      addCustomCategory,
      removeCustomCategory,
      getCategoryLimit,
      getLimitPercentage,
      getTotalLimitPercentage,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
