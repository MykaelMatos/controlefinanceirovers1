import * as React from "react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/context/SettingsContext"
import { Theme } from "@/lib/database";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
        theme === 'aurora' && "border-[hsla(180_100%_60%/0.3)] bg-[hsla(230_20%_15%/0.7)] backdrop-blur-lg animate-gradient",
        theme === 'galaxy' && "border-[hsla(290_100%_60%/0.3)] bg-[hsla(260_30%_15%/0.7)] backdrop-blur-lg",
        theme === 'quantum' && "border-[hsla(180_100%_50%/0.3)] bg-[hsla(200_50%_15%/0.7)] backdrop-blur-lg",
        theme === 'neon' && "border-[hsla(150_100%_50%/0.3)] shadow-[0_0_15px_hsla(150_100%_50%/0.5)]",
        theme === 'cyberpunk' && "border-2 border-[hsla(60_100%_50%)] shadow-[6px_6px_0px_hsla(60_100%_50%)]",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        theme === 'quantum' && "relative after:content-[''] after:absolute after:bottom-0 after:left-[10%] after:right-[10%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-[hsla(180_100%_50%/0.3)] after:to-transparent",
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';
  
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        theme === 'aurora' && "text-[hsl(180_100%_80%)]",
        theme === 'galaxy' && "text-[hsl(290_100%_80%)]",
        theme === 'quantum' && "text-[hsl(180_100%_80%)]",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userSettings } = useSettings();
  const theme = userSettings?.theme || 'light';
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        theme === 'quantum' && "relative after:content-[''] after:absolute after:top-0 after:left-[10%] after:right-[10%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-[hsla(180_100%_50%/0.3)] after:to-transparent",
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
