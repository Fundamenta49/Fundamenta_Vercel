import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  UtensilsCrossed,
  Calendar,
  Apple,
  Beef,
  Fish,
  Salad,
  Coffee,
  Soup,
  Clock,
  Check,
  ShoppingCart,
  Pizza,
  Download,
  Printer
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Define meal types
interface Meal {
  name: string;
  prepTime: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
}

interface MealPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

// Define different plan types
const mealPlans = {
  balanced: {
    title: "Balanced Meal Plan",
    description: "A nutritionally balanced plan suitable for everyone",
    days: 7,
    icon: Salad,
    color: "text-green-500"
  },
  budget: {
    title: "Budget-Friendly Meal Plan",
    description: "Affordable meals without sacrificing nutrition",
    days: 7,
    icon: ShoppingCart,
    color: "text-blue-500"
  },
  quick: {
    title: "Quick & Easy Meal Plan",
    description: "Meals that take 30 minutes or less to prepare",
    days: 7,
    icon: Clock,
    color: "text-orange-500"
  }
};

// Sample meal data for demo purposes
const sampleBreakfasts: Meal[] = [
  {
    name: "Overnight Oats with Berries",
    prepTime: "5 min (+ overnight soaking)",
    category: "breakfast",
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup milk (dairy or plant-based)",
      "1 tbsp chia seeds",
      "1 tbsp honey or maple syrup",
      "1/4 cup mixed berries",
      "Optional: cinnamon, vanilla extract"
    ],
    instructions: [
      "Mix oats, milk, chia seeds, and sweetener in a jar",
      "Add any flavorings like cinnamon or vanilla",
      "Cover and refrigerate overnight",
      "Top with berries before eating"
    ],
    nutrition: {
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 10
    },
    tags: ["make-ahead", "vegetarian", "no-cook"]
  },
  {
    name: "Avocado Toast with Egg",
    prepTime: "10 min",
    category: "breakfast",
    ingredients: [
      "1 slice whole grain bread",
      "1/2 ripe avocado",
      "1 egg",
      "Salt and pepper to taste",
      "Optional: chili flakes, lemon juice"
    ],
    instructions: [
      "Toast the bread",
      "Mash avocado and spread on toast",
      "Fry or poach egg to your liking",
      "Place egg on avocado toast",
      "Season with salt, pepper and optional toppings"
    ],
    nutrition: {
      calories: 280,
      protein: 15,
      carbs: 20,
      fat: 18
    },
    tags: ["high-protein", "vegetarian", "quick"]
  }
];

const sampleLunches: Meal[] = [
  {
    name: "Mediterranean Chickpea Salad",
    prepTime: "15 min",
    category: "lunch",
    ingredients: [
      "1 can chickpeas, drained and rinsed",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/4 red onion, finely chopped",
      "1/4 cup feta cheese, crumbled",
      "2 tbsp olive oil",
      "1 tbsp lemon juice",
      "Salt and pepper to taste",
      "Optional: fresh herbs like parsley or mint"
    ],
    instructions: [
      "Combine chickpeas, cucumber, tomatoes, red onion in a bowl",
      "Add crumbled feta cheese",
      "Whisk together olive oil, lemon juice, salt and pepper",
      "Pour dressing over salad and toss gently",
      "Add fresh herbs if using, and serve"
    ],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 35,
      fat: 15
    },
    tags: ["vegetarian", "high-fiber", "meal-prep-friendly"]
  },
  {
    name: "Turkey and Hummus Wrap",
    prepTime: "10 min",
    category: "lunch",
    ingredients: [
      "1 whole wheat tortilla",
      "3 slices deli turkey",
      "2 tbsp hummus",
      "Handful of fresh spinach",
      "1/4 cup grated carrot",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Spread hummus evenly on tortilla",
      "Layer turkey slices, spinach and grated carrot",
      "Season with salt and pepper",
      "Roll up tightly and slice in half"
    ],
    nutrition: {
      calories: 290,
      protein: 18,
      carbs: 30,
      fat: 10
    },
    tags: ["high-protein", "quick", "portable"]
  }
];

const sampleDinners: Meal[] = [
  {
    name: "One-Pan Baked Chicken and Vegetables",
    prepTime: "15 min prep, 30 min cooking",
    category: "dinner",
    ingredients: [
      "2 chicken breasts",
      "2 cups mixed vegetables (broccoli, carrots, bell peppers)",
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 tsp dried herbs (rosemary, thyme)",
      "Salt and pepper to taste",
      "Lemon wedges for serving"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C)",
      "Place chicken breasts on a baking sheet",
      "Surround with chopped vegetables",
      "Drizzle everything with olive oil",
      "Season with garlic, herbs, salt and pepper",
      "Bake for 25-30 minutes until chicken is cooked through",
      "Serve with lemon wedges"
    ],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 15,
      fat: 18
    },
    tags: ["high-protein", "one-pan", "easy cleanup"]
  },
  {
    name: "Simple Pasta with Tomato Sauce",
    prepTime: "20 min",
    category: "dinner",
    ingredients: [
      "8 oz (about 2 cups) pasta of choice",
      "1 can (15 oz) tomato sauce",
      "2 cloves garlic, minced",
      "1 tbsp olive oil",
      "1 tsp dried basil or Italian seasoning",
      "Salt and pepper to taste",
      "Optional: grated Parmesan cheese"
    ],
    instructions: [
      "Cook pasta according to package directions",
      "In a saucepan, heat olive oil over medium heat",
      "Add minced garlic and cook for 30 seconds",
      "Add tomato sauce and dried herbs",
      "Simmer for 10 minutes",
      "Drain pasta and toss with sauce",
      "Season with salt and pepper, top with Parmesan if desired"
    ],
    nutrition: {
      calories: 350,
      protein: 12,
      carbs: 60,
      fat: 8
    },
    tags: ["vegetarian", "budget-friendly", "kid-friendly"]
  }
];

