
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MMLogo from "@/components/layout/MMLogo";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Nome de usuário deve ter pelo menos 3 caracteres",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const success = login(data.username, data.password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-4 p-4 rounded-full flex items-center justify-center bg-gradient-to-br from-mm-purple/10 to-mm-lightPurple/20 dark:from-mm-purple/20 dark:to-mm-darkPurple/40">
            <MMLogo size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-mm-dark dark:text-white">FinanceTracker</CardTitle>
          <CardDescription className="text-mm-dark/70 dark:text-white/70">
            Faça login para acessar o controle de despesas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-right">
                <Link to="/forgot-password" className="text-mm-purple hover:text-mm-darkPurple hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Button type="submit" className="w-full bg-mm-purple hover:bg-mm-darkPurple">
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground mt-2">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-mm-purple hover:text-mm-darkPurple hover:underline">
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
