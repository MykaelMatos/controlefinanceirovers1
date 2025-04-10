
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
import { cn } from "@/lib/utils";
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  Tags,
  Plus,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  Zap,
  Atom,
  Satellite,
  Binary,
  Globe,
} from "lucide-react";

const Settings = () => {
  const { 
    userSettings, 
    updateUserSettings, 
    addCustomCategory,
    removeCustomCategory
  } = useSettings();
  
  const [newCategory, setNewCategory] = React.useState("");
  const theme = userSettings?.theme || 'light';

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCustomCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6">
      <h1 className={cn(
        "text-3xl font-bold tracking-tight mb-4",
        theme === 'aurora' && "text-[hsl(180_100%_80%)] animate-glow",
        theme === 'galaxy' && "text-[hsl(290_100%_80%)] bg-clip-text text-transparent bg-gradient-to-r from-[hsl(290_100%_80%)] to-[hsl(260_100%_90%)]",
        theme === 'quantum' && "text-[hsl(180_100%_80%)] relative after:content-[''] after:absolute after:inset-0 after:bg-primary/20 after:blur-lg after:z-[-1]"
      )}>Configurações</h1>
      <p className={cn(
        "text-muted-foreground mb-8",
        theme === 'aurora' && "text-[hsl(180_60%_70%)]",
        theme === 'galaxy' && "text-[hsl(290_60%_70%)]",
        theme === 'quantum' && "text-[hsl(180_60%_70%)]"
      )}>
        Personalize sua experiência no aplicativo de finanças
      </p>
      
      <Tabs defaultValue="appearance" className="mb-8">
        <TabsList className={cn(
          "grid grid-cols-3 mb-4",
          theme === 'aurora' && "bg-[hsl(230_20%_15%)] border border-[hsl(180_100%_60%/0.2)]",
          theme === 'galaxy' && "bg-[hsl(260_30%_15%)] border border-[hsl(290_100%_60%/0.2)]",
          theme === 'quantum' && "bg-[hsl(200_50%_15%)] border border-[hsl(180_100%_50%/0.2)]"
        )}>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card className={cn(
            theme === 'aurora' && "card-gradient border-[hsl(180_100%_60%/0.3)]",
            theme === 'galaxy' && "card-gradient border-[hsl(290_100%_60%/0.3)]",
            theme === 'quantum' && "card-gradient border-[hsl(180_100%_50%/0.3)]"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className={cn(
                  "h-5 w-5 mr-2",
                  theme === 'aurora' && "text-[hsl(180_100%_80%)]",
                  theme === 'galaxy' && "text-[hsl(290_100%_80%)]",
                  theme === 'quantum' && "text-[hsl(180_100%_70%)]"
                )} />
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
                      className={cn(
                        theme === 'aurora' && userSettings?.currency === currency && "animate-glow",
                        theme === 'galaxy' && userSettings?.currency === currency && "bg-[hsl(290_100%_60%)]",
                        theme === 'quantum' && userSettings?.currency === currency && "bg-[hsl(180_100%_50%)]"
                      )}
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
                  className={cn(
                    theme === 'aurora' && "[&:has(:checked)]:bg-[hsl(180_100%_60%)]",
                    theme === 'galaxy' && "[&:has(:checked)]:bg-[hsl(290_100%_60%)]",
                    theme === 'quantum' && "[&:has(:checked)]:bg-[hsl(180_100%_50%)]"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card className={cn(
            theme === 'aurora' && "card-gradient border-[hsl(180_100%_60%/0.3)]",
            theme === 'galaxy' && "card-gradient border-[hsl(290_100%_60%/0.3)]",
            theme === 'quantum' && "card-gradient border-[hsl(180_100%_50%/0.3)]"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className={cn(
                  "h-5 w-5 mr-2",
                  theme === 'aurora' && "text-[hsl(180_100%_80%)]",
                  theme === 'galaxy' && "text-[hsl(290_100%_80%)]",
                  theme === 'quantum' && "text-[hsl(180_100%_70%)]"
                )} />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize o visual do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="block mb-4">Tema Visual</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'light', icon: <Sun /> },
                      { name: 'dark', icon: <Moon /> },
                      { name: 'neon', icon: <Sparkles /> },
                      { name: 'cyberpunk', icon: <Zap /> },
                      { name: 'aurora', icon: <Atom /> },
                      { name: 'galaxy', icon: <Satellite /> },
                      { name: 'quantum', icon: <Binary /> }
                    ].map((themeOption) => (
                      <div 
                        key={themeOption.name}
                        className={cn(
                          "aspect-video rounded-lg p-4 cursor-pointer border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300",
                          userSettings?.theme === themeOption.name 
                            ? cn(
                              "border-primary bg-primary/10",
                              theme === 'aurora' && "border-[hsl(180_100%_60%)] bg-[hsl(180_100%_60%/0.1)] animate-glow",
                              theme === 'galaxy' && "border-[hsl(290_100%_60%)] bg-[hsl(290_100%_60%/0.1)]",
                              theme === 'quantum' && "border-[hsl(180_100%_50%)] bg-[hsl(180_100%_50%/0.1)]"
                            )
                            : cn(
                              "border-muted hover:border-primary/50",
                              theme === 'aurora' && "hover:border-[hsl(180_100%_60%/0.5)]",
                              theme === 'galaxy' && "hover:border-[hsl(290_100%_60%/0.5)]",
                              theme === 'quantum' && "hover:border-[hsl(180_100%_50%/0.5)]"
                            )
                        )}
                        onClick={() => updateUserSettings({ theme: themeOption.name as any })}
                      >
                        {themeOption.icon}
                        <span className="font-medium capitalize">{themeOption.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card className={cn(
            theme === 'aurora' && "card-gradient border-[hsl(180_100%_60%/0.3)]",
            theme === 'galaxy' && "card-gradient border-[hsl(290_100%_60%/0.3)]",
            theme === 'quantum' && "card-gradient border-[hsl(180_100%_50%/0.3)]"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tags className={cn(
                  "h-5 w-5 mr-2",
                  theme === 'aurora' && "text-[hsl(180_100%_80%)]",
                  theme === 'galaxy' && "text-[hsl(290_100%_80%)]",
                  theme === 'quantum' && "text-[hsl(180_100%_70%)]"
                )} />
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
                  className={cn(
                    theme === 'aurora' && "border-[hsl(180_100%_60%/0.3)] focus-visible:ring-[hsl(180_100%_60%)]",
                    theme === 'galaxy' && "border-[hsl(290_100%_60%/0.3)] focus-visible:ring-[hsl(290_100%_60%)]",
                    theme === 'quantum' && "border-[hsl(180_100%_50%/0.3)] focus-visible:ring-[hsl(180_100%_50%)]"
                  )}
                />
                <Button 
                  onClick={handleAddCategory}
                  className={cn(
                    theme === 'aurora' && "animate-glow",
                    theme === 'galaxy' && "bg-[hsl(290_100%_60%)]",
                    theme === 'quantum' && "bg-[hsl(180_100%_50%)]"
                  )}
                >
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
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md",
                          theme === 'light' && "bg-muted",
                          theme === 'dark' && "bg-muted",
                          theme === 'neon' && "bg-muted border border-[hsl(150_100%_50%/0.3)]",
                          theme === 'cyberpunk' && "bg-muted border-2 border-[hsl(60_100%_50%)]",
                          theme === 'aurora' && "bg-[hsl(230_20%_15%)] border border-[hsl(180_100%_60%/0.3)]",
                          theme === 'galaxy' && "bg-[hsl(260_30%_15%)] border border-[hsl(290_100%_60%/0.3)]",
                          theme === 'quantum' && "bg-[hsl(200_50%_15%)] border border-[hsl(180_100%_50%/0.3)]"
                        )}
                      >
                        <span>{category}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomCategory(category)}
                          className={cn(
                            theme === 'aurora' && "hover:bg-[hsl(0_100%_60%/0.2)]",
                            theme === 'galaxy' && "hover:bg-[hsl(0_100%_60%/0.2)]",
                            theme === 'quantum' && "hover:bg-[hsl(0_100%_60%/0.2)]"
                          )}
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
              
              <div className={cn(
                "p-3 rounded-md text-sm",
                theme === 'light' && "bg-muted/50",
                theme === 'dark' && "bg-muted/50",
                theme === 'neon' && "bg-muted/30 border border-[hsl(150_100%_50%/0.2)]",
                theme === 'cyberpunk' && "bg-muted/30 border border-[hsl(60_100%_50%/0.2)]",
                theme === 'aurora' && "bg-[hsl(230_20%_15%/0.5)] border border-[hsl(180_100%_60%/0.2)]",
                theme === 'galaxy' && "bg-[hsl(260_30%_15%/0.5)] border border-[hsl(290_100%_60%/0.2)]",
                theme === 'quantum' && "bg-[hsl(200_50%_15%/0.5)] border border-[hsl(180_100%_50%/0.2)]"
              )}>
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
