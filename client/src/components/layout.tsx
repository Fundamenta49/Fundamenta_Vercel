import Navigation from "@/components/navigation";
import FloatingChat from "@/components/floating-chat";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MoodSelector } from "@/components/mood-selector";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location === "/" || location === "/home";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className={cn(
        "transition-all duration-300 bg-background min-h-screen",
        isMobile ? "ml-0 p-4 pt-16" : "ml-64 p-6", 
        document.body.classList.contains("sidebar-minimized") && !isMobile ? "ml-16" : ""
      )}>
        {!isHomePage && (
          <header className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                {location === "/career" ? "Career Development" : 
                 location === "/finance" ? "Financial Literacy" : 
                 location === "/wellness" ? "Wellness & Nutrition" :
                 location === "/active" ? "Active You" :
                 location === "/emergency" ? "Emergency Guidance" :
                 location === "/learning" ? "Life Skills" : ""}
              </h1>
              
              <div className="flex items-center gap-3">
                <MoodSelector />
                <Separator orientation="vertical" className="h-8" />
                
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-primary hover:bg-muted">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-primary hover:bg-muted">
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="mt-2 text-text-secondary text-sm">
              {location === "/career" ? "Explore opportunities and build your professional skills" : 
               location === "/finance" ? "Learn to manage your money effectively" : 
               location === "/wellness" ? "Tools and guidance for your wellbeing" :
               location === "/active" ? "Stay fit and healthy with personalized plans" :
               location === "/emergency" ? "Critical information when you need it most" :
               location === "/learning" ? "Master essential skills for everyday life" : ""}
            </div>
          </header>
        )}
        
        <div className={cn(
          "pb-24", // Add padding at bottom to accommodate floating chat
          isHomePage ? "mt-0" : "mt-4"
        )}>
          {children}
        </div>
      </main>
      
      <FloatingChat />
    </div>
  );
}
