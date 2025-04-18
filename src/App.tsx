
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { NotificationProvider } from "@/context/NotificationContext";

import Layout from "@/components/layout/Layout";
import RequireAuth from "@/components/auth/RequireAuth";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import AddExpense from "@/pages/expenses/AddExpense";
import AddIncome from "@/pages/incomes/AddIncome";
import FixedExpenses from "@/pages/fixedExpenses/FixedExpenses";
import Reports from "@/pages/reports/Reports";
import Limits from "@/pages/limits/Limits";
import Settings from "@/pages/settings/Settings";
import ShoppingLists from "@/pages/shopping/ShoppingLists";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <SettingsProvider>
            <FinanceProvider>
              <NotificationProvider>
                <Layout>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    
                    {/* Protected Routes */}
                    <Route element={<RequireAuth />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/expenses/add" element={<AddExpense />} />
                      <Route path="/incomes/add" element={<AddIncome />} />
                      <Route path="/fixed-expenses" element={<FixedExpenses />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/limits" element={<Limits />} />
                      <Route path="/shopping" element={<ShoppingLists />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                    
                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </NotificationProvider>
            </FinanceProvider>
          </SettingsProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
