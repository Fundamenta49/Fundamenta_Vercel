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
  "I like to build things",
  "I enjoy solving problems",
  "I like to help others",
  "I am good at organizing",
  "I enjoy creative work"
];

type Answer = {
  [key: number]: string;
};

export default function RiasecTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

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
              {QUESTIONS[currentQuestion]}
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
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}