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
import { PhoneCall, Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  category: 'mental_health' | 'substance' | 'safety';
  options: Array<{
    text: string;
    value: number; // Higher numbers indicate higher risk
  }>;
}

const assessmentQuestions: Question[] = [
  {
    id: 1,
    text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
    category: 'mental_health',
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 2,
    text: "How often do you have thoughts of harming yourself?",
    category: 'mental_health',
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Often", value: 3 }
    ]
  },
  {
    id: 3,
    text: "Do you feel in control of your substance use (including alcohol)?",
    category: 'substance',
    options: [
      { text: "Always in control", value: 0 },
      { text: "Usually in control", value: 1 },
      { text: "Sometimes struggle with control", value: 2 },
      { text: "Often feel out of control", value: 3 }
    ]
  },
  {
    id: 4,
    text: "How safe do you feel in your current environment?",
    category: 'safety',
    options: [
      { text: "Very safe", value: 0 },
      { text: "Mostly safe", value: 1 },
      { text: "Sometimes unsafe", value: 2 },
      { text: "Often unsafe", value: 3 }
    ]
  },
  {
    id: 5,
    text: "How often do you feel overwhelmed by your current situation?",
    category: 'mental_health',
    options: [
      { text: "Rarely or never", value: 0 },
      { text: "Sometimes", value: 1 },
      { text: "Often", value: 2 },
      { text: "Almost always", value: 3 }
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

export default function RiskAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const { toast } = useToast();

  const progress = (currentQuestion / assessmentQuestions.length) * 100;

  const evaluateRisk = (answers: Record<number, number>) => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxPossibleScore = assessmentQuestions.length * 3;
    const riskLevel = totalScore / maxPossibleScore;

    const recommendedResources: Resource[] = [
      {
        title: "24/7 Crisis Hotline",
        description: "Speak with a trained counselor immediately",
        action: "Call Now",
        phone: "1-800-273-8255",
        urgent: true
      },
      {
        title: "Grounding Exercise",
        description: "Try this simple 5-4-3-2-1 technique to feel more present",
        action: "Start Exercise",
        link: "/emergency/grounding",
        urgent: false
      },
      {
        title: "Local Support Services",
        description: "Find professional help in your area",
        action: "Find Help",
        link: "/emergency/local-services",
        urgent: false
      }
    ];

    // Add specific resources based on answers
    if (answers[2] >= 2) { // High score on self-harm question
      recommendedResources.unshift({
        title: "Immediate Crisis Support",
        description: "You're not alone. Talk to someone who understands.",
        action: "Get Help Now",
        phone: "988",
        urgent: true
      });
    }

    if (answers[3] >= 2) { // High score on substance use
      recommendedResources.push({
        title: "Substance Use Support",
        description: "Connect with substance use specialists",
        action: "Get Support",
        phone: "1-800-662-4357",
        urgent: false
      });
    }

    return recommendedResources;
  };

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [assessmentQuestions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const recommendedResources = evaluateRisk(newAnswers);
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
            <Brain className="h-6 w-6 text-primary" />
            Assessment Results
          </CardTitle>
          <CardDescription>
            Based on your responses, here are some recommended resources:
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
                  {resource.urgent && <PhoneCall className="h-5 w-5 text-red-500" />}
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-3">{resource.description}</p>
                {resource.phone ? (
                  <Button 
                    variant="default" 
                    className={resource.urgent ? 'bg-red-500 hover:bg-red-600' : ''}
                    onClick={() => {
                      // In a real app, this would use proper phone handling
                      window.location.href = `tel:${resource.phone}`;
                    }}
                  >
                    <PhoneCall className="h-4 w-4 mr-2" />
                    {resource.action}: {resource.phone}
                  </Button>
                ) : (
                  <Button 
                    variant={resource.urgent ? "destructive" : "default"}
                    onClick={() => {
                      if (resource.link) {
                        // Navigate to the resource
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
                  Remember, this is just a preliminary assessment. If you're in immediate danger,
                  please call emergency services (911) or your local crisis hotline.
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
          Self-Assessment Tool
        </CardTitle>
        <CardDescription>
          This quick assessment will help identify if you might benefit from additional support.
          Your responses are private and not stored.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-4">
          <Label className="text-lg">{assessmentQuestions[currentQuestion].text}</Label>
          <RadioGroup
            value={answers[assessmentQuestions[currentQuestion].id]?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            <div className="space-y-2">
              {assessmentQuestions[currentQuestion].options.map((option) => (
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
