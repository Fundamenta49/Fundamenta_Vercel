import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Camera, Dumbbell, Trophy } from 'lucide-react';
import YogaProgression from '@/components/yoga-progression';
import YogaVisionEnhanced from '@/components/yoga-vision-enhanced';
import { YogaProgressionProvider } from '../contexts/yoga-progression-context';

export default function YogaProgressionPage() {
  const [selectedPoseId, setSelectedPoseId] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [activeTab, setActiveTab] = useState("progression");
  
  const handlePracticeClick = (poseId: string) => {
    setSelectedPoseId(poseId);
    setShowCamera(true);
  };
  
  const handleCloseCamera = () => {
    setShowCamera(false);
  };
  
  return (
    <YogaProgressionProvider>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <a href="/active">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yoga Journey</h1>
            <p className="text-muted-foreground">Track your progress and master poses with YogaVision AI</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="progression" className="flex gap-2 items-center">
                <Trophy size={16} />
                Progression
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex gap-2 items-center">
                <Dumbbell size={16} />
                Practice
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex gap-2 items-center">
                <Camera size={16} />
                YogaVision
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="progression" className="space-y-4">
            <YogaProgression />
          </TabsContent>
          
          <TabsContent value="practice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yoga Practice</CardTitle>
                <CardDescription>
                  Guided practice sessions with real-time feedback and correction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <img 
                        src="/images/yoga/beginners.jpg" 
                        alt="Beginners Flow"
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Beginner's Flow</h3>
                      <p className="text-sm text-muted-foreground">A gentle 15-minute routine for newcomers</p>
                      <div className="flex mt-3 gap-2">
                        <Button size="sm" className="w-full">Start Practice</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <img 
                        src="/images/yoga/strength.jpg" 
                        alt="Strength Builder"
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Strength Builder</h3>
                      <p className="text-sm text-muted-foreground">Build core strength with this 20-minute flow</p>
                      <div className="flex mt-3 gap-2">
                        <Button size="sm" className="w-full">Start Practice</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center">
                      <img 
                        src="/images/yoga/flexibility.jpg" 
                        alt="Flexibility Focus"
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Flexibility Focus</h3>
                      <p className="text-sm text-muted-foreground">Improve flexibility with deep stretches</p>
                      <div className="flex mt-3 gap-2">
                        <Button size="sm" className="w-full">Start Practice</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vision" className="space-y-4">
            <YogaVisionEnhanced />
          </TabsContent>
        </Tabs>
        
        {/* YogaVision Dialog */}
        <Dialog open={showCamera} onOpenChange={setShowCamera}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>YogaVision Analysis</DialogTitle>
              <DialogDescription>
                Get detailed form feedback on your yoga pose
              </DialogDescription>
            </DialogHeader>
            
            {selectedPoseId && (
              <YogaVisionEnhanced 
                initialPoseId={selectedPoseId}
                onClose={handleCloseCamera}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </YogaProgressionProvider>
  );
}