
import React, { createContext, useContext, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useFinance } from './FinanceContext';
import { useSettings } from './SettingsContext';
import { Expense, Category } from '@/lib/database';

interface NotificationContextProps {
  scheduleNotification: (title: string, body: string, id?: number) => Promise<void>;
  checkLimits: () => Promise<void>;
  checkFixedExpensesDue: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { expenses, getExpensesByCategory, getTotalExpenses, fixedExpenses } = useFinance();
  const { userSettings, getCategoryLimit } = useSettings();

  // Inicializar notificações
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await LocalNotifications.requestPermissions();
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };

    initNotifications();
  }, []);

  // Enviar uma notificação
  const scheduleNotification = async (title: string, body: string, id?: number) => {
    if (!userSettings?.receiveNotifications) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: id || Math.floor(Math.random() * 10000),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'beep.wav',
            smallIcon: 'ic_stat_icon_config_sample',
          },
        ],
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // Verificar se os limites estão próximos ou ultrapassados
  const checkLimits = async () => {
    if (!userSettings?.receiveNotifications) return;

    // Verificar limites por categoria
    const expensesByCategory = getExpensesByCategory();
    
    for (const category of Object.keys(expensesByCategory) as Category[]) {
      const spent = expensesByCategory[category];
      const limit = getCategoryLimit(category);
      
      if (limit > 0) {
        const percentage = (spent / limit) * 100;
        
        if (percentage >= 100) {
          await scheduleNotification(
            `Limite excedido: ${category}`,
            `Você ultrapassou o limite de R$ ${limit.toFixed(2)} para ${category}. Gasto atual: R$ ${spent.toFixed(2)}.`
          );
        } else if (percentage >= 80) {
          await scheduleNotification(
            `Alerta de limite: ${category}`,
            `Você atingiu ${percentage.toFixed(0)}% do limite para ${category} (R$ ${spent.toFixed(2)} de R$ ${limit.toFixed(2)}).`
          );
        }
      }
    }
    
    // Verificar limite total
    if (userSettings?.totalLimit > 0) {
      const totalSpent = getTotalExpenses();
      const totalPercentage = (totalSpent / userSettings.totalLimit) * 100;
      
      if (totalPercentage >= 100) {
        await scheduleNotification(
          'Limite total excedido',
          `Você ultrapassou o limite total de R$ ${userSettings.totalLimit.toFixed(2)}. Gasto atual: R$ ${totalSpent.toFixed(2)}.`
        );
      } else if (totalPercentage >= 80) {
        await scheduleNotification(
          'Alerta de limite total',
          `Você atingiu ${totalPercentage.toFixed(0)}% do limite total (R$ ${totalSpent.toFixed(2)} de R$ ${userSettings.totalLimit.toFixed(2)}).`
        );
      }
    }
  };

  // Verificar despesas fixas próximas do vencimento
  const checkFixedExpensesDue = async () => {
    if (!userSettings?.receiveNotifications) return;
    
    const today = new Date();
    const currentDay = today.getDate();
    
    for (const expense of fixedExpenses) {
      if (expense.dueDay && Math.abs(expense.dueDay - currentDay) <= 3) {
        const daysRemaining = expense.dueDay - currentDay;
        
        if (daysRemaining >= 0) {
          const daysText = daysRemaining === 0 ? 'hoje' : 
                          daysRemaining === 1 ? 'amanhã' : 
                          `em ${daysRemaining} dias`;
          
          await scheduleNotification(
            `Despesa fixa próxima: ${expense.name}`,
            `A despesa ${expense.name} vence ${daysText}. Valor: R$ ${expense.value.toFixed(2)}.`
          );
        }
      }
    }
  };

  useEffect(() => {
    // Verificar limites quando as despesas mudarem
    const checkForAlerts = async () => {
      await checkLimits();
      await checkFixedExpensesDue();
    };
    
    checkForAlerts();

    // Agendar verificação diária
    const dailyCheck = setInterval(checkForAlerts, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(dailyCheck);
  }, [expenses, fixedExpenses]);

  return (
    <NotificationContext.Provider value={{
      scheduleNotification,
      checkLimits,
      checkFixedExpensesDue,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
