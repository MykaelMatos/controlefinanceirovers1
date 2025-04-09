
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  Home,
  PlusCircle, 
  BarChart, 
  Settings, 
  LogOut, 
  ChevronDown,
  ChevronUp,
  DollarSign,
  PiggyBank,
  Clock,
  AlertCircle
} from "lucide-react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: "/", icon: <Home className="h-5 w-5" />, name: "Dashboard" },
    { path: "/expenses/add", icon: <PlusCircle className="h-5 w-5" />, name: "Nova Despesa" },
    { path: "/incomes/add", icon: <DollarSign className="h-5 w-5" />, name: "Nova Entrada" },
    { path: "/fixed-expenses", icon: <Clock className="h-5 w-5" />, name: "Despesas Fixas" },
    { path: "/reports", icon: <BarChart className="h-5 w-5" />, name: "Relatórios" },
    { path: "/limits", icon: <AlertCircle className="h-5 w-5" />, name: "Limites" },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, name: "Configurações" },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <PiggyBank className="h-8 w-8" />
              <span className="text-xl font-bold">FinanceTracker</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${location.pathname === item.path 
                    ? "bg-primary-foreground text-primary" 
                    : "hover:bg-primary-foreground/10"
                  }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            {currentUser && (
              <Button
                variant="ghost"
                className="flex items-center px-3 py-2"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Sair</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              className="focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden py-2 bg-primary border-t border-primary-foreground/20">
          <div className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${location.pathname === item.path 
                    ? "bg-primary-foreground text-primary" 
                    : "hover:bg-primary-foreground/10"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            {currentUser && (
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start px-3 py-2"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Sair</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
