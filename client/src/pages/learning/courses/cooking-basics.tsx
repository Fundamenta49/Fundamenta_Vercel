import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChefHat, 
  Utensils, 
  Book, 
  ArrowLeft, 
  PlayCircle, 
  Coffee, 
  UtensilsCrossed, 
  Clock, 
  ShoppingBag,
  Cookie,
  Egg,
  Beef,
  Apple 
} from 'lucide-react';
import RecipeExplorer from '@/components/recipe-explorer';
import KitchenEssentials from '@/components/kitchen-essentials';
import CookingTutorials from '@/components/cooking-tutorials';
import { Link } from 'wouter';

// Define category type
type GridCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  linkTo: string;
  onClick?: () => void;
};

// Category card component
const GridCard: React.FC<GridCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  linkTo,
  onClick 
}) => {
  const colorClasses = {
    orange: "border-orange-200 bg-orange-50 hover:bg-orange-100",
    green: "border-green-200 bg-green-50 hover:bg-green-100",
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100",
    purple: "border-purple-200 bg-purple-50 hover:bg-purple-100",
    pink: "border-pink-200 bg-pink-50 hover:bg-pink-100",
    yellow: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100",
  };

  const iconColors = {
    orange: "text-orange-600",
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    pink: "text-pink-600",
    yellow: "text-yellow-600",
  };

  return (
    <Card 
      className={`cursor-pointer border transition-all hover:shadow-md ${colorClasses[color]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`${iconColors[color]}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-1">
        <a 
          href={linkTo} 
          className="no-underline w-full"
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          }}
        >
          <Button 
            variant="outline" 
            className="w-full border-gray-300"
          >
            Explore
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

// Define component options for the different features
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Display the appropriate content based on selection
  const renderContent = () => {
    if (!selectedCategory) {
      return null;
    }

    switch (selectedCategory) {
      case 'intro':
        return introContent;
      case 'kitchen-tools':
        return <KitchenEssentials />;
      case 'cooking-tutorials':
        return <CookingTutorials />;
      case 'recipe-explorer':
        return <RecipeExplorer />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6">
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
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-orange-600">
          <ChefHat className="h-8 w-8" />
          Cooking Basics
        </h1>
        <p className="text-gray-600 mt-2">
          Learn essential cooking skills, discover new recipes, and build your confidence in the kitchen.
        </p>
      </div>
      
      {/* Grid Layout of Cooking Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Introduction */}
        <GridCard
          title="Introduction to Cooking"
          description="Why cooking matters and what you'll learn"
          icon={<Book className="h-5 w-5" />}
          color="orange"
          linkTo="#intro"
          onClick={() => setSelectedCategory('intro')}
        />
        
        {/* Kitchen Tools */}
        <GridCard
          title="Essential Kitchen Tools"
          description="Basic equipment every cook needs"
          icon={<Utensils className="h-5 w-5" />}
          color="blue"
          linkTo="#kitchen-tools"
          onClick={() => setSelectedCategory('kitchen-tools')}
        />
        
        {/* Cooking Tutorials */}
        <GridCard
          title="Cooking Tutorials"
          description="Step-by-step video guides for beginners"
          icon={<PlayCircle className="h-5 w-5" />}
          color="green"
          linkTo="#cooking-tutorials"
          onClick={() => setSelectedCategory('cooking-tutorials')}
        />
        
        {/* Recipe Explorer */}
        <GridCard
          title="Recipe Explorer"
          description="Discover easy home cooking classics"
          icon={<ChefHat className="h-5 w-5" />}
          color="purple"
          linkTo="#recipe-explorer"
          onClick={() => setSelectedCategory('recipe-explorer')}
        />
        
        {/* Meal Types */}
        <GridCard
          title="Meal Types"
          description="Breakfast, lunch, dinner & snacks"
          icon={<UtensilsCrossed className="h-5 w-5" />}
          color="yellow"
          linkTo="#meal-types"
          onClick={() => setSelectedCategory('cooking-tutorials')}
        />
        
        {/* Quick Meals */}
        <GridCard
          title="Quick & Easy Meals"
          description="Recipes ready in 30 minutes or less"
          icon={<Clock className="h-5 w-5" />}
          color="pink"
          linkTo="#quick-meals"
          onClick={() => setSelectedCategory('cooking-tutorials')}
        />
        
        {/* Breakfast */}
        <GridCard
          title="Breakfast Basics"
          description="Start your day with simple recipes"
          icon={<Egg className="h-5 w-5" />}
          color="yellow"
          linkTo="#breakfast"
          onClick={() => setSelectedCategory('cooking-tutorials')}
        />
        
        {/* Lunch & Dinner */}
        <GridCard
          title="Lunch & Dinner Staples"
          description="Everyday meals made simple"
          icon={<Beef className="h-5 w-5" />}
          color="orange"
          linkTo="#lunch-dinner"
          onClick={() => setSelectedCategory('cooking-tutorials')}
        />
        
        {/* Desserts */}
        <GridCard
          title="Simple Desserts"
          description="Sweet treats anyone can make"
          icon={<Cookie className="h-5 w-5" />}
          color="pink"
          linkTo="#desserts"
          onClick={() => setSelectedCategory('cooking-tutorials')}
        />
      </div>
      
      {/* Selected Content Display */}
      {selectedCategory && (
        <Card className="mb-6">
          <CardHeader className="bg-orange-50 border-b border-orange-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {selectedCategory === 'intro' && <Book className="h-5 w-5 text-orange-600" />}
                {selectedCategory === 'kitchen-tools' && <Utensils className="h-5 w-5 text-blue-600" />}
                {selectedCategory === 'cooking-tutorials' && <PlayCircle className="h-5 w-5 text-green-600" />}
                {selectedCategory === 'recipe-explorer' && <ChefHat className="h-5 w-5 text-purple-600" />}
                
                <CardTitle>
                  {selectedCategory === 'intro' && 'Introduction to Cooking'}
                  {selectedCategory === 'kitchen-tools' && 'Essential Kitchen Tools'}
                  {selectedCategory === 'cooking-tutorials' && 'Cooking Tutorials'}
                  {selectedCategory === 'recipe-explorer' && 'Recipe Explorer'}
                </CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
              >
                Back to All Categories
              </Button>
            </div>
            <CardDescription>
              {selectedCategory === 'intro' && 'Why cooking matters and what you\'ll learn'}
              {selectedCategory === 'kitchen-tools' && 'Basic equipment every cook needs'}
              {selectedCategory === 'cooking-tutorials' && 'Step-by-step video guides for beginners'}
              {selectedCategory === 'recipe-explorer' && 'Discover easy home cooking classics'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {renderContent()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}