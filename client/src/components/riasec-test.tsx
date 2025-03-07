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

// Start with a few test questions before implementing all 72
const QUESTIONS = [
  { text: "I like to build things", category: "R" },
  { text: "I enjoy solving problems", category: "I" },
  { text: "I like to help others", category: "S" },
  { text: "I am good at organizing", category: "C" },
  { text: "I enjoy creative work", category: "A" }
];

type Answer = {
  [key: number]: string;
};

type RiasecScores = {
  R: number; // Realistic
  I: number; // Investigative
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
};

const calculateScores = (answers: Answer): RiasecScores => {
  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.entries(answers).forEach(([questionIndex, answer]) => {
    const category = QUESTIONS[Number(questionIndex)].category;
    const value = {
      'strongly-agree': 5,
      'agree': 4,
      'neutral': 3,
      'disagree': 2,
      'strongly-disagree': 1
    }[answer] || 0;

    if (category in scores) {
      scores[category as keyof RiasecScores] += value;
    }
  });

  return scores;
};

const getTopCategories = (scores: RiasecScores): string[] => {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category)
    .slice(0, 3);
};

const getCategoryDescription = (category: string): string => {
  const descriptions: { [key: string]: string } = {
    R: "Realistic - Hands-on problem solver who likes working with tools, machines, or nature",
    I: "Investigative - Analytical thinker who likes exploring ideas and solving complex problems",
    A: "Artistic - Creative individual who enjoys self-expression through art and design",
    S: "Social - Helper who enjoys working with people and making a difference",
    E: "Enterprising - Leader who likes to influence, persuade, and perform",
    C: "Conventional - Organizer who excels at working with data, numbers, and details"
  };
  return descriptions[category] || "";
};

export default function RiasecTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handlePrevious = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (showResults) {
    const scores = calculateScores(answers);
    const topCategories = getTopCategories(scores);

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your RIASEC Assessment Results</CardTitle>
          <CardDescription>
            Based on your answers, here are your career interest areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {index + 1}. {getCategoryDescription(category)}
                  </h3>
                  <Progress 
                    value={(scores[category as keyof RiasecScores] / (5 * QUESTIONS.length)) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="w-full"
              >
                Start Over
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Educational Path Assessment</CardTitle>
        <CardDescription>
          Answer these questions to get personalized recommendations for university degrees or trade school programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">
              {QUESTIONS[currentQuestion].text}
            </Label>

            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border rounded-lg p-4">
                <RadioGroupItem value="strongly-disagree" id="strongly-disagree" />
                <Label htmlFor="strongly-disagree">Strongly Disagree</Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4">
                <RadioGroupItem value="disagree" id="disagree" />
                <Label htmlFor="disagree">Disagree</Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral">Neutral</Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4">
                <RadioGroupItem value="agree" id="agree" />
                <Label htmlFor="agree">Agree</Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4">
                <RadioGroupItem value="strongly-agree" id="strongly-agree" />
                <Label htmlFor="strongly-agree">Strongly Agree</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
            >
              {isLastQuestion ? "View Results" : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}