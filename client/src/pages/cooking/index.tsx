import React from 'react';
import { Link } from 'wouter';
import { ChefHat, UtensilsCrossed, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section, Container, H1, H2, Paragraph } from '@/components/ui/content';

export default function CookingLanding() {
  const features = [
    {
      title: "Recipe Explorer",
      description: "Search and discover thousands of recipes based on ingredients you have or dietary preferences.",
      icon: <BookOpen className="h-12 w-12 text-orange-500" />,
      link: "/cooking/recipes",
      color: "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
      buttonText: "Find Recipes"
    },
    {
      title: "Meal Planning",
      description: "Generate personalized weekly meal plans based on your dietary preferences and nutritional goals.",
      icon: <Calendar className="h-12 w-12 text-green-500" />,
      link: "/cooking/meal-plan",
      color: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
      buttonText: "Plan Meals"
    },
    {
      title: "Cooking Techniques",
      description: "Learn essential cooking skills and methods through step-by-step video tutorials.",
      icon: <UtensilsCrossed className="h-12 w-12 text-blue-500" />,
      link: "/cooking/techniques",
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      buttonText: "Learn Skills"
    }
  ];

  return (
    <Container>
      <Section className="space-y-6">
        <div className="flex items-center gap-3">
          <ChefHat className="h-10 w-10 text-orange-500" />
          <H1>Cooking Skills & Nutrition</H1>
        </div>
        
        <Paragraph className="text-lg text-muted-foreground">
          Develop essential cooking skills, explore recipes, and learn how to prepare nutritious meals with our comprehensive cooking guides.
        </Paragraph>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-2 hover:border-orange-300 transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${feature.color} p-6 flex justify-center`}>
                {feature.icon}
              </div>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link to={feature.link}>
                    {feature.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Section>
          <H2 className="mb-4">Why Cooking Skills Matter</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Health Benefits</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Control over ingredients and portion sizes</li>
                <li>Reduced sodium, sugar, and unhealthy fats</li>
                <li>Higher intake of fresh fruits and vegetables</li>
                <li>Better nutritional balance in daily meals</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Life Skills</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Budget management and grocery planning</li>
                <li>Time management and organization</li>
                <li>Cultural appreciation through food</li>
                <li>Social connection through shared meals</li>
              </ul>
            </div>
          </div>
        </Section>
      </Section>
    </Container>
  );
}