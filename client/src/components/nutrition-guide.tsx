import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Apple,
  Brain,
  Dumbbell,
  Moon,
  Heart,
  Droplets,
  AlertCircle,
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Refrigerator } from "lucide-react";
import { MapPin, TrendingDown } from "lucide-react";

interface HabitTracker {
  water: number;
  sleep: number;
  exercise: number;
  meditation: number;
}

interface IngredientList {
  items: string[];
}

interface StoreComparison {
  storeName: string;
  distance: string;
  prices: {
    item: string;
    price: number;
    deal?: string;
  }[];
}

const healthTips = [
  {
    title: "Morning Ritual",
    description: "Start your day with a glass of water and 5 minutes of stretching",
    icon: Brain,
  },
  {
    title: "Mindful Eating",
    description: "Take time to eat slowly and without distractions",
    icon: Apple,
  },
  {
    title: "Movement Breaks",
    description: "Stand up and move for 2-3 minutes every hour",
    icon: Dumbbell,
  },
  {
    title: "Better Sleep",
    description: "Create a relaxing bedtime routine without screens",
    icon: Moon,
  },
];

const budgetMeals = [
  {
    title: "Chickpea Curry Bowl",
    cost: "$3.50",
    ingredients: ["Chickpeas", "Rice", "Onion", "Tomatoes", "Curry Spices"],
    tips: "Buy spices in bulk and rice in large bags for best value"
  },
  {
    title: "Mediterranean Pasta",
    cost: "$4.20",
    ingredients: ["Whole Grain Pasta", "Tomatoes", "Spinach", "Olive Oil", "Garlic"],
    tips: "Use frozen spinach to save money"
  },
  {
    title: "Bean & Rice Burrito Bowl",
    cost: "$3.80",
    ingredients: ["Black Beans", "Rice", "Corn", "Peppers", "Seasonings"],
    tips: "Use dried beans instead of canned for extra savings"
  },
  {
    title: "Lentil Soup",
    cost: "$2.90",
    ingredients: ["Lentils", "Carrots", "Onion", "Celery", "Broth"],
    tips: "Make a large batch and freeze portions"
  }
];

const mealPrepTips = [
  {
    title: "Prep Basics",
    tips: [
      "Choose 2-3 proteins to cook",
      "Roast multiple vegetables at once",
      "Cook grains in bulk",
      "Use similar ingredients across meals",
      "Store properly in airtight containers"
    ]
  },
  {
    title: "Time-Saving Tricks",
    tips: [
      "Chop vegetables in advance",
      "Use sheet pan meals",
      "Cook proteins in slow cooker",
      "Prepare overnight oats",
      "Use mason jar salads"
    ]
  }
];

