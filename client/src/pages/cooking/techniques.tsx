import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section, Container, H1, Paragraph } from '@/components/ui/content';
import CookingTutorialsNew from '@/components/cooking-tutorials-new';

export default function TechniquesPage() {
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
          <H1>Cooking Techniques</H1>
        </div>
        
        <Paragraph className="text-lg text-muted-foreground mb-6">
          Master essential cooking techniques through guided video tutorials. From knife skills to heat management, build your cooking competence step by step.
        </Paragraph>
        
        <CookingTutorialsNew />
      </Section>
    </Container>
  );
}