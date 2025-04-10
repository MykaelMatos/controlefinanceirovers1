
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import { Theme } from "@/lib/database";
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
  AlertCircle,
  X
} from "lucide-react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <nav className={cn(
      "text-primary-foreground shadow-md sticky top-0 z-40 transition-all duration-300",
      scrolled ? "backdrop-blur-lg bg-background/80" : "bg-primary",
      theme === 'aurora' && "bg-gradient-to-r from-[hsl(180_100%_30%)] to-[hsl(220_100%_40%)]",
      theme === 'galaxy' && "bg-gradient-to-r from-[hsl(290_100%_30%)] to-[hsl(260_100%_20%)]",
      theme === 'quantum' && "bg-gradient-to-r from-[hsl(180_100%_25%)] to-[hsl(220_100%_30%)]",
      scrolled && theme === 'aurora' && "bg-background/40 backdrop-blur-xl border-b border-[hsl(180_100%_60%/0.2)]",
      scrolled && theme === 'galaxy' && "bg-background/40 backdrop-blur-xl border-b border-[hsl(290_100%_60%/0.2)]",
      scrolled && theme === 'quantum' && "bg-background/40 backdrop-blur-xl border-b border-[hsl(180_100%_50%/0.2)]"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className={cn(
              "flex items-center space-x-2 transition-all duration-300 hover:scale-105",
              theme === 'aurora' && "animate-glow",
              theme === 'quantum' && "relative z-10 after:content-[''] after:absolute after:inset-0 after:bg-primary/20 after:blur-lg after:z-[-1]"
            )}>
              <PiggyBank className={cn(
                "h-8 w-8",
                theme === 'aurora' && "text-[hsl(180_100%_80%)]",
                theme === 'galaxy' && "text-[hsl(290_100%_80%)]",
                theme === 'quantum' && "text-[hsl(180_100%_70%)]"
              )} />
              <span className={cn(
                "text-xl font-bold",
                theme === 'aurora' && "text-[hsl(180_100%_80%)]",
                theme === 'galaxy' && "text-[hsl(290_100%_80%)]",
                theme === 'quantum' && "text-[hsl(180_100%_80%)]"
              )}>FinanceTracker</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  location.pathname === item.path 
                    ? cn(
                      "bg-primary-foreground text-primary",
                      theme === 'aurora' && "bg-[hsla(180_100%_60%/0.2)] text-[hsl(180_100%_80%)] backdrop-blur-sm border border-[hsl(180_100%_60%/0.3)]",
                      theme === 'galaxy' && "bg-[hsla(290_100%_60%/0.2)] text-[hsl(290_100%_80%)] backdrop-blur-sm border border-[hsl(290_100%_60%/0.3)]",
                      theme === 'quantum' && "bg-[hsla(180_100%_50%/0.2)] text-[hsl(180_100%_80%)] backdrop-blur-sm border border-[hsl(180_100%_50%/0.3)]"
                    )
                    : cn(
                      "hover:bg-primary-foreground/10",
                      theme === 'aurora' && "hover:bg-[hsla(180_100%_60%/0.1)] hover:border hover:border-[hsl(180_100%_60%/0.2)]",
                      theme === 'galaxy' && "hover:bg-[hsla(290_100%_60%/0.1)] hover:border hover:border-[hsl(290_100%_60%/0.2)]",
                      theme === 'quantum' && "hover:bg-[hsla(180_100%_50%/0.1)] hover:border hover:border-[hsl(180_100%_50%/0.2)]"
                    )
                )}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            {currentUser && (
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center px-3 py-2",
                  theme === 'aurora' && "hover:bg-[hsla(180_100%_60%/0.1)]",
                  theme === 'galaxy' && "hover:bg-[hsla(290_100%_60%/0.1)]",
                  theme === 'quantum' && "hover:bg-[hsla(180_100%_50%/0.1)]"
                )}
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
              className={cn(
                "focus:outline-none transition-transform duration-300",
                isOpen && "rotate-90"
              )}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className={cn(
          "md:hidden py-2 border-t border-primary-foreground/20 animate-in slide-in-from-top duration-300",
          theme === 'aurora' && "border-[hsl(180_100%_60%/0.2)] bg-background/60 backdrop-blur-xl",
          theme === 'galaxy' && "border-[hsl(290_100%_60%/0.2)] bg-background/60 backdrop-blur-xl",
          theme === 'quantum' && "border-[hsl(180_100%_50%/0.2)] bg-background/60 backdrop-blur-xl"
        )}>
          <div className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  location.pathname === item.path 
                    ? cn(
                      "bg-primary-foreground text-primary",
                      theme === 'aurora' && "bg-[hsla(180_100%_60%/0.2)] text-[hsl(180_100%_80%)] backdrop-blur-sm border border-[hsl(180_100%_60%/0.3)]",
                      theme === 'galaxy' && "bg-[hsla(290_100%_60%/0.2)] text-[hsl(290_100%_80%)] backdrop-blur-sm border border-[hsl(290_100%_60%/0.3)]",
                      theme === 'quantum' && "bg-[hsla(180_100%_50%/0.2)] text-[hsl(180_100%_80%)] backdrop-blur-sm border border-[hsl(180_100%_50%/0.3)]"
                    )
                    : cn(
                      "hover:bg-primary-foreground/10",
                      theme === 'aurora' && "hover:bg-[hsla(180_100%_60%/0.1)] hover:border hover:border-[hsl(180_100%_60%/0.2)]",
                      theme === 'galaxy' && "hover:bg-[hsla(290_100%_60%/0.1)] hover:border hover:border-[hsl(290_100%_60%/0.2)]",
                      theme === 'quantum' && "hover:bg-[hsla(180_100%_50%/0.1)] hover:border hover:border-[hsl(180_100%_50%/0.2)]"
                    )
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            {currentUser && (
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center justify-start px-3 py-2",
                  theme === 'aurora' && "hover:bg-[hsla(180_100%_60%/0.1)]",
                  theme === 'galaxy' && "hover:bg-[hsla(290_100%_60%/0.1)]",
                  theme === 'quantum' && "hover:bg-[hsla(180_100%_50%/0.1)]"
                )}
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
