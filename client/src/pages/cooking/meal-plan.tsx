import React from 'react';
import { ChefHat, CalendarDays, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import MealPlanning from '@/components/meal-planning';
import { H1, Section } from '@/components/ui/content';

export default function MealPlanPage() {
  const [, navigate] = useLocation();

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <Section>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4" 
          onClick={() => navigate('/cooking')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cooking
        </Button>
        
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-6">
          <div>
            <H1 className="flex items-center gap-3 mb-2">
              <CalendarDays className="h-8 w-8 text-orange-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
                Meal Planning
              </span>
            </H1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Create personalized meal plans based on your dietary preferences, 
              nutritional goals, and available ingredients.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
          <MealPlanning />
        </div>
      </Section>
    </div>
  );
}