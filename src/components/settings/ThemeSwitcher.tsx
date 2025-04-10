
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles, Zap, Atom, Binary, Satellite } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ThemeSwitcher = () => {
  const { isAuthenticated } = useAuth();
  const { userSettings, updateUserSettings } = useSettings();
  const theme = userSettings?.theme || 'light';

  const setTheme = (newTheme: 'light' | 'dark' | 'neon' | 'cyberpunk' | 'aurora' | 'galaxy' | 'quantum') => {
    if (isAuthenticated) {
      updateUserSettings({ theme: newTheme });
    }
  };

  const renderIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'neon':
        return <Sparkles className="h-5 w-5" />;
      case 'cyberpunk':
        return <Zap className="h-5 w-5" />;
      case 'aurora':
        return <Atom className="h-5 w-5" />;
      case 'galaxy':
        return <Satellite className="h-5 w-5" />;
      case 'quantum':
        return <Binary className="h-5 w-5" />;
      case 'light':
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={cn(
            "rounded-full transition-all duration-300",
            theme === 'aurora' && "animate-glow",
            theme === 'galaxy' && "bg-background/80 backdrop-blur-sm",
            theme === 'quantum' && "animate-pulse-slow"
          )}
        >
          {renderIcon()}
          <span className="sr-only">Alterar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn(
        theme === 'aurora' && "glass animate-glow",
        theme === 'galaxy' && "bg-background/80 backdrop-blur-md",
        theme === 'quantum' && "bg-background/70 backdrop-blur-lg"
      )}>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('neon')}>
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Neon</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('cyberpunk')}>
          <Zap className="h-4 w-4 mr-2" />
          <span>Cyberpunk</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('aurora')}>
          <Atom className="h-4 w-4 mr-2" />
          <span>Aurora</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('galaxy')}>
          <Satellite className="h-4 w-4 mr-2" />
          <span>Galaxy</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('quantum')}>
          <Binary className="h-4 w-4 mr-2" />
          <span>Quantum</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
