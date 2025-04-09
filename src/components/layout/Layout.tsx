
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import ThemeSwitcher from "../settings/ThemeSwitcher";
import { useSettings } from "@/context/SettingsContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';

  return (
    <div className={`min-h-screen ${theme}`}>
      <div className="bg-background text-foreground min-h-screen">
        {isAuthenticated && <Navbar />}
        <main className="container mx-auto px-4 py-4 md:py-6">
          {children}
        </main>
        <div className="fixed bottom-4 right-4">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Layout;
