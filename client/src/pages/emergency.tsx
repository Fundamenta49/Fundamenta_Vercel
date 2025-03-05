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
import DomesticViolenceHelp from "@/components/domestic-violence-help";
import LegalRightsGuide from "@/components/legal-rights-guide";
import SurvivorStories from "@/components/survivor-stories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Emergency() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Emergency Assistance</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="guides">Emergency Guides</TabsTrigger>
            <TabsTrigger value="cpr">CPR Training</TabsTrigger>
            <TabsTrigger value="safety">Safety Resources</TabsTrigger>
            <TabsTrigger value="legal">Legal Rights</TabsTrigger>
            <TabsTrigger value="stories">Survivor Stories</TabsTrigger>
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

        <TabsContent value="cpr">
          <CPRGuide />
        </TabsContent>

        <TabsContent value="safety">
          <DomesticViolenceHelp />
        </TabsContent>

        <TabsContent value="legal">
          <LegalRightsGuide />
        </TabsContent>

        <TabsContent value="stories">
          <SurvivorStories />
        </TabsContent>
      </Tabs>
    </div>
  );
}