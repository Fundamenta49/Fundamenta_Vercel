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

// Simple test question for now
const question = "I like to build things";

export default function RiasecTest() {
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="strongly-disagree" id="strongly-disagree" />
              <Label htmlFor="strongly-disagree">Strongly Disagree</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="disagree" id="disagree" />
              <Label htmlFor="disagree">Disagree</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="neutral" id="neutral" />
              <Label htmlFor="neutral">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="agree" id="agree" />
              <Label htmlFor="agree">Agree</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="strongly-agree" id="strongly-agree" />
              <Label htmlFor="strongly-agree">Strongly Agree</Label>
            </div>
          </RadioGroup>

          <div className="flex justify-between pt-6">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button disabled={!selected}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}