import Navigation from "@/components/navigation";
import FloatingChat from "@/components/floating-chat";
import { AIFallbackNotice } from "@/components/ai-fallback-notice";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";
import ErrorEmergencyFix from "@/components/error-emergency-fix";
import SelectorErrorSuppressor from "@/components/selector-error-suppressor";
import NuclearFix from "@/components/nuclear-fix";
import FundiReplacement from "@/components/fundi-replacement";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location === "/" || location === "/home";
  const isShowcasePage = location === "/fundi-showcase";
  
  // Determine current category based on the URL path
  const getCurrentCategory = () => {
    if (location.includes('/finance')) return 'finance';
    if (location.includes('/career')) return 'career';
    if (location.includes('/wellness')) return 'wellness';
    if (location.includes('/learning')) return 'learning';
    if (location.includes('/emergency')) return 'emergency';
    if (location.includes('/cooking')) return 'cooking';
    if (location.includes('/fitness')) return 'fitness';
    return 'general';
  };
  
  const currentCategory = getCurrentCategory();

  return (
    <div className="min-h-screen bg-background">
      <ErrorEmergencyFix />
      <SelectorErrorSuppressor />
      <NuclearFix />
      <FundiReplacement />
      <div data-tour="main-nav">
        <Navigation />
      </div>
      
      <main className={cn(
        "transition-all duration-300 bg-background min-h-screen",
        isMobile ? "ml-0 p-4 pt-16" : "ml-64 p-6", 
        document.body.classList.contains("sidebar-minimized") && !isMobile ? "ml-16" : ""
      )}>
        {/* All headers are now handled directly in each page component */}
        
        <div className={cn(
          "pb-24", // Add padding at bottom to accommodate floating chat
          isHomePage ? "mt-0" : "mt-4"
        )}>
          {/* Display notice when in fallback mode */}
          <AIFallbackNotice />
          {children}
        </div>
      </main>
      
      {/* Hide the standard Fundi components as we're replacing them */}
      <div data-tour="fundi-assistant" style={{ display: 'none' }}>
        <FloatingChat category={currentCategory} />
      </div>
    </div>
  );
}