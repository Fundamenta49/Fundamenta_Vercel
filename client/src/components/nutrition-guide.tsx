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
import { Badge } from "@/components/ui/badge";
import { Refrigerator } from "lucide-react";

interface HabitTracker {
  water: number;
  sleep: number;
  exercise: number;
  meditation: number;
}

interface QuizAnswers {
  nutrition: {
    fruitsAndVegetables: string;
    sugaryDrinks: string;
    processedFood: string;
    skipMeals: string;
  };
  activity: {
    physicalActivity: string;
    limitations: string;
    dailyActivity: string;
  };
  sleep: {
    hoursOfSleep: string;
    feelingRested: string;
    sleepTrouble: string;
  };
  mentalHealth: {
    stressLevel: string;
    relaxationActivities: string;
    anxiety: string;
  };
  healthcare: {
    lastCheckup: string;
    provider: string;
    insurance: string;
  };
}

const initialQuizState: QuizAnswers = {
  nutrition: {
    fruitsAndVegetables: "",
    sugaryDrinks: "",
    processedFood: "",
    skipMeals: "",
  },
  activity: {
    physicalActivity: "",
    limitations: "",
    dailyActivity: "",
  },
  sleep: {
    hoursOfSleep: "",
    feelingRested: "",
    sleepTrouble: "",
  },
  mentalHealth: {
    stressLevel: "",
    relaxationActivities: "",
    anxiety: "",
  },
  healthcare: {
    lastCheckup: "",
    provider: "",
    insurance: "",
  },
};

export default function NutritionGuide() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof QuizAnswers>("nutrition");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(initialQuizState);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [habits, setHabits] = useState<HabitTracker>({
    water: 0,
    sleep: 7,
    exercise: 0,
    meditation: 0,
  });

  const handleQuizSubmit = () => {
    // Generate recommendations based on answers
    const newRecommendations: string[] = [];

    // Nutrition recommendations
    if (quizAnswers.nutrition.fruitsAndVegetables === "A") {
      newRecommendations.push("Try to incorporate more fruits and vegetables into your daily meals");
    }
    if (quizAnswers.nutrition.sugaryDrinks === "A") {
      newRecommendations.push("Consider replacing sugary drinks with water or unsweetened beverages");
    }

    // Activity recommendations
    if (quizAnswers.activity.physicalActivity === "A") {
      newRecommendations.push("Start with simple exercises like walking for 10 minutes daily");
    }

    // Sleep recommendations
    if (quizAnswers.sleep.hoursOfSleep === "A" || quizAnswers.sleep.hoursOfSleep === "B") {
      newRecommendations.push("Work on getting 7-9 hours of sleep per night");
    }

    // Mental health recommendations
    if (quizAnswers.mentalHealth.stressLevel === "A") {
      newRecommendations.push("Consider practicing daily stress-reduction techniques");
    }

    // Healthcare recommendations
    if (quizAnswers.healthcare.lastCheckup === "A") {
      newRecommendations.push("Schedule a check-up with a healthcare provider");
    }

    setRecommendations(newRecommendations);
    setQuizCompleted(true);
  };

  const updateHabit = (habit: keyof HabitTracker, value: number) => {
    setHabits((prev) => ({
      ...prev,
      [habit]: value,
    }));
  };

  const updateQuizAnswer = (section: keyof QuizAnswers, question: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: answer
      }
    }));
  };

  const renderQuizSection = () => {
    switch (currentSection) {
      case "nutrition":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How many servings of fruits and vegetables do you eat per day?</h3>
              <div className="space-x-2">
                <Button 
                  variant={quizAnswers.nutrition.fruitsAndVegetables === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "fruitsAndVegetables", "A")}
                >0-1</Button>
                <Button 
                  variant={quizAnswers.nutrition.fruitsAndVegetables === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "fruitsAndVegetables", "B")}
                >2-3</Button>
                <Button 
                  variant={quizAnswers.nutrition.fruitsAndVegetables === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "fruitsAndVegetables", "C")}
                >4+</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-2">How often do you drink sugary drinks?</h3>
              <div className="space-x-2">
                <Button 
                  variant={quizAnswers.nutrition.sugaryDrinks === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "sugaryDrinks", "A")}
                >Daily</Button>
                <Button 
                  variant={quizAnswers.nutrition.sugaryDrinks === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "sugaryDrinks", "B")}
                >A few times a week</Button>
                <Button 
                  variant={quizAnswers.nutrition.sugaryDrinks === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("nutrition", "sugaryDrinks", "C")}
                >Rarely/Never</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                disabled={true}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("activity")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How often do you engage in physical activity?</h3>
              <div className="space-x-2">
                <Button 
                  variant={quizAnswers.activity.physicalActivity === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("activity", "physicalActivity", "A")}
                >Rarely/Never</Button>
                <Button 
                  variant={quizAnswers.activity.physicalActivity === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("activity", "physicalActivity", "B")}
                >2-3 times a week</Button>
                <Button 
                  variant={quizAnswers.activity.physicalActivity === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("activity", "physicalActivity", "C")}
                >4+ times a week</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("nutrition")}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("sleep")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "sleep":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How many hours of sleep do you get on average?</h3>
              <div className="space-x-2">
                <Button 
                  variant={quizAnswers.sleep.hoursOfSleep === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("sleep", "hoursOfSleep", "A")}
                >Less than 5</Button>
                <Button 
                  variant={quizAnswers.sleep.hoursOfSleep === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("sleep", "hoursOfSleep", "B")}
                >5-7</Button>
                <Button 
                  variant={quizAnswers.sleep.hoursOfSleep === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("sleep", "hoursOfSleep", "C")}
                >7+</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("activity")}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("mentalHealth")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "mentalHealth":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">How often do you feel stressed or overwhelmed?</h3>
              <div className="space-x-2">
                <Button 
                  variant={quizAnswers.mentalHealth.stressLevel === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("mentalHealth", "stressLevel", "A")}
                >Daily</Button>
                <Button 
                  variant={quizAnswers.mentalHealth.stressLevel === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("mentalHealth", "stressLevel", "B")}
                >A few times a week</Button>
                <Button 
                  variant={quizAnswers.mentalHealth.stressLevel === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("mentalHealth", "stressLevel", "C")}
                >Rarely</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("sleep")}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentSection("healthcare")}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "healthcare":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2">When was your last full health check-up?</h3>
              <div className="space-x-2">
                <Button 
                  variant={quizAnswers.healthcare.lastCheckup === "A" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("healthcare", "lastCheckup", "A")}
                >Over a year ago / Never</Button>
                <Button 
                  variant={quizAnswers.healthcare.lastCheckup === "B" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("healthcare", "lastCheckup", "B")}
                >6-12 months ago</Button>
                <Button 
                  variant={quizAnswers.healthcare.lastCheckup === "C" ? "default" : "outline"}
                  onClick={() => updateQuizAnswer("healthcare", "lastCheckup", "C")}
                >Within 6 months</Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSection("mentalHealth")}
              >
                Previous
              </Button>
              <Button
                onClick={handleQuizSubmit}
              >
                Complete Quiz
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            Take our comprehensive wellness assessment to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!quizCompleted ? (
            <>
              <div className="mb-4">
                <Progress value={(Object.values(quizAnswers[currentSection]).filter(Boolean).length / 3) * 100} />
              </div>
              {renderQuizSection()}
            </>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Based on your answers, here are your personalized recommendations:
                </AlertDescription>
              </Alert>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  setQuizCompleted(false);
                  setQuizAnswers(initialQuizState);
                  setCurrentSection("nutrition");
                }}
              >
                Retake Quiz
              </Button>
            </div>
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