import React, { useState, useEffect, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  Moon, 
  Sun, 
  Wind, 
  Heart,
  Clock,
  Sparkles
} from "lucide-react";

export default function Meditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Reset time remaining when duration changes
    setTimeRemaining(duration);
    setProgress(100);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
  }, [duration]);

  useEffect(() => {
    return () => {
      // Clean up timer on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsPlaying(true);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setIsPlaying(false);
          return 0;
        }
        
        const newTime = prev - 1;
        setProgress((newTime / duration) * 100);
        return newTime;
      });
    }, 1000);
  };

  const pauseMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
  };

  const resetMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
    setTimeRemaining(duration);
    setProgress(100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDurationChange = (newValue: number[]) => {
    // Convert minutes to seconds
    setDuration(newValue[0] * 60);
  };

  const meditationTypes = [
    {
      id: "mindfulness",
      title: "Mindfulness Meditation",
      description: "Focus on your breath and present moment awareness",
      icon: <Wind className="h-5 w-5 text-primary" />,
      duration: 5,
    },
    {
      id: "loving-kindness",
      title: "Loving-Kindness Meditation",
      description: "Cultivate feelings of goodwill, kindness, and warmth towards others",
      icon: <Heart className="h-5 w-5 text-primary" />,
      duration: 10,
    },
    {
      id: "body-scan",
      title: "Body Scan Meditation",
      description: "Progressively focus on different parts of your body to release tension",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      duration: 15,
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Meditation Guide</h1>
      
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="guided">Guided Meditations</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Meditation Timer
              </CardTitle>
              <CardDescription>
                Set your meditation duration and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Duration: {duration / 60} minutes</h3>
                  <Slider
                    defaultValue={[duration / 60]}
                    max={60}
                    min={1}
                    step={1}
                    onValueChange={handleDurationChange}
                    disabled={isPlaying}
                  />
                </div>
                
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-4xl font-bold mb-4">{formatTime(timeRemaining)}</div>
                  <Progress value={progress} className="w-full max-w-md mb-6" />
                  
                  <div className="flex gap-4">
                    {!isPlaying ? (
                      <Button onClick={startMeditation} className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseMeditation} variant="outline" className="flex items-center gap-2">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetMeditation} variant="ghost" className="flex items-center gap-2">
                      <SkipBack className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  {isPlaying ? "Find a comfortable position and breathe naturally..." : "Ready to begin your meditation practice?"}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ambient Sounds</CardTitle>
              <CardDescription>
                Enhance your meditation practice with calming background sounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center gap-2">
                  <Moon className="h-5 w-5" />
                  <span>Rain</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center gap-2">
                  <Wind className="h-5 w-5" />
                  <span>White Noise</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center gap-2">
                  <Sun className="h-5 w-5" />
                  <span>Forest</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guided" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationTypes.map((meditation) => (
              <Card key={meditation.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {meditation.icon}
                    {meditation.title}
                  </CardTitle>
                  <CardDescription>{meditation.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-sm mb-4">
                    <span className="text-muted-foreground">Duration: </span>
                    <span>{meditation.duration} minutes</span>
                  </div>
                  <div className="mt-auto">
                    <Button className="w-full">Start Guided Meditation</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Meditation?</CardTitle>
              <CardDescription>An introduction to the practice and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Meditation is a practice where an individual uses a technique – such as mindfulness, 
                or focusing the mind on a particular object, thought, or activity – to train attention 
                and awareness, and achieve a mentally clear and emotionally calm and stable state.
              </p>
              <p className="mb-4">
                Regular meditation practice has been shown to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Reduce stress and anxiety</li>
                <li>Improve focus and concentration</li>
                <li>Enhance self-awareness</li>
                <li>Promote emotional health</li>
                <li>Improve sleep quality</li>
                <li>Help manage pain</li>
                <li>Lower blood pressure</li>
              </ul>
              <p>
                Start with just a few minutes each day and gradually increase your practice time 
                as you become more comfortable with the techniques.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Beginner's Guide</CardTitle>
              <CardDescription>How to start your meditation practice</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Find a quiet space</strong>
                  <p className="text-muted-foreground">Choose a location where you won't be disturbed for the duration of your meditation session.</p>
                </li>
                <li>
                  <strong>Get comfortable</strong>
                  <p className="text-muted-foreground">Sit in a position that allows you to be both alert and relaxed. You can sit on a chair, cushion, or mat.</p>
                </li>
                <li>
                  <strong>Set a time limit</strong>
                  <p className="text-muted-foreground">Start with 5 minutes and work your way up as you become more comfortable with the practice.</p>
                </li>
                <li>
                  <strong>Focus on your breath</strong>
                  <p className="text-muted-foreground">Pay attention to the sensation of your breath as it enters and leaves your body.</p>
                </li>
                <li>
                  <strong>Notice when your mind wanders</strong>
                  <p className="text-muted-foreground">When you notice your thoughts wandering, gently bring your attention back to your breath.</p>
                </li>
                <li>
                  <strong>Be kind to yourself</strong>
                  <p className="text-muted-foreground">Don't judge yourself for having thoughts. This is normal. Just return to your breath.</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}