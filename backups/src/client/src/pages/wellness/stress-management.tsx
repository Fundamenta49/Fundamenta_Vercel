import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Wind, Clock, Heart, BarChart2 } from "lucide-react";

export default function StressManagement() {
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [breathingState, setBreathingState] = useState<"inhale" | "hold" | "exhale" | "rest" | "inactive">("inactive");
  const [breathingTimer, setBreathingTimer] = useState<NodeJS.Timeout | null>(null);
  
  const startBreathingExercise = () => {
    if (breathingTimer) clearInterval(breathingTimer);
    setBreathingState("inhale");
    setBreathingProgress(0);
    
    let progress = 0;
    let currentState: "inhale" | "hold" | "exhale" | "rest" = "inhale";
    let stateTime = 0;
    
    const timer = setInterval(() => {
      progress += 1;
      stateTime += 1;
      
      // State transitions based on timing
      if (currentState === "inhale" && stateTime >= 4) {
        currentState = "hold";
        stateTime = 0;
      } else if (currentState === "hold" && stateTime >= 7) {
        currentState = "exhale";
        stateTime = 0;
      } else if (currentState === "exhale" && stateTime >= 8) {
        currentState = "rest";
        stateTime = 0;
      } else if (currentState === "rest" && stateTime >= 4) {
        currentState = "inhale";
        stateTime = 0;
        
        // One complete cycle
        if (progress >= 92) {  // 4+7+8+4 seconds = 23 seconds per cycle, 4 cycles = 92 seconds
          clearInterval(timer);
          setBreathingState("inactive");
          setBreathingProgress(100);
          return;
        }
      }
      
      setBreathingState(currentState);
      setBreathingProgress(Math.min((progress / 92) * 100, 100));
    }, 1000);
    
    setBreathingTimer(timer);
  };
  
  const stopBreathingExercise = () => {
    if (breathingTimer) {
      clearInterval(breathingTimer);
      setBreathingTimer(null);
    }
    setBreathingState("inactive");
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Stress Management</h1>
      
      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="exercises">Breathing Exercises</TabsTrigger>
          <TabsTrigger value="relaxation">Relaxation Techniques</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive Strategies</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wind className="mr-2 h-5 w-5 text-primary" />
                4-7-8 Breathing Technique
              </CardTitle>
              <CardDescription>
                A powerful relaxation technique that can help reduce anxiety, manage stress, and improve sleep.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="mb-4">This breathing pattern is designed to reduce anxiety by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Inhale quietly through your nose for 4 seconds</li>
                  <li>Hold your breath for 7 seconds</li>
                  <li>Exhale completely through your mouth for 8 seconds</li>
                  <li>Repeat the cycle 4 times</li>
                </ul>
              </div>
              
              {breathingState !== "inactive" && (
                <div className="mb-6 py-4 px-6 bg-muted rounded-lg text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    {breathingState === "inhale" && "Inhale"}
                    {breathingState === "hold" && "Hold"}
                    {breathingState === "exhale" && "Exhale"}
                    {breathingState === "rest" && "Rest"}
                  </h3>
                  <p className="text-muted-foreground">
                    {breathingState === "inhale" && "Breathe in slowly through your nose..."}
                    {breathingState === "hold" && "Hold your breath..."}
                    {breathingState === "exhale" && "Exhale completely through your mouth..."}
                    {breathingState === "rest" && "Prepare for next breath..."}
                  </p>
                  <Progress value={breathingProgress} className="mt-4" />
                </div>
              )}
              
              <div className="flex gap-4 justify-center">
                {breathingState === "inactive" ? (
                  <Button onClick={startBreathingExercise}>Start Exercise</Button>
                ) : (
                  <Button variant="destructive" onClick={stopBreathingExercise}>
                    Stop Exercise
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Box Breathing
              </CardTitle>
              <CardDescription>
                A technique used by Navy SEALs to stay calm and focused in stressful situations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Equal-duration breathing for 4 counts each: inhale, hold, exhale, hold. Helps regulate the autonomic nervous system.</p>
              <Button variant="outline" className="mt-4">Learn Box Breathing</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="relaxation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Progressive Muscle Relaxation
              </CardTitle>
              <CardDescription>
                Systematically tense and relax different muscle groups to reduce overall tension.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This proven technique helps release physical tension that accumulates during stressful situations:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Find a quiet, comfortable place to sit or lie down</li>
                <li>Starting with your feet, tense the muscles as tightly as possible for 5 seconds</li>
                <li>Relax the muscles and notice the tension flowing away</li>
                <li>Continue this pattern, working up through your body</li>
              </ol>
              <Button className="mt-6">Start Guided Exercise</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cognitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                Cognitive Reframing
              </CardTitle>
              <CardDescription>
                Learn to identify negative thought patterns and transform them into balanced perspectives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This powerful cognitive behavioral therapy technique helps you challenge distorted thoughts and replace them with more realistic ones.</p>
              <div className="mt-4 space-y-4">
                <h4 className="font-medium">Common Cognitive Distortions:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Catastrophizing:</strong> Anticipating the worst possible outcome</li>
                  <li><strong>Black-and-white thinking:</strong> Seeing situations in absolute terms</li>
                  <li><strong>Overgeneralization:</strong> Applying one negative experience to all situations</li>
                  <li><strong>Mind reading:</strong> Assuming you know what others are thinking</li>
                </ul>
              </div>
              <Button className="mt-6">Try Reframing Exercise</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li><a href="#" className="text-primary hover:underline">Why Zebras Don't Get Ulcers by Robert Sapolsky</a></li>
                  <li><a href="#" className="text-primary hover:underline">The Relaxation Response by Herbert Benson</a></li>
                  <li><a href="#" className="text-primary hover:underline">Full Catastrophe Living by Jon Kabat-Zinn</a></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Helpful Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li><a href="#" className="text-primary hover:underline">Headspace: Guided meditation and mindfulness</a></li>
                  <li><a href="#" className="text-primary hover:underline">Calm: Sleep stories and relaxation techniques</a></li>
                  <li><a href="#" className="text-primary hover:underline">Insight Timer: Free meditation timer and community</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}