import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import MeditationGuide from "@/components/meditation-guide";
import NutritionGuide from "@/components/nutrition-guide";
import ShoppingBuddy from "@/components/shopping-buddy";

export default function Wellness() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Wellness & Nutrition</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">Wellness Coach</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="shopping">Shopping Buddy</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Wellness AI Coach</CardTitle>
              <CardDescription>
                Get guidance for mental health, well-being, and nutrition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="wellness" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <NutritionGuide />
        </TabsContent>

        <TabsContent value="shopping">
          <ShoppingBuddy />
        </TabsContent>

        <TabsContent value="meditation">
          <MeditationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}