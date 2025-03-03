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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  MapPin,
  TrendingDown,
  AlertCircle,
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

interface StoreComparison {
  storeName: string;
  distance: string;
  prices: {
    item: string;
    price: number;
    deal?: string;
  }[];
}

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

export default function ShoppingBuddy() {
  const [location, setLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [storeComparisons, setStoreComparisons] = useState<StoreComparison[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [storeError, setStoreError] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [groceryPreferences, setGroceryPreferences] = useState({
    diet: "",
    budget: "",
    meals: 0,
    restrictions: ""
  });

  const [generatedList, setGeneratedList] = useState<{
    items: Array<{ name: string; estimatedCost: number }>;
    totalCost: number;
    suggestions: string[];
  }>({
    items: [],
    totalCost: 0,
    suggestions: []
  });

  const commonProducts = [
    "Milk", "Bread", "Eggs", "Chicken", "Rice",
    "Pasta", "Apples", "Bananas", "Tomatoes", "Potatoes",
    "Onions", "Cheese", "Yogurt", "Coffee", "Cereal"
  ];

  const searchNearbyStores = async (latitude: number, longitude: number) => {
    setIsLoadingStores(true);
    setStoreError("");

    try {
      // This would normally make an API call to get nearby stores
      // For now, we'll simulate an API delay and update mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate different stores based on location
      const stores = [
        {
          storeName: "Kroger",
          distance: "0.5 miles",
          prices: [
            { item: "Milk", price: 3.99, deal: "Buy 2 get 1 free" },
            { item: "Bread", price: 2.49 },
            { item: "Eggs", price: 3.29, deal: "20% off this week" },
            { item: "Chicken", price: 6.99 },
            { item: "Rice", price: 4.99 },
            { item: "Pasta", price: 2.99 },
            { item: "Apples", price: 2.49 },
            { item: "Bananas", price: 0.79 },
            { item: "Tomatoes", price: 1.99 },
            { item: "Potatoes", price: 3.49 },
            { item: "Onions", price: 1.29 },
            { item: "Cheese", price: 4.99 },
            { item: "Yogurt", price: 1.99 },
            { item: "Coffee", price: 8.99 },
            { item: "Cereal", price: 4.29 }
          ]
        },
        {
          storeName: "Whole Foods Market",
          distance: "0.8 miles",
          prices: [
            { item: "Milk", price: 4.49 },
            { item: "Bread", price: 3.99, deal: "Organic" },
            { item: "Eggs", price: 4.99, deal: "Cage-free" },
            { item: "Chicken", price: 8.99 },
            { item: "Rice", price: 6.49 },
            { item: "Pasta", price: 3.99 },
            { item: "Apples", price: 3.49 },
            { item: "Bananas", price: 0.99 },
            { item: "Tomatoes", price: 2.49 },
            { item: "Potatoes", price: 4.49 },
            { item: "Onions", price: 1.49 },
            { item: "Cheese", price: 6.49 },
            { item: "Yogurt", price: 2.49 },
            { item: "Coffee", price: 10.99 },
            { item: "Cereal", price: 5.29 }
          ]
        },
        {
          storeName: "Trader Joe's",
          distance: "1.2 miles",
          prices: [
            { item: "Milk", price: 3.79 },
            { item: "Bread", price: 2.99 },
            { item: "Eggs", price: 3.49, deal: "Free-range" },
            { item: "Chicken", price: 7.49 },
            { item: "Rice", price: 5.49 },
            { item: "Pasta", price: 3.49 },
            { item: "Apples", price: 2.99 },
            { item: "Bananas", price: 0.89 },
            { item: "Tomatoes", price: 2.29 },
            { item: "Potatoes", price: 3.99 },
            { item: "Onions", price: 1.39 },
            { item: "Cheese", price: 5.49 },
            { item: "Yogurt", price: 2.29 },
            { item: "Coffee", price: 9.49 },
            { item: "Cereal", price: 4.79 }
          ]
        },
        {
          storeName: "Safeway",
          distance: "1.5 miles",
          prices: [
            { item: "Milk", price: 3.89 },
            { item: "Bread", price: 2.79, deal: "Fresh baked" },
            { item: "Eggs", price: 3.19, deal: "Member price" },
            { item: "Chicken", price: 7.99 },
            { item: "Rice", price: 5.99 },
            { item: "Pasta", price: 2.49 },
            { item: "Apples", price: 2.79 },
            { item: "Bananas", price: 0.84 },
            { item: "Tomatoes", price: 2.19 },
            { item: "Potatoes", price: 3.79 },
            { item: "Onions", price: 1.19 },
            { item: "Cheese", price: 5.99 },
            { item: "Yogurt", price: 1.79 },
            { item: "Coffee", price: 9.99 },
            { item: "Cereal", price: 4.49 }
          ]
        }
      ];

      setStoreComparisons(stores);
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

  const generateGroceryList = () => {
    // This would normally call an AI service
    // For now, we'll simulate budget-based suggestions
    const budgetRanges = {
      'very-low': { min: 0, max: 30 },
      'low': { min: 30, max: 50 },
      'medium': { min: 50, max: 100 },
      'high': { min: 100, max: 150 },
      'very-high': { min: 150, max: 300 }
    };

    const budget = budgetRanges[groceryPreferences.budget];

    // Example generated list based on budget
    const generateSampleList = () => {
      if (groceryPreferences.diet === 'vegan') {
        return {
          items: [
            { name: "Tofu (2 blocks)", estimatedCost: 5.98 },
            { name: "Quinoa (1 lb)", estimatedCost: 4.99 },
            { name: "Mixed Vegetables", estimatedCost: 6.99 },
            { name: "Plant-based Milk", estimatedCost: 3.99 },
            { name: "Legumes (2 cans)", estimatedCost: 3.98 }
          ],
          suggestions: [
            "Buy in bulk to save on staples",
            "Check frozen vegetables for better value",
            "Visit local farmers markets for fresh produce deals"
          ]
        };
      } else {
        return {
          items: [
            { name: "Chicken Breast (2 lbs)", estimatedCost: 9.98 },
            { name: "Brown Rice (2 lbs)", estimatedCost: 3.99 },
            { name: "Mixed Vegetables", estimatedCost: 6.99 },
            { name: "Eggs (dozen)", estimatedCost: 3.99 },
            { name: "Milk (1 gallon)", estimatedCost: 3.89 }
          ],
          suggestions: [
            "Look for family packs of protein for better value",
            "Compare unit prices between brands",
            "Check weekly specials for staples"
          ]
        };
      }
    };

    const list = generateSampleList();
    const totalCost = list.items.reduce((sum, item) => sum + item.estimatedCost, 0);

    setGeneratedList({
      items: list.items,
      totalCost,
      suggestions: list.suggestions
    });
  };

  return (
    <div className="space-y-6">
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
              <SelectItem value="very-low">Under $30</SelectItem>
              <SelectItem value="low">$30-50</SelectItem>
              <SelectItem value="medium">$50-100</SelectItem>
              <SelectItem value="high">$100-150</SelectItem>
              <SelectItem value="very-high">$150+</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Any dietary restrictions or allergies?"
            value={groceryPreferences.restrictions}
            onChange={(e) => setGroceryPreferences(prev => ({ ...prev, restrictions: e.target.value }))}
          />

          <Button
            className="w-full"
            onClick={generateGroceryList}
            disabled={!groceryPreferences.diet || !groceryPreferences.budget}
          >
            Generate Shopping List
          </Button>

          {generatedList.items.length > 0 && (
            <div className="space-y-4 mt-4 p-4 border rounded-md">
              <h3 className="font-medium">Your Personalized Shopping List:</h3>
              <div className="space-y-2">
                {generatedList.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.estimatedCost.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Estimated Total:</span>
                    <span>${generatedList.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Shopping Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {generatedList.suggestions.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card className="border-teal-200 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-teal-500" />
            Select Products to Compare
          </CardTitle>
          <CardDescription>
            Choose items you want to compare prices for across stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonProducts.map((product) => (
              <Badge
                key={product}
                variant={selectedProducts.includes(product) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedProducts(prev =>
                    prev.includes(product)
                      ? prev.filter(p => p !== product)
                      : [...prev, product]
                  );
                }}
              >
                {product}
              </Badge>
            ))}
          </div>
          {selectedProducts.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected {selectedProducts.length} items to compare
            </p>
          )}
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
                      {store.prices
                        .filter(item => selectedProducts.length === 0 || selectedProducts.includes(item.item))
                        .map((item, itemIndex) => (
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