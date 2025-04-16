import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  UtensilsCrossed, 
  Calendar, 
  Apple, 
  Beef, 
  Salad, 
  Coffee,
  Soup, 
  Clock, 
  Check, 
  ShoppingCart, 
  Pizza, 
  Download, 
  Printer,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

// Types for Spoonacular API responses
interface SpoonacularMealPlanDay {
  meals: SpoonacularMeal[];
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

interface SpoonacularMealPlanWeek {
  days: {
    day: number;
    meals: SpoonacularMeal[];
    nutrients: {
      calories: number;
      protein: number;
      fat: number;
      carbohydrates: number;
    };
  }[];
}

interface SpoonacularMeal {
  id: number;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  extendedIngredients: {
    id: number;
    aisle: string;
    image: string;
    name: string;
    amount: number;
    unit: string;
    originalString: string;
  }[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: { id: number; name: string; image: string }[];
      equipment: { id: number; name: string; image: string }[];
    }[];
  }[];
  diets: string[];
  occasions: string[];
}

// Our app-specific types
interface Meal {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  imageUrl?: string;
  ingredients?: string[];
  instructions?: string[];
  sourceUrl?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface DayPlan {
  day: string;
  meals: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snack: Meal | null;
  };
}

// Define different meal plan types
const mealPlans = {
  balanced: {
    title: "Balanced Meal Plan",
    description: "A nutritionally balanced plan suitable for everyone",
    days: 7,
    icon: Salad,
    color: "text-green-500",
    apiParams: { timeFrame: "day", targetCalories: 2000 }
  },
  vegetarian: {
    title: "Vegetarian Plan",
    description: "Plant-based meals with eggs and dairy",
    days: 7,
    icon: Soup,
    color: "text-purple-500",
    apiParams: { timeFrame: "day", targetCalories: 2000, diet: "vegetarian" }
  },
  quick: {
    title: "Quick & Easy Meal Plan",
    description: "Meals that take 30 minutes or less to prepare",
    days: 7,
    icon: Clock,
    color: "text-orange-500",
    apiParams: { timeFrame: "day", targetCalories: 2000, maxReadyTime: 30 }
  }
};

