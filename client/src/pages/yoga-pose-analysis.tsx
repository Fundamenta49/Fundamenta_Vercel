import React from 'react';
import YogaVision from '@/components/yoga-vision';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import YogaPromptFlow from '@/components/yoga-prompt-flow';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function YogaPoseAnalysisPage() {
  return (
    <div className="w-full h-full mx-auto p-4">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-4">
        Yoga Practice
      </h1>
      
      <Alert variant="default" className="mx-3 sm:mx-5 mb-4 border-blue-500 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800 text-sm">
          Enhance your yoga practice with AI-guided sessions and form analysis. Our AI provides analysis and suggestions to help improve your yoga poses.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="form-analysis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form-analysis">YogaVision</TabsTrigger>
          <TabsTrigger value="guided-sessions">Guided Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form-analysis" className="space-y-4">
          <Card className="shadow-md border-0 overflow-hidden p-0">
            <CardHeader>
              <CardTitle>YogaVision</CardTitle>
              <CardDescription>
                Upload a photo of your yoga pose and receive real-time form feedback from our AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 sm:px-6 py-6">
                <YogaVision />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guided-sessions" className="space-y-4">
          <Card className="shadow-md border-0 overflow-hidden p-0">
            <CardHeader>
              <CardTitle>Personalized Yoga Sessions</CardTitle>
              <CardDescription>
                Discover yoga sessions tailored to your mood, available time, and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 sm:px-6 py-6">
                <YogaPromptFlow />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}