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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";

// Icons
import { 
  Coffee, Heart, Brain, Check, FileText, 
  ChevronRight, ArrowLeft, Save, Share2 
} from "lucide-react";

// Import the new questions format
import { 
  coffeeTalkQuestions, 
  getWellbeingScore, 
  getDepressionScore, 
  getAnxietyScore,
  checkSuicidalIdeation
} from "./coffee-talk-questions";

// Severity levels for depression scoring
const depressionSeverity = [
  { 
    range: [0, 4], 
    level: "Minimal", 
    description: "You're showing minimal signs of depression.", 
    color: "bg-green-500",
    recommendation: "Continue with your current activities and monitor how you feel." 
  },
  { 
    range: [5, 9], 
    level: "Mild", 
    description: "You may be experiencing mild depression symptoms.", 
    color: "bg-yellow-400",
    recommendation: "Consider talking to someone you trust about how you're feeling and engage in self-care activities." 
  },
  { 
    range: [10, 14], 
    level: "Moderate", 
    description: "Your symptoms suggest moderate depression.", 
    color: "bg-orange-400",
    recommendation: "Consider speaking with a mental health professional for further evaluation and support." 
  },
  { 
    range: [15, 19], 
    level: "Moderately Severe", 
    description: "You're showing signs of moderately severe depression.", 
    color: "bg-red-400",
    recommendation: "We recommend speaking with a mental health professional as soon as possible to discuss treatment options." 
  },
  { 
    range: [20, 27], 
    level: "Severe", 
    description: "Your symptoms indicate severe depression.", 
    color: "bg-red-600",
    recommendation: "Please seek professional help immediately from a healthcare provider or mental health specialist." 
  }
];

// Severity levels for anxiety
const anxietySeverity = [
  { 
    range: [0, 4], 
    level: "Minimal", 
    description: "You're showing minimal signs of anxiety.", 
    color: "bg-green-500",
    recommendation: "Continue with your current activities and monitor how you feel." 
  },
  { 
    range: [5, 9], 
    level: "Mild", 
    description: "You may be experiencing mild anxiety symptoms.", 
    color: "bg-yellow-400",
    recommendation: "Consider practicing relaxation techniques and monitor your symptoms." 
  },
  { 
    range: [10, 14], 
    level: "Moderate", 
    description: "Your symptoms suggest moderate anxiety.", 
    color: "bg-orange-400",
    recommendation: "Consider speaking with a mental health professional for further evaluation and support." 
  },
  { 
    range: [15, 21], 
    level: "Severe", 
    description: "Your symptoms indicate severe anxiety.", 
    color: "bg-red-500",
    recommendation: "Please seek professional help from a healthcare provider or mental health specialist." 
  }
];

// Severity levels for wellbeing
const wellbeingSeverity = [
  { 
    range: [0, 25], 
    level: "Low", 
    percent: "0-25%",
    description: "Your wellbeing score suggests you may be experiencing significant challenges with your mental wellbeing.", 
    color: "bg-red-500",
    recommendation: "Consider talking to a healthcare professional about ways to improve your wellbeing." 
  },
  { 
    range: [26, 50], 
    level: "Below Average", 
    percent: "26-50%",
    description: "Your wellbeing score is below average, suggesting you might benefit from additional support.", 
    color: "bg-orange-400",
    recommendation: "Focus on self-care and consider speaking with someone about how you're feeling." 
  },
  { 
    range: [51, 75], 
    level: "Moderate", 
    percent: "51-75%",
    description: "Your wellbeing score is in the moderate range, indicating a relatively balanced emotional state with room for improvement.", 
    color: "bg-yellow-400",
    recommendation: "Continue with positive lifestyle habits and consider adding more activities that boost your mood." 
  },
  { 
    range: [76, 100], 
    level: "Excellent", 
    percent: "76-100%",
    description: "Your wellbeing score indicates you're experiencing high levels of positive emotions, energy, and satisfaction in your daily life.", 
    color: "bg-green-500",
    recommendation: "Wonderful! You seem to have established practices and circumstances that support your flourishing. Consider how you might maintain these positive patterns during challenging times." 
  }
];

