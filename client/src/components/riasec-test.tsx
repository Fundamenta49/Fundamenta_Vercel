import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialQuestions = [
  { id: 1, text: "I like to build things" },
  { id: 2, text: "I enjoy solving complex problems" },
  { id: 3, text: "I prefer working with people" },
  { id: 4, text: "I like organizing information" },
  { id: 5, text: "I enjoy creative activities" },
  // ... Add 67 more questions here ...
];

const AnswerOption = React.memo(({ value, label }: { value: string; label: string }) => (
  <div className="flex items-center space-x-3 border rounded-lg p-4">
    <RadioGroupItem value={value} id={value} />
    <Label htmlFor={value} className="flex-grow">
      {label}
    </Label>
  </div>
));

export default function RiasecTest() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialQuestions[currentIndex].text}</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={answers[initialQuestions[currentIndex].id]}
          onValueChange={(value) => {
            setAnswers(prev => ({
              ...prev,
              [initialQuestions[currentIndex].id]: value
            }));
          }}
          className="space-y-3"
        >
          <AnswerOption value="strongly-disagree" label="Strongly Disagree" />
          <AnswerOption value="disagree" label="Disagree" />
          <AnswerOption value="neutral" label="Neutral" />
          <AnswerOption value="agree" label="Agree" />
          <AnswerOption value="strongly-agree" label="Strongly Agree" />
        </RadioGroup>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentIndex(i => Math.min(initialQuestions.length -1, i + 1))}
            disabled={!answers[initialQuestions[currentIndex].id]}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}