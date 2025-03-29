import { useState } from 'react';
import { useLocation } from 'wouter';
import { Utensils, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QuizComponent from '@/components/quiz-component';
import ResourceLinks from '@/components/resource-links';

export default function CookingBasicsCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to cooking basics
  const resources = [
    {
      title: "Cooking Techniques 101",
      url: "https://www.seriouseats.com/cooking-techniques-how-tos",
      description: "Essential cooking methods every home cook should know",
      type: "guide"
    },
    {
      title: "Beginner Cooking Videos",
      url: "https://www.youtube.com/c/foodwishes",
      description: "Step-by-step visual guides for cooking basics",
      type: "video"
    },
    {
      title: "Ingredient Substitutions Guide",
      url: "https://www.allrecipes.com/article/common-ingredient-substitutions/",
      description: "What to use when you're missing ingredients",
      type: "reference"
    },
    {
      title: "r/Cooking",
      url: "https://www.reddit.com/r/cooking/",
      description: "Community forum for cooking questions and inspiration",
      type: "community"
    },
    {
      title: "Recipe Calculator",
      url: "https://www.myfooddiary.com/resources/recipe_calculator.asp",
      description: "Calculate nutritional information for your recipes",
      type: "tool"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Utensils className="h-6 w-6 mr-2 text-orange-500" />
          Cooking Basics
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={activeTab === 'learn' ? 'default' : 'outline'}
          className={activeTab === 'learn' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('learn')}
        >
          Learn
        </Button>
        <Button
          variant={activeTab === 'practice' ? 'default' : 'outline'}
          className={activeTab === 'practice' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('practice')}
        >
          Test Your Knowledge
        </Button>
        <Button
          variant={activeTab === 'resources' ? 'default' : 'outline'}
          className={activeTab === 'resources' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </Button>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to Cooking Basics</CardTitle>
              <CardDescription>
                Learning to cook is an essential life skill that promotes health, saves money, and can be a creative outlet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Cooking your own meals is one of the most practical life skills you can develop. It allows you to control what goes into your food, save money compared to eating out, and provides a creative and satisfying activity that you can share with others.
              </p>
              <p className="mb-4">
                In this module, you'll learn essential cooking techniques, knife skills, meal planning, food safety, and how to build flavor in your dishes. Whether you're a complete beginner or looking to expand your skills, these fundamentals will help you become more confident in the kitchen.
              </p>
              <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mb-4">
                <h3 className="font-semibold text-amber-800 mb-2">Coming Soon!</h3>
                <p className="text-amber-700">
                  We're currently developing interactive cooking guides and tutorials. Check back soon for comprehensive cooking basics content!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>5 Essential Cooking Techniques</CardTitle>
              <CardDescription>
                Master these foundational methods to prepare a variety of dishes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">1. Sautéing</h3>
                  <p>Cooking food quickly in a small amount of oil over relatively high heat. Perfect for vegetables, thin cuts of meat, and creating flavorful bases for dishes.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">2. Roasting</h3>
                  <p>Cooking food in an oven with dry heat. Creates delicious caramelization and is ideal for vegetables, chicken, and larger cuts of meat.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">3. Boiling/Simmering</h3>
                  <p>Cooking in water or liquid at different temperatures. Essential for pasta, rice, potatoes, and creating soups and stews.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">4. Steaming</h3>
                  <p>Cooking with the steam from boiling water. Preserves nutrients and is excellent for vegetables, fish, and dumplings.</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-1">5. Baking</h3>
                  <p>Cooking with dry heat in an oven, typically for breads, cakes, and casseroles. Also works well for fish and chicken dishes.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about cooking basics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Cooking Basics"
                difficulty="beginner"
                numberOfQuestions={5}
                onComplete={(results) => {
                  console.log('Quiz results:', results);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <ResourceLinks 
            resources={resources}
            title="Cooking Resources"
            description="Helpful guides, videos, and communities for learning more about cooking"
          />
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}