// Weekday names
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MealPlanning() {
  const [selectedPlan, setSelectedPlan] = useState<string>("balanced");
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMealDetail, setLoadingMealDetail] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeDetail | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [regeneratingMeal, setRegeneratingMeal] = useState<{
    day: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  } | null>(null);

  // Generate meal plan when component loads or plan type changes
  useEffect(() => {
    // Initial check of API status
    const checkApiStatus = async () => {
      try {
        const statusResponse = await axios.get('/api/cooking/spoonacular-status');
        console.log('Spoonacular API status:', statusResponse.data);
      } catch (error) {
        console.error('API status check failed:', error);
        toast({
          title: "API Configuration Issue",
          description: "There might be an issue with the Spoonacular API configuration.",
          variant: "destructive"
        });
      }
    };
    
    checkApiStatus();
    generateMealPlan(selectedPlan);
  }, [selectedPlan]);

  // Function to fetch a meal plan from the Spoonacular API
  const generateMealPlan = async (planType: string) => {
    setLoading(true);
    
    try {
      const selectedPlanConfig = mealPlans[planType as keyof typeof mealPlans];
      if (!selectedPlanConfig) {
        throw new Error("Invalid plan type");
      }
      
      const response = await axios.get('/api/cooking/meal-plan', {
        params: selectedPlanConfig.apiParams
      });

      if (response.data?.week) {
        const weekData = response.data.week as SpoonacularMealPlanWeek["days"];
        
        // Transform the API response into our app's data structure
        const formattedPlan: DayPlan[] = weekData.map((day, index) => {
          const dayName = DAYS_OF_WEEK[index % 7];
          
          // Determine meal types
          const breakfast = day.meals[0] ? {
            id: day.meals[0].id,
            title: day.meals[0].title,
            readyInMinutes: day.meals[0].readyInMinutes,
            servings: day.meals[0].servings,
            imageUrl: `https://spoonacular.com/recipeImages/${day.meals[0].id}-312x231.${day.meals[0].imageType}`,
            type: 'breakfast' as const
          } : null;
          
          const lunch = day.meals[1] ? {
            id: day.meals[1].id,
            title: day.meals[1].title,
            readyInMinutes: day.meals[1].readyInMinutes,
            servings: day.meals[1].servings,
            imageUrl: `https://spoonacular.com/recipeImages/${day.meals[1].id}-312x231.${day.meals[1].imageType}`,
            type: 'lunch' as const
          } : null;
          
          const dinner = day.meals[2] ? {
            id: day.meals[2].id,
            title: day.meals[2].title,
            readyInMinutes: day.meals[2].readyInMinutes,
            servings: day.meals[2].servings,
            imageUrl: `https://spoonacular.com/recipeImages/${day.meals[2].id}-312x231.${day.meals[2].imageType}`,
            type: 'dinner' as const
          } : null;
          
          return {
            day: dayName,
            meals: {
              breakfast,
              lunch,
              dinner,
              snack: null // API doesn't provide snacks by default
            }
          };
        });
        
        setWeeklyPlan(formattedPlan);
      } else if (response.data?.meals) {
        // Handle daily meal plan if that's what we get back
        const dayData = response.data.meals as SpoonacularMeal[];
        
        // Create a 7-day plan by generating different meals for each day
        // We'll use the same meal data but stagger them to create variety
        const formattedPlan: DayPlan[] = [];
        
        // For each day of the week
        for (let i = 0; i < 7; i++) {
          const dayName = DAYS_OF_WEEK[i];
          
          // We'll rotate the meals for variety (breakfast becomes lunch, lunch becomes dinner, etc.)
          const breakfastIndex = i % 3;
          const lunchIndex = (i + 1) % 3;
          const dinnerIndex = (i + 2) % 3;
          
          formattedPlan.push({
            day: dayName,
            meals: {
              breakfast: dayData[breakfastIndex] ? {
                id: dayData[breakfastIndex].id,
                title: dayData[breakfastIndex].title,
                readyInMinutes: dayData[breakfastIndex].readyInMinutes,
                servings: dayData[breakfastIndex].servings,
                imageUrl: `https://spoonacular.com/recipeImages/${dayData[breakfastIndex].id}-312x231.${dayData[breakfastIndex].imageType}`,
                type: 'breakfast'
              } : null,
              lunch: dayData[lunchIndex] ? {
                id: dayData[lunchIndex].id,
                title: dayData[lunchIndex].title,
                readyInMinutes: dayData[lunchIndex].readyInMinutes,
                servings: dayData[lunchIndex].servings,
                imageUrl: `https://spoonacular.com/recipeImages/${dayData[lunchIndex].id}-312x231.${dayData[lunchIndex].imageType}`,
                type: 'lunch'
              } : null,
              dinner: dayData[dinnerIndex] ? {
                id: dayData[dinnerIndex].id,
                title: dayData[dinnerIndex].title,
                readyInMinutes: dayData[dinnerIndex].readyInMinutes,
                servings: dayData[dinnerIndex].servings,
                imageUrl: `https://spoonacular.com/recipeImages/${dayData[dinnerIndex].id}-312x231.${dayData[dinnerIndex].imageType}`,
                type: 'dinner'
              } : null,
              snack: null
            }
          });
        }
        
        setWeeklyPlan(formattedPlan);
      } else {
        throw new Error("Invalid response format from meal plan API");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error generating meal plan",
        description: "Unable to fetch meal plan. Please try again later.",
        variant: "destructive"
      });
      
      // If we were regenerating a specific meal, clear that state
      if (regeneratingMeal) {
        setRegeneratingMeal(null);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Get recipe details for a specific meal
  const getRecipeDetails = async (recipeId: number) => {
    setLoadingMealDetail(true);
    
    try {
      const response = await axios.get(`/api/cooking/recipes/${recipeId}/information`);
      // Add sourceUrl property if it doesn't exist
      if (!response.data.sourceUrl && response.data.spoonacularSourceUrl) {
        response.data.sourceUrl = response.data.spoonacularSourceUrl;
      }
      setCurrentRecipe(response.data);
      setShowRecipeModal(true);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      toast({
        title: "Error fetching recipe",
        description: "Unable to get recipe details. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoadingMealDetail(false);
    }
  };
  
  // Regenerate a specific meal
  const handleRegenerateMeal = async (day: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setRegeneratingMeal({ day, mealType });
    
    try {
      // Get the selected plan parameters to maintain diet type, etc.
      const selectedPlanConfig = mealPlans[selectedPlan as keyof typeof mealPlans];
      if (!selectedPlanConfig) {
        throw new Error("Invalid plan type");
      }
      
      // Convert parameters to daily for single meal regeneration
      const params = {
        ...selectedPlanConfig.apiParams,
        timeFrame: "day" // Override to get just one day
      };
      
      const response = await axios.get('/api/cooking/meal-plan', { params });
      
      if (response.data?.meals && response.data.meals.length > 0) {
        // Determine which meal from the response to use based on mealType
        let mealIndex: number = 0;
        if (mealType === 'lunch') mealIndex = 1;
        if (mealType === 'dinner') mealIndex = 2;
        
        const newMeal = response.data.meals[mealIndex % response.data.meals.length];
        
        // Update the weekly plan with the new meal
        setWeeklyPlan(prevPlan => 
          prevPlan.map(dayPlan => {
            if (dayPlan.day === day) {
              const updatedMeals = { ...dayPlan.meals };
              updatedMeals[mealType] = newMeal ? {
                id: newMeal.id,
                title: newMeal.title,
                readyInMinutes: newMeal.readyInMinutes,
                servings: newMeal.servings,
                imageUrl: `https://spoonacular.com/recipeImages/${newMeal.id}-312x231.${newMeal.imageType}`,
                type: mealType
              } : null;
              
              return { ...dayPlan, meals: updatedMeals };
            }
            return dayPlan;
          })
        );
        
        toast({
          title: "Meal updated",
          description: `${day}'s ${mealType} has been updated.`
        });
      }
    } catch (error) {
      console.error("Error regenerating meal:", error);
      toast({
        title: "Error updating meal",
        description: "Unable to get a new meal. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setRegeneratingMeal(null);
    }
  };
  
  // Define interface for categorized shopping list
  interface ShoppingListCategory {
    name: string;
    items: {
      name: string;
      amount?: number | string;
      unit?: string;
      notes?: string;
    }[];
  }

  interface ShoppingListData {
    categories: ShoppingListCategory[];
    tips?: string[];
  }

  // State for categorized shopping list
  const [categorizedShoppingList, setCategorizedShoppingList] = useState<ShoppingListData | null>(null);

  // Generate shopping list from current meal plan
  const handleGenerateShoppingList = async () => {
    setLoading(true);
    
    try {
      // Collect all meal IDs
      const mealIds: number[] = [];
      weeklyPlan.forEach(day => {
        if (day.meals.breakfast?.id) mealIds.push(day.meals.breakfast.id);
        if (day.meals.lunch?.id) mealIds.push(day.meals.lunch.id);
        if (day.meals.dinner?.id) mealIds.push(day.meals.dinner.id);
        if (day.meals.snack?.id) mealIds.push(day.meals.snack.id);
      });
      
      // Collect all ingredients with only the essential information to reduce payload size
      const simplifiedIngredients: Array<{
        name: string;
        amount?: number;
        unit?: string;
        originalString?: string;
      }> = [];
      
      for (const id of mealIds) {
        try {
          const response = await axios.get(`/api/cooking/recipes/${id}/information`);
          const recipe = response.data as RecipeDetail;
          
          // Only include essential ingredient data (not the full objects)
          if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients)) {
            recipe.extendedIngredients.forEach(ingredient => {
              simplifiedIngredients.push({
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                originalString: ingredient.originalString
              });
            });
          }
        } catch (error) {
          console.error(`Error fetching details for recipe ${id}:`, error);
        }
      }
      
      if (simplifiedIngredients.length === 0) {
        throw new Error("No ingredients found for the selected recipes");
      }
      
      // Call our AI-powered shopping list generation endpoint with simplified ingredients
      const aiResponse = await axios.post('/api/cooking/generate-shopping-list', {
        ingredients: simplifiedIngredients,
        model: 'openai' // Can be 'openai' or 'huggingface'
      });
      
      if (!aiResponse.data.success) {
        throw new Error("Failed to generate shopping list");
      }
      
      // The AI response should include categorized items
      const shoppingListData = aiResponse.data.shoppingList as ShoppingListData;
      
      // Store the categorized shopping list
      setCategorizedShoppingList(shoppingListData);
      
      // Also create a flat list for backwards compatibility
      const flatList: string[] = [];
      
      if (shoppingListData.categories && Array.isArray(shoppingListData.categories)) {
        shoppingListData.categories.forEach(category => {
          if (category.items && Array.isArray(category.items)) {
            category.items.forEach(item => {
              // Format with amount and unit if available
              if (item.amount && item.unit) {
                flatList.push(`${item.amount} ${item.unit} ${item.name}`);
              } else {
                flatList.push(item.name);
              }
            });
          }
        });
      }
      
      setShoppingList(flatList);
      setShowShoppingList(true);
      
      toast({
        title: "AI Shopping List Generated",
        description: `Created a smart list with ${flatList.length} ingredients organized by store section`,
      });
    } catch (error) {
      console.error("Error generating shopping list:", error);
      toast({
        title: "Error generating shopping list",
        description: error instanceof Error ? error.message : "Unable to create shopping list. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Weekly Meal Planning</h1>
      
      <p className="text-gray-600 mb-6">
        Planning your meals in advance helps save money, reduce food waste, and maintain a balanced diet.
        Choose a plan type below to get started.
      </p>
      
      {/* Plan selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(mealPlans).map(([key, plan]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPlan === key ? 'border-2 border-orange-500 shadow-md' : ''
            }`}
            onClick={() => setSelectedPlan(key)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <plan.icon className={`h-5 w-5 ${plan.color}`} />
                {plan.title}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{plan.days} day plan</Badge>
                {selectedPlan === key && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Weekly meal plan display */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Weekly Meal Plan</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleGenerateShoppingList}
              disabled={loading || weeklyPlan.length === 0}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
              Generate Shopping List
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => generateMealPlan(selectedPlan)}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh Plan
            </Button>
          </div>
        </div>
        
        {loading && weeklyPlan.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Skeleton className="h-[120px] rounded-md" />
                  <Skeleton className="h-[120px] rounded-md" />
                  <Skeleton className="h-[120px] rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : weeklyPlan.length === 0 ? (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No meal plan could be generated. Please try again with different parameters.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue={weeklyPlan[0]?.day.toLowerCase() || "monday"} className="w-full">
            <TabsList className="mb-2 flex flex-wrap">
              {weeklyPlan.map((day, index) => (
                <TabsTrigger key={index} value={day.day.toLowerCase()}>
                  {day.day}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {weeklyPlan.map((day, index) => (
              <TabsContent key={index} value={day.day.toLowerCase()} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Breakfast */}
                  {day.meals.breakfast ? (
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-amber-500" />
                          Breakfast
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {day.meals.breakfast.imageUrl && (
                          <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
                            <img 
                              src={day.meals.breakfast.imageUrl} 
                              alt={day.meals.breakfast.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-medium">{day.meals.breakfast.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {day.meals.breakfast.readyInMinutes} min
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => getRecipeDetails(day.meals.breakfast!.id)}
                          disabled={loadingMealDetail}
                        >
                          {loadingMealDetail ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                          View Recipe
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-10 p-0"
                          onClick={() => handleRegenerateMeal(day.day, 'breakfast')}
                          disabled={Boolean(regeneratingMeal)}
                        >
                          {regeneratingMeal?.day === day.day && regeneratingMeal?.mealType === 'breakfast' 
                            ? <Loader2 className="h-4 w-4 animate-spin" /> 
                            : <RefreshCw className="h-4 w-4" />}
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-amber-500" />
                          Breakfast
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">No breakfast planned</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Lunch */}
                  {day.meals.lunch ? (
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Salad className="h-4 w-4 text-green-500" />
                          Lunch
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {day.meals.lunch.imageUrl && (
                          <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
                            <img 
                              src={day.meals.lunch.imageUrl} 
                              alt={day.meals.lunch.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-medium">{day.meals.lunch.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {day.meals.lunch.readyInMinutes} min
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => getRecipeDetails(day.meals.lunch!.id)}
                          disabled={loadingMealDetail}
                        >
                          {loadingMealDetail ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                          View Recipe
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-10 p-0"
                          onClick={() => handleRegenerateMeal(day.day, 'lunch')}
                          disabled={Boolean(regeneratingMeal)}
                        >
                          {regeneratingMeal?.day === day.day && regeneratingMeal?.mealType === 'lunch' 
                            ? <Loader2 className="h-4 w-4 animate-spin" /> 
                            : <RefreshCw className="h-4 w-4" />}
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Salad className="h-4 w-4 text-green-500" />
                          Lunch
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">No lunch planned</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Dinner */}
                  {day.meals.dinner ? (
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-purple-500" />
                          Dinner
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {day.meals.dinner.imageUrl && (
                          <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
                            <img 
                              src={day.meals.dinner.imageUrl} 
                              alt={day.meals.dinner.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-medium">{day.meals.dinner.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {day.meals.dinner.readyInMinutes} min
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => getRecipeDetails(day.meals.dinner!.id)}
                          disabled={loadingMealDetail}
                        >
                          {loadingMealDetail ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                          View Recipe
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-10 p-0"
                          onClick={() => handleRegenerateMeal(day.day, 'dinner')}
                          disabled={Boolean(regeneratingMeal)}
                        >
                          {regeneratingMeal?.day === day.day && regeneratingMeal?.mealType === 'dinner' 
                            ? <Loader2 className="h-4 w-4 animate-spin" /> 
                            : <RefreshCw className="h-4 w-4" />}
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-purple-500" />
                          Dinner
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">No dinner planned</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
      
      {/* Shopping List */}
      {showShoppingList && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              AI-Generated Shopping List
            </CardTitle>
            <CardDescription>
              Intelligently organized based on your weekly meal plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Only display this format if we have the AI-generated categorized data */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Generating your intelligent shopping list...</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {/* Display categorized shopping list */}
                  {categorizedShoppingList && categorizedShoppingList.categories && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Categorized list on the left - takes 8/12 columns on large screens */}
                      <div className="lg:col-span-8 space-y-6">
                        <h3 className="font-medium text-lg mb-2">Organized Shopping List</h3>
                        
                        <div className="space-y-4">
                          {categorizedShoppingList.categories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="border rounded-md p-4">
                              <h4 className="font-medium text-base mb-3 text-slate-800">{category.name}</h4>
                              <div className="space-y-2">
                                {category.items.map((item, itemIndex) => (
                                  <div key={`${categoryIndex}-${itemIndex}`} className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id={`cat-${categoryIndex}-item-${itemIndex}`} 
                                      className="rounded" 
                                    />
                                    <label 
                                      htmlFor={`cat-${categoryIndex}-item-${itemIndex}`} 
                                      className="text-sm"
                                    >
                                      {item.amount && item.unit 
                                        ? `${item.amount} ${item.unit} ${item.name}`
                                        : item.name
                                      }
                                      {item.notes && (
                                        <span className="text-xs text-gray-500 ml-1">({item.notes})</span>
                                      )}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shopping tips section on the right - takes 4/12 columns on large screens */}
                      <div className="lg:col-span-4">
                        <div className="border rounded-md p-4 sticky top-4">
                          <h3 className="font-medium mb-3">Shopping Tips</h3>
                          
                          {/* Custom tips if available */}
                          {categorizedShoppingList.tips && categorizedShoppingList.tips.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                              {categorizedShoppingList.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                              ))}
                            </ul>
                          ) : (
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                              <li>Shop from the perimeter of the store first (produce, meat, dairy)</li>
                              <li>Buy in bulk for frequently used non-perishable items</li>
                              <li>Compare unit prices to find the best deals</li>
                              <li>Consider seasonal produce for freshness and value</li>
                              <li>Check your pantry before shopping to avoid duplicates</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback flat list if categorized data isn't available */}
                  {!categorizedShoppingList && shoppingList.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-3">Your Shopping List</h3>
                        <div className="space-y-2">
                          {shoppingList.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input type="checkbox" id={`item-${index}`} className="rounded" />
                              <label htmlFor={`item-${index}`} className="text-sm">{item}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-3">Shopping Tips</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                          <li>Shop from the perimeter of the store first (produce, meat, dairy)</li>
                          <li>Buy in bulk for frequently used non-perishable items</li>
                          <li>Compare unit prices to find the best deals</li>
                          <li>Consider seasonal produce for freshness and value</li>
                          <li>Check your pantry before shopping to avoid duplicates</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowShoppingList(false)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Close List
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // You could implement printing functionality here
                      window.print();
                    }}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print List
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Meal Planning Tips */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            Meal Planning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Benefits of Meal Planning</h3>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-sm text-gray-600">Save up to $1,500 per year by reducing food waste</li>
                <li className="text-sm text-gray-600">Make fewer shopping trips and spend less time cooking</li>
                <li className="text-sm text-gray-600">Eat more balanced and nutritious meals</li>
                <li className="text-sm text-gray-600">Reduce stress around daily meal decisions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Beginner Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-sm text-gray-600">Start with planning just 3-4 days at a time</li>
                <li className="text-sm text-gray-600">Choose recipes with overlapping ingredients</li>
                <li className="text-sm text-gray-600">Designate a prep day to get ahead on chopping and cooking</li>
                <li className="text-sm text-gray-600">Use a mix of fresh foods and longer-lasting pantry staples</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recipe Detail Modal */}
      <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="recipe-details-description">
          {currentRecipe ? (
            <>
              <DialogHeader>
                <DialogTitle>{currentRecipe.title}</DialogTitle>
                <DialogDescription id="recipe-details-description" className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentRecipe.readyInMinutes} min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentRecipe.servings} serving{currentRecipe.servings !== 1 ? 's' : ''}
                  </Badge>
                  {currentRecipe.diets?.map((diet, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </DialogDescription>
              </DialogHeader>
              
              {currentRecipe.image && (
                <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden">
                  <img 
                    src={currentRecipe.image} 
                    alt={currentRecipe.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b">
                    <span>Ingredients</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <ul className="list-disc list-inside space-y-1">
                      {currentRecipe.extendedIngredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">
                          {ingredient.originalString || `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b">
                    <span>Instructions</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    {currentRecipe.analyzedInstructions.length > 0 ? (
                      <ol className="list-decimal list-inside space-y-2">
                        {currentRecipe.analyzedInstructions[0].steps.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step.step}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: currentRecipe.instructions || 'No instructions available.' }} 
                      />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRecipeModal(false)}>
                  Close
                </Button>
                {currentRecipe.sourceUrl && (
                  <Button 
                    variant="default" 
                    onClick={() => window.open(currentRecipe.sourceUrl, '_blank')}
                  >
                    View Original Recipe
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>Loading recipe details...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}