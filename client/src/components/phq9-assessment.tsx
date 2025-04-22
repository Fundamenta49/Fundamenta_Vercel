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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Brain, AlertCircle, InfoIcon, HelpCircle, Heart, Coffee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// PHQ-9 Assessment based on official clinical guidelines
// Reference: Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure.
// J Gen Intern Med. 2001;16(9):606-613.

interface PHQ9Result {
  score: number;
  level: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
  classification: string;
  description: string;
  recommendations: string[];
  mentalHealthPathway: string;
  warningLevel: "none" | "caution" | "warning" | "severe";
  selfCareSteps: string[];
  followUp: string;
}

interface PHQ9AssessmentProps {
  onComplete?: () => void;
}

export default function PHQ9Assessment({ onComplete }: PHQ9AssessmentProps = {}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<PHQ9Result | null>(null);

  // PHQ-9 questions
  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself in some way"
  ];

  // Frequency options
  const frequencyOptions = [
    { value: 0, label: "Not at all", description: "0 days" },
    { value: 1, label: "Several days", description: "1-7 days" },
    { value: 2, label: "More than half the days", description: "8-12 days" },
    { value: 3, label: "Nearly every day", description: "13+ days" }
  ];

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Handle answer change
  const handleAnswerChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);

    // Move to next question or show results if last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate results
  const calculateResults = (answers: number[]) => {
    const totalScore = answers.reduce((acc, value) => acc + value, 0);
    
    let level: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe" = "minimal";
    let classification = "";
    let description = "";
    let recommendations: string[] = [];
    let mentalHealthPathway = "";
    let warningLevel: "none" | "caution" | "warning" | "severe" = "none";
    let selfCareSteps: string[] = [];
    let followUp = "";

    // Determine severity level based on score
    if (totalScore <= 4) {
      level = "minimal";
      classification = "Minimal depression";
      description = "Your responses suggest minimal symptoms of depression. This is a normal range.";
      recommendations = [
        "Maintain your current wellness practices",
        "Continue regular self-care activities",
        "Practice mindfulness and gratitude",
        "Stay connected with friends and family"
      ];
      mentalHealthPathway = "wellness_maintenance";
      warningLevel = "none";
      selfCareSteps = [
        "Regular physical activity",
        "Healthy sleep habits",
        "Social connections",
        "Enjoyable activities"
      ];
      followUp = "Consider reassessment in 3 months to monitor your mental wellbeing.";
    } else if (totalScore <= 9) {
      level = "mild";
      classification = "Mild depression";
      description = "Your responses suggest mild symptoms of depression. Some of these feelings may come and go.";
      recommendations = [
        "Increase physical activity (30 minutes daily if possible)",
        "Practice stress reduction techniques",
        "Maintain social connections",
        "Consider a structured self-help program"
      ];
      mentalHealthPathway = "mild_support";
      warningLevel = "caution";
      selfCareSteps = [
        "Daily journaling",
        "Mindfulness meditation (10-15 minutes daily)",
        "Regular sleep schedule",
        "Limit alcohol and caffeine"
      ];
      followUp = "Consider reassessment in 4-6 weeks to monitor your symptoms.";
    } else if (totalScore <= 14) {
      level = "moderate";
      classification = "Moderate depression";
      description = "Your responses suggest moderate symptoms of depression that may be impacting your daily life.";
      recommendations = [
        "Consider speaking with a mental health professional",
        "Practice daily mood management techniques",
        "Establish regular routines for sleep, meals, and exercise",
        "Use the Wellness Journal to track mood patterns"
      ];
      mentalHealthPathway = "moderate_support";
      warningLevel = "warning";
      selfCareSteps = [
        "Daily mood tracking",
        "Guided meditation or relaxation techniques",
        "Regular physical activity",
        "Scheduled enjoyable activities"
      ];
      followUp = "Consider consulting with a healthcare provider for a professional assessment.";
    } else if (totalScore <= 19) {
      level = "moderately_severe";
      classification = "Moderately severe depression";
      description = "Your responses suggest moderately severe symptoms of depression that are likely impacting multiple areas of your life.";
      recommendations = [
        "Consult with a mental health professional",
        "Follow structured self-care routines",
        "Engage your support network",
        "Use the resources in the Mental Wellness section"
      ];
      mentalHealthPathway = "mental_health_support";
      warningLevel = "warning";
      selfCareSteps = [
        "Structured daily routine",
        "Regular communication with supportive people",
        "Physical activity as possible",
        "Professional guidance for coping strategies"
      ];
      followUp = "We recommend consulting with a healthcare provider for a professional assessment and treatment options.";
    } else {
      level = "severe";
      classification = "Severe depression";
      description = "Your responses suggest severe symptoms of depression that are significantly impacting your daily functioning.";
      recommendations = [
        "Seek professional help from a healthcare provider",
        "Consider a comprehensive mental health evaluation",
        "Engage in supported self-care activities",
        "Maintain close contact with your support network"
      ];
      mentalHealthPathway = "critical_support";
      warningLevel = "severe";
      selfCareSteps = [
        "Immediate connection with healthcare provider",
        "Daily check-ins with trusted support person",
        "Simple self-care activities as manageable",
        "Safety planning if having thoughts of suicide"
      ];
      followUp = "We strongly recommend consulting with a healthcare provider as soon as possible for a professional assessment and treatment.";
    }

    // Special warning for suicide risk (question 9)
    if (answers[8] >= 1) {
      warningLevel = "severe";
      followUp = "Your response to question 9 indicates thoughts of self-harm or suicide. Please speak with a healthcare provider or mental health professional right away, or contact a crisis helpline such as the National Suicide Prevention Lifeline at 988.";
    }

    // Set results
    const result: PHQ9Result = {
      score: totalScore,
      level,
      classification,
      description,
      recommendations,
      mentalHealthPathway,
      warningLevel,
      selfCareSteps,
      followUp
    };

    setResult(result);
    setShowResults(true);

    // Save results to localStorage for integration with other components
    try {
      localStorage.setItem('phq9Assessment', JSON.stringify(result));
      localStorage.setItem('phq9AssessmentDate', new Date().toISOString());
      
      // Trigger onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving PHQ-9 assessment:", error);
    }
  };

  // Reset assessment
  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers(new Array(9).fill(-1));
    setShowResults(false);
    setResult(null);
  };

  if (showResults && result) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-wellness-50 border-b border-wellness-100">
          <CardTitle className="text-wellness-700 flex items-center gap-2">
            <Brain className="h-5 w-5" /> 
            PHQ-9 Assessment Results
          </CardTitle>
          <CardDescription>
            Patient Health Questionnaire-9 - Depression screening assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-wellness-700 mb-4">Assessment Summary</h3>
              
              <div className="bg-wellness-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-wellness-600">Total PHQ-9 Score</span>
                  <span className="text-xl font-bold text-wellness-700">{result.score}/27</span>
                </div>
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        result.level === "minimal" ? "bg-green-500" :
                        result.level === "mild" ? "bg-blue-500" :
                        result.level === "moderate" ? "bg-yellow-500" :
                        result.level === "moderately_severe" ? "bg-orange-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${(result.score / 27) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Minimal (0-4)</span>
                    <span>Mild (5-9)</span>
                    <span>Moderate (10-14)</span>
                    <span>Severe (20+)</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-wellness-700 mb-2">Classification</h4>
                <p className="text-gray-700 mb-2">{result.classification}</p>
                <p className="text-gray-600">{result.description}</p>
              </div>
              
              {result.warningLevel === "severe" && (
                <Alert className="bg-red-50 border-red-100 mb-6">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-700">Important</AlertTitle>
                  <AlertDescription className="text-red-800">
                    Based on your responses, we recommend speaking with a healthcare professional as soon as possible. If you're experiencing thoughts of harming yourself, please contact a crisis service such as the National Suicide Prevention Lifeline at 988, or go to your nearest emergency room.
                  </AlertDescription>
                </Alert>
              )}
              
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
                <h4 className="text-lg font-medium text-wellness-700">Self-Care Steps</h4>
                <ul className="space-y-2">
                  {result.selfCareSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 text-wellness-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-wellness-50 rounded-lg">
                <h4 className="text-md font-medium text-wellness-700 mb-2">Follow-up Recommendations</h4>
                <p className="text-gray-700">{result.followUp}</p>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-100">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle>How to use these results</AlertTitle>
              <AlertDescription className="text-blue-800">
                This assessment provides a snapshot of your current emotional wellbeing. It's not a diagnostic tool, but can help identify patterns that may benefit from attention. Your results have been saved to your wellness profile to help personalize your experience.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-yellow-50 border-yellow-100">
              <HelpCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Seeking Support</AlertTitle>
              <AlertDescription className="text-yellow-800">
                Mental health is an important part of your overall wellbeing. If you're struggling, remember that help is available. Explore the mental wellness resources in the app, or reach out to a healthcare provider for professional support.
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
            <Heart className="h-4 w-4 mr-2" />
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
          <Brain className="h-5 w-5" /> 
          PHQ-9 Assessment
        </CardTitle>
        <CardDescription>
          Patient Health Questionnaire-9 - Depression screening assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-6">
          <div className="bg-wellness-50 p-4 rounded-lg">
            <p className="text-sm text-wellness-700 font-medium mb-1">Over the last 2 weeks, how often have you been bothered by the following problem:</p>
            <p className="text-lg font-medium text-wellness-800">{questions[currentQuestionIndex]}</p>
          </div>
          
          <div className="space-y-1">
            <RadioGroup
              value={answers[currentQuestionIndex] >= 0 ? answers[currentQuestionIndex].toString() : ""}
              onValueChange={(value) => handleAnswerChange(parseInt(value))}
              className="space-y-3"
            >
              {frequencyOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2 rounded-md border p-3 hover:bg-gray-50">
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`q${currentQuestionIndex}-${option.value}`} 
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={`q${currentQuestionIndex}-${option.value}`} className="text-base font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {currentQuestionIndex === 8 && (
            <Alert className="bg-yellow-50 border-yellow-100">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-yellow-800">
                If you're experiencing thoughts of harming yourself, please reach out for help. The National Suicide Prevention Lifeline is available 24/7 at 988, or you can text HOME to 741741 to reach the Crisis Text Line.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <Button 
            onClick={() => {
              if (answers[currentQuestionIndex] >= 0) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                toast({
                  variant: "destructive",
                  title: "No answer selected",
                  description: "Please select an answer before proceeding.",
                });
              }
            }}
          >
            Next
          </Button>
        ) : (
          <Button 
            className="bg-wellness-600 hover:bg-wellness-700" 
            onClick={() => {
              if (answers[currentQuestionIndex] >= 0) {
                calculateResults(answers);
              } else {
                toast({
                  variant: "destructive",
                  title: "No answer selected",
                  description: "Please select an answer before proceeding.",
                });
              }
            }}
          >
            Complete Assessment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}