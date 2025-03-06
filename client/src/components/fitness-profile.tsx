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
  const [formData, setFormData] = useState({
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    sex: "",
    fitnessLevel: "",
    goals: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness",
    "Stress Reduction"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started with data:", formData);

    try {
      setIsSubmitting(true);

      // Validation
      const missingFields = [];
      if (!formData.heightFeet) missingFields.push("Height (feet)");
      if (!formData.heightInches) missingFields.push("Height (inches)");
      if (!formData.weightLbs) missingFields.push("Weight");
      if (!formData.sex) missingFields.push("Sex");
      if (!formData.fitnessLevel) missingFields.push("Fitness Level");

      if (missingFields.length > 0) {
        console.log("Validation failed - missing fields:", missingFields);
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: `Please fill in: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Convert measurements
      const heightCm = feetInchesToCm(
        Number(formData.heightFeet),
        Number(formData.heightInches)
      );
      const weightKg = lbsToKg(Number(formData.weightLbs));

      if (isNaN(heightCm) || isNaN(weightKg)) {
        console.log("Invalid measurements", { heightCm, weightKg });
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
        sex: formData.sex as "male" | "female",
        fitnessLevel: formData.fitnessLevel as "beginner" | "intermediate" | "advanced",
        goals: formData.goals.length > 0 ? formData.goals : ["General Fitness"],
      };

      console.log("Calling onComplete with profile:", profile);
      await Promise.resolve(onComplete(profile));
      console.log("Profile submission completed");

    } catch (error) {
      console.error("Profile creation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
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
                    onChange={(e) => handleInputChange("heightFeet", e.target.value)}
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
                    onChange={(e) => handleInputChange("heightInches", e.target.value)}
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
                onChange={(e) => handleInputChange("weightLbs", e.target.value)}
                placeholder="150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sex</Label>
            <select
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
              value={formData.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
            >
              <option value="">Select your sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Level</Label>
            <select
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background"
              value={formData.fitnessLevel}
              onChange={(e) => handleInputChange("fitnessLevel", e.target.value)}
            >
              <option value="">Select your fitness level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Goals (Select multiple)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fitnessGoals.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={formData.goals.includes(goal) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating Profile..." : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}