import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import NutritionGuide from "@/components/nutrition-guide";
import NutritionTracker from "@/components/nutrition-tracker";
import ShoppingBuddy from "@/components/shopping-buddy";

export default function Wellness() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Wellness & Nutrition</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Wellness Coach</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Guide</TabsTrigger>
            <TabsTrigger value="tracker">Food Tracker</TabsTrigger>
            <TabsTrigger value="shopping">Shopping Buddy</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Wellness AI Coach</CardTitle>
              <CardDescription>
                Get guidance for mental health, well-being, and nutrition
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ChatInterface category="wellness" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <NutritionGuide />
        </TabsContent>

        <TabsContent value="tracker">
          <NutritionTracker />
        </TabsContent>

        <TabsContent value="shopping">
          <ShoppingBuddy />
        </TabsContent>
      </Tabs>
    </div>
  );
}