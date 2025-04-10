
import React from "react";
import { cn } from "@/lib/utils";

interface MMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MMLogo: React.FC<MMLogoProps> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizes[size],
      className
    )}>
      <img
        src="/lovable-uploads/3cf65954-2442-4e26-b68d-db12e0573fb6.png"
        alt="MM Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MMLogo;
