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

const questions = [
  "I like to build things",
  "I enjoy solving complex problems",
  "I prefer working with people",
  "I like organizing information",
  "I enjoy creative activities"
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

export default function RiasecTest() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{questions[index]}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected}
          onValueChange={setSelected}
        >
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-3 border rounded-lg p-4">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="flex-grow">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              if (index > 0) {
                setIndex(index - 1);
                setSelected("");
              }
            }}
            disabled={index === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (index < questions.length - 1) {
                setIndex(index + 1);
                setSelected("");
              }
            }}
            disabled={!selected}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}