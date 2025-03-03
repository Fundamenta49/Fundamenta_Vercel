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
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Apple,
  Brain,
  Dumbbell,
  Moon,
  Heart,
  Droplets,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HabitTracker {
  water: number;
  sleep: number;
  exercise: number;
  meditation: number;
}

const healthTips = [
  {
    title: "Morning Ritual",
    description: "Start your day with a glass of water and 5 minutes of stretching",
    icon: Brain,
  },
  {
    title: "Mindful Eating",
    description: "Take time to eat slowly and without distractions",
    icon: Apple,
  },
  {
    title: "Movement Breaks",
    description: "Stand up and move for 2-3 minutes every hour",
    icon: Dumbbell,
  },
  {
    title: "Better Sleep",
    description: "Create a relaxing bedtime routine without screens",
    icon: Moon,
  },
];

export default function NutritionGuide() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [habits, setHabits] = useState<HabitTracker>({
    water: 0,
    sleep: 7,
    exercise: 0,
    meditation: 0,
  });
  const [goalSettings, setGoalSettings] = useState({
    goal: "",
    dietaryPreference: "",
    restrictions: "",
  });

  const handleQuizSubmit = () => {
    setQuizCompleted(true);
    // Here we would normally process the quiz answers and generate recommendations
  };

  const updateHabit = (habit: keyof HabitTracker, value: number) => {
    setHabits((prev) => ({
      ...prev,
      [habit]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Wellness Quiz Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Wellness Quiz
          </CardTitle>
          <CardDescription>
            Take our quiz to get personalized health and nutrition recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={goalSettings.goal}
            onValueChange={(value) => setGoalSettings(prev => ({ ...prev, goal: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="What's your primary wellness goal?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight Management</SelectItem>
              <SelectItem value="energy">Boost Energy</SelectItem>
              <SelectItem value="strength">Build Strength</SelectItem>
              <SelectItem value="health">Overall Health</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={goalSettings.dietaryPreference}
            onValueChange={(value) => setGoalSettings(prev => ({ ...prev, dietaryPreference: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dietary Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="pescatarian">Pescatarian</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Any dietary restrictions or allergies?"
            value={goalSettings.restrictions}
            onChange={(e) => setGoalSettings(prev => ({ ...prev, restrictions: e.target.value }))}
          />

          <Button onClick={handleQuizSubmit} className="w-full">
            Get My Personalized Plan
          </Button>

          {quizCompleted && (
            <Alert>
              <AlertDescription>
                Based on your answers, we've created a customized plan for you!
                Check your habit tracker and recommendations below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Daily Habit Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Daily Habit Tracker
          </CardTitle>
          <CardDescription>
            Track your daily wellness habits to build healthy routines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Water Intake (cups)</label>
                <span>{habits.water}/8</span>
              </div>
              <Slider
                value={[habits.water]}
                onValueChange={(value) => updateHabit("water", value[0])}
                max={8}
                step={1}
              />
              <Progress value={(habits.water / 8) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Sleep (hours)</label>
                <span>{habits.sleep}</span>
              </div>
              <Slider
                value={[habits.sleep]}
                onValueChange={(value) => updateHabit("sleep", value[0])}
                min={4}
                max={12}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>Exercise (minutes)</label>
                <span>{habits.exercise}/30</span>
              </div>
              <Slider
                value={[habits.exercise]}
                onValueChange={(value) => updateHabit("exercise", value[0])}
                max={30}
                step={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Small Changes Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-500" />
            Small Changes for Big Results
          </CardTitle>
          <CardDescription>
            Simple, actionable tips to improve your health and wellness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {healthTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tip.icon className="h-5 w-5" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {quizCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions based on your goals and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Based on your profile, here are some suggestions:
                • Start with a protein-rich breakfast
                • Take 10-minute walk breaks
                • Include more leafy greens in your meals
                • Practice mindful eating
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
