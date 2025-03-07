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

// Official RIASEC Test questions from Open Source Psychometrics Project
const questions = [
  {
    id: 1,
    text: "I like to work on cars",
    category: "R"
  },
  {
    id: 2,
    text: "I like to do puzzles",
    category: "I"
  },
  {
    id: 3,
    text: "I am good at working independently",
    category: "A"
  },
  {
    id: 4,
    text: "I like to work in teams",
    category: "S"
  },
  {
    id: 5,
    text: "I am an ambitious person, I set goals for myself",
    category: "E"
  },
  {
    id: 6,
    text: "I like to organize things (files, desks/offices)",
    category: "C"
  },
  {
    id: 7,
    text: "I like to build things",
    category: "R"
  },
  {
    id: 8,
    text: "I like to read about art and music",
    category: "A"
  },
  {
    id: 9,
    text: "I like to have clear instructions to follow",
    category: "C"
  },
  {
    id: 10,
    text: "I like to try to influence or persuade people",
    category: "E"
  }
];

const answerOptions = [
  { value: "1", label: "Strongly Disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly Agree" }
];

export default function RiasecTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleSelectAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <CardDescription>
          {Math.round(progress)}% Complete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Progress value={progress} />

          <div className="space-y-4">
            <Label className="text-lg">
              {questions[currentQuestionIndex].text}
            </Label>

            <RadioGroup
              value={answers[questions[currentQuestionIndex].id]}
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {answerOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 border rounded-lg p-4"
                >
                  <RadioGroupItem value={option.value} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-grow">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={!answers[questions[currentQuestionIndex].id]}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