const sampleSnacks: Meal[] = [
  {
    name: "Greek Yogurt with Honey and Nuts",
    prepTime: "5 min",
    category: "snack",
    ingredients: [
      "1 cup Greek yogurt",
      "1 tbsp honey",
      "1 tbsp chopped nuts (almonds, walnuts)",
      "Optional: cinnamon, berries"
    ],
    instructions: [
      "Place yogurt in a bowl",
      "Drizzle with honey",
      "Top with chopped nuts and any optional toppings"
    ],
    nutrition: {
      calories: 180,
      protein: 15,
      carbs: 15,
      fat: 7
    },
    tags: ["high-protein", "vegetarian", "quick"]
  },
  {
    name: "Apple with Peanut Butter",
    prepTime: "2 min",
    category: "snack",
    ingredients: [
      "1 medium apple, sliced",
      "1 tbsp peanut butter"
    ],
    instructions: [
      "Slice apple into wedges",
      "Serve with peanut butter for dipping"
    ],
    nutrition: {
      calories: 170,
      protein: 4,
      carbs: 25,
      fat: 8
    },
    tags: ["vegetarian", "kid-friendly", "no-cook"]
  }
];

// Generate a simple meal plan for demo
const generateSampleWeeklyPlan = (): MealPlan[] => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days.map(day => ({
    day,
    breakfast: sampleBreakfasts[Math.floor(Math.random() * sampleBreakfasts.length)],
    lunch: sampleLunches[Math.floor(Math.random() * sampleLunches.length)],
    dinner: sampleDinners[Math.floor(Math.random() * sampleDinners.length)],
    snacks: [sampleSnacks[Math.floor(Math.random() * sampleSnacks.length)]]
  }));
};

// Generate shopping list from a meal plan
const generateShoppingList = (plan: MealPlan[]): string[] => {
  const allIngredients: string[] = [];
  
  plan.forEach(day => {
    allIngredients.push(...day.breakfast.ingredients);
    allIngredients.push(...day.lunch.ingredients);
    allIngredients.push(...day.dinner.ingredients);
    day.snacks.forEach(snack => {
      allIngredients.push(...snack.ingredients);
    });
  });
  
  // Simple deduplication by ingredient name (in a real app, we'd need proper parsing)
  const uniqueIngredients = Array.from(new Set(allIngredients));
  return uniqueIngredients;
};

export default function MealPlanning() {
  const [selectedPlan, setSelectedPlan] = useState<string>("balanced");
  const [weeklyPlan, setWeeklyPlan] = useState<MealPlan[]>(generateSampleWeeklyPlan());
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  
  const handleGenerateShoppingList = () => {
    const ingredients = generateShoppingList(weeklyPlan);
    setShoppingList(ingredients);
    setShowShoppingList(true);
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
            <Button variant="outline" onClick={handleGenerateShoppingList}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Generate Shopping List
            </Button>
            
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Plan
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="monday" className="w-full">
          <TabsList className="mb-2 flex flex-wrap">
            {weeklyPlan.map((day, index) => (
              <TabsTrigger key={index} value={day.day.toLowerCase()}>
                {day.day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weeklyPlan.map((day, index) => (
            <TabsContent key={index} value={day.day.toLowerCase()} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Breakfast */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-amber-500" />
                      Breakfast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">{day.breakfast.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {day.breakfast.prepTime}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {day.breakfast.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Lunch */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Salad className="h-4 w-4 text-green-500" />
                      Lunch
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">{day.lunch.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {day.lunch.prepTime}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {day.lunch.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Dinner */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 text-purple-500" />
                      Dinner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">{day.dinner.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {day.dinner.prepTime}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {day.dinner.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Snacks */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Apple className="h-4 w-4 text-red-500" />
                      Snacks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {day.snacks.map((snack, i) => (
                      <div key={i}>
                        <h3 className="font-medium">{snack.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {snack.prepTime}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1 mb-2">
                          {snack.tags.map((tag, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Shopping List */}
      {showShoppingList && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              Shopping List
            </CardTitle>
            <CardDescription>
              Based on your weekly meal plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoppingList.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="checkbox" id={`item-${index}`} className="rounded" />
                  <label htmlFor={`item-${index}`} className="text-sm">{item}</label>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print List
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Save as PDF
              </Button>
            </div>
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
    </div>
  );
}