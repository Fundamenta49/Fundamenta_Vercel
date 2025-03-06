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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, GraduationCap, Wrench, Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: number;
  text: string;
  category: 'personality' | 'interests' | 'values' | 'skills';
  options: string[];
}

const questions: Question[] = [
  // Personality Questions
  {
    id: 1,
    text: "How do you prefer to solve problems?",
    category: 'personality',
    options: [
      "Through careful analysis and research",
      "By getting hands-on and experimenting",
      "Through creative thinking and innovation",
      "By discussing with others and collaboration",
      "Through step-by-step systematic approach"
    ],
  },
  {
    id: 2,
    text: "How do you prefer to learn new things?",
    category: 'personality',
    options: [
      "Through reading and theoretical study",
      "Through practical, hands-on experience",
      "Through visual demonstrations",
      "Through group discussions and seminars",
      "Through self-paced online courses"
    ],
  },
  // Interests Questions
  {
    id: 3,
    text: "What type of work environment interests you most?",
    category: 'interests',
    options: [
      "Traditional office setting",
      "Workshop or construction site",
      "Laboratory or research facility",
      "Outdoor and variable locations",
      "Creative studio or design space"
    ],
  },
  {
    id: 4,
    text: "Which activities do you find most engaging?",
    category: 'interests',
    options: [
      "Writing and analyzing documents",
      "Building or repairing things",
      "Solving complex problems",
      "Working with tools and machinery",
      "Creating and designing"
    ],
  },
  // Values Questions
  {
    id: 5,
    text: "What factors are most important in your career choice?",
    category: 'values',
    options: [
      "High earning potential and benefits",
      "Work-life balance and stability",
      "Opportunity for advancement",
      "Independence and autonomy",
      "Making a positive impact"
    ],
  },
  {
    id: 6,
    text: "What timeline for career preparation appeals to you?",
    category: 'values',
    options: [
      "4+ years of academic study",
      "1-2 years of focused training",
      "2-3 years combining study and practice",
      "Immediate hands-on training",
      "Flexible, self-paced learning"
    ],
  },
  // Skills Assessment
  {
    id: 7,
    text: "What are your strongest current skills?",
    category: 'skills',
    options: [
      "Academic and analytical thinking",
      "Technical and mechanical abilities",
      "Creative and artistic expression",
      "Physical and hands-on work",
      "Leadership and organization"
    ],
  },
  {
    id: 8,
    text: "How do you handle challenging tasks?",
    category: 'skills',
    options: [
      "Research thoroughly before starting",
      "Jump in and learn by doing",
      "Break down into smaller steps",
      "Seek guidance from experts",
      "Collaborate with others"
    ],
  }
];

interface CareerSuggestion {
  pathType: 'university' | 'trade';
  title: string;
  description: string;
  skills: string[];
  growth: string;
  education: {
    type: string;
    duration: string;
    requirements: string[];
    estimated_cost: string;
  };
  salary_range: {
    entry: string;
    experienced: string;
  };
  program_suggestions: {
    name: string;
    description: string;
    link?: string;
  }[];
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
        description: "Here are your personalized educational and career path suggestions!",
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
            <CardTitle>Your Educational Path Recommendations</CardTitle>
            <CardDescription>
              Based on your personality, interests, values, and skills, here are recommended educational and career paths
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="space-y-4 p-6 border rounded-lg bg-card">
                <div className="flex items-center gap-2">
                  {suggestion.pathType === 'university' ? (
                    <GraduationCap className="h-6 w-6 text-primary" />
                  ) : (
                    <Wrench className="h-6 w-6 text-primary" />
                  )}
                  <h3 className="text-xl font-semibold">{suggestion.title}</h3>
                </div>

                <p className="text-muted-foreground">{suggestion.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Education Path</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Type:</strong> {suggestion.education.type}</p>
                      <p><strong>Duration:</strong> {suggestion.education.duration}</p>
                      <p><strong>Estimated Cost:</strong> {suggestion.education.estimated_cost}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Salary Potential</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Entry Level:</strong> {suggestion.salary_range.entry}</p>
                      <p><strong>Experienced:</strong> {suggestion.salary_range.experienced}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Required Skills:</h4>
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

                <div>
                  <h4 className="font-medium mb-2">Recommended Programs:</h4>
                  <div className="grid gap-2">
                    {suggestion.program_suggestions.map((program, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted">
                        <h5 className="font-medium">{program.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                        {program.link && (
                          <a
                            href={program.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 inline-block"
                          >
                            Learn more →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={handleRestart} className="w-full mt-4">
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
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Educational Path Assessment
        </CardTitle>
        <CardDescription>
          Answer these questions to get personalized recommendations for university degrees or trade school programs
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