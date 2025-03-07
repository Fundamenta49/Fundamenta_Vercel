import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const QUESTIONS = ["I like to build things"];

export default function RiasecTest() {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState("");

  function handleNext() {
    setQuestionNumber(questionNumber + 1);
    setAnswer("");
  }

  function handlePrevious() {
    setQuestionNumber(questionNumber - 1);
    setAnswer("");
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{QUESTIONS[questionNumber]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup 
            value={answer}
            onValueChange={setAnswer}
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

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={questionNumber === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answer}
            >
              Next  
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}