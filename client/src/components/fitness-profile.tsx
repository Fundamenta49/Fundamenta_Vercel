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
import { useToast } from "@/hooks/use-toast";

export interface FitnessProfile {
  height: number;
  weight: number;
  sex: "male" | "female";
  goals: string[];
  fitnessLevel: "beginner" | "intermediate" | "advanced";
}

interface FitnessProfileProps {
  onComplete: (profile: FitnessProfile) => void;
}

const lbsToKg = (lbs: number) => lbs * 0.453592;
const feetInchesToCm = (feet: number, inches: number) => (feet * 12 + inches) * 2.54;

export default function FitnessProfileSetup({ onComplete }: FitnessProfileProps) {
  const { toast } = useToast();
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [selectedSex, setSelectedSex] = useState("");
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState("");
  const [goals, setGoals] = useState<string[]>([]);

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness",
    "Stress Reduction"
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission
    try {
      // Validation
      const missingFields = [];
      if (!heightFeet) missingFields.push("Height (feet)");
      if (!heightInches) missingFields.push("Height (inches)");
      if (!weightLbs) missingFields.push("Weight");
      if (!selectedSex) missingFields.push("Sex");
      if (!selectedFitnessLevel) missingFields.push("Fitness Level");

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: `Please fill in: ${missingFields.join(", ")}`,
        });
        return;
      }

      const heightCm = feetInchesToCm(Number(heightFeet), Number(heightInches));
      const weightKg = lbsToKg(Number(weightLbs));

      if (isNaN(heightCm) || isNaN(weightKg)) {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Please enter valid numbers for height and weight.",
        });
        return;
      }

      const profile: FitnessProfile = {
        height: heightCm,
        weight: weightKg,
        sex: selectedSex as "male" | "female",
        fitnessLevel: selectedFitnessLevel as "beginner" | "intermediate" | "advanced",
        goals: goals.length > 0 ? goals : ["General Fitness"],
      };

      onComplete(profile);

    } catch (error) {
      console.error("Profile creation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create profile. Please try again.",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Fitness Profile 💪</CardTitle>
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
                  <Label>Feet</Label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="flex-1">
                  <Label>Inches</Label>
                  <Input
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
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                placeholder="150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sex</Label>
            <div className="relative">
              <select
                className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedSex}
                onChange={(e) => setSelectedSex(e.target.value)}
              >
                <option value="">Select your sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fitness Level</Label>
            <div className="relative">
              <select
                className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFitnessLevel}
                onChange={(e) => setSelectedFitnessLevel(e.target.value)}
              >
                <option value="">Select your fitness level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fitness Goals (Select multiple)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fitnessGoals.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={goals.includes(goal) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    setGoals((current) =>
                      current.includes(goal)
                        ? current.filter((g) => g !== goal)
                        : [...current, goal]
                    );
                  }}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full"
          >
            Create Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}