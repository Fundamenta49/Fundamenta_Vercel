import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define available module types
type ModuleType = 
  | 'dashboard'
  | 'yoga'
  | 'running'
  | 'meditation'
  | 'weightlifting'
  | 'hiit'
  | 'stretch'
  | 'profile';

// Define context interface
interface ModuleContextType {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  userProfile: any;
  updateUserProfile: (profile: any) => void;
}

// Create the context with default values
const ModuleContext = createContext<ModuleContextType>({
  activeModule: 'dashboard',
  setActiveModule: () => {},
  isSidebarVisible: true,
  toggleSidebar: () => {},
  userProfile: null,
  updateUserProfile: () => {}
});

// Context provider component
export function ModuleProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load saved profile from localStorage if it exists
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('fitnessProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Update user profile
  const updateUserProfile = (profile: any) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <ModuleContext.Provider 
      value={{
        activeModule,
        setActiveModule,
        isSidebarVisible,
        toggleSidebar,
        userProfile,
        updateUserProfile
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

// Custom hook to use the context
export function useModuleContext() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModuleContext must be used within a ModuleProvider');
  }
  return context;
}