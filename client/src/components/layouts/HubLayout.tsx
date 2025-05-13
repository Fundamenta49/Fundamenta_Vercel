/**
 * Shared layout component for hub pages
 * Used by both jungle and standard hub pages to maintain consistent layout
 */

import * as React from "react";
import { ThemeType } from "@/data/zones-config";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { useTheme } from "@/contexts/LearningThemeContext";

interface HubLayoutProps {
  /** Title displayed at the top of the hub page */
  title: string;
  /** Description text shown below the title */
  description: string;
  /** Current theme - affects visual styling and contextual elements */
  theme: ThemeType;
  /** Child content (typically zone cards) */
  children: React.ReactNode;
  /** Optional additional content to display below the header */
  headerContent?: React.ReactNode;
}

export function HubLayout({ 
  title, 
  description, 
  theme: propTheme, 
  children, 
  headerContent 
}: HubLayoutProps) {
  // Get theme from context, fallback to prop theme if provided
  const { theme: contextTheme } = useTheme();
  const theme = propTheme || contextTheme;
  
  // Add any theme-specific container classes
  const containerClasses = theme === "jungle" 
    ? "bg-[#1E4A3D] text-white min-h-screen" 
    : "";
    
  return (
    <Container className={containerClasses}>
      <div className="py-8 space-y-8">
        {/* Page Header */}
        <PageHeader 
          title={title} 
          description={description}
        >
          {headerContent}
        </PageHeader>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </Container>
  );
}