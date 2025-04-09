
import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  Tags,
  Plus,
  Trash2,
} from "lucide-react";

const Settings = () => {
  const { 
    userSettings, 
    updateUserSettings, 
    addCustomCategory,
    removeCustomCategory
  } = useSettings();
  
  const [newCategory, setNewCategory] = React.useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCustomCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Configurações</h1>
      <p className="text-muted-foreground mb-8">
        Personalize sua experiência no aplicativo de finanças
      </p>
      
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure preferências básicas do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["BRL", "USD", "EUR"].map((currency) => (
                    <Button
                      key={currency}
                      type="button"
                      variant={userSettings?.currency === currency ? "default" : "outline"}
                      onClick={() => updateUserSettings({ currency: currency as any })}
                    >
                      {currency === "BRL" ? "Real (R$)" : 
                       currency === "USD" ? "Dólar ($)" : "Euro (€)"}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notifications">Notificações</Label>
                  <span className="text-sm text-muted-foreground">
                    Receber alertas de limites e lembretes
                  </span>
                </div>
                <Switch
                  id="notifications"
                  checked={userSettings?.receiveNotifications ?? true}
                  onCheckedChange={(checked) => 
                    updateUserSettings({ receiveNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize o visual do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Tema Visual</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["light", "dark", "neon", "cyberpunk"].map((theme) => (
                    <div 
                      key={theme}
                      className={`aspect-video rounded-lg p-4 cursor-pointer border-2 flex items-center justify-center ${
                        userSettings?.theme === theme 
                          ? "border-primary bg-primary/10" 
                          : "border-muted hover:border-primary/50"
                      }`}
                      onClick={() => updateUserSettings({ theme: theme as any })}
                    >
                      <span className="font-medium capitalize">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tags className="h-5 w-5 mr-2" />
                Categorias Personalizadas
              </CardTitle>
              <CardDescription>
                Adicione e gerencie categorias customizadas para seus gastos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)} 
                />
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label>Categorias Personalizadas</Label>
                {userSettings?.customCategories && userSettings.customCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {userSettings.customCategories.map((category) => (
                      <div 
                        key={category}
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <span>{category}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomCategory(category)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma categoria personalizada adicionada
                  </div>
                )}
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <Bell className="h-4 w-4 inline-block mr-2" />
                Além das categorias personalizadas, você também tem acesso às categorias padrão do sistema: Alimentação, Transporte, Moradia, etc.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
