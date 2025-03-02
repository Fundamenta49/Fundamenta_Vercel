import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What type of tasks do you enjoy most?",
    options: [
      "Analytical and problem-solving",
      "Creative and artistic",
      "Helping and teaching others",
      "Leading and organizing teams",
      "Working with technology",
    ],
  },
  {
    id: 2,
    text: "What work environment do you prefer?",
    options: [
      "Fast-paced and dynamic",
      "Structured and organized",
      "Collaborative and team-oriented",
      "Independent and autonomous",
      "Mix of indoor and outdoor work",
    ],
  },
  {
    id: 3,
    text: "What are your key strengths?",
    options: [
      "Communication and interpersonal skills",
      "Technical and analytical abilities",
      "Creativity and innovation",
      "Leadership and management",
      "Detail-oriented and organized",
    ],
  },
  {
    id: 4,
    text: "What motivates you most in a career?",
    options: [
      "Financial success and stability",
      "Making a positive impact",
      "Learning and growth opportunities",
      "Work-life balance",
      "Recognition and advancement",
    ],
  },
  {
    id: 5,
    text: "What industries interest you most?",
    options: [
      "Technology and innovation",
      "Healthcare and wellness",
      "Business and finance",
      "Arts and entertainment",
      "Education and training",
    ],
  },
];

interface CareerSuggestion {
  title: string;
  description: string;
  skills: string[];
  growth: string;
  education: string;
}

export default function CareerAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const { toast } = useToast();

  const progress = (currentQuestion / questions.length) * 100;

  const assessmentMutation = useMutation({
    mutationFn: async (answers: Record<number, string>) => {
      const res = await apiRequest("POST", "/api/career/assess", { answers });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze career assessment");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions);
      toast({
        title: "Assessment Complete",
        description: "Here are your personalized career suggestions!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: error.message || "Failed to analyze assessment. Please try again.",
      });
    },
  });

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      assessmentMutation.mutate(answers);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSuggestions([]);
  };

  if (suggestions.length > 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Career Suggestions</CardTitle>
            <CardDescription>
              Based on your answers, here are some career paths that might interest you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {suggestion.title}
                </h3>
                <p className="text-muted-foreground">{suggestion.description}</p>
                <div>
                  <h4 className="font-medium mb-2">Key Skills Needed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Growth Potential</h4>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.growth}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Education Path</h4>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.education}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleRestart} className="w-full">
              Take Assessment Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Assessment Quiz</CardTitle>
        <CardDescription>
          Answer a few questions to get personalized career suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-4">
          <Label className="text-lg">{questions[currentQuestion].text}</Label>
          <RadioGroup
            value={answers[questions[currentQuestion].id]}
            onValueChange={handleAnswer}
          >
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer"
                  onClick={() => handleAnswer(option)}
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer flex-grow">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {assessmentMutation.isPending && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Analyzing your responses...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
