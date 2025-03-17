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
import CPRGuide from "@/components/cpr-guide";
import FireSafety from "@/components/fire-safety";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Emergency() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Emergency Assistance</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="guides">Emergency Guides</TabsTrigger>
            <TabsTrigger value="fire">Fire Safety</TabsTrigger>
            <TabsTrigger value="cpr">CPR Training</TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent value="fire">
          <FireSafety />
        </TabsContent>

        <TabsContent value="cpr">
          <CPRGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}