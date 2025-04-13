import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Clock, 
  Sun, 
  Moon, 
  Coffee, 
  Utensils,
  Cloud,
  BookOpen,
  Bell,
  Footprints
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Mindfulness() {
  const [bellTimer, setBellTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeBetweenBells, setTimeBetweenBells] = useState(30); // seconds
  const [bellsEnabled, setBellsEnabled] = useState(false);
  
  const startBells = () => {
    if (bellTimer) clearInterval(bellTimer);
    
    // Play bell immediately
    playBellSound();
    
    // Set interval for future bells
    const timer = setInterval(() => {
      playBellSound();
    }, timeBetweenBells * 1000);
    
    setBellTimer(timer);
    setBellsEnabled(true);
  };
  
  const stopBells = () => {
    if (bellTimer) {
      clearInterval(bellTimer);
      setBellTimer(null);
    }
    setBellsEnabled(false);
  };
  
  const playBellSound = () => {
    // In a real implementation, this would play a bell sound
    console.log("Bell sound played");
  };
  
  const dailyActivities = [
    {
      id: "morning",
      title: "Morning Ritual",
      icon: <Sun className="h-5 w-5 text-primary" />,
      description: "Start your day with presence and intention",
      practices: [
        "Take three deep breaths before getting out of bed",
        "Notice the sensation of water during your morning shower",
        "Eat breakfast without distractions, savoring each bite",
        "Set an intention for the day ahead"
      ]
    },
    {
      id: "work",
      title: "Mindful Work",
      icon: <Clock className="h-5 w-5 text-primary" />,
      description: "Bring awareness to your professional activities",
      practices: [
        "Take a mindful minute between tasks",
        "Notice physical sensations when stress arises",
        "Practice single-tasking rather than multitasking",
        "Use the sound of notifications as a reminder to breathe"
      ]
    },
    {
      id: "eating",
      title: "Mindful Eating",
      icon: <Utensils className="h-5 w-5 text-primary" />,
      description: "Transform your relationship with food",
      practices: [
        "Notice colors, smells, and textures before eating",
        "Put your utensils down between bites",
        "Chew slowly and thoroughly",
        "Express gratitude for your meal"
      ]
    },
    {
      id: "evening",
      title: "Evening Wind-Down",
      icon: <Moon className="h-5 w-5 text-primary" />,
      description: "Transition peacefully to rest",
      practices: [
        "Disconnect from screens an hour before bed",
        "Reflect on three positive moments from your day",
        "Scan your body for tension and consciously relax",
        "Practice gratitude for the day's experiences"
      ]
    }
  ];
  
  const mindfulnessExercises = [
    {
      id: "breathing",
      title: "Mindful Breathing",
      duration: "5 minutes",
      description: "Focus on the natural rhythm of your breath",
      steps: [
        "Find a comfortable seated position",
        "Close your eyes or maintain a soft gaze",
        "Breathe naturally through your nose",
        "Notice the sensation of breath at your nostrils or the rising and falling of your chest",
        "When your mind wanders, gently bring attention back to your breath",
        "Continue for 5 minutes, gradually building to longer periods"
      ]
    },
    {
      id: "walking",
      title: "Walking Meditation",
      duration: "10 minutes",
      description: "Transform walking into a contemplative practice",
      steps: [
        "Choose a quiet path where you can walk back and forth",
        "Stand still and become aware of your body",
        "Begin walking slowly, more deliberately than usual",
        "Pay attention to the lifting, moving, and placing of each foot",
        "Notice the shifting of weight and balance",
        "When your mind wanders, return awareness to the sensations of walking"
      ]
    },
    {
      id: "body-scan",
      title: "Body Scan",
      duration: "15 minutes",
      description: "Develop awareness of physical sensations throughout your body",
      steps: [
        "Lie down in a comfortable position",
        "Bring awareness to your breath for a few moments",
        "Systematically scan through your body from feet to head",
        "Notice sensations without judgment (warmth, coolness, tension, etc.)",
        "If your mind wanders, gently return to the last body part you remember",
        "Complete the practice by being aware of your body as a whole"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Mindfulness Practice</h1>
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="daily">Daily Mindfulness</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="tools">Mindfulness Tools</TabsTrigger>
          <TabsTrigger value="resources">Learning Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          <p className="text-lg max-w-3xl">
            Mindfulness isn't just for meditation cushions - it can be integrated into your
            everyday activities. Here are practices to help you be more present throughout your day.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyActivities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {activity.icon}
                    {activity.title}
                  </CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activity.practices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Leaf className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="exercises" className="space-y-6">
          <p className="text-lg max-w-3xl mb-6">
            These structured mindfulness exercises can help you develop your practice. 
            Start with shorter sessions and gradually build your capacity for sustained attention.
          </p>
          
          {mindfulnessExercises.map((exercise) => (
            <Card key={exercise.id} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {exercise.id === "breathing" && <Cloud className="h-5 w-5 text-primary" />}
                  {exercise.id === "walking" && <Footprints className="h-5 w-5 text-primary" />}
                  {exercise.id === "body-scan" && <Leaf className="h-5 w-5 text-primary" />}
                  {exercise.title}
                </CardTitle>
                <CardDescription>
                  Duration: {exercise.duration} | {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  {exercise.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </CardContent>
              <CardFooter>
                <Button>Start Guided {exercise.title}</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Mindfulness Bells
              </CardTitle>
              <CardDescription>
                Periodic bells can remind you to pause and return to the present moment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">Bell frequency:</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTimeBetweenBells(30)}
                      className={timeBetweenBells === 30 ? "bg-primary/10" : ""}
                    >
                      30s
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTimeBetweenBells(60)}
                      className={timeBetweenBells === 60 ? "bg-primary/10" : ""}
                    >
                      1m
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTimeBetweenBells(300)}
                      className={timeBetweenBells === 300 ? "bg-primary/10" : ""}
                    >
                      5m
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTimeBetweenBells(900)}
                      className={timeBetweenBells === 900 ? "bg-primary/10" : ""}
                    >
                      15m
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {!bellsEnabled ? (
                    <Button onClick={startBells} className="w-full md:w-auto">
                      Start Mindfulness Bells
                    </Button>
                  ) : (
                    <Button onClick={stopBells} variant="destructive" className="w-full md:w-auto">
                      Stop Bells
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground text-center">
                  When you hear the bell, pause and take three mindful breaths
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                One-Minute Mindfulness
              </CardTitle>
              <CardDescription>
                Quick practices for busy moments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Even a minute of mindfulness can reset your nervous system and bring you back to the present.
                  Try these quick practices throughout your day:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>STOP Practice:</strong> Stop, Take a breath, Observe (thoughts, feelings, sensations), Proceed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>3-3-3:</strong> Name 3 things you see, 3 things you hear, and 3 sensations in your body</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Hand Breathing:</strong> Trace your fingers with your breath - inhale up, exhale down</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Recommended Books
                </h3>
                <ul className="space-y-3">
                  <li>
                    <strong>Wherever You Go, There You Are</strong> by Jon Kabat-Zinn
                    <p className="text-sm text-muted-foreground">A classic introduction to mindfulness meditation</p>
                  </li>
                  <li>
                    <strong>The Miracle of Mindfulness</strong> by Thich Nhat Hanh
                    <p className="text-sm text-muted-foreground">Gentle guidance on mindfulness practice from a Zen master</p>
                  </li>
                  <li>
                    <strong>Mindfulness in Plain English</strong> by Bhante Gunaratana
                    <p className="text-sm text-muted-foreground">Clear, straightforward instructions for meditation practice</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Online Courses</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-primary hover:underline">Mindfulness-Based Stress Reduction (MBSR) Online</a>
                    <p className="text-sm text-muted-foreground">The gold standard 8-week program for developing mindfulness</p>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline">Mindful Self-Compassion</a>
                    <p className="text-sm text-muted-foreground">Learn to respond to difficult emotions with kindness</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Apps</h3>
                <ul className="space-y-3">
                  <li>
                    <strong>Headspace:</strong> Guided meditations and mindfulness exercises
                  </li>
                  <li>
                    <strong>Insight Timer:</strong> Free library of guided meditations and timer
                  </li>
                  <li>
                    <strong>Calm:</strong> Sleep stories, meditations, and relaxing music
                  </li>
                  <li>
                    <strong>Waking Up:</strong> Meditation and mindfulness guidance with a philosophical approach
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Research</h3>
                <p className="mb-3">
                  Mindfulness practices have been extensively studied and shown to provide benefits including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reduced stress and anxiety</li>
                  <li>Improved attention and focus</li>
                  <li>Better emotional regulation</li>
                  <li>Enhanced immune function</li>
                  <li>Increased self-awareness</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}