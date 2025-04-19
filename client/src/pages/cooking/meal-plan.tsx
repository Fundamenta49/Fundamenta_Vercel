import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section, Container, H1, Paragraph } from '@/components/ui/content';
import MealPlanning from '@/components/meal-planning';

export default function MealPlanPage() {
  return (
    <Container>
      <Button 
        variant="ghost" 
        size="sm" 
        asChild 
        className="mb-4"
      >
        <Link to="/cooking">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cooking Skills
        </Link>
      </Button>
      
      <Section className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-green-500" />
          <H1>Meal Planning</H1>
        </div>
        
        <Paragraph className="text-lg text-muted-foreground mb-6">
          Create personalized weekly meal plans based on your dietary needs and preferences. Save time with organized grocery lists and balanced nutrition throughout the week.
        </Paragraph>
        
        <div>
          <Card className="p-4">
            <MealPlanning />
          </Card>
        </div>
        
        <Section className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Benefits of Meal Planning</h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>Reduces food waste by planning portions and ingredients</li>
                <li>Saves money through efficient grocery shopping</li>
                <li>Ensures balanced nutrition throughout the week</li>
                <li>Decreases reliance on unhealthy takeout options</li>
                <li>Reduces daily decision fatigue about what to eat</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Tips for Success</h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>Start with just planning dinners if a full week feels overwhelming</li>
                <li>Choose recipes with overlapping ingredients to minimize waste</li>
                <li>Designate a prep day to prepare ingredients in advance</li>
                <li>Consider batch cooking meals that freeze well</li>
                <li>Include some flexible meals for unexpected schedule changes</li>
              </ul>
            </div>
          </div>
        </Section>
      </Section>
    </Container>
  );
}