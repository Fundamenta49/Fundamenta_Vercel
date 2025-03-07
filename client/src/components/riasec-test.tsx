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

// Simple test questions until we get the full 72
const questions = [
  { id: 1, text: "I like to build things" },
  { id: 2, text: "I like to solve problems" },
  { id: 3, text: "I enjoy helping others" }
];

export default function RiasecTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <CardDescription>0% Complete</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <Progress value={0} />

          <div className="space-y-4">
            <Label className="text-lg">
              {questions[currentQuestionIndex].text}
            </Label>

            <RadioGroup
              value={selectedAnswers[questions[currentQuestionIndex].id]}
              onValueChange={(value) => {
                setSelectedAnswers({
                  ...selectedAnswers,
                  [questions[currentQuestionIndex].id]: value
                });
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="Strongly Disagree" id="strongly-disagree" />
                  <Label htmlFor="strongly-disagree">Strongly Disagree</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="Disagree" id="disagree" />
                  <Label htmlFor="disagree">Disagree</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="Neutral" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="Agree" id="agree" />
                  <Label htmlFor="agree">Agree</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="Strongly Agree" id="strongly-agree" />
                  <Label htmlFor="strongly-agree">Strongly Agree</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={!selectedAnswers[questions[currentQuestionIndex].id]}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}