import React from "react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { useTheme } from "@/contexts/LearningThemeContext";

interface BasecampLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function BasecampLayout({ title, description, children }: BasecampLayoutProps) {
  const { theme } = useTheme();
  
  // Theme-specific styling
  const containerClasses = theme === "jungle"
    ? "bg-[#1E4A3D] text-white min-h-screen pb-16"
    : "pb-16";
  
  return (
    <Container className={containerClasses}>
      <div className="py-8 space-y-8">
        <PageHeader 
          title={title} 
          description={description}
        />
        
        {children}
      </div>
    </Container>
  );
}