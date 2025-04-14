import { useState } from 'react';
import { useLocation } from 'wouter';
import { Wrench, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import RepairAssistant from '@/components/repair-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RepairAssistantPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('repair-tool');

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Wrench className="h-6 w-6 mr-2 text-orange-500" />
          Smart Repair Assistant
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">Diagnose and fix household items with AI-powered repair guidance</h2>
        <p className="text-gray-700 mb-5">
          The Smart Repair Assistant helps you identify and fix broken household items. Simply upload a photo of the 
          broken item, and our AI will analyze it to identify the problem, provide repair instructions, and even help 
          you find replacement parts at nearby stores.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="repair-tool">Repair Tool</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="repair-tool" className="mt-4">
            <RepairAssistant />
          </TabsContent>
          
          <TabsContent value="how-it-works" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 1: Take a Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Take a clear photo of the broken item using your device's camera or upload an existing image from your gallery.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 2: Get Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Our AI analyzes the photo to identify the item, diagnose the problem, and determine what's needed for repair.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 3: Review Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Follow the step-by-step repair instructions provided, complete with the tools and parts you'll need.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Step 4: Find Parts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Check parts availability at nearby stores with pricing information to complete your repair.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2">Tips for Better Results:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Take photos in good lighting with the damaged area clearly visible</li>
                <li>• Include multiple angles if the damage isn't clear from one perspective</li>
                <li>• Make sure the entire item is in frame so the AI can properly identify it</li>
                <li>• For complex repairs, consider professional help if the difficulty is rated "Hard" or "Professional Only"</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setActiveTab('repair-tool')}
              className="mt-4"
            >
              Try the Repair Assistant
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hide Learning Coach button on mobile, show only on SM and larger screens */}
      <div className="mt-8 hidden sm:block">
        <Button 
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-chat', { detail: true }))}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Ask Learning Coach
        </Button>
      </div>
      
      {/* FloatingChat removed to prevent duplicate Fundi robots */}
    </div>
  );
}