// Helper function to get depression severity level
const getDepressionLevel = (score: number) => {
  const level = depressionSeverity.find(s => score >= s.range[0] && score <= s.range[1]);
  return level ? level.level : "Unknown";
};

// Helper function to get anxiety severity level
const getAnxietyLevel = (score: number) => {
  const level = anxietySeverity.find(s => score >= s.range[0] && score <= s.range[1]);
  return level ? level.level : "Unknown";
};

// Helper function for wellbeing level 
const getWellbeingLevel = (percentage: number) => {
  const level = wellbeingSeverity.find(s => percentage >= s.range[0] && percentage <= s.range[1]);
  return level ? level.level : "Unknown";
};

// Helper function to get severity color
const getSeverityColor = (score: number, category: "wellbeing" | "depression" | "anxiety") => {
  if (category === "wellbeing") {
    const level = wellbeingSeverity.find(s => score >= s.range[0] && score <= s.range[1]);
    return level ? level.color : "bg-gray-400";
  } else if (category === "depression") {
    const level = depressionSeverity.find(s => score >= s.range[0] && score <= s.range[1]);
    return level ? level.color : "bg-gray-400";
  } else {
    const level = anxietySeverity.find(s => score >= s.range[0] && score <= s.range[1]);
    return level ? level.color : "bg-gray-400";
  }
};

