import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import RiasecTest from "@/components/career-interest-assessment";
import { Book, Brain } from "lucide-react";

export default function Learning() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning & Development</h1>

      <Tabs defaultValue="assessment">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="assessment">Career Assessment</TabsTrigger>
            <TabsTrigger value="chat">AI Learning Coach</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assessment">
          <RiasecTest />
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Learning AI Coach</CardTitle>
              <CardDescription>
                Get personalized guidance for your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="learning" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}