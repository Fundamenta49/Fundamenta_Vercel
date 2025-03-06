import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface FitnessProfile {
  height: number; // stored in centimeters
  weight: number; // stored in kilograms
  sex: "male" | "female";
  goals: string[];
  fitnessLevel: "beginner" | "intermediate" | "advanced";
}

interface FitnessProfileProps {
  onComplete: (profile: FitnessProfile) => void;
}

// Conversion helpers
const lbsToKg = (lbs: number) => lbs * 0.453592;
const kgToLbs = (kg: number) => kg * 2.20462;
const cmToFeetInches = (cm: number) => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return { feet, inches: remainingInches };
};
const feetInchesToCm = (feet: number, inches: number) => (feet * 12 + inches) * 2.54;

export default function FitnessProfileSetup({ onComplete }: FitnessProfileProps) {
  const { toast } = useToast();
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [weightLbs, setWeightLbs] = useState<string>("");
  const [sex, setSex] = useState<"male" | "female" | undefined>(undefined);
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "advanced" | undefined>(undefined);
  const [goals, setGoals] = useState<string[]>([]);

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness",
    "Stress Reduction"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!heightFeet || !heightInches || !weightLbs || !sex || !fitnessLevel) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const heightCm = feetInchesToCm(Number(heightFeet), Number(heightInches));
    const weightKg = lbsToKg(Number(weightLbs));

    onComplete({
      height: heightCm,
      weight: weightKg,
      sex,
      fitnessLevel,
      goals,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Active You! 💪</CardTitle>
        <CardDescription>
          Let's create your personalized fitness profile to help you achieve your goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="feet">Feet</Label>
                  <Input
                    id="feet"
                    type="number"
                    min="1"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="inches">Inches</Label>
                  <Input
                    id="inches"
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                placeholder="150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sex</Label>
            <Select value={sex} onValueChange={(value: "male" | "female") => setSex(value)}>
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select your sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Level</Label>
            <Select 
              value={fitnessLevel} 
              onValueChange={(value: "beginner" | "intermediate" | "advanced") => setFitnessLevel(value)}
            >
              <SelectTrigger id="fitnessLevel">
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Goals</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fitnessGoals.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={goals.includes(goal) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    setGoals(current => 
                      current.includes(goal)
                        ? current.filter(g => g !== goal)
                        : [...current, goal]
                    );
                  }}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}