// Main component
export default function CoffeeTalkAssessment() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: string, value: number}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState<"overview" | "mental">("overview");
  const [isPending, setIsPending] = useState(false);
  const [consentToStore, setConsentToStore] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / coffeeTalkQuestions.length) * 100;
  
  // Reset assessment
  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setActiveResultsTab("overview");
    setResults(null);
    setConsentToStore(false);
  };
  
  // Handle question answer
  const handleAnswer = (value: number) => {
    const questionId = coffeeTalkQuestions[currentQuestionIndex].questionId;
    
    // Update answers
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, value };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, { questionId, value }];
      }
    });
    
    // Move to next question or show results if last question
    if (currentQuestionIndex < coffeeTalkQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };
  
  // Handle skipping a question
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < coffeeTalkQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };
  
  // Handle going back to a previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Submit the assessment
  const submitAssessment = async () => {
    setIsPending(true);
    
    try {
      // Calculate scores
      const wellbeingScores = getWellbeingScore(answers);
      const depressionScore = getDepressionScore(answers);
      const anxietyScore = getAnxietyScore(answers);
      
      // Get severity levels
      const wellbeingLevel = getWellbeingLevel(wellbeingScores.percentage);
      const depressionLevel = getDepressionLevel(depressionScore);
      const anxietyLevel = getAnxietyLevel(anxietyScore);
      
      // Check for suicidal ideation
      const suicidalIdeation = checkSuicidalIdeation(answers);
      
      // Prepare result data
      const assessmentResults = {
        mentalMetrics: {
          wellbeingScore: wellbeingScores.raw,
          wellbeingPercentage: wellbeingScores.percentage,
          wellbeingLevel: wellbeingLevel,
          depressionScore: depressionScore,
          depressionLevel: depressionLevel,
          anxietyScore: anxietyScore,
          anxietyLevel: anxietyLevel,
          suicidalIdeation: suicidalIdeation
        },
        recommendations: {
          mentalWellness: [
            "Practice mindfulness or meditation for 10 minutes daily",
            "Schedule regular social interactions with friends or family",
            "Establish a consistent sleep schedule",
            "Engage in physical activity at least 3 times per week"
          ],
          integratedWellness: [
            "Consider journaling to track your mood patterns",
            "Try breathing exercises when feeling overwhelmed",
            "Stay hydrated and maintain balanced nutrition",
            "Set aside time for activities you genuinely enjoy"
          ]
        }
      };
      
      setResults(assessmentResults);
      setShowResults(true);
      setIsPending(false);
    } catch (error) {
      console.error("Error processing assessment:", error);
      setIsPending(false);
    }
  };
  
  // Save results to wellness journal (placeholder function)
  const saveToJournal = () => {
    if (!consentToStore || !results) return;
    
    // This would be connected to an API to save the results
    console.log("Saving results to wellness journal:", results);
    
    // Show confirmation message (could use a toast notification)
    alert("Your results have been saved to your wellness journal.");
  };
  
  // Render question content
  const renderContent = () => {
    if (showResults) {
      return renderResults();
    }
    
    const currentQuestion = coffeeTalkQuestions[currentQuestionIndex];
    
    return (
      <>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Coffee className="h-6 w-6 text-amber-600" />
            Coffee Talk
          </CardTitle>
          <CardDescription>
            Let's have a friendly conversation about how you're feeling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {coffeeTalkQuestions.length}
              </span>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} Check-In
              </Badge>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 mb-6"
            />
            
            <div className="mb-8">
              {currentQuestion.displayFormat.prefix && (
                <div className="text-sm text-amber-700 mb-2">{currentQuestion.displayFormat.prefix}</div>
              )}
              <h3 className="text-base sm:text-lg font-medium mb-4 leading-relaxed">
                {currentQuestion.text}
              </h3>
              
              <RadioGroup
                className="gap-3"
                value={
                  answers.find(a => a.questionId === currentQuestion.questionId)?.value.toString() || ""
                }
                onValueChange={(value) => handleAnswer(parseInt(value))}
              >
                {currentQuestion.responseOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 rounded-md border p-3">
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`option-${option.value}`}
                      className="mt-1 h-5 w-5 !border-amber-600 data-[state=checked]:!text-amber-600 data-[state=checked]:!ring-2 data-[state=checked]:!ring-amber-300"
                    />
                    <Label htmlFor={`option-${option.value}`} className="flex flex-col flex-1">
                      <span className="font-medium text-sm sm:text-base">{option.label}</span>
                      <span className="text-xs sm:text-sm text-gray-500">{option.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Support alert if needed */}
            {currentQuestion.displayFormat.showAlert && (
              <Alert className="bg-amber-50 border-amber-100 mt-4">
                <Brain className="h-4 w-4 text-amber-600" />
                <AlertTitle>A gentle reminder</AlertTitle>
                <AlertDescription className="text-amber-800">
                  {currentQuestion.displayFormat.alertContent}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </>
    );
  };
  
  // Render results
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Coffee Talk Results
          </CardTitle>
          <CardDescription>
            Thank you for taking the time to complete this wellness check-in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs 
            defaultValue="overview" 
            value={activeResultsTab} 
            onValueChange={(value) => setActiveResultsTab(value as "overview" | "mental")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mental">Mental Wellness</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mental Wellness Summary</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Well-being</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.mentalMetrics.wellbeingPercentage}%</div>
                      <p className="text-xs text-muted-foreground">{results.mentalMetrics.wellbeingLevel}</p>
                    </CardContent>
                    <div className={`${getSeverityColor(results.mentalMetrics.wellbeingPercentage, "wellbeing")} h-1 w-full`} />
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Depression</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.mentalMetrics.depressionScore}/27</div>
                      <p className="text-xs text-muted-foreground">{results.mentalMetrics.depressionLevel}</p>
                    </CardContent>
                    <div className={`${getSeverityColor(results.mentalMetrics.depressionScore, "depression")} h-1 w-full`} />
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Anxiety</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.mentalMetrics.anxietyScore}/21</div>
                      <p className="text-xs text-muted-foreground">{results.mentalMetrics.anxietyLevel}</p>
                    </CardContent>
                    <div className={`${getSeverityColor(results.mentalMetrics.anxietyScore, "anxiety")} h-1 w-full`} />
                  </Card>
                </div>
              </div>
              
              {results.mentalMetrics.suicidalIdeation && (
                <Alert className="bg-amber-50 border-amber-100">
                  <Brain className="h-4 w-4 text-amber-600" />
                  <AlertTitle>Wellness suggestion</AlertTitle>
                  <AlertDescription className="text-amber-800">
                    Based on your responses, connecting with a supportive friend, family member, or mental health professional could be beneficial for your wellbeing. Taking care of your mental health is just as important as physical health.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recommendations</h3>
                <div className="space-y-2">
                  {results.recommendations.integratedWellness.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
                      <Check className="h-5 w-5 mt-0.5 text-green-500" />
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="consent" 
                    checked={consentToStore} 
                    onCheckedChange={(checked) => setConsentToStore(checked === true)}
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Save to my wellness journal
                  </label>
                </div>
                
                <Button 
                  onClick={saveToJournal} 
                  disabled={!consentToStore} 
                  size="sm" 
                  variant="outline"
                  className="text-sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Results
                </Button>
              </div>
              
              <div className="pt-2 text-center text-sm text-gray-500">
                This assessment is not a diagnostic tool. Please consult a healthcare professional for medical advice.
              </div>
            </TabsContent>
            
            <TabsContent value="mental" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mental Health Scores</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="wellbeing">
                    <AccordionTrigger>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Wellbeing</Badge>
                        <span className="font-medium">{results.mentalMetrics.wellbeingScore}/25 ({results.mentalMetrics.wellbeingPercentage}%)</span>
                        <span className="text-sm text-gray-500">- {results.mentalMetrics.wellbeingLevel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="mb-4">The WHO-5 Well-Being Index is a short questionnaire measuring subjective well-being and positive mood, vitality, and interest in daily activities.</p>
                      <div className={`h-2 w-full mb-2 ${getSeverityColor(results.mentalMetrics.wellbeingPercentage, "wellbeing")} rounded-full`} />
                      <p className="text-sm">
                        {wellbeingSeverity.find(s => 
                          results.mentalMetrics.wellbeingPercentage >= s.range[0] && 
                          results.mentalMetrics.wellbeingPercentage <= s.range[1]
                        )?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="depression">
                    <AccordionTrigger>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Depression</Badge>
                        <span className="font-medium">{results.mentalMetrics.depressionScore}/27</span>
                        <span className="text-sm text-gray-500">- {results.mentalMetrics.depressionLevel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="mb-4">The PHQ-9 is a 9-question instrument used to screen for depression severity.</p>
                      <div className={`h-2 w-full mb-2 ${getSeverityColor(results.mentalMetrics.depressionScore, "depression")} rounded-full`} />
                      <p className="text-sm">
                        {depressionSeverity.find(s => 
                          results.mentalMetrics.depressionScore >= s.range[0] && 
                          results.mentalMetrics.depressionScore <= s.range[1]
                        )?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="anxiety">
                    <AccordionTrigger>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Anxiety</Badge>
                        <span className="font-medium">{results.mentalMetrics.anxietyScore}/21</span>
                        <span className="text-sm text-gray-500">- {results.mentalMetrics.anxietyLevel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="mb-4">The GAD-7 is a 7-question instrument used to screen for anxiety severity.</p>
                      <div className={`h-2 w-full mb-2 ${getSeverityColor(results.mentalMetrics.anxietyScore, "anxiety")} rounded-full`} />
                      <p className="text-sm">
                        {anxietySeverity.find(s => 
                          results.mentalMetrics.anxietyScore >= s.range[0] && 
                          results.mentalMetrics.anxietyScore <= s.range[1]
                        )?.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mental Wellness Recommendations</h3>
                <div className="space-y-2">
                  {results.recommendations.mentalWellness.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
                      <Check className="h-5 w-5 mt-0.5 text-green-500" />
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <h3 className="text-md font-medium">Resources</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-amber-600 hover:underline">Understanding Mental Health</a>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-amber-600 hover:underline">Mindfulness and Meditation Techniques</a>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-amber-600 hover:underline">Finding Mental Health Support</a>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </>
    );
  };
  
  // Render navigation buttons
  const renderNavButtons = () => {
    if (showResults) {
      return (
        <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
          <Button 
            variant="outline" 
            onClick={resetAssessment}
            className="w-full sm:w-auto"
          >
            Take Assessment Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
        <Button 
          variant="outline" 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="order-2 sm:order-1 w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
          <Button 
            variant="ghost" 
            onClick={handleSkipQuestion}
            className="w-full sm:w-auto"
          >
            Skip
          </Button>
          <Button 
            variant="default"
            onClick={submitAssessment}
            disabled={isPending}
            className={`${currentQuestionIndex === coffeeTalkQuestions.length - 1 ? "" : "hidden"} w-full sm:w-auto`}
          >
            {isPending ? "Processing..." : "Complete Assessment"}
          </Button>
        </div>
      </div>
    );
  };
  
  // Main JSX
  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-amber-600" />
              Coffee Talk
            </CardTitle>
            <CardDescription className="text-gray-600">
              Let's connect—and realign—with what really matters
            </CardDescription>
          </div>
          
          <div className="w-full sm:w-auto">
            <div 
              onClick={() => setIsOpen(true)}
              className="cursor-pointer px-5 py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-amber-950 font-medium text-base flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <Coffee className="h-5 w-5 flex-shrink-0" />
              <div className="whitespace-nowrap">Let's Talk</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-6 md:p-8 relative overflow-hidden">
          <div className="w-full">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">Our Coffee Talk Journey</h3>
            <p className="text-gray-700 mb-4">
              Let's have a friendly conversation about your mental wellbeing to understand how you're doing.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-amber-100 p-2 mr-3">
                    <Heart className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-amber-700 text-base">Depression Screening</h4>
                </div>
                <p className="text-sm text-gray-600">
                  A brief PHQ-9 assessment to help understand your mood and identify potential depression symptoms.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-amber-100 p-2 mr-3">
                    <Brain className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-amber-700 text-base">Anxiety Check-In</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Using the GAD-7 to assess anxiety levels and help identify strategies to manage worry or nervousness.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-amber-100 p-2 mr-3">
                    <Coffee className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-amber-700 text-base">Positive Wellbeing</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Measure your overall sense of wellbeing and positive mental health with the WHO-5 assessment.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="rounded-full bg-amber-100 p-1">
                  <Share2 className="h-4 w-4 text-amber-600" />
                </div>
                <h4 className="font-medium text-amber-700">Holistic Approach</h4>
              </div>
              <p className="text-gray-700 text-sm">
                Our conversational assessment helps us understand your mental wellbeing from different angles, providing personalized insights and recommendations.
              </p>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-64 h-64 -mb-12 -mr-12 opacity-10">
            <Coffee className="absolute w-full h-full text-amber-700" />
          </div>
        </div>
      </CardContent>
      
      <FullScreenDialog open={isOpen} onOpenChange={setIsOpen}>
        <FullScreenDialogContent themeColor="#f59e0b">
          <FullScreenDialogHeader className="mb-6">
            <FullScreenDialogTitle className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-amber-600" />
              Coffee Talk
            </FullScreenDialogTitle>
            <FullScreenDialogDescription>
              {!showResults && (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    <span>Question {currentQuestionIndex + 1} of {coffeeTalkQuestions.length}</span>
                    <span>{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </FullScreenDialogDescription>
          </FullScreenDialogHeader>
          
          <FullScreenDialogBody className="pt-6">
            <div className="max-w-4xl mx-auto w-full">
              <Card className="border shadow-sm">
                {renderContent()}
                
                <CardFooter className="flex pt-6">
                  {renderNavButtons()}
                </CardFooter>
              </Card>
            </div>
          </FullScreenDialogBody>
          
          <FullScreenDialogFooter>
            <Button 
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="mx-auto"
            >
              Close
            </Button>
          </FullScreenDialogFooter>
        </FullScreenDialogContent>
      </FullScreenDialog>
    </Card>
  );
}