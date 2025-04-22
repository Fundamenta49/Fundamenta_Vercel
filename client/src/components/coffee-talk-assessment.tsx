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
  FullScreenDialogFooter
} from "./ui/full-screen-dialog";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Brain,
  Check,
  Coffee,
  Download,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Save,
  ExternalLink,
  FileText,
  Heart,
  Share2,
  ChevronRight,
} from "lucide-react";

// PHQ-9 questions (depression screening)
const phq9Questions = [
  "I have little interest or pleasure in doing things",
  "I feel down, depressed, or hopeless",
  "I have trouble falling asleep or staying asleep, or I sleep too much",
  "I feel tired or have little energy",
  "I have poor appetite or I overeat",
  "I feel bad about myself - as if I am a failure or have let myself or my family down",
  "I have trouble concentrating on things, such as reading or watching TV",
  "I move or speak so slowly that others could notice, or I'm so fidgety and restless that I move around much more than usual",
  "I have thoughts that I would be better off dead, or of hurting myself"
];

// WHO-5 questions (well-being screening)
const who5Questions = [
  "I have felt cheerful and in good spirits",
  "I have felt calm and relaxed",
  "I have felt active and vigorous",
  "I woke up feeling fresh and rested",
  "My daily life has been filled with things that interest me"
];

// GAD-7 questions (anxiety screening)
const gad7Questions = [
  "I feel nervous, anxious, or on edge",
  "I cannot stop or control worrying",
  "I worry too much about different things",
  "I have trouble relaxing",
  "I feel so restless that it's hard to sit still",
  "I become easily annoyed or irritable",
  "I feel afraid, as if something awful might happen"
];

// Combined questions for the unified assessment
const mentalHealthQuestions = [
  ...who5Questions.map((q, i) => ({ id: i, text: q, category: "wellbeing" })),
  ...phq9Questions.map((q, i) => ({ id: i + 5, text: q, category: "depression" })),
  ...gad7Questions.map((q, i) => ({ id: i + 14, text: q, category: "anxiety" }))
];

// Frequency options for PHQ-9 and GAD-7 scoring
const frequencyOptions = [
  { value: 0, label: "Not at all", description: "0 days" },
  { value: 1, label: "Several days", description: "1-7 days" },
  { value: 2, label: "More than half the days", description: "8-12 days" },
  { value: 3, label: "Nearly every day", description: "13+ days" }
];

// WHO-5 frequency options (different scale, positive framing)
const who5FrequencyOptions = [
  { value: 0, label: "At no time", description: "Never experienced this" },
  { value: 1, label: "Some of the time", description: "Occasionally" },
  { value: 2, label: "Less than half of the time", description: "Sometimes" },
  { value: 3, label: "More than half of the time", description: "Often" },
  { value: 4, label: "Most of the time", description: "Usually" },
  { value: 5, label: "All of the time", description: "Always" }
];

// Severity levels for PHQ-9 (depression) - follows official clinical guidelines
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

// Severity levels for GAD-7 (anxiety) - follows official clinical guidelines
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

// Severity levels for WHO-5 (wellbeing)
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

// Helper function for WHO-5 wellbeing level 
const getWellbeingLevel = (score: number) => {
  // The WHO-5 raw score ranges from 0 to 25, we convert to percentage (0-100)
  const percentScore = (score / 25) * 100;
  const level = wellbeingSeverity.find(s => percentScore >= s.range[0] && percentScore <= s.range[1]);
  return level ? level.level : "Unknown";
};

// Helper function to get WHO-5 percentage score
const getWellbeingPercentage = (score: number) => {
  // Convert raw score (0-25) to percentage (0-100)
  return Math.round((score / 25) * 100);
};

