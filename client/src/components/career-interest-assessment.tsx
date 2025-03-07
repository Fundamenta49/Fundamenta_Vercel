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
import { Brain, Briefcase, Lightbulb, AlertCircle } from "lucide-react";

interface Props {
  category: string;
}

interface Question {
  id: number;
  text: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
}

// Standard RIASEC questions from Open Source Psychometrics Project
const riasecQuestions: Question[] = [
  // Realistic questions
  {
    id: 1,
    text: "I like to work on cars",
    category: 'R'
  },
  {
    id: 2,
    text: "I like to do puzzles",
    category: 'I'
  },
  {
    id: 3,
    text: "I am good at working independently",
    category: 'A'
  },
  {
    id: 4,
    text: "I like to work in teams",
    category: 'S'
  },
  {
    id: 5,
    text: "I am an ambitious person, I set goals for myself",
    category: 'E'
  },
  {
    id: 6,
    text: "I like to organize things, (files, desks/offices)",
    category: 'C'
  },
  {
    id: 7,
    text: "I like to build things",
    category: 'R'
  },
  {
    id: 8,
    text: "I like to read about art and music",
    category: 'A'
  },
  {
    id: 9,
    text: "I like to have clear instructions to follow",
    category: 'C'
  },
  {
    id: 10,
    text: "I like to try to influence or persuade people",
    category: 'E'
  },
  {
    id: 11,
    text: "I like to do experiments",
    category: 'I'
  },
  {
    id: 12,
    text: "I like to teach or train people",
    category: 'S'
  },
  {
    id: 13,
    text: "I like trying to help people solve their problems",
    category: 'S'
  },
  {
    id: 14,
    text: "I like to take care of animals",
    category: 'R'
  },
  {
    id: 15,
    text: "I wouldn't mind working 8 hours per day in an office",
    category: 'C'
  },
  {
    id: 16,
    text: "I like selling things",
    category: 'E'
  },
  {
    id: 17,
    text: "I enjoy creative writing",
    category: 'A'
  },
  {
    id: 18,
    text: "I enjoy science",
    category: 'I'
  }
];

const answerOptions = [
  { value: "1", label: "Strongly Disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly Agree" }
];

export default function CareerInterestAssessment({ category }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });

  const progress = (currentQuestion / riasecQuestions.length) * 100;

  const calculateScores = () => {
    const newScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = riasecQuestions.find(q => q.id === parseInt(questionId));
      if (question) {
        newScores[question.category] += answer;
      }
    });

    setScores(newScores);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < riasecQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    calculateScores();
    setShowResults(true);
  };

  const getTopInterests = () => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  };

  const getCareerSuggestions = (interests: string[]) => {
    const suggestions: Record<string, string[]> = {
      R: ["Engineer", "Mechanic", "Construction Manager", "Agricultural Specialist"],
      I: ["Scientist", "Research Analyst", "Software Developer", "Medical Researcher"],
      A: ["Graphic Designer", "Writer", "Musician", "Interior Designer"],
      S: ["Teacher", "Counselor", "Social Worker", "Healthcare Provider"],
      E: ["Business Manager", "Sales Representative", "Entrepreneur", "Project Manager"],
      C: ["Accountant", "Data Analyst", "Administrative Manager", "Quality Control Specialist"]
    };

    return interests.flatMap(interest => suggestions[interest] || []);
  };

  if (showResults) {
    const topInterests = getTopInterests();
    const careerSuggestions = getCareerSuggestions(topInterests);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Your Career Interest Profile
          </CardTitle>
          <CardDescription>
            Based on your responses, here are your dominant interest areas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between">
                  <Label>
                    {category === 'R' && "Realistic (Doers)"}
                    {category === 'I' && "Investigative (Thinkers)"}
                    {category === 'A' && "Artistic (Creators)"}
                    {category === 'S' && "Social (Helpers)"}
                    {category === 'E' && "Enterprising (Persuaders)"}
                    {category === 'C' && "Conventional (Organizers)"}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((score / 18) * 100)}%
                  </span>
                </div>
                <Progress value={(score / 18) * 100} />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Suggested Career Paths
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerSuggestions.map((career, index) => (
                <Alert key={index}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{career}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
              setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
            }}
            variant="outline"
            className="mt-4"
          >
            Retake Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Career Interest Assessment
        </CardTitle>
        <CardDescription>
          Discover your career interests and natural inclinations through this assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {riasecQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-6">
          <Label className="text-lg font-medium">
            {riasecQuestions[currentQuestion].text}
          </Label>

          <RadioGroup
            value={answers[riasecQuestions[currentQuestion].id]?.toString()}
            onValueChange={(value) => {
              const numValue = parseInt(value);
              setAnswers(prev => ({
                ...prev,
                [riasecQuestions[currentQuestion].id]: numValue
              }));
            }}
          >
            <div className="space-y-3">
              {answerOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                  />
                  <Label htmlFor={option.value} className="flex-grow">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            Back
          </Button>

          {currentQuestion < riasecQuestions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[riasecQuestions[currentQuestion].id]}
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!answers[riasecQuestions[currentQuestion].id]}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}