import { ReactNode } from 'react';
import { useModuleContext } from './context/module-context';
import { X, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarVisible, toggleSidebar } = useModuleContext();
  
  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-14 border-b px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:hidden"
          >
            {isSidebarVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AY</span>
            </div>
            <h1 className="text-lg font-bold">Active You</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a href="/active" className="text-sm text-muted-foreground">
            Return to Standard View
          </a>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}