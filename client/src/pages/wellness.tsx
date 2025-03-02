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

export default function Wellness() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Wellness Support</h1>

      <Tabs defaultValue="chat">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Wellness Coach</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Wellness AI Coach</CardTitle>
              <CardDescription>
                Get guidance for mental health and well-being
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="wellness" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meditation">
          <MeditationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
