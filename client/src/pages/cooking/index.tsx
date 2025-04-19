import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Utensils, 
  ChefHat, 
  CalendarDays, 
  GraduationCap, 
  Search,
  BookOpen 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { H1, H2, Section } from '@/components/ui/content';

// Main cooking hub page component
export default function CookingPage() {
  const [, navigate] = useLocation();

  // Features offered in the cooking section
  const cookingFeatures = [
    {
      id: 'recipes',
      title: 'Recipe Explorer',
      description: 'Browse thousands of recipes across global cuisines, skill levels, and dietary preferences',
      icon: <Search className="h-6 w-6 text-orange-500" />,
      path: '/cooking/recipes',
      primaryAction: 'Explore Recipes',
      secondaryAction: 'Find by Ingredient'
    },
    {
      id: 'meal-plan',
      title: 'Meal Planning',
      description: 'Plan your weekly meals with nutritionally balanced and budget-friendly options',
      icon: <CalendarDays className="h-6 w-6 text-orange-500" />,
      path: '/cooking/meal-plan',
      primaryAction: 'Create Meal Plan',
      secondaryAction: 'View Saved Plans'
    },
    {
      id: 'techniques',
      title: 'Cooking Techniques',
      description: 'Master essential cooking methods through step-by-step video tutorials',
      icon: <ChefHat className="h-6 w-6 text-orange-500" />,
      path: '/cooking/techniques',
      primaryAction: 'Learn Techniques',
      secondaryAction: 'Knife Skills Guide'
    },
    {
      id: 'basics',
      title: 'Cooking Basics Course',
      description: 'Structured lessons to build your cooking confidence from beginner to advanced',
      icon: <GraduationCap className="h-6 w-6 text-orange-500" />,
      path: '/learning/courses/cooking-basics',
      primaryAction: 'Start Learning',
      secondaryAction: 'View Curriculum'
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <Section>
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-8">
          <div>
            <H1 className="flex items-center gap-3 mb-2">
              <Utensils className="h-8 w-8 text-orange-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
                Cooking Assistant
              </span>
            </H1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Develop essential cooking skills, discover new recipes, and plan meals with personalized guidance
              for your dietary preferences and cooking level.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              onClick={() => navigate('/cooking/recipes')}
            >
              <Search className="mr-2 h-4 w-4" />
              Quick Recipe Search
            </Button>
            <Button 
              onClick={() => navigate('/cooking/meal-plan')}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Plan My Meals
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cookingFeatures.map(feature => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button 
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.primaryAction}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.secondaryAction}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
      
      <Section>
        <div className="mt-10 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full">
              <BookOpen className="h-12 w-12 text-orange-600" />
            </div>
            <div className="flex-1">
              <H2 className="text-orange-800 dark:text-orange-400 mb-2">Begin Your Cooking Journey</H2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Whether you're a complete beginner or looking to refine your skills, our structured 
                cooking courses will help you build confidence in the kitchen.
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                onClick={() => navigate('/learning/courses/cooking-basics')}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Start Cooking Basics Course
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}