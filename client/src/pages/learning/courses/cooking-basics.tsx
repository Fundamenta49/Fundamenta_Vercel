import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChefHat, Utensils, Book, ArrowLeft, PlayCircle, ShoppingBag } from 'lucide-react';
import RecipeExplorer from '@/components/recipe-explorer';
import KitchenEssentials from '@/components/kitchen-essentials';
import CookingTutorials from '@/components/cooking-tutorials';
import { Link } from 'wouter';

export default function CookingBasics() {
  const [activeTab, setActiveTab] = useState('intro');
  
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="intro" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Introduction
          </TabsTrigger>
          <TabsTrigger value="kitchen-essentials" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Kitchen Tools
          </TabsTrigger>
          <TabsTrigger value="cooking-techniques" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Cooking Tutorials
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Home Cooking Classics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="intro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Cooking Basics</CardTitle>
              <CardDescription>
                Your journey to becoming confident in the kitchen starts here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1024&auto=format&fit=crop"
                  alt="Kitchen with cooking setup"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h2 className="text-white text-xl font-medium">
                    Cooking is a valuable life skill that saves money and improves health
                  </h2>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Why Learn to Cook?</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Save $2,000+ per year</strong> by preparing homemade meals instead of takeout</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Eat healthier</strong> by controlling ingredients, salt, and portion sizes</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Gain independence</strong> and self-sufficiency in your daily life</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Start simple and build</strong> your skills with basic home cooking favorites</span>
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
                      <span>Essential kitchen tools for beginners and how to use them safely</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </div>
                      <span>Basic cooking techniques with step-by-step video tutorials</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </div>
                      <span>Simple home-style recipes like mac & cheese, burgers, and pancakes</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </div>
                      <span>How to find video tutorials for any recipe you want to learn</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="text-lg font-medium mb-2 text-orange-800">Getting Started</h3>
                <p className="text-orange-700 mb-4">
                  This module helps beginners build kitchen confidence with simple, achievable steps. Explore each section to start your cooking journey.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button onClick={() => setActiveTab('kitchen-essentials')} className="bg-orange-500 hover:bg-orange-600">
                    <Utensils className="h-4 w-4 mr-2" />
                    Kitchen Tools
                  </Button>
                  <Button onClick={() => setActiveTab('cooking-techniques')} className="bg-orange-500 hover:bg-orange-600">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Cooking Tutorials
                  </Button>
                  <Button onClick={() => setActiveTab('recipes')} className="bg-orange-500 hover:bg-orange-600">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Home Cooking Classics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kitchen-essentials">
          <Card>
            <CardHeader>
              <CardTitle>Essential Kitchen Tools</CardTitle>
              <CardDescription>
                The basic equipment every beginner cook should have in their kitchen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KitchenEssentials />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cooking-techniques">
          <Card>
            <CardHeader>
              <CardTitle>Cooking Tutorials</CardTitle>
              <CardDescription>
                Step-by-step videos to master basic cooking techniques and simple recipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CookingTutorials />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle>Home Cooking Classics Explorer</CardTitle>
              <CardDescription>
                Discover simple, popular home cooking recipes perfect for beginners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecipeExplorer />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}