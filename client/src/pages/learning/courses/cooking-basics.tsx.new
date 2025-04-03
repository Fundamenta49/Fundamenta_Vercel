import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChefHat, 
  Utensils, 
  Book, 
  ArrowLeft, 
  PlayCircle, 
  UtensilsCrossed, 
  Cookie,
  Info
} from 'lucide-react';
import RecipeExplorer from '@/components/recipe-explorer';
import KitchenSkillsLearning from '@/components/kitchen-skills-learning-updated';
import CookingTutorialPopup from '@/components/cooking-tutorial-popup';
import { Link } from 'wouter';
import { 
  FullScreenDialog,
  FullScreenDialogContent,
} from '@/components/ui/full-screen-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define section types
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const SECTIONS: SectionType[] = [
  {
    id: 'tutorials',
    title: 'Cooking Tutorials',
    description: 'Step-by-step video guides to master cooking techniques',
    icon: PlayCircle,
    color: 'text-learning-color',
  },
  {
    id: 'recipes',
    title: 'Recipe Explorer',
    description: 'Discover new recipes and meal ideas',
    icon: Cookie,
    color: 'text-learning-color',
  },
  {
    id: 'skills',
    title: 'Kitchen Skills',
    description: 'Learn essential cooking skills and techniques',
    icon: Utensils,
    color: 'text-learning-color',
  },
  {
    id: 'meal-planning',
    title: 'Meal Planning',
    description: 'Plan balanced meals for the week ahead',
    icon: UtensilsCrossed,
    color: 'text-learning-color',
  }
];

const introContent = (
  <div className="space-y-4">
    <div className="relative rounded-lg overflow-hidden aspect-video">
      <img 
        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1024&auto=format&fit=crop"
        alt="Kitchen with cooking setup"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <h2 className="text-white text-xl font-medium">
          Learn to cook and save money while eating healthier
        </h2>
      </div>
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="text-lg font-medium mb-2">Why Learn to Cook?</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong>Save $2,000+ per year</strong> by preparing homemade meals</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong>Eat healthier</strong> by controlling ingredients and portions</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong>Gain independence</strong> and confidence in the kitchen</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <span>Essential kitchen tools and how to use them</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <span>Basic cooking techniques with step-by-step videos</span>
          </li>
          <li className="flex gap-2 items-start">
            <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <span>Simple home recipes like mac & cheese and pancakes</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default function CookingBasics() {
  // Dialog states
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [isRecipeExplorerOpen, setIsRecipeExplorerOpen] = useState(false);
  const [isKitchenSkillsOpen, setIsKitchenSkillsOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  
  const handleCardClick = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked
    switch(sectionId) {
      case 'tutorials':
        setIsTutorialsOpen(true);
        break;
      case 'recipes':
        setIsRecipeExplorerOpen(true);
        break;
      case 'skills':
        setIsKitchenSkillsOpen(true);
        break;
      case 'intro':
        setIsIntroOpen(true);
        break;
    }
  };

  return (
    <div className="w-full h-full mx-auto p-0 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/learning">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Learning
              </Button>
            </Link>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
          Cooking Basics
        </h1>
        
        <Alert variant="default" className="mx-0 sm:mx-2 mb-4 bg-learning-color/10 border-learning-color">
          <Info className="h-4 w-4 text-learning-color" />
          <AlertDescription className="text-sm">
            Learn essential cooking skills, discover new recipes, and build your confidence in the kitchen.
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Full-screen dialogs */}
      <FullScreenDialog open={isTutorialsOpen} onOpenChange={setIsTutorialsOpen}>
        <FullScreenDialogContent themeColor="#d97706">
          <CookingTutorialPopup />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isRecipeExplorerOpen} onOpenChange={setIsRecipeExplorerOpen}>
        <FullScreenDialogContent themeColor="#d97706">
          <RecipeExplorer />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isKitchenSkillsOpen} onOpenChange={setIsKitchenSkillsOpen}>
        <FullScreenDialogContent themeColor="#d97706">
          <KitchenSkillsLearning />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isIntroOpen} onOpenChange={setIsIntroOpen}>
        <FullScreenDialogContent themeColor="#d97706">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Introduction to Cooking</h2>
            {introContent}
          </div>
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Introduction Header - Mobile Optimized */}
      <div className="px-4 sm:px-6">
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-8">
          <div className="relative aspect-video sm:h-[300px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1024&auto=format&fit=crop"
              alt="Kitchen with cooking setup"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-4 sm:p-6">
              <h2 className="text-white text-lg sm:text-xl font-medium mb-2">
                Learn to cook and save money
              </h2>
              <p className="text-white/90 text-sm sm:text-base max-w-md mb-2">
                Get started with basic recipes and techniques to become confident in the kitchen
              </p>
              <Button 
                onClick={() => handleCardClick('intro')}
                className="bg-white/90 hover:bg-white text-learning-color hover:text-learning-color/90 w-full sm:w-auto mt-2"
                size="sm"
              >
                <Book className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid-style cards layout - Mobile Optimized */}
      <div className="px-4 sm:px-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-learning-color/10 text-learning-color/90 rounded-md border-l-4 border-learning-color">
            Cooking Resources
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 mt-4">
            {SECTIONS.map((section) => (
              <div key={section.id} className="flex flex-col h-full">
                <button
                  onClick={() => handleCardClick(section.id)}
                  className="relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-learning-color min-h-[130px] sm:min-h-[160px] w-full h-full"
                  aria-label={`Open ${section.title}`}
                >
                  <div className="flex items-center justify-center h-12 sm:h-14 w-full mb-2">
                    <section.icon className={`w-9 h-9 sm:w-10 sm:h-10 ${section.color}`} />
                  </div>
                  
                  <span className="text-sm sm:text-base font-medium text-center line-clamp-2 w-full">{section.title}</span>
                  
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 text-center hidden sm:block">
                    {section.description.length > 60 
                      ? `${section.description.substring(0, 60)}...` 
                      : section.description}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}