import { useState, useEffect } from 'react';
import Layout from './layout';
import Sidebar from './components/sidebar';
import Dashboard from './components/dashboard';
import YogaModule from './components/modules/yoga';
import RunningModule from './components/modules/running';
import { ModuleProvider, useModuleContext } from './context/module-context';
import { useToast } from "@/hooks/use-toast";

// Main Active You module component
export default function ActiveYouModule() {
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [skipProfile, setSkipProfile] = useState<boolean>(false);

  // Check if user has an existing profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile) {
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error loading saved profile:", error);
        localStorage.removeItem('fitnessProfile');
      }
    }
  }, []);

  // Create profile handler
  const handleProfileComplete = (profile: any) => {
    try {
      localStorage.setItem('fitnessProfile', JSON.stringify(profile));
      setHasProfile(true);
      
      toast({
        title: "Success!",
        description: "Your fitness profile has been created successfully!",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile. Please try again.",
      });
      setHasProfile(false);
      localStorage.removeItem('fitnessProfile');
    }
  };

  // Skip profile setup
  const handleSkipProfile = () => {
    setSkipProfile(true);
  };

  // If profile not set up and not skipped, show profile setup
  if (!hasProfile && !skipProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div className="pb-4 mb-6 border-b border-primary">
              <h2 className="text-2xl font-bold text-primary">
                Welcome to Active You! 🎉
              </h2>
              <p className="text-muted-foreground mt-2">
                Let's create your personalized fitness profile to help you achieve your goals.
                This will help us provide customized recommendations across all features.
              </p>
            </div>
            
            {/* This will be replaced with our custom profile creation component */}
            <div className="flex flex-col space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-medium">Profile Creation Component Will Go Here</h3>
              <p className="text-sm text-muted-foreground">
                In the full implementation, the profile creation form will appear here.
              </p>
              <button 
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                onClick={() => handleProfileComplete({ name: 'User', goals: ['Get fit'] })}
              >
                Create Sample Profile
              </button>
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={handleSkipProfile}
                className="text-muted-foreground hover:text-primary"
              >
                Skip for now and explore
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main component with ModuleProvider
  return (
    <ModuleProvider>
      <ActiveYouContent />
    </ModuleProvider>
  );
}

// Component that uses the module context
function ActiveYouContent() {
  const { activeModule } = useModuleContext();

  // Render the appropriate module based on active selection
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'yoga':
        return <YogaModule />;
      case 'running':
        return <RunningModule />;
      case 'meditation':
        return <div className="p-6">Meditation module will go here</div>;
      case 'weightlifting':
        return <div className="p-6">Weightlifting module will go here</div>;
      case 'hiit':
        return <div className="p-6">HIIT module will go here</div>;
      case 'stretch':
        return <div className="p-6">Stretch module will go here</div>;
      case 'profile':
        return <div className="p-6">Profile management will go here</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </Layout>
  );
}