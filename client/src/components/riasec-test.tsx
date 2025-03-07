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

const questions = [
  { id: 1, text: "I like to build things" },
  { id: 2, text: "I like to do puzzles" },
  { id: 3, text: "I am good at working independently" },
  { id: 4, text: "I like to work in teams" },
  { id: 5, text: "I am an ambitious person" },
  { id: 6, text: "I like to organize things" },
  { id: 7, text: "I like to help others" },
  { id: 8, text: "I enjoy learning new things" },
  { id: 9, text: "I like to solve problems" },
  { id: 10, text: "I enjoy creative activities" }
];

const answerOptions = [
  "Strongly Disagree",
  "Disagree", 
  "Neutral",
  "Agree",
  "Strongly Agree"
];

export default function RiasecTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = (currentQuestionIndex / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <CardDescription>{Math.round(progress)}% Complete</CardDescription>
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
              onValueChange={(value) => {
                setAnswers(prev => ({
                  ...prev,
                  [questions[currentQuestionIndex].id]: value
                }));
              }}
              className="space-y-3"
            >
              {answerOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 border rounded-lg p-4"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-grow">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
              }}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              }}
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