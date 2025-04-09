
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, ArrowRight, Check, Plus } from "lucide-react";

const Limits = () => {
  const { categories, getExpensesByCategory, getTotalExpenses } = useFinance();
  const { 
    userSettings, 
    getCategoryLimit, 
    addCategoryLimit, 
    updateCategoryLimit,
    removeCategoryLimit,
    getLimitPercentage,
    updateTotalLimit,
    getTotalLimitPercentage
  } = useSettings();
  
  const [limitValues, setLimitValues] = useState<Record<string, string>>({});
  const [totalLimit, setTotalLimit] = useState(userSettings?.totalLimit?.toString() || "");

  const expensesByCategory = getExpensesByCategory();
  const totalSpent = getTotalExpenses();

  // Atualizar limite para uma categoria
  const handleUpdateLimit = (category: string) => {
    const limitValue = Number(limitValues[category]);
    if (!limitValue || isNaN(limitValue) || limitValue <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido maior que zero",
        variant: "destructive",
      });
      return;
    }

    const currentLimit = getCategoryLimit(category as any);
    
    if (currentLimit > 0) {
      updateCategoryLimit(category as any, limitValue);
    } else {
      addCategoryLimit(category as any, limitValue);
    }
    
    // Limpar o campo após salvar
    setLimitValues((prev) => ({ ...prev, [category]: "" }));
  };

  // Remover limite para uma categoria
  const handleRemoveLimit = (category: string) => {
    removeCategoryLimit(category as any);
    setLimitValues((prev) => ({ ...prev, [category]: "" }));
  };

  // Atualizar limite total
  const handleUpdateTotalLimit = () => {
    const limit = Number(totalLimit);
    if (!limit || isNaN(limit) || limit <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido maior que zero",
        variant: "destructive",
      });
      return;
    }

    updateTotalLimit(limit);
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Limites de Gastos</h1>
      <p className="text-muted-foreground mb-8">
        Configure limites para controlar seus gastos por categoria e no total
      </p>

      {/* Limite total */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Limite Total Mensal
          </CardTitle>
          <CardDescription>
            Configure um limite máximo para seus gastos mensais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <Input
              type="number"
              placeholder="Valor do limite total"
              value={totalLimit}
              onChange={(e) => setTotalLimit(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUpdateTotalLimit}>
              {userSettings?.totalLimit ? "Atualizar" : "Definir"} Limite
            </Button>
          </div>

          {userSettings?.totalLimit ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gasto atual: {formatCurrency(totalSpent)}</span>
                <span>Limite: {formatCurrency(userSettings.totalLimit)}</span>
              </div>
              <Progress
                value={getTotalLimitPercentage(totalSpent)}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>
                  {getTotalLimitPercentage(totalSpent).toFixed(0)}% utilizado
                </span>
                <span>100%</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum limite total definido
            </div>
          )}
        </CardContent>
      </Card>

      {/* Limites por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Limites por Categoria</CardTitle>
          <CardDescription>
            Configure limites específicos para cada categoria de gasto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => {
              const currentLimit = getCategoryLimit(category);
              const currentSpent = expensesByCategory[category] || 0;
              const limitPercentage = getLimitPercentage(category, currentSpent);

              return (
                <div key={category} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{category}</h3>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                    <Input
                      type="number"
                      placeholder={`Limite para ${category}`}
                      value={limitValues[category] || ""}
                      onChange={(e) =>
                        setLimitValues((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateLimit(category)}
                      >
                        {currentLimit ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {currentLimit ? "Atualizar" : "Adicionar"}
                      </Button>
                      
                      {currentLimit > 0 && (
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveLimit(category)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>

                  {currentLimit > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gasto: {formatCurrency(currentSpent)}</span>
                        <span>Limite: {formatCurrency(currentLimit)}</span>
                      </div>
                      <Progress value={limitPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>{limitPercentage.toFixed(0)}% utilizado</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Sem limite definido para esta categoria
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Limits;
