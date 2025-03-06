import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  heightFeet: z.string().min(1, "Required"),
  heightInches: z.string().min(1, "Required"),
  weightLbs: z.string().min(1, "Required"),
  sex: z.enum(["male", "female"]),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

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
const feetInchesToCm = (feet: number, inches: number) => (feet * 12 + inches) * 2.54;

export default function FitnessProfileSetup({ onComplete }: FitnessProfileProps) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heightFeet: "",
      heightInches: "",
      weightLbs: "",
      sex: undefined,
      fitnessLevel: undefined,
    },
  });

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness",
    "Stress Reduction"
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    const heightCm = feetInchesToCm(Number(values.heightFeet), Number(values.heightInches));
    const weightKg = lbsToKg(Number(values.weightLbs));

    const profile: FitnessProfile = {
      height: heightCm,
      weight: weightKg,
      sex: values.sex,
      fitnessLevel: values.fitnessLevel,
      goals,
    };

    onComplete(profile);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Active You! 💪</CardTitle>
        <CardDescription>
          Let's create your personalized fitness profile to help you achieve your goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="heightFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feet</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="8"
                              placeholder="5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="heightInches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inches</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="11"
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="weightLbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="150"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your fitness level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </CardContent>
    </Card>
  );
}