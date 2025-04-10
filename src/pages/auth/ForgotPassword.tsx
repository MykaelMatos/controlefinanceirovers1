
import React, { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, Mail, ArrowLeft, Info } from "lucide-react";

const forgotPasswordSchema = z.object({
  usernameOrEmail: z.string().min(3, {
    message: "Nome de usuário ou email deve ter pelo menos 3 caracteres",
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      usernameOrEmail: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    resetPassword(data.usernameOrEmail);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-primary rounded-full">
              <Key className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu nome de usuário ou email para receber uma nova senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4">
              <Alert className="bg-primary/10 border-primary">
                <Mail className="h-4 w-4" />
                <AlertTitle>Instruções enviadas!</AlertTitle>
                <AlertDescription>
                  Se houver uma conta associada a este usuário ou email, você receberá uma nova senha temporária.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário ou email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome de usuário ou email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-xs text-muted-foreground flex items-center mt-2">
                  <Info className="h-3 w-3 mr-1" />
                  <span>Uma nova senha será enviada para o seu email cadastrado</span>
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Recuperar Senha
                  </Button>
                </div>
                <div className="text-center pt-2">
                  <Link to="/login" className="text-sm text-primary hover:underline">
                    <ArrowLeft className="inline mr-1 h-3 w-3" /> Voltar para o login
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
