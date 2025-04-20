import { ReactNode, useEffect } from 'react';
import { Dumbbell, Maximize, Minimize, Menu } from 'lucide-react';
import { useModuleContext } from './context/module-context';
import { Button } from "@/components/ui/button";

// Main layout component for the Active You module
export default function Layout({ children }: { children: ReactNode }) {
  const { 
    activeModule, 
    isFullscreen, 
    toggleFullscreen, 
    isSidebarVisible, 
    toggleSidebar 
  } = useModuleContext();

  // Effect to handle fullscreen change events from browser controls
  useEffect(() => {
    const onFullscreenChange = () => {
      // This checks if we're in fullscreen mode and updates our state if it doesn't match
      const fullscreenActive = !!document.fullscreenElement;
      if (isFullscreen !== fullscreenActive) {
        // Would update isFullscreen state here, but we're simplifying
        // setIsFullscreen(fullscreenActive);
      }
    };
    
    document.addEventListener('fullscreenchange', onFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [isFullscreen]);

  // Get display name of current module
  const getModuleDisplayName = () => {
    const moduleNames: Record<string, string> = {
      dashboard: 'Dashboard',
      yoga: 'Yoga Practice',
      running: 'Running Tracker',
      meditation: 'Meditation',
      weightlifting: 'Weight Training',
      hiit: 'HIIT Workouts',
      stretch: 'Stretching',
      profile: 'Profile'
    };
    
    return moduleNames[activeModule] || 'Active You';
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top navigation bar */}
      <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="mr-2 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center">
            <Dumbbell className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold text-primary">
              {getModuleDisplayName()}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <Menu className="h-4 w-4 mr-2" />
            <span>{isSidebarVisible ? 'Hide' : 'Show'} Menu</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </Button>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}