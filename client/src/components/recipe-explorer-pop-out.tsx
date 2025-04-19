import React, { useState, useEffect } from 'react';
import { Search, X, ChefHat, Filter, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  sourceUrl: string;
  diets: string[];
  dishTypes: string[];
  instructions?: string;
}

export default function RecipeExplorerPopOut() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [apiStatus, setApiStatus] = useState<'ok' | 'limited' | 'error'>('ok');
  const [apiMessage, setApiMessage] = useState<string>('');
  
  const [filterOptions, setFilterOptions] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    quick: false,
    beginner: false
  });

  // Mock diet options for filter UI
  const dietOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'glutenFree', label: 'Gluten Free' },
    { id: 'dairyFree', label: 'Dairy Free' }
  ];
  
  // Mock difficulty/time options for filter UI
  const complexityOptions = [
    { id: 'quick', label: 'Quick (< 30 min)' },
    { id: 'beginner', label: 'Beginner Friendly' }
  ];

  async function searchRecipes() {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setApiStatus('ok');
    setApiMessage('');
    
    try {
      // Construct query based on filters
      let diet = '';
      if (filterOptions.vegetarian) diet += 'vegetarian,';
      if (filterOptions.vegan) diet += 'vegan,';
      if (filterOptions.glutenFree) diet += 'gluten free,';
      if (filterOptions.dairyFree) diet += 'dairy free,';
      
      diet = diet.endsWith(',') ? diet.slice(0, -1) : diet;
      
      // Add maxReadyTime if quick option is selected
      const maxReadyTime = filterOptions.quick ? 30 : undefined;
      
      const response = await axios.get('/api/recipes/search', {
        params: {
          query: searchTerm,
          diet: diet || undefined,
          maxReadyTime
        }
      });
      
      if (response.data.status === 'limited') {
        setApiStatus('limited');
        setApiMessage(response.data.message || 'API rate limit reached. Try again later.');
        setRecipes([]);
      } else if (response.data.results && response.data.results.length > 0) {
        setRecipes(response.data.results);
        setActiveRecipe(null);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setApiStatus('error');
      setApiMessage('Failed to fetch recipes. Please try again later.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  async function getRecipeDetails(id: number) {
    setLoading(true);
    
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      
      if (response.data.status === 'limited') {
        setApiStatus('limited');
        setApiMessage(response.data.message || 'API rate limit reached. Try again later.');
      } else {
        setActiveRecipe(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setApiStatus('error');
      setApiMessage('Failed to fetch recipe details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (id: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchRecipes();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <ChefHat className="h-6 w-6 text-orange-500 mr-2" />
            <h2 className="text-xl font-bold">Recipe Explorer</h2>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Input
                placeholder="Search for recipes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              onClick={searchRecipes}
              disabled={loading || !searchTerm.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r p-4 hidden md:block">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">Filters</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Diet</h4>
                    <div className="space-y-2">
                      {dietOptions.map(option => (
                        <div key={option.id} className="flex items-center gap-2">
                          <Checkbox 
                            id={`filter-${option.id}`} 
                            checked={filterOptions[option.id as keyof typeof filterOptions]}
                            onCheckedChange={(checked) => 
                              handleFilterChange(option.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`filter-${option.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Complexity</h4>
                    <div className="space-y-2">
                      {complexityOptions.map(option => (
                        <div key={option.id} className="flex items-center gap-2">
                          <Checkbox 
                            id={`filter-${option.id}`}
                            checked={filterOptions[option.id as keyof typeof filterOptions]}
                            onCheckedChange={(checked) => 
                              handleFilterChange(option.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`filter-${option.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={searchRecipes}
                variant="outline" 
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4">
            {apiStatus !== 'ok' && (
              <Alert className={
                apiStatus === 'limited' 
                  ? 'mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                  : 'mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }>
                <AlertTriangle className={
                  apiStatus === 'limited' 
                    ? 'h-4 w-4 text-amber-600 dark:text-amber-400'
                    : 'h-4 w-4 text-red-600 dark:text-red-400'
                } />
                <AlertTitle className={
                  apiStatus === 'limited' 
                    ? 'text-amber-800 dark:text-amber-300'
                    : 'text-red-800 dark:text-red-300'
                }>
                  {apiStatus === 'limited' ? 'API Limit Reached' : 'Error'}
                </AlertTitle>
                <AlertDescription className={
                  apiStatus === 'limited' 
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-red-700 dark:text-red-400'
                }>
                  {apiMessage}
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : activeRecipe ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{activeRecipe.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveRecipe(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Back to Results
                  </Button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <img 
                      src={activeRecipe.image} 
                      alt={activeRecipe.title} 
                      className="rounded-lg w-full h-auto object-cover"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activeRecipe.readyInMinutes} mins
                      </Badge>
                      <Badge variant="outline">
                        {activeRecipe.servings} servings
                      </Badge>
                      {activeRecipe.diets?.map(diet => (
                        <Badge key={diet} variant="secondary">{diet}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 space-y-4">
                    <Tabs defaultValue="summary">
                      <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary" className="mt-4">
                        <div dangerouslySetInnerHTML={{ __html: activeRecipe.summary }} />
                        
                        {activeRecipe.sourceUrl && (
                          <div className="mt-4">
                            <a 
                              href={activeRecipe.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              Visit Original Recipe
                            </a>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="instructions" className="mt-4">
                        {activeRecipe.instructions ? (
                          <div dangerouslySetInnerHTML={{ __html: activeRecipe.instructions }} />
                        ) : (
                          <p>No detailed instructions available. Please visit the original recipe.</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {searchTerm && recipes.length === 0 && apiStatus === 'ok' ? (
                  <div className="text-center py-12">
                    <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      No recipes found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : recipes.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Search Results for "{searchTerm}"
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recipes.map(recipe => (
                        <div 
                          key={recipe.id}
                          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => getRecipeDetails(recipe.id)}
                        >
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={recipe.image} 
                              alt={recipe.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                              {recipe.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{recipe.readyInMinutes} mins</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Search for recipes
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Enter ingredients, dish names, or dietary preferences
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}