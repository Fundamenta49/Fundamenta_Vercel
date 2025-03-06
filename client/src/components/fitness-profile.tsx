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

interface FormData {
  heightFeet: string;
  heightInches: string;
  weightLbs: string;
  sex: string;
  fitnessLevel: string;
}

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
  const [formData, setFormData] = useState<FormData>({
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    sex: "",
    fitnessLevel: "",
  });
  const [goals, setGoals] = useState<string[]>([]);

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness",
    "Stress Reduction"
  ];

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.heightFeet || !formData.heightInches || !formData.weightLbs || !formData.sex || !formData.fitnessLevel) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const heightCm = feetInchesToCm(Number(formData.heightFeet), Number(formData.heightInches));
    const weightKg = lbsToKg(Number(formData.weightLbs));

    const profile: FitnessProfile = {
      height: heightCm,
      weight: weightKg,
      sex: formData.sex as "male" | "female",
      fitnessLevel: formData.fitnessLevel as "beginner" | "intermediate" | "advanced",
      goals,
    };

    onComplete(profile);
  };

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
                    value={formData.heightFeet}
                    onChange={(e) => handleInputChange("heightFeet")(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="flex-1">
                  <Label>Inches</Label>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={formData.heightInches}
                    onChange={(e) => handleInputChange("heightInches")(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                value={formData.weightLbs}
                onChange={(e) => handleInputChange("weightLbs")(e.target.value)}
                placeholder="150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sex</Label>
            <Select 
              value={formData.sex}
              onValueChange={(value) => handleInputChange("sex")(value)}
            >
              <SelectTrigger>
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
              value={formData.fitnessLevel}
              onValueChange={(value) => handleInputChange("fitnessLevel")(value)}
            >
              <SelectTrigger>
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

          <Button type="submit" className="w-full">
            Create Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}