export default function NutritionGuide() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [habits, setHabits] = useState<HabitTracker>({
    water: 0,
    sleep: 7,
    exercise: 0,
    meditation: 0,
  });
  const [goalSettings, setGoalSettings] = useState({
    goal: "",
    dietaryPreference: "",
    restrictions: "",
  });
  const [groceryPreferences, setGroceryPreferences] = useState({
    diet: "",
    budget: "",
    meals: 0,
    restrictions: ""
  });
  const [ingredients, setIngredients] = useState<string>("");
  const [ingredientList, setIngredientList] = useState<IngredientList>({ items: [] });
  const [suggestedMeals, setSuggestedMeals] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [essentialItems, setEssentialItems] = useState<string[]>([]);
  const [storeComparisons, setStoreComparisons] = useState<StoreComparison[]>([
    {
      storeName: "SuperMart",
      distance: "0.8 miles",
      prices: [
        { item: "Milk", price: 3.99, deal: "Buy 2 get 1 free" },
        { item: "Bread", price: 2.49 },
        { item: "Eggs", price: 3.29, deal: "20% off this week" },
      ]
    },
    {
      storeName: "FreshValue",
      distance: "1.2 miles",
      prices: [
        { item: "Milk", price: 4.29 },
        { item: "Bread", price: 2.29, deal: "BOGO" },
        { item: "Eggs", price: 2.99 },
      ]
    },
  ]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [storeError, setStoreError] = useState<string>("");

  const handleQuizSubmit = () => {
    setQuizCompleted(true);
    // Here we would normally process the quiz answers and generate recommendations
  };

  const updateHabit = (habit: keyof HabitTracker, value: number) => {
    setHabits((prev) => ({
      ...prev,
      [habit]: value,
    }));
  };

  const handleAddIngredient = () => {
    if (ingredients.trim()) {
      setIngredientList(prev => ({
        items: [...prev.items, ingredients.trim()]
      }));
      setIngredients("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientList(prev => ({
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const generateMealSuggestions = () => {
    // This would integrate with an AI service to get meal suggestions
    // For now, we'll provide example suggestions
    setSuggestedMeals([
      "Quick stir-fry with available vegetables",
      "One-pot pasta with pantry ingredients",
      "Custom rice bowl with protein and veggies",
      "Healthy sandwich combinations"
    ]);
  };

  const searchNearbyStores = async (latitude: number, longitude: number) => {
    setIsLoadingStores(true);
    setStoreError("");

    try {
      // This would normally make an API call to get nearby stores
      // For now, we'll simulate an API delay and update mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStoreComparisons([
        {
          storeName: "SuperMart",
          distance: "0.3 miles",
          prices: [
            { item: "Milk", price: 3.99, deal: "Buy 2 get 1 free" },
            { item: "Bread", price: 2.49 },
            { item: "Eggs", price: 3.29, deal: "20% off this week" },
          ]
        },
        {
          storeName: "FreshValue",
          distance: "0.8 miles",
          prices: [
            { item: "Milk", price: 4.29 },
            { item: "Bread", price: 2.29, deal: "BOGO" },
            { item: "Eggs", price: 2.99 },
          ]
        },
        {
          storeName: "ValueMart",
          distance: "1.2 miles",
          prices: [
            { item: "Milk", price: 3.89 },
            { item: "Bread", price: 2.99, deal: "Fresh baked daily" },
            { item: "Eggs", price: 3.49 },
          ]
        }
      ]);
    } catch (error) {
      setStoreError("Failed to fetch nearby stores. Please try again.");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleLocationSearch = (manualLocation: string) => {
    setLocation(manualLocation);
    // In a real app, we would geocode the address here
    // For now, just simulate some coordinates
    searchNearbyStores(37.7749, -122.4194);
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        searchNearbyStores(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please enter it manually.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Wellness Quiz Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Wellness Quiz
          </CardTitle>
          <CardDescription>
            Take our quiz to get personalized health and nutrition recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={goalSettings.goal}
            onValueChange={(value) => setGoalSettings(prev => ({ ...prev, goal: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="What's your primary wellness goal?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight Management</SelectItem>
              <SelectItem value="energy">Boost Energy</SelectItem>
              <SelectItem value="strength">Build Strength</SelectItem>
              <SelectItem value="health">Overall Health</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={goalSettings.dietaryPreference}
            onValueChange={(value) => setGoalSettings(prev => ({ ...prev, dietaryPreference: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dietary Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="pescatarian">Pescatarian</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Any dietary restrictions or allergies?"
            value={goalSettings.restrictions}
            onChange={(e) => setGoalSettings(prev => ({ ...prev, restrictions: e.target.value }))}
          />

          <Button onClick={handleQuizSubmit} className="w-full">
            Get My Personalized Plan
          </Button>

          {quizCompleted && (
            <Alert>
              <AlertDescription>
                Based on your answers, we've created a customized plan for you!
                Check your habit tracker and recommendations below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Daily Habit Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Daily Habit Tracker
          </CardTitle>
          <CardDescription>
            Track your daily wellness habits to build healthy routines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Water Intake (cups)</label>
                <span>{habits.water}/8</span>
              </div>
              <Slider
                value={[habits.water]}
                onValueChange={(value) => updateHabit("water", value[0])}
                max={8}
                step={1}
              />
              <Progress value={(habits.water / 8) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Sleep (hours)</label>
                <span>{habits.sleep}</span>
              </div>
              <Slider
                value={[habits.sleep]}
                onValueChange={(value) => updateHabit("sleep", value[0])}
                min={4}
                max={12}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Exercise (minutes)</label>
                <span>{habits.exercise}/30</span>
              </div>
              <Slider
                value={[habits.exercise]}
                onValueChange={(value) => updateHabit("exercise", value[0])}
                max={30}
                step={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Small Changes Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-500" />
            Small Changes for Big Results
          </CardTitle>
          <CardDescription>
            Simple, actionable tips to improve your health and wellness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {healthTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tip.icon className="h-5 w-5" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {quizCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions based on your goals and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Based on your profile, here are some suggestions:
                • Start with a protein-rich breakfast
                • Take 10-minute walk breaks
                • Include more leafy greens in your meals
                • Practice mindful eating
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}


      {/* Kitchen Ingredients Meal Suggestions */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Refrigerator className="h-5 w-5 text-orange-500" />
            What's in Your Kitchen?
          </CardTitle>
          <CardDescription>
            Enter ingredients you have available and get AI-powered meal suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter ingredients (e.g., rice, chicken, tomatoes)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddIngredient();
                }
              }}
            />
            <Button onClick={handleAddIngredient}>Add</Button>
          </div>

          <ScrollArea className="h-24 w-full rounded-md border p-4">
            <div className="flex flex-wrap gap-2">
              {ingredientList.items.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  {item} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </ScrollArea>

          <Button
            className="w-full"
            onClick={generateMealSuggestions}
            disabled={ingredientList.items.length === 0}
          >
            Get Meal Suggestions
          </Button>

          {suggestedMeals.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Suggested Meals:</h3>
              <ul className="space-y-2">
                {suggestedMeals.map((meal, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{meal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Meals Section */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            $5 Healthy Meals on a Budget
          </CardTitle>
          <CardDescription>
            Nutritious and affordable meal ideas that won't break the bank
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {budgetMeals.map((meal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{meal.title}</span>
                    <span className="text-green-600">{meal.cost}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Ingredients:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground italic">
                      Tip: {meal.tips}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Grocery List Generator */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            Smart Grocery List Generator
          </CardTitle>
          <CardDescription>
            Get a personalized shopping list based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={groceryPreferences.diet}
            onValueChange={(value) => setGroceryPreferences(prev => ({ ...prev, diet: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={groceryPreferences.budget}
            onValueChange={(value) => setGroceryPreferences(prev => ({ ...prev, budget: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Weekly budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">$30-50</SelectItem>
              <SelectItem value="medium">$50-100</SelectItem>
              <SelectItem value="high">$100+</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Any dietary restrictions or allergies?"
            value={groceryPreferences.restrictions}
            onChange={(e) => setGroceryPreferences(prev => ({ ...prev, restrictions: e.target.value }))}
          />

          <Button className="w-full">
            Generate Shopping List
          </Button>
        </CardContent>
      </Card>

      {/* Meal Prep Guide */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-purple-500" />
            Meal Prep Guide for Beginners
          </CardTitle>
          <CardDescription>
            Quick and easy batch cooking tips for healthy eating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mealPrepTips.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium text-lg">{section.title}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Store Price Comparison */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-teal-500" />
            Smart Price Comparison
          </CardTitle>
          <CardDescription>
            Find the best deals on groceries at stores near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLocationSearch(e.target.value);
                }
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              className="shrink-0"
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isLocating ? "Locating..." : "Use Current Location"}
            </Button>
          </div>

          {locationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {storeError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{storeError}</AlertDescription>
            </Alert>
          )}

          {location && (
            <Alert className="bg-teal-50 border-teal-200">
              <MapPin className="h-4 w-4 text-teal-600" />
              <AlertDescription className="text-teal-800">
                {isLoadingStores ? (
                  "Finding stores near your location..."
                ) : (
                  `Showing stores near: ${location}`
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isLoadingStores ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading nearby stores...</p>
              </div>
            ) : (
              storeComparisons.map((store, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{store.storeName}</span>
                      <span className="text-sm text-muted-foreground">{store.distance}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {store.prices.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between">
                          <span>{item.item}</span>
                          <div className="text-right">
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                            {item.deal && (
                              <Badge variant="secondary" className="ml-2">
                                {item.deal}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Money-Saving Tips:</h3>
            <ul className="space-y-1">
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Best time to shop: Early mornings for fresh markdowns
              </li>
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Compare unit prices instead of package prices
              </li>
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Check store flyers for weekly specials
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}