
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import ThemeSwitcher from "../settings/ThemeSwitcher";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';

  useEffect(() => {
    // Smooth scroll to top when navigation changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add a loading animation
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('opacity-0');
      setTimeout(() => {
        mainContent.classList.remove('opacity-0');
        mainContent.classList.add('opacity-100');
      }, 100);
    }
  }, []);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      theme
    )}>
      <div className={cn(
        "bg-background text-foreground min-h-screen transition-all duration-300",
        theme === 'aurora' && "bg-gradient-to-br from-[hsl(230_20%_10%)] to-[hsl(200_30%_15%)]",
        theme === 'galaxy' && "bg-gradient-to-br from-[hsl(260_30%_5%)] to-[hsl(280_30%_10%)]",
        theme === 'quantum' && "bg-gradient-to-br from-[hsl(200_50%_5%)] to-[hsl(220_40%_8%)]"
      )}>
        {isAuthenticated && <Navbar />}
        <main className={cn(
          "container mx-auto px-4 py-4 md:py-6 transition-opacity duration-500 ease-in-out",
        )}>
          <div className={cn(
            "rounded-xl",
            theme === 'aurora' && "glass animate-gradient",
            theme === 'galaxy' && "bg-background/30 backdrop-blur-sm",
            theme === 'quantum' && "bg-background/20 backdrop-blur-md"
          )}>
            {children}
          </div>
        </main>
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Layout;
