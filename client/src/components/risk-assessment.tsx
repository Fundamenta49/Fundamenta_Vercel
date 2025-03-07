import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Heart, Sparkles, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  category: string;
}

interface Question {
  id: number;
  text: string;
  category: 'emotional' | 'physical' | 'mental' | 'social';
  options: Array<{
    text: string;
    value: number;
  }>;
}

const wellnessQuestions: Question[] = [
  {
    id: 1,
    text: "How have you been feeling emotionally over the past two weeks?",
    category: 'emotional',
    options: [
      { text: "Very positive and stable", value: 0 },
      { text: "Generally good with some ups and downs", value: 1 },
      { text: "More down than usual", value: 2 },
      { text: "Consistently struggling", value: 3 }
    ]
  },
  {
    id: 2,
    text: "How would you rate your sleep quality lately?",
    category: 'physical',
    options: [
      { text: "Sleeping well consistently", value: 0 },
      { text: "Some nights are better than others", value: 1 },
      { text: "Often having trouble sleeping", value: 2 },
      { text: "Severe sleep difficulties", value: 3 }
    ]
  },
  {
    id: 3,
    text: "How often do you feel overwhelmed by stress?",
    category: 'mental',
    options: [
      { text: "Rarely or never", value: 0 },
      { text: "Occasionally", value: 1 },
      { text: "Frequently", value: 2 },
      { text: "Almost constantly", value: 3 }
    ]
  },
  {
    id: 4,
    text: "How connected do you feel to others in your life?",
    category: 'social',
    options: [
      { text: "Very connected and supported", value: 0 },
      { text: "Moderately connected", value: 1 },
      { text: "Somewhat isolated", value: 2 },
      { text: "Very isolated", value: 3 }
    ]
  },
  {
    id: 5,
    text: "How do you feel about your ability to cope with challenges?",
    category: 'mental',
    options: [
      { text: "Very confident in my coping skills", value: 0 },
      { text: "Generally able to cope", value: 1 },
      { text: "Sometimes struggle to cope", value: 2 },
      { text: "Often feel unable to cope", value: 3 }
    ]
  }
];

interface Resource {
  title: string;
  description: string;
  action: string;
  link?: string;
  phone?: string;
  urgent: boolean;
}

export default function RiskAssessment({ category }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const { toast } = useToast();

  const progress = (currentQuestion / wellnessQuestions.length) * 100;

  const evaluateWellness = (answers: Record<number, number>) => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxPossibleScore = wellnessQuestions.length * 3;
    const wellnessLevel = totalScore / maxPossibleScore;

    const recommendedResources: Resource[] = [
      {
        title: "Guided Meditation",
        description: "Take a moment to center yourself with our guided meditation",
        action: "Start Now",
        link: "/wellness/meditation",
        urgent: false
      },
      {
        title: "Wellness Journal",
        description: "Track your emotional well-being and identify patterns",
        action: "Start Journaling",
        link: "/wellness/journal",
        urgent: false
      },
      {
        title: "Community Support",
        description: "Connect with others on similar wellness journeys",
        action: "Join Community",
        link: "/wellness/community",
        urgent: false
      }
    ];

    // Add specific resources based on answers
    if (answers[1] >= 2) { // High emotional distress
      recommendedResources.unshift({
        title: "Talk to Someone",
        description: "Connect with a mental health professional",
        action: "Get Support Now",
        phone: "988",
        urgent: true
      });
    }

    if (answers[2] >= 2) { // Sleep issues
      recommendedResources.push({
        title: "Sleep Improvement Guide",
        description: "Expert tips for better sleep quality",
        action: "View Guide",
        link: "/wellness/sleep",
        urgent: false
      });
    }

    return recommendedResources;
  };

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [wellnessQuestions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < wellnessQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const recommendedResources = evaluateWellness(newAnswers);
      setResources(recommendedResources);
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResources([]);
  };

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Your Wellness Insights
          </CardTitle>
          <CardDescription>
            Based on your responses, here are some personalized resources for your well-being:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  resource.urgent ? 'bg-red-50 border-red-200' : 'bg-card'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  {resource.urgent ? <Phone className="h-5 w-5 text-red-500" /> : <Heart className="h-5 w-5 text-primary" />}
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-3">{resource.description}</p>
                {resource.phone ? (
                  <Button 
                    variant="default" 
                    className={resource.urgent ? 'bg-red-500 hover:bg-red-600' : ''}
                    onClick={() => {
                      window.location.href = `tel:${resource.phone}`;
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {resource.action}: {resource.phone}
                  </Button>
                ) : (
                  <Button 
                    variant={resource.urgent ? "destructive" : "default"}
                    onClick={() => {
                      if (resource.link) {
                        window.location.href = resource.link;
                      }
                    }}
                  >
                    {resource.action}
                  </Button>
                )}
              </div>
            ))}

            <div className="mt-6">
              <Alert>
                <AlertDescription>
                  Remember, this is just a preliminary assessment. For personalized guidance,
                  consider speaking with a mental health professional.
                </AlertDescription>
              </Alert>
            </div>

            <Button onClick={handleRestart} variant="outline" className="mt-4">
              Take Assessment Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          BrainTap Check-In
        </CardTitle>
        <CardDescription>
          Take a moment to reflect on your well-being. Your responses will help us
          provide personalized resources and support.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {wellnessQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-4">
          <Label className="text-lg">{wellnessQuestions[currentQuestion].text}</Label>
          <RadioGroup
            value={answers[wellnessQuestions[currentQuestion].id]?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            <div className="space-y-2">
              {wellnessQuestions[currentQuestion].options.map((option) => (
                <div
                  key={option.text}
                  className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer"
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem value={option.value.toString()} id={option.text} />
                  <Label htmlFor={option.text} className="cursor-pointer flex-grow">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}