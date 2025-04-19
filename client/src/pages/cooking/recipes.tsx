import { useEffect, useState } from 'react';
import { Utensils, ChefHat, Search, Book, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RecipeExplorerPopOut from '@/components/recipe-explorer-pop-out';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';

export default function RecipesPage() {
  const [recipeExplorerOpen, setRecipeExplorerOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'available' | 'limited'>('loading');
  const [apiMessage, setApiMessage] = useState('');

  // Check Spoonacular API status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/cooking/spoonacular-status');
        const data = await response.json();
        
        if (response.ok && !data.status) {
          setApiStatus('available');
        } else if (data.status === 'rate_limited' || data.code === 402) {
          setApiStatus('limited');
          setApiMessage(data.message || 'API daily limit reached. Some features may be unavailable.');
        } else {
          setApiStatus('available');
        }
      } catch (error) {
        console.error('Error checking API status:', error);
        setApiStatus('available'); // Default to available to not block UI
      }
    };
    
    checkApiStatus();
  }, []);

  // Recipe categories for the page
  const recipeCategories = [
    {
      id: 'beginner',
      title: 'Beginner Recipes',
      description: 'Simple recipes for those new to cooking',
      icon: <ChefHat className="h-5 w-5 text-orange-500" />,
      items: ['Pasta', 'Salad', 'Sandwiches', 'Eggs', 'Rice']
    },
    {
      id: 'quick',
      title: 'Quick Meals',
      description: 'Ready in 30 minutes or less',
      icon: <Utensils className="h-5 w-5 text-orange-500" />,
      items: ['Stir-fry', 'Sheet pan meals', 'One-pot dishes', 'Wraps', 'Soups']
    },
    {
      id: 'nutrition',
      title: 'Nutritious Options',
      description: 'Healthy and balanced meal ideas',
      icon: <BookOpen className="h-5 w-5 text-orange-500" />,
      items: ['Vegetable dishes', 'Lean proteins', 'Whole grains', 'Smoothies', 'Plant-based']
    }
  ];

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
              Recipe Library
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Discover delicious recipes, cooking techniques, and meal ideas for every skill level.
            From beginner-friendly meals to more advanced culinary creations.
          </p>
        </div>
        
        <Button 
          onClick={() => setRecipeExplorerOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-none hover:from-orange-600 hover:to-amber-600"
        >
          <Search className="mr-2 h-5 w-5" />
          <span>Explore Recipes</span>
        </Button>
      </div>

      {apiStatus === 'limited' && (
        <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">API Limit Notice</AlertTitle>
          <AlertDescription className="text-amber-700">
            {apiMessage || "Some recipe features may be limited due to API rate limits. Video tutorials are still available."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Recipe Categories</TabsTrigger>
          <TabsTrigger value="latest">Latest Recipes</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipeCategories.map(category => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {category.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setRecipeExplorerOpen(true)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Browse Recipes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                <Book className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Essential Cooking Techniques</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Master fundamental cooking methods to elevate your cooking skills. From knife techniques to proper heat management.
                </p>
                <Button 
                  variant="default" 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setRecipeExplorerOpen(true)}
                >
                  <ChefHat className="mr-2 h-4 w-4" />
                  Explore Techniques
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="latest">
          <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <ChefHat className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Discover Recipes</h3>
            <p className="text-gray-500 mt-1 mb-4">
              Use our recipe explorer to find delicious recipes for any occasion.
            </p>
            <Button 
              onClick={() => setRecipeExplorerOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Search className="mr-2 h-4 w-4" />
              Open Recipe Explorer
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <ChefHat className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Cooking Video Tutorials</h3>
            <p className="text-gray-500 mt-1 mb-4">
              Learn cooking techniques through helpful video demonstrations.
            </p>
            <Button 
              onClick={() => setRecipeExplorerOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Video Tutorials
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recipe Explorer Dialog */}
      <Dialog open={recipeExplorerOpen} onOpenChange={setRecipeExplorerOpen}>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="sm:max-w-[95vw] h-[95vh] p-0">
          <RecipeExplorerPopOut />
        </DialogContent>
      </Dialog>
    </div>
  );
}