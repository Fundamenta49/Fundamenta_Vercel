import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, BookOpen, HeartPulse, UserCog, ShieldCheck, Lightbulb, PlayCircle, CheckCircle, Clock } from 'lucide-react';

// Resilience strategies
const RESILIENCE_STRATEGIES = [
  {
    id: 'mindfulness',
    title: 'Mindfulness Practice',
    description: 'Techniques to stay present and manage workplace stress',
    icon: <Brain className="h-8 w-8" />,
    practiceTime: '5-10 min',
    exercises: [
      {
        id: 'breathing',
        title: 'Deep Breathing Exercise',
        description: 'A simple breathing technique to reduce stress and increase focus',
        duration: '3 min',
        steps: [
          'Find a quiet, comfortable place to sit or stand',
          'Breathe in slowly through your nose for a count of 4',
          'Hold your breath for a count of 2',
          'Exhale slowly through your mouth for a count of 6',
          'Repeat for 3 minutes, focusing only on your breath'
        ]
      },
      {
        id: 'body-scan',
        title: 'Body Scan Meditation',
        description: 'A practice to notice tension in your body and release it',
        duration: '5 min',
        steps: [
          'Sit or lie down in a comfortable position',
          'Close your eyes and take a few deep breaths',
          'Bring awareness to your feet, noticing any sensations',
          'Slowly move your attention up through your body: legs, hips, back, chest, arms, shoulders, neck, and head',
          'Notice any areas of tension and consciously release them'
        ]
      }
    ]
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    description: 'Developing awareness and management of emotions',
    icon: <HeartPulse className="h-8 w-8" />,
    practiceTime: '10-15 min',
    exercises: [
      {
        id: 'emotion-labeling',
        title: 'Emotion Labeling Practice',
        description: 'Improve your ability to identify and name emotions',
        duration: '5 min',
        steps: [
          "Take a moment to check in with yourself",
          "Notice what emotions you're feeling right now",
          'Try to name these emotions with specific labels (e.g., "frustrated" instead of just "bad")',
          'Consider what might be causing these emotions',
          'Write down your observations in a journal'
        ]
      },
      {
        id: 'trigger-identification',
        title: 'Emotional Trigger Identification',
        description: 'Learn to recognize situations that provoke strong emotional responses',
        duration: '10 min',
        steps: [
          'Think of a recent situation where you felt a strong negative emotion',
          'Describe the situation in detail',
          'Identify the specific trigger that sparked your emotional response',
          'Notice patterns across different situations',
          'Consider alternative ways to respond to these triggers in the future'
        ]
      }
    ]
  },
  {
    id: 'resilience-building',
    title: 'Resilience Building',
    description: 'Practices to strengthen your ability to bounce back',
    icon: <ShieldCheck className="h-8 w-8" />,
    practiceTime: '15-20 min',
    exercises: [
      {
        id: 'reframing',
        title: 'Cognitive Reframing Exercise',
        description: 'Practice looking at challenges from different perspectives',
        duration: '10 min',
        steps: [
          'Identify a current workplace challenge or setback',
          'Write down your initial thoughts and feelings about it',
          'Challenge negative interpretations: "Is this really true? What evidence do I have?"',
          'Generate alternative perspectives: "How else could I view this situation?"',
          'Identify potential opportunities or lessons in this challenge'
        ]
      },
      {
        id: 'strengths-focus',
        title: 'Personal Strengths Inventory',
        description: 'Build resilience by focusing on your capabilities',
        duration: '15 min',
        steps: [
          'List 10 personal strengths or skills you possess',
          "Recall specific times when you've used these strengths effectively",
          'Consider how these strengths can help you overcome current challenges',
          'Identify one strength you can intentionally apply today',
          'Plan how to further develop your key strengths'
        ]
      }
    ]
  },
  {
    id: 'workplace-boundaries',
    title: 'Workplace Boundaries',
    description: 'Setting healthy limits to prevent burnout',
    icon: <UserCog className="h-8 w-8" />,
    practiceTime: '10-15 min',
    exercises: [
      {
        id: 'boundary-setting',
        title: 'Boundary Setting Practice',
        description: 'Learn to establish and communicate healthy work boundaries',
        duration: '10 min',
        steps: [
          'Identify areas where you need stronger boundaries at work',
          'Clarify what specific boundaries would support your wellbeing',
          "Practice how you'll communicate these boundaries clearly and respectfully",
          'Anticipate potential resistance and plan your response',
          'Set small, achievable goals for implementing new boundaries'
        ]
      },
      {
        id: 'workday-structure',
        title: 'Structured Workday Planning',
        description: 'Design your workday to support wellbeing and productivity',
        duration: '15 min',
        steps: [
          'Map out an ideal workday schedule that includes breaks',
          'Identify your most productive hours and plan challenging work during that time',
          'Schedule specific times to check email rather than constantly monitoring it',
          'Plan a clear end to your workday with a shutdown ritual',
          'Identify small changes you can implement immediately'
        ]
      }
    ]
  }
];