// Helper function to get severity color
const getSeverityColor = (score: number, isDepression: boolean, isWellbeing = false) => {
  if (isWellbeing) {
    const percentScore = (score / 25) * 100;
    const level = wellbeingSeverity.find(s => percentScore >= s.range[0] && percentScore <= s.range[1]);
    return level ? level.color : "bg-gray-400";
  }
  
  const levels = isDepression ? depressionSeverity : anxietySeverity;
  const level = levels.find(s => score >= s.range[0] && score <= s.range[1]);
  return level ? level.color : "bg-gray-400";
};

// Main component
export default function CoffeeTalkAssessment() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{id: number, value: number}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState<"overview" | "mental">("overview");
  const [isPending, setIsPending] = useState(false);
  const [consentToStore, setConsentToStore] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / mentalHealthQuestions.length) * 100;
  
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
    const questionId = mentalHealthQuestions[currentQuestionIndex].id;
    
    // Update answers
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.id === questionId);
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { id: questionId, value };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, { id: questionId, value }];
      }
    });
    
    // Move to next question or show results if last question
    if (currentQuestionIndex < mentalHealthQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };
  
  // Handle skipping a question
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < mentalHealthQuestions.length - 1) {
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
      // Prepare mental health data
      const who5Answers = answers.filter(a => a.id >= 0 && a.id <= 4);
      const phq9Answers = answers.filter(a => a.id >= 5 && a.id <= 13);
      const gad7Answers = answers.filter(a => a.id >= 14 && a.id <= 20);
      
      // Calculate WHO-5 wellbeing score and percentage
      const who5Score = who5Answers.reduce((sum, curr) => sum + curr.value, 0);
      const wellbeingPercentage = getWellbeingPercentage(who5Score);
      const wellbeingLevel = getWellbeingLevel(who5Score);
      
      // Calculate PHQ-9 depression score
      const depressionScore = phq9Answers.reduce((sum, curr) => sum + curr.value, 0);
      const depressionLevel = getDepressionLevel(depressionScore);
      
      // Calculate GAD-7 anxiety score
      const anxietyScore = gad7Answers.reduce((sum, curr) => sum + curr.value, 0);
      const anxietyLevel = getAnxietyLevel(anxietyScore);
      
      // Structure the data
      const assessmentData = {
        mentalHealth: {
          who5Answers,
          phq9Answers,
          gad7Answers,
          who5Score,
          wellbeingPercentage,
          wellbeingLevel,
          depressionScore,
          depressionLevel,
          anxietyScore,
          anxietyLevel
        }
      };
      
      // Check for suicidal ideation (PHQ-9 question 9 - now at index 13)
      const suicidalIdeation = answers.find(a => a.id === 13 && a.value >= 1) !== undefined;
      
      // For now, we'll simulate an API response
      const simulatedResults = {
        mentalMetrics: {
          wellbeingScore: who5Score,
          wellbeingPercentage: wellbeingPercentage,
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
            "Aim for 7-9 hours of quality sleep each night",
            "Limit screen time before bedtime"
          ],
          integratedWellness: [
            "Regular physical activity can improve both physical and mental health",
            "Maintain a balanced diet rich in fruits, vegetables, lean proteins",
            "Consider journaling your thoughts and feelings",
            "Take breaks throughout the day to reduce stress and improve focus"
          ]
        }
      };
      
      // If there's suicidal ideation, add a crisis recommendation
      if (suicidalIdeation) {
        simulatedResults.recommendations.mentalWellness.unshift(
          "Please reach out to a mental health professional or crisis helpline immediately"
        );
      }
      
      setResults(simulatedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Assessment failed",
        description: "We couldn't process your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  // Save assessment to journal
  const saveToJournal = async () => {
    if (!results) return;
    
    try {
      // Format the date
      const date = new Date().toLocaleDateString();
      
      // Create journal entry content
      const journalContent = `
# Coffee Talk Assessment (${date})

## Mental Health Metrics
- Well-Being Score (WHO-5): ${results.mentalMetrics.wellbeingScore || 0}/25 (${results.mentalMetrics.wellbeingPercentage || 0}%) - ${results.mentalMetrics.wellbeingLevel || "Not assessed"}
- Depression Score (PHQ-9): ${results.mentalMetrics.depressionScore}/27 - ${results.mentalMetrics.depressionLevel}
- Anxiety Score (GAD-7): ${results.mentalMetrics.anxietyScore}/21 - ${results.mentalMetrics.anxietyLevel}

## Mental Wellness Recommendations:
${results.recommendations.mentalWellness.map((rec: string) => `- ${rec}`).join('\n')}

## Integrated Wellness Recommendations:
${results.recommendations.integratedWellness.map((rec: string) => `- ${rec}`).join('\n')}

This assessment is not a diagnostic tool. The results are meant to provide general guidance and should not replace professional medical advice.
`;
      
      // Create a new journal entry (would normally call API)
      console.log('Would save to journal:', journalContent);
      
      toast({
        title: "Saved to Journal",
        description: "Your assessment has been saved to your Wellness Journal",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving to journal:', error);
      toast({
        title: "Couldn't save to journal",
        description: "There was an error saving your assessment to your journal.",
        variant: "destructive"
      });
    }
  };
  
  // Render assessment content
  const renderContent = () => {
    if (showResults) {
      return renderResults();
    }
    
    // Show mental health assessment questions
    return (
      <>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-600" />
            Coffee Talk
          </CardTitle>
          <CardDescription>
            Over the last 2 weeks, how often have you been bothered by the following?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {mentalHealthQuestions.length}
              </span>
              <Badge variant="outline" className={
                mentalHealthQuestions[currentQuestionIndex].category === "wellbeing"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : mentalHealthQuestions[currentQuestionIndex].category === "depression"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-purple-200 bg-purple-50 text-purple-700"
              }>
                {mentalHealthQuestions[currentQuestionIndex].category === "wellbeing"
                  ? "Well-Being"
                  : mentalHealthQuestions[currentQuestionIndex].category === "depression"
                    ? "Depression"
                    : "Anxiety"} Check-In
              </Badge>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 mb-6"
            />
            
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-medium mb-4 leading-relaxed">{mentalHealthQuestions[currentQuestionIndex].text}</h3>
              
              <RadioGroup
                className="gap-3"
                value={
                  answers.find(a => a.id === mentalHealthQuestions[currentQuestionIndex].id)?.value.toString() || ""
                }
                onValueChange={(value) => handleAnswer(parseInt(value))}
              >
                {mentalHealthQuestions[currentQuestionIndex].category === "wellbeing" ? (
                  // WHO-5 uses a different scale (0-5)
                  who5FrequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3 rounded-md border p-3">
                      <RadioGroupItem value={option.value.toString()} id={`who5-option-${option.value}`} className="mt-1" />
                      <Label htmlFor={`who5-option-${option.value}`} className="flex flex-col flex-1">
                        <span className="font-medium text-sm sm:text-base">{option.label}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{option.description}</span>
                      </Label>
                    </div>
                  ))
                ) : (
                  // PHQ-9 and GAD-7 use the same scale (0-3)
                  frequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3 rounded-md border p-3">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="mt-1" />
                      <Label htmlFor={`option-${option.value}`} className="flex flex-col flex-1">
                        <span className="font-medium text-sm sm:text-base">{option.label}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{option.description}</span>
                      </Label>
                    </div>
                  ))
                )}
              </RadioGroup>
            </div>
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
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Well-being</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.mentalMetrics.wellbeingPercentage}%</div>
                      <p className="text-xs text-muted-foreground">{results.mentalMetrics.wellbeingLevel}</p>
                    </CardContent>
                    <div className={`${getSeverityColor(results.mentalMetrics.wellbeingScore, false, true)} h-1 w-full`} />
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Depression</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.mentalMetrics.depressionScore}/27</div>
                      <p className="text-xs text-muted-foreground">{results.mentalMetrics.depressionLevel}</p>
                    </CardContent>
                    <div className={`${getSeverityColor(results.mentalMetrics.depressionScore, true)} h-1 w-full`} />
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Anxiety</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">{results.mentalMetrics.anxietyScore}/21</div>
                      <p className="text-xs text-muted-foreground">{results.mentalMetrics.anxietyLevel}</p>
                    </CardContent>
                    <div className={`${getSeverityColor(results.mentalMetrics.anxietyScore, false)} h-1 w-full`} />
                  </Card>
                </div>
              </div>
              
              {results.mentalMetrics.suicidalIdeation && (
                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important notice</AlertTitle>
                  <AlertDescription>
                    Based on your responses, we recommend speaking with a mental health professional as soon as possible. If you're in crisis, please call a crisis helpline or text HOME to 741741 to reach the Crisis Text Line.
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
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Wellbeing</Badge>
                        <span className="font-medium">{results.mentalMetrics.wellbeingScore}/25 ({results.mentalMetrics.wellbeingPercentage}%)</span>
                        <span className="text-sm text-gray-500">- {results.mentalMetrics.wellbeingLevel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="mb-4">The WHO-5 Well-Being Index is a short questionnaire measuring subjective well-being and positive mood, vitality, and interest in daily activities.</p>
                      <div className={`h-2 w-full mb-2 ${getSeverityColor(results.mentalMetrics.wellbeingScore, false, true)} rounded-full`} />
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
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Depression</Badge>
                        <span className="font-medium">{results.mentalMetrics.depressionScore}/27</span>
                        <span className="text-sm text-gray-500">- {results.mentalMetrics.depressionLevel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="mb-4">The PHQ-9 is a 9-question instrument used to screen for depression severity.</p>
                      <div className={`h-2 w-full mb-2 ${getSeverityColor(results.mentalMetrics.depressionScore, true)} rounded-full`} />
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
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Anxiety</Badge>
                        <span className="font-medium">{results.mentalMetrics.anxietyScore}/21</span>
                        <span className="text-sm text-gray-500">- {results.mentalMetrics.anxietyLevel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <p className="mb-4">The GAD-7 is a 7-question instrument used to screen for anxiety severity.</p>
                      <div className={`h-2 w-full mb-2 ${getSeverityColor(results.mentalMetrics.anxietyScore, false)} rounded-full`} />
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
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="text-md font-medium">Resources</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-blue-600 hover:underline">Understanding Mental Health</a>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-blue-600 hover:underline">Mindfulness and Meditation Techniques</a>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                    <a href="#" className="text-blue-600 hover:underline">Finding Mental Health Support</a>
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
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            onClick={resetAssessment}
          >
            Take Assessment Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between w-full">
        <Button 
          variant="outline" 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            onClick={handleSkipQuestion}
          >
            Skip
          </Button>
          <Button 
            variant="default"
            onClick={submitAssessment}
            disabled={isPending}
            className={currentQuestionIndex === mentalHealthQuestions.length - 1 ? "" : "hidden"}
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-amber-600" />
              Coffee Talk
            </CardTitle>
            <CardDescription className="text-gray-600">
              Let's connect—and realign—with what really matters
            </CardDescription>
          </div>
          
          <Button 
            onClick={() => setIsOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-amber-300 to-orange-300 hover:from-amber-400 hover:to-orange-400 text-amber-900 self-start mt-2 sm:mt-0 w-full sm:w-auto"
          >
            <Coffee className="h-5 w-5 mr-2" />
            <span>Let's Talk</span>
          </Button>
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
                  <div className="rounded-full bg-blue-100 p-2 mr-3">
                    <Heart className="h-5 w-5 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-blue-700 text-base">Depression Screening</h4>
                </div>
                <p className="text-sm text-gray-600">
                  A brief PHQ-9 assessment to help understand your mood and identify potential depression symptoms.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-purple-100 p-2 mr-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                  </div>
                  <h4 className="font-medium text-purple-700 text-base">Anxiety Check-In</h4>
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
                    <span>Question {currentQuestionIndex + 1} of {mentalHealthQuestions.length}</span>
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