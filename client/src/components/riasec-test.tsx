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

const QUESTIONS = [
  { text: "I like to build things", category: "R" },
  { text: "I enjoy solving problems", category: "I" },
  { text: "I like to help others", category: "S" },
  { text: "I am good at organizing", category: "C" },
  { text: "I enjoy creative work", category: "A" }
];

// Simplified result mapping
const RESULT_DESCRIPTIONS = {
  R: "Realistic: You enjoy working with your hands and solving practical problems. Consider careers in engineering, construction, or technical fields.",
  I: "Investigative: You like analyzing problems and discovering new things. Look into scientific research, technology, or medical careers.",
  A: "Artistic: You have a strong creative drive and value self-expression. Explore careers in design, music, writing, or the arts.",
  S: "Social: You enjoy working with and helping others. Consider careers in teaching, counseling, or healthcare.",
  E: "Enterprising: You like leading and persuading others. Look into business, sales, or management roles.",
  C: "Conventional: You enjoy organizing and working with data. Consider careers in accounting, administration, or IT."
};

export default function RiasecTest() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);

  const calculateResults = () => {
    const scores: {[key: string]: number} = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.entries(answers).forEach(([idx, answer]) => {
      const question = QUESTIONS[Number(idx)];
      const value = answer === 'strongly-agree' ? 5 : 
                    answer === 'agree' ? 4 : 
                    answer === 'neutral' ? 3 : 
                    answer === 'disagree' ? 2 : 1;

      if (question.category in scores) {
        scores[question.category] += value;
      }
    });

    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => RESULT_DESCRIPTIONS[category as keyof typeof RESULT_DESCRIPTIONS]);
  };

  if (showResults) {
    const results = calculateResults();

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Your Career Path Results</CardTitle>
          <CardDescription>
            Based on your answers, here are your top career directions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">#{index + 1}</h3>
                <p>{result}</p>
              </div>
            ))}

            <div className="pt-6 border-t mt-6">
              <Button 
                className="w-full"
                onClick={() => {
                  setShowResults(false);
                  setQuestionIndex(0);
                  setAnswers({});
                }}
              >
                Take Test Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;
  const isLastQuestion = questionIndex === QUESTIONS.length - 1;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Educational Path Assessment</CardTitle>
        <CardDescription>
          Question {questionIndex + 1} of {QUESTIONS.length} ({Math.round(progress)}% Complete)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Progress value={progress} />

          <div className="space-y-4">
            <Label className="text-lg font-medium">
              {QUESTIONS[questionIndex].text}
            </Label>

            <RadioGroup
              value={answers[questionIndex] || ""}
              onValueChange={(value) => setAnswers(prev => ({ ...prev, [questionIndex]: value }))}
              className="space-y-3"
            >
              {[
                ["strongly-disagree", "Strongly Disagree"],
                ["disagree", "Disagree"],
                ["neutral", "Neutral"],
                ["agree", "Agree"],
                ["strongly-agree", "Strongly Agree"]
              ].map(([value, label]) => (
                <div key={value} className="flex items-center space-x-3 border rounded-lg p-4">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setQuestionIndex(prev => prev - 1)}
              disabled={questionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (isLastQuestion) {
                  setShowResults(true);
                } else {
                  setQuestionIndex(prev => prev + 1);
                }
              }}
              disabled={!answers[questionIndex]}
            >
              {isLastQuestion ? "View Results" : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}