import { useState } from 'react';
import { useLocation } from 'wouter';
import { Utensils, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import SimpleResourceLinks, { SimpleResource } from '@/components/simple-resource-links';

export default function CookingBasicsCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to cooking basics
  const resources: SimpleResource[] = [
    {
      title: "Cooking Techniques 101",
      url: "https://www.seriouseats.com/cooking-techniques-how-tos",
      description: "Essential cooking methods every home cook should know"
    },
    {
      title: "Beginner Cooking Videos",
      url: "https://www.youtube.com/c/foodwishes",
      description: "Step-by-step visual guides for cooking basics"
    },
    {
      title: "Ingredient Substitutions Guide",
      url: "https://www.allrecipes.com/article/common-ingredient-substitutions/",
      description: "What to use when you're missing ingredients"
    },
    {
      title: "r/Cooking",
      url: "https://www.reddit.com/r/cooking/",
      description: "Community forum for cooking questions and inspiration"
    },
    {
      title: "Recipe Calculator",
      url: "https://www.myfooddiary.com/resources/recipe_calculator.asp",
      description: "Calculate nutritional information for your recipes"
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
                questions={[
                  {
                    id: 1,
                    question: "What cooking method involves quickly cooking food in a small amount of oil over high heat?",
                    options: [
                      "Boiling", 
                      "Sautéing", 
                      "Steaming", 
                      "Braising"
                    ],
                    correctAnswer: 1,
                    explanation: "Sautéing involves cooking food quickly in a small amount of oil over relatively high heat, usually in a pan or skillet. It's perfect for cooking vegetables, thin cuts of meat, and creating flavor bases for dishes."
                  },
                  {
                    id: 2,
                    question: "Which knife is considered the most essential for general kitchen tasks?",
                    options: [
                      "Paring knife", 
                      "Bread knife", 
                      "Chef's knife", 
                      "Boning knife"
                    ],
                    correctAnswer: 2,
                    explanation: "The chef's knife (also called a cook's knife) is the most versatile and essential knife in the kitchen. Its curved blade allows for a rocking motion that makes chopping, dicing, and mincing efficient."
                  },
                  {
                    id: 3,
                    question: "What is the purpose of 'mise en place' in cooking?",
                    options: [
                      "A French plating technique", 
                      "Preparing and organizing ingredients before cooking", 
                      "Cleaning as you cook", 
                      "Pairing wine with food"
                    ],
                    correctAnswer: 1,
                    explanation: "Mise en place is a French culinary phrase meaning 'everything in its place.' It refers to organizing and preparing all ingredients before you start cooking, which makes the cooking process more efficient and less stressful."
                  },
                  {
                    id: 4,
                    question: "What is the minimum safe internal temperature for cooking chicken?",
                    options: [
                      "145°F (63°C)", 
                      "160°F (71°C)", 
                      "165°F (74°C)", 
                      "180°F (82°C)"
                    ],
                    correctAnswer: 2,
                    explanation: "Chicken must reach an internal temperature of 165°F (74°C) to be considered safe to eat. This temperature kills harmful bacteria like Salmonella. Always use a food thermometer to check."
                  },
                  {
                    id: 5,
                    question: "Which of these is NOT a mother sauce in classical French cuisine?",
                    options: [
                      "Béchamel", 
                      "Velouté", 
                      "Mayonnaise", 
                      "Espagnole"
                    ],
                    correctAnswer: 2,
                    explanation: "The five mother sauces in classical French cuisine are Béchamel, Velouté, Espagnole, Hollandaise, and Tomato. Mayonnaise is considered a cold emulsion sauce, not a mother sauce."
                  },
                  {
                    id: 6,
                    question: "Which cooking method best retains the nutrients in vegetables?",
                    options: [
                      "Deep frying", 
                      "Steaming", 
                      "Boiling", 
                      "Grilling"
                    ],
                    correctAnswer: 1,
                    explanation: "Steaming preserves the most nutrients in vegetables because it minimizes the contact between the food and water, which can leach out water-soluble vitamins. It's a gentle cooking method that maintains texture, color, and nutritional value."
                  },
                  {
                    id: 7,
                    question: "What does it mean to 'blanch' vegetables?",
                    options: [
                      "Cook them until completely soft", 
                      "Briefly cook them in boiling water, then cool them in ice water", 
                      "Marinate them in vinegar solution", 
                      "Bake them with a bread crumb coating"
                    ],
                    correctAnswer: 1,
                    explanation: "Blanching is a cooking technique that involves briefly immersing food (usually vegetables) in boiling water followed by rapid cooling in ice water. This process helps preserve color, texture, and nutritional value, especially before freezing vegetables."
                  },
                  {
                    id: 8,
                    question: "What is the purpose of letting meat 'rest' after cooking?",
                    options: [
                      "To cool it to a safe temperature", 
                      "To allow the bacteria on the surface to die", 
                      "To allow juices to redistribute throughout the meat", 
                      "To soften tough connective tissues"
                    ],
                    correctAnswer: 2,
                    explanation: "Resting meat allows the juices, which have been driven to the center during cooking, to redistribute throughout the meat. This results in a juicier, more flavorful final product that's easier to slice without losing moisture."
                  },
                  {
                    id: 9,
                    question: "Which cooking oil has the highest smoke point, making it best for high-heat cooking?",
                    options: [
                      "Extra virgin olive oil", 
                      "Butter", 
                      "Avocado oil", 
                      "Sesame oil"
                    ],
                    correctAnswer: 2,
                    explanation: "Avocado oil has one of the highest smoke points (around 520°F/270°C) among cooking oils, making it excellent for high-heat cooking methods like searing and frying. Extra virgin olive oil and butter have relatively low smoke points and are better for low to medium-heat cooking or finishing dishes."
                  },
                  {
                    id: 10,
                    question: "What is the difference between baking powder and baking soda?",
                    options: [
                      "They're different names for the same ingredient", 
                      "Baking powder contains baking soda plus an acidic component", 
                      "Baking soda is stronger but expires more quickly", 
                      "Baking powder is for desserts while baking soda is for bread"
                    ],
                    correctAnswer: 1,
                    explanation: "Baking powder is a complete leavening agent that contains baking soda (sodium bicarbonate) plus an acidic component (usually cream of tartar) and sometimes a moisture-absorbing starch. Baking soda needs an acidic ingredient in the recipe to activate, while baking powder can work with just moisture and heat."
                  }
                ]}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Cooking Basics Resources</CardTitle>
              <CardDescription>Curated resources to help master these skills</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleResourceLinks 
                resources={resources}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}