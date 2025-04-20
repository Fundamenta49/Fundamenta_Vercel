import { createContext, useContext, useState, ReactNode } from 'react';

// Define the module types
export type ModuleType = 'dashboard' | 'yoga' | 'running' | 'meditation' | 'weightlifting' | 'hiit' | 'stretch' | 'profile';

// Define context interface
interface ModuleContextProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
}

// Create context with default values
const ModuleContext = createContext<ModuleContextProps>({
  activeModule: 'dashboard',
  setActiveModule: () => {},
  isFullscreen: false,
  toggleFullscreen: () => {},
  isSidebarVisible: true,
  toggleSidebar: () => {},
});

// Context provider component
export function ModuleProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  // Toggle fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Effect to handle fullscreen change events
  /* useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', onFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []); */

  // Provide context values
  return (
    <ModuleContext.Provider 
      value={{ 
        activeModule, 
        setActiveModule, 
        isFullscreen, 
        toggleFullscreen,
        isSidebarVisible,
        toggleSidebar
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

// Custom hook for easier context consumption
export function useModuleContext() {
  return useContext(ModuleContext);
}