
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { ShoppingList, ShoppingItem, generateId, useLocalStorage } from "@/lib/database";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ShoppingCart, List, History, Trash2, Plus, Check, Save, Loader2 } from "lucide-react";

// Schema para novo item na lista
const shoppingItemSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantidade deve ser maior que zero",
  }),
  unitCost: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Preço de custo deve ser maior ou igual a zero",
  }),
});

// Schema para nova lista
const shoppingListSchema = z.object({
  name: z.string().min(1, "Nome da lista é obrigatório"),
});

type ShoppingItemFormValues = z.infer<typeof shoppingItemSchema>;
type ShoppingListFormValues = z.infer<typeof shoppingListSchema>;

const ShoppingLists: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>("shoppingLists", []);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isFinalizingList, setIsFinalizingList] = useState(false);

  // Formulário para criar nova lista
  const listForm = useForm<ShoppingListFormValues>({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: {
      name: "",
    },
  });

  // Formulário para adicionar novo item
  const itemForm = useForm<ShoppingItemFormValues>({
    resolver: zodResolver(shoppingItemSchema),
    defaultValues: {
      name: "",
      quantity: "1",
      unitCost: "0",
    },
  });

  // Filtrar listas do usuário atual
  const userLists = shoppingLists.filter(list => list.userId === userId);
  const activeLists = userLists.filter(list => !list.isCompleted);
  const completedLists = userLists.filter(list => list.isCompleted);

  // Criar nova lista
  const createNewList = (data: ShoppingListFormValues) => {
    const newList: ShoppingList = {
      id: generateId(),
      name: data.name,
      date: new Date().toISOString(),
      userId,
      items: [],
      isCompleted: false,
      totalCost: 0,
    };

    setShoppingLists([...shoppingLists, newList]);
    setActiveList(newList);
    setIsCreatingList(false);
    listForm.reset();
  };

  // Adicionar item à lista ativa
  const addItemToList = (data: ShoppingItemFormValues) => {
    if (!activeList) return;

    const quantity = Number(data.quantity);
    const unitCost = Number(data.unitCost);
    const total = quantity * unitCost;

    const newItem: ShoppingItem = {
      id: generateId(),
      name: data.name,
      quantity,
      unitCost,
      total,
      checked: false,
    };

    const updatedItems = [...activeList.items, newItem];
    const totalCost = updatedItems.reduce((sum, item) => sum + item.total, 0);

    const updatedList = {
      ...activeList,
      items: updatedItems,
      totalCost,
    };

    const updatedLists = shoppingLists.map(list =>
      list.id === activeList.id ? updatedList : list
    );

    setShoppingLists(updatedLists);
    setActiveList(updatedList);
    itemForm.reset({
      name: "",
      quantity: "1",
      unitCost: "0",
    });
    setIsAddingItem(false);
  };

  // Remover item da lista
  const removeItem = (itemId: string) => {
    if (!activeList) return;

    const updatedItems = activeList.items.filter(item => item.id !== itemId);
    const totalCost = updatedItems.reduce((sum, item) => sum + item.total, 0);

    const updatedList = {
      ...activeList,
      items: updatedItems,
      totalCost,
    };

    const updatedLists = shoppingLists.map(list =>
      list.id === activeList.id ? updatedList : list
    );

    setShoppingLists(updatedLists);
    setActiveList(updatedList);
  };

  // Marcar/desmarcar item
  const toggleItemCheck = (itemId: string) => {
    if (!activeList) return;

    const updatedItems = activeList.items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    const updatedList = {
      ...activeList,
      items: updatedItems,
    };

    const updatedLists = shoppingLists.map(list =>
      list.id === activeList.id ? updatedList : list
    );

    setShoppingLists(updatedLists);
    setActiveList(updatedList);
  };

  // Finalizar lista
  const finalizeList = () => {
    if (!activeList) return;
    
    setIsFinalizingList(true);
    
    setTimeout(() => {
      const updatedList = {
        ...activeList,
        isCompleted: true,
        date: new Date().toISOString(), // Atualizar a data para a data de finalização
      };
  
      const updatedLists = shoppingLists.map(list =>
        list.id === activeList.id ? updatedList : list
      );
  
      setShoppingLists(updatedLists);
      setActiveList(null);
      setIsFinalizingList(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Lista de Compras</h1>
        {!isCreatingList && !activeList && (
          <Button 
            onClick={() => setIsCreatingList(true)}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Nova Lista
          </Button>
        )}
      </div>
      
      {isCreatingList && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Criar Nova Lista</CardTitle>
            <CardDescription>
              Dê um nome para sua lista de compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...listForm}>
              <form onSubmit={listForm.handleSubmit(createNewList)} className="space-y-4">
                <FormField
                  control={listForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Lista</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Feira do mês, Compras semanais..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">Criar Lista</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreatingList(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {activeList && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{activeList.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingItem(true)}
                  disabled={isAddingItem}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Item
                </Button>
                <Button 
                  size="sm"
                  variant="default"
                  onClick={finalizeList}
                  disabled={activeList.items.length === 0 || isFinalizingList}
                >
                  {isFinalizingList ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Finalizar
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveList(null)}
                >
                  Voltar
                </Button>
              </div>
            </div>
            <CardDescription>
              {format(new Date(activeList.date), "dd/MM/yyyy")} · {activeList.items.length} itens · 
              Total: {formatCurrency(activeList.totalCost)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAddingItem && (
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3">Adicionar Item</h3>
                <Form {...itemForm}>
                  <form onSubmit={itemForm.handleSubmit(addItemToList)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={itemForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produto</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do produto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={itemForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" step="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={itemForm.control}
                        name="unitCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço Unitário (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="0,00"
                                onChange={(e) => {
                                  // Formatar como moeda
                                  const value = e.target.value
                                    .replace(/\D/g, '')
                                    .replace(/(\d)(\d{2})$/, '$1,$2')
                                    .replace(/(?=(\d{3})+(\D))\B/g, '.');
                                  
                                  // Converter para o formato que o campo espera
                                  const numericValue = e.target.value
                                    .replace(/\D/g, '')
                                    .replace(/^0+/, '');
                                  
                                  const formattedValue = numericValue ? 
                                    (parseInt(numericValue) / 100).toString() : 
                                    '0';
                                  
                                  field.onChange(formattedValue);
                                  
                                  // Atualizar visualmente o input
                                  e.target.value = value === '' ? '0,00' : value;
                                }}
                                onBlur={(e) => {
                                  // Garantir formatação correta ao perder foco
                                  const value = field.value;
                                  const numericValue = parseFloat(value);
                                  
                                  if (!isNaN(numericValue)) {
                                    const formatted = numericValue.toFixed(2).replace('.', ',');
                                    e.target.value = formatted;
                                  } else {
                                    e.target.value = '0,00';
                                    field.onChange('0');
                                  }
                                }}
                                defaultValue="0,00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Adicionar</Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingItem(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {activeList.items.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: 50 }}></TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-center">Qtde</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead style={{ width: 50 }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeList.items.map((item) => (
                      <TableRow key={item.id} className={item.checked ? "bg-muted/50" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={item.checked}
                            onCheckedChange={() => toggleItemCheck(item.id)}
                          />
                        </TableCell>
                        <TableCell className={item.checked ? "line-through text-muted-foreground" : ""}>
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitCost)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Lista vazia</h3>
                <p className="text-muted-foreground">
                  Adicione itens à sua lista de compras
                </p>
              </div>
            )}
          </CardContent>
          {activeList.items.length > 0 && (
            <CardFooter className="flex justify-between border-t p-4">
              <div>
                <span className="text-muted-foreground">{activeList.items.length} itens</span>
                {activeList.items.some(item => item.checked) && (
                  <span className="text-muted-foreground ml-2">
                    ({activeList.items.filter(item => item.checked).length} marcados)
                  </span>
                )}
              </div>
              <div className="font-medium">
                Total: {formatCurrency(activeList.totalCost)}
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      {!activeList && !isCreatingList && (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              Listas Ativas
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeLists.map(list => (
                  <Card key={list.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveList(list)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(list.date), "dd/MM/yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-muted-foreground text-sm">
                        {list.items.length} itens · Total: {formatCurrency(list.totalCost)}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveList(list)}>
                        Abrir Lista
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Nenhuma lista ativa</h3>
                <p className="text-muted-foreground mb-6">
                  Você não tem nenhuma lista de compras ativa no momento
                </p>
                <Button onClick={() => setIsCreatingList(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Nova Lista
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedLists.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Lista</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-center">Itens</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedLists
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(list => (
                        <TableRow key={list.id}>
                          <TableCell className="font-medium">{list.name}</TableCell>
                          <TableCell>{format(new Date(list.date), "dd/MM/yyyy")}</TableCell>
                          <TableCell className="text-center">{list.items.length}</TableCell>
                          <TableCell className="text-right">{formatCurrency(list.totalCost)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setActiveList(list)}
                            >
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Nenhuma lista finalizada</h3>
                <p className="text-muted-foreground">
                  O histórico de listas finalizadas aparecerá aqui
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ShoppingLists;
