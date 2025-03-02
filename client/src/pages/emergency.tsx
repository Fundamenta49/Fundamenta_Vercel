import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatInterface from "@/components/chat-interface";
import EmergencyGuide from "@/components/emergency-guide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Emergency() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Emergency Assistance</h1>
      
      <Tabs defaultValue="chat">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          <TabsTrigger value="guides">Emergency Guides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Emergency AI Assistant</CardTitle>
              <CardDescription>
                Get immediate guidance for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="emergency" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides">
          <EmergencyGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
