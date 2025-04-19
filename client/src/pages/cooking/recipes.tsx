import React from 'react';
import { Link } from 'wouter';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section, Container, H1, Paragraph } from '@/components/ui/content';
import RecipeExplorerPopOut from '@/components/recipe-explorer-pop-out';

export default function RecipesPage() {
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
          <ChefHat className="h-8 w-8 text-orange-500" />
          <H1>Recipe Explorer</H1>
        </div>
        
        <Paragraph className="text-lg text-muted-foreground mb-6">
          Find recipes that match your tastes, dietary needs, and available ingredients. Filter by cuisine, diet restrictions, or prep time.
        </Paragraph>
        
        <div className="h-[calc(100vh-250px)] min-h-[500px] border rounded-lg shadow-sm overflow-hidden">
          <RecipeExplorerPopOut />
        </div>
      </Section>
    </Container>
  );
}