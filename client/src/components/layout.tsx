import Navigation from "@/components/navigation";
import FloatingChat from "@/components/floating-chat";
import { AIFallbackNotice } from "@/components/ai-fallback-notice";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

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
      <div data-tour="main-nav">
        <Navigation />
      </div>
      
      <main className={cn(
        "transition-all duration-300 bg-background min-h-screen",
        isMobile && isHomePage ? "ml-0 p-0 pt-16" : isMobile ? "ml-0 p-4 pt-16" : "ml-64 p-6", 
        document.body.classList.contains("sidebar-minimized") && !isMobile ? "ml-16" : ""
      )}>
        {/* All headers are now handled directly in each page component */}
        
        <div className={cn(
          isHomePage ? "pb-0 mt-0" : "pb-24 mt-4" // Remove bottom padding on home page
        )}>
          {/* Display notice when in fallback mode */}
          <AIFallbackNotice />
          {children}
        </div>
      </main>
      
      <div data-tour="fundi-assistant">
        <FloatingChat category={currentCategory} />
      </div>
    </div>
  );
}