// EQ assessment questions
const EQ_ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "I can recognize my emotions as I experience them",
    category: "self-awareness"
  },
  {
    id: 2,
    question: "I lose my temper when I feel frustrated",
    category: "self-regulation",
    reverse: true
  },
  {
    id: 3,
    question: "I can calm myself down when I'm upset",
    category: "self-regulation"
  },
  {
    id: 4,
    question: "I find it difficult to understand why people feel the way they do",
    category: "empathy",
    reverse: true
  },
  {
    id: 5,
    question: "I can sense how others are feeling even when they don't tell me",
    category: "empathy"
  }
];

export default function EmotionalResilience() {
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  // Get selected strategy and exercise details
  const strategyDetails = RESILIENCE_STRATEGIES.find(s => s.id === selectedStrategy);
  const exerciseDetails = strategyDetails?.exercises.find(e => e.id === selectedExercise);
  
  // Mark exercise as complete
  const completeExercise = () => {
    if (exerciseDetails && !completedExercises.includes(exerciseDetails.id)) {
      setCompletedExercises([...completedExercises, exerciseDetails.id]);
    }
    setExerciseStep(0);
    setSelectedExercise(null);
  };
  
  // Start exercise
  const startExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setExerciseStep(1);
  };
  
  // Next exercise step
  const nextStep = () => {
    if (exerciseDetails && exerciseStep < exerciseDetails.steps.length) {
      setExerciseStep(exerciseStep + 1);
    } else {
      completeExercise();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Emotional Intelligence & Resilience</h2>
          <p className="text-muted-foreground">
            Build your emotional intelligence and resilience for workplace success
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="learn">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn
          </TabsTrigger>
          <TabsTrigger value="practice">
            <Brain className="h-4 w-4 mr-2" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="progress">
            <CheckCircle className="h-4 w-4 mr-2" />
            My Progress
          </TabsTrigger>
        </TabsList>
        
        {/* Learn Tab */}
        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Why Emotional Intelligence Matters</CardTitle>
              <CardDescription>
                Understanding emotional intelligence and its impact on workplace success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Emotional Intelligence?</h3>
                  <p className="text-muted-foreground mb-3">
                    Emotional intelligence (EQ) is the ability to recognize, understand, and manage our own emotions,
                    as well as recognize, understand and influence the emotions of others.
                  </p>
                  <p className="text-muted-foreground">
                    It plays a critical role in how we navigate workplace relationships, handle stress,
                    and make decisions. Research shows that EQ is often a stronger predictor of success than IQ.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">The Four Components of EQ</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Self-Awareness</AccordionTrigger>
                      <AccordionContent>
                        The ability to recognize and understand your own emotions, their triggers,
                        and their impact on your behavior and performance. This includes understanding your
                        strengths, weaknesses, and values.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Self-Management</AccordionTrigger>
                      <AccordionContent>
                        The ability to regulate your emotions, especially in stressful situations.
                        This includes managing impulses, adapting to change, and maintaining a positive outlook.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Social Awareness</AccordionTrigger>
                      <AccordionContent>
                        The ability to understand others' emotions, concerns, and needs. This includes
                        empathy, organizational awareness, and service orientation.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Relationship Management</AccordionTrigger>
                      <AccordionContent>
                        The ability to influence, inspire, and develop others while managing conflict.
                        This includes leadership, collaboration, and effective communication.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Benefits in the Workplace</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Better conflict resolution and negotiation skills</li>
                      <li>Improved leadership effectiveness</li>
                      <li>Enhanced communication and relationship building</li>
                      <li>Greater resilience during challenges and changes</li>
                      <li>Reduced workplace stress and anxiety</li>
                      <li>More effective teamwork and collaboration</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How to Develop Emotional Intelligence</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Practice mindfulness and self-reflection</li>
                      <li>Seek feedback from trusted colleagues</li>
                      <li>Keep an emotion journal to identify patterns</li>
                      <li>Learn to recognize your emotional triggers</li>
                      <li>Practice active listening and empathy</li>
                      <li>Develop stress management techniques</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('practice')}>
                Start Practicing EQ Skills
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Practice Tab */}
        <TabsContent value="practice" className="space-y-6">
          {!selectedStrategy ? (
            // Show strategy selection
            <div className="grid gap-6 sm:grid-cols-2">
              {RESILIENCE_STRATEGIES.map(strategy => (
                <Card key={strategy.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="p-2 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-2">
                      {strategy.icon}
                    </div>
                    <CardTitle>{strategy.title}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Practice time: {strategy.practiceTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => setSelectedStrategy(strategy.id)}
                    >
                      Explore Exercises
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : !selectedExercise ? (
            // Show exercises for selected strategy
            <div className="space-y-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedStrategy(null)}
                  className="mr-2"
                >
                  ← Back to All Strategies
                </Button>
                <h3 className="text-xl font-bold">{strategyDetails?.title}</h3>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {strategyDetails?.exercises.map(exercise => (
                  <Card key={exercise.id} className={completedExercises.includes(exercise.id) ? "border-green-200" : ""}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        {completedExercises.includes(exercise.id) && (
                          <div className="bg-green-100 text-green-800 p-1 rounded-full">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Duration: {exercise.duration}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => startExercise(exercise.id)}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Exercise
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Show active exercise
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setSelectedExercise(null);
                        setExerciseStep(0);
                      }}
                      className="mb-2 -ml-2"
                    >
                      ← Back to Exercises
                    </Button>
                    <CardTitle>{exerciseDetails?.title}</CardTitle>
                    <CardDescription>{exerciseDetails?.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{exerciseDetails?.duration}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{exerciseStep} of {exerciseDetails?.steps.length}</span>
                  </div>
                  <Progress value={(exerciseStep / (exerciseDetails?.steps.length || 1)) * 100} className="h-2" />
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  {exerciseStep === 0 ? (
                    <div className="text-center">
                      <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Ready to Begin?</h3>
                      <p className="text-muted-foreground mb-6">
                        Find a quiet place where you won't be interrupted. Take a few deep breaths and click
                        "Start" when you're ready to begin the exercise.
                      </p>
                      <Button onClick={() => setExerciseStep(1)}>
                        Start
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Step {exerciseStep}:</h3>
                      <p className="text-lg mb-6">
                        {exerciseDetails?.steps[exerciseStep - 1]}
                      </p>
                      <Button onClick={nextStep}>
                        {exerciseStep === exerciseDetails?.steps.length ? "Complete" : "Next Step"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your EQ & Resilience Progress</CardTitle>
              <CardDescription>
                Track your progress in developing emotional intelligence and resilience skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Completed Exercises</h3>
                {completedExercises.length > 0 ? (
                  <div className="space-y-3">
                    {RESILIENCE_STRATEGIES.map(strategy => {
                      const strategyExercises = strategy.exercises.filter(e => 
                        completedExercises.includes(e.id)
                      );
                      
                      if (strategyExercises.length === 0) return null;
                      
                      return (
                        <div key={strategy.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {strategy.icon}
                            <h4 className="font-medium">{strategy.title}</h4>
                          </div>
                          <ul className="space-y-2">
                            {strategyExercises.map(exercise => (
                              <li key={exercise.id} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{exercise.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No exercises completed yet</h3>
                    <p className="text-muted-foreground mb-6">Complete exercises to track your progress here.</p>
                    <Button onClick={() => setActiveTab('practice')}>
                      Start Practicing
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}