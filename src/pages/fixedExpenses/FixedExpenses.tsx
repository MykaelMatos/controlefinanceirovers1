
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Check, 
  X,
  Clock
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FixedExpense } from "@/lib/database";

const fixedExpenseSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres",
  }),
  value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número maior que zero",
  }),
  periodicity: z.string({
    required_error: "Selecione uma periodicidade",
  }),
  category: z.string({
    required_error: "Selecione uma categoria",
  }),
  dueDay: z.string().optional().refine(
    (val) => !val || (Number(val) >= 1 && Number(val) <= 31),
    {
      message: "Dia de vencimento deve estar entre 1 e 31",
    }
  ),
});

type FixedExpenseFormValues = z.infer<typeof fixedExpenseSchema>;

const FixedExpenses = () => {
  const { fixedExpenses, addFixedExpense, updateFixedExpense, deleteFixedExpense, categories, periodicities } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FixedExpenseFormValues>({
    resolver: zodResolver(fixedExpenseSchema),
    defaultValues: {
      name: "",
      value: "",
      periodicity: "Mensal",
      category: "",
      dueDay: "",
    },
  });

  const onSubmit = (data: FixedExpenseFormValues) => {
    if (editingId) {
      updateFixedExpense(editingId, {
        name: data.name,
        value: Number(data.value),
        periodicity: data.periodicity as any,
        category: data.category as any,
        dueDay: data.dueDay ? Number(data.dueDay) : undefined,
      });
      setEditingId(null);
    } else {
      addFixedExpense({
        name: data.name,
        value: Number(data.value),
        periodicity: data.periodicity as any,
        category: data.category as any,
        dueDay: data.dueDay ? Number(data.dueDay) : undefined,
      });
    }

    form.reset();
  };

  const handleEdit = (expense: FixedExpense) => {
    form.reset({
      name: expense.name,
      value: String(expense.value),
      periodicity: expense.periodicity,
      category: expense.category,
      dueDay: expense.dueDay ? String(expense.dueDay) : "",
    });
    setEditingId(expense.id);
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingId(null);
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-6 w-6 mr-2" />
            Despesas Fixas
          </CardTitle>
          <CardDescription>
            Gerencie suas despesas recorrentes (aluguel, serviços, assinaturas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Despesa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Netflix, Aluguel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="periodicity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Periodicidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {periodicities.map((periodicity) => (
                            <SelectItem key={periodicity} value={periodicity}>
                              {periodicity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de Vencimento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="Opcional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                )}
                <Button type="submit">
                  {editingId ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Atualizar
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Adicionar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          <Separator className="my-6" />
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Nenhuma despesa fixa cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  fixedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.name}</TableCell>
                      <TableCell>{formatCurrency(expense.value)}</TableCell>
                      <TableCell>{expense.periodicity}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>
                        {expense.dueDay ? `Dia ${expense.dueDay}` : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteFixedExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixedExpenses;
