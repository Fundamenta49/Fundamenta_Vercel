import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import ResumeBuilder from "@/components/resume-builder";

export default function Career() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career Development</h1>

      <Tabs defaultValue="chat">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Career Coach</TabsTrigger>
          <TabsTrigger value="resume">Resume Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Career AI Coach</CardTitle>
              <CardDescription>
                Get professional guidance for your career journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="career" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <ResumeBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
