
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Processa o valor ao digitar
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      
      // Remove todos os caracteres não numéricos
      inputValue = inputValue.replace(/[^0-9]/g, "");
      
      // Converte para número e depois para string formatada
      const numberValue = Number(inputValue) / 100;
      
      // Atualiza o estado com o valor sem formatação (para cálculos)
      onChange(numberValue.toString());
    };

    // Formata o valor para exibição
    const formatValue = (val: string) => {
      const number = parseFloat(val || "0");
      return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    return (
      <Input
        type="text"
        className={cn(className)}
        value={formatValue(value)}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
