
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop, Sparkles, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";

const ThemeSwitcher = () => {
  const { isAuthenticated } = useAuth();
  const { userSettings, updateUserSettings } = useSettings();
  const theme = userSettings?.theme || 'light';

  const setTheme = (newTheme: 'light' | 'dark' | 'neon' | 'cyberpunk') => {
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
      case 'light':
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {renderIcon()}
          <span className="sr-only">Alterar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
