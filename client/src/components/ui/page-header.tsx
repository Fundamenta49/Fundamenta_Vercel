import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/LearningThemeContext";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({ 
  title, 
  description, 
  className, 
  children, 
  ...props 
}: PageHeaderProps) {
  const { theme } = useTheme();
  const isJungleTheme = theme === 'jungle';
  
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h1 className={cn("text-3xl font-bold tracking-tight", {
        "text-amber-300": isJungleTheme
      })}>
        {title}
      </h1>
      {description && (
        <p className={cn("max-w-[750px]", {
          "text-muted-foreground": !isJungleTheme,
          "text-amber-200 text-lg font-medium": isJungleTheme
        })}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}