import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, AlertCircle, FileText, Heart, InfoIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// PAVS Assessment Questions according to official guidelines
// Questions based on: Coleman KJ, et al. Initial validation of an exercise "vital sign" in electronic medical records. 
// Med Sci Sports Exerc. 2012;44(11):2071-2076.

interface PAVSResult {
  minutesPerWeek: number;
  daysPerWeek: number;
  intensity: "light" | "moderate" | "vigorous" | "mixed";
  classificationLevel: "inactive" | "insufficient" | "active";
  classificationText: string;
  recommendationLevel: string;
  recommendations: string[];
  actions: string[];
}

interface PAVSAssessmentProps {
  onComplete?: () => void;
}

export default function PAVSAssessment({ onComplete }: PAVSAssessmentProps = {}) {
  const [step, setStep] = useState(1);
  const [daysPerWeek, setDaysPerWeek] = useState<number | null>(null);
  const [minutesPerDay, setMinutesPerDay] = useState<number | null>(null);
  const [intensity, setIntensity] = useState<"light" | "moderate" | "vigorous" | "mixed" | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<PAVSResult | null>(null);

  const totalSteps = 3;
  const progressPercentage = (step / totalSteps) * 100;

  const handleSubmit = () => {
    if (!daysPerWeek || !minutesPerDay || !intensity) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please complete all questions before proceeding.",
      });
      return;
    }

    // Calculate minutes per week
    const minutesPerWeek = daysPerWeek * minutesPerDay;

    // Determine activity classification
    let classificationLevel: "inactive" | "insufficient" | "active" = "inactive";
    let classificationText = "";
    let recommendationLevel = "";
    let recommendations: string[] = [];
    let actions: string[] = [];

    if (daysPerWeek === 0 || minutesPerWeek < 10) {
      classificationLevel = "inactive";
      classificationText = "You currently have minimal physical activity.";
      recommendationLevel = "high-priority";
      recommendations = [
        "Start with very short sessions (5-10 minutes) of light activity",
        "Focus on activities you enjoy and can easily incorporate into your day",
        "Consider walking, gentle stretching, or other low-impact activities",
        "Gradually increase duration as your fitness improves"
      ];
      actions = [
        "Schedule two 10-minute walks this week",
        "Stand up and move around for 2-3 minutes every hour during the day",
        "Set a realistic goal to gradually increase activity over the next month"
      ];
    } else if (minutesPerWeek < 150 || (daysPerWeek < 5 && intensity !== "vigorous")) {
      classificationLevel = "insufficient";
      classificationText = "You're getting some activity, but less than recommended levels.";
      recommendationLevel = "moderate-priority";
      recommendations = [
        "Gradually increase your activity to reach 150 minutes per week",
        "Add one more day of activity per week if possible",
        "Consider adding both cardio and strength training activities",
        "Increase intensity gradually if appropriate for your fitness level"
      ];
      actions = [
        "Add 5-10 minutes to your current activity sessions",
        "Schedule an additional day of activity in your week",
        "Try a new activity that interests you for variety"
      ];
    } else {
      classificationLevel = "active";
      classificationText = "You're meeting or exceeding recommended activity levels!";
      recommendationLevel = "maintenance";
      recommendations = [
        "Maintain your current activity level",
        "Consider adding variety to your routine to work different muscle groups",
        "If interested, you could increase intensity for additional health benefits",
        "Focus on recovery and proper nutrition to support your activity"
      ];
      actions = [
        "Continue your current routine, which is already beneficial",
        "Consider tracking specific fitness goals",
        "Share your activity habits with others as motivation"
      ];
    }

    const result: PAVSResult = {
      minutesPerWeek,
      daysPerWeek,
      intensity,
      classificationLevel,
      classificationText,
      recommendationLevel,
      recommendations,
      actions
    };

    setResult(result);
    setShowResults(true);

    // Save results to localStorage for integration with other components
    try {
      localStorage.setItem('pavsAssessment', JSON.stringify(result));
      localStorage.setItem('pavsAssessmentDate', new Date().toISOString());
      
      // Trigger onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving PAVS assessment:", error);
    }
  };

  const resetAssessment = () => {
    setDaysPerWeek(null);
    setMinutesPerDay(null);
    setIntensity(null);
    setStep(1);
    setShowResults(false);
    setResult(null);
  };

  const getIntensityExamples = (intensityType: string) => {
    switch(intensityType) {
      case "light":
        return "Casual walking, light housework, gentle stretching";
      case "moderate":
        return "Brisk walking, cycling on level ground, water aerobics, gardening";
      case "vigorous":
        return "Running, swimming laps, hiking uphill, high-intensity interval training";
      case "mixed":
        return "A combination of different intensity activities throughout the week";
      default:
        return "";
    }
  };

  if (showResults && result) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-wellness-50 border-b border-wellness-100">
          <CardTitle className="text-wellness-700 flex items-center gap-2">
            <Dumbbell className="h-5 w-5" /> 
            PAVS Assessment Results
          </CardTitle>
          <CardDescription>
            Physical Activity Vital Sign - Your activity level assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-wellness-700 mb-4">Activity Summary</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-wellness-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-wellness-600 font-medium">Days Per Week</p>
                  <p className="text-2xl font-bold text-wellness-700">{result.daysPerWeek}</p>
                </div>
                <div className="bg-wellness-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-wellness-600 font-medium">Minutes Per Week</p>
                  <p className="text-2xl font-bold text-wellness-700">{result.minutesPerWeek}</p>
                </div>
                <div className="bg-wellness-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-wellness-600 font-medium">Intensity</p>
                  <p className="text-2xl font-bold text-wellness-700 capitalize">{result.intensity}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-wellness-700 mb-2">Activity Classification</h4>
                <div className={`p-4 rounded-lg ${
                  result.classificationLevel === "active" ? "bg-green-50 border border-green-100" :
                  result.classificationLevel === "insufficient" ? "bg-yellow-50 border border-yellow-100" :
                  "bg-orange-50 border border-orange-100"
                }`}>
                  <p className={`font-semibold ${
                    result.classificationLevel === "active" ? "text-green-700" :
                    result.classificationLevel === "insufficient" ? "text-yellow-700" :
                    "text-orange-700"
                  }`}>
                    {result.classificationLevel === "active" ? "Meeting Recommendations" :
                     result.classificationLevel === "insufficient" ? "Approaching Recommendations" :
                     "Below Recommendations"}
                  </p>
                  <p className="mt-1 text-gray-700">{result.classificationText}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-wellness-700">Recommendations</h4>
                <ul className="space-y-2 list-disc pl-5">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-wellness-700">Action Steps</h4>
                <ul className="space-y-2">
                  {result.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 text-wellness-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-100">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle>How to use these results</AlertTitle>
              <AlertDescription className="text-blue-800">
                This assessment provides a baseline for your current activity level. Consider discussing these results with a healthcare provider or fitness professional for personalized guidance. Remember that any increase in physical activity offers health benefits.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-2 pb-6">
          <Button 
            variant="outline" 
            className="border-wellness-200 text-wellness-700 hover:bg-wellness-50"
            onClick={resetAssessment}
          >
            Retake Assessment
          </Button>
          <Button className="bg-wellness-600 hover:bg-wellness-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Save to Wellness Profile
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-wellness-50 border-b border-wellness-100">
        <CardTitle className="text-wellness-700 flex items-center gap-2">
          <Heart className="h-5 w-5" /> 
          Physical Activity Assessment (PAVS)
        </CardTitle>
        <CardDescription>
          Physical Activity Vital Sign - Evaluate your current activity level
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{step} of {totalSteps}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-wellness-700 mb-2">Days of Physical Activity</h3>
              <p className="text-gray-600 mb-4">
                On average, how many days per week do you engage in moderate to vigorous physical activity?
              </p>
              
              <RadioGroup
                value={daysPerWeek?.toString() || ""}
                onValueChange={(value) => setDaysPerWeek(parseInt(value))}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <RadioGroupItem value={day.toString()} id={`days-${day}`} />
                    <Label htmlFor={`days-${day}`} className="cursor-pointer">
                      {day} {day === 1 ? "day" : "days"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Alert className="bg-wellness-50 border-wellness-100">
              <InfoIcon className="h-4 w-4 text-wellness-600" />
              <AlertDescription className="text-wellness-800">
                Moderate to vigorous physical activity includes activities that increase your heart rate and make you breathe harder than normal.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-wellness-700 mb-2">Minutes Per Day</h3>
              <p className="text-gray-600 mb-4">
                On the days you engage in physical activity, how many minutes, on average, do you spend being active?
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[10, 15, 20, 30, 45, 60].map((minutes) => (
                    <Button
                      key={minutes}
                      type="button"
                      variant={minutesPerDay === minutes ? "default" : "outline"}
                      className={minutesPerDay === minutes ? "bg-wellness-600 hover:bg-wellness-700" : ""}
                      onClick={() => setMinutesPerDay(minutes)}
                    >
                      {minutes} minutes
                    </Button>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <Label htmlFor="custom-minutes" className="sm:w-auto whitespace-nowrap">
                    Custom amount:
                  </Label>
                  <div className="w-full sm:w-32">
                    <Input
                      id="custom-minutes"
                      type="number"
                      min={1}
                      max={300}
                      value={minutesPerDay !== null && ![10, 15, 20, 30, 45, 60].includes(minutesPerDay) ? minutesPerDay : ""}
                      onChange={(e) => setMinutesPerDay(parseInt(e.target.value) || 0)}
                      placeholder="Minutes"
                    />
                  </div>
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-wellness-700 mb-2">Exercise Intensity</h3>
              <p className="text-gray-600 mb-4">
                What is the typical intensity of your physical activity?
              </p>
              
              <RadioGroup
                value={intensity || ""}
                onValueChange={(value) => setIntensity(value as any)}
                className="space-y-4"
              >
                {["light", "moderate", "vigorous", "mixed"].map((level) => (
                  <div key={level} className="flex items-start space-x-2 rounded-md border p-4 hover:bg-wellness-50">
                    <RadioGroupItem value={level} id={`intensity-${level}`} className="mt-1" />
                    <div>
                      <Label htmlFor={`intensity-${level}`} className="text-base font-medium cursor-pointer capitalize">
                        {level} Intensity
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {getIntensityExamples(level)}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Alert className="bg-yellow-50 border-yellow-100">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                If you're new to exercise or have any health concerns, always start with light intensity activities and gradually increase as your fitness improves.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-6">
        {step > 1 ? (
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)}
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < totalSteps ? (
          <Button 
            onClick={() => {
              if (step === 1 && daysPerWeek === null) {
                toast({
                  variant: "destructive",
                  title: "Missing information",
                  description: "Please select the number of days per week.",
                });
                return;
              }
              
              if (step === 2 && (!minutesPerDay || minutesPerDay < 1)) {
                toast({
                  variant: "destructive",
                  title: "Missing information",
                  description: "Please enter the number of minutes per day.",
                });
                return;
              }
              
              setStep(step + 1);
            }}
          >
            Next
          </Button>
        ) : (
          <Button 
            className="bg-wellness-600 hover:bg-wellness-700" 
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}