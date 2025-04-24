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
  AlertCircle,
  Save,
  ExternalLink,
  FileText,
  Heart,
  Share2,
  ChevronRight,
} from "lucide-react";

// PHQ-9 questions (depression screening) with conversational language
const phq9Questions = [
  "Have you found yourself not enjoying the things you usually care about?",
  "Have you been feeling low or emotionally stuck lately?",
  "Have you been having trouble sleeping or sleeping way more than usual?",
  "Have you been feeling drained or low-energy lately?",
  "Have you noticed changes in your appetite, like eating too little or too much?",
  "Have you been feeling down on yourself or struggling with self-worth?",
  "Have you had a hard time focusing on simple things, like reading or watching something?",
  "Have you felt noticeably slowed down—or super restless and unable to sit still?",
  "Have dark thoughts about hurting yourself or feeling like giving up shown up recently?"
];

// WHO-5 questions (well-being screening) with conversational language
const who5Questions = [
  "Have you felt genuinely happy or in good spirits lately?",
  "Have you had moments where you felt peaceful or at ease?",
  "Have you felt energized or ready to take on the day?",
  "Have you been waking up feeling recharged and rested?",
  "Have you had things in your day that made you curious or excited?"
];

// GAD-7 questions (anxiety screening) with conversational language
const gad7Questions = [
  "Have you felt nervous or like something's been buzzing under the surface?",
  "Have your worries been hard to quiet or control lately?",
  "Have you caught yourself worrying about a bunch of different things all at once?",
  "Have you found it tough to fully relax or slow your mind down?",
  "Have you felt so restless or jumpy that staying still is hard?",
  "Have you felt extra irritable or like little things are setting you off?",
  "Have you had a sense that something bad might happen, even without a clear reason?"
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
    
    // Don't automatically progress - user must click "Next" button
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
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
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
                      <RadioGroupItem value={option.value.toString()} id={`who5-option-${option.value}`} className="mt-1 h-5 w-5 !border-amber-600 data-[state=checked]:!text-amber-600 data-[state=checked]:!ring-2 data-[state=checked]:!ring-amber-300" />
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
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="mt-1 h-5 w-5 !border-amber-600 data-[state=checked]:!text-amber-600 data-[state=checked]:!ring-2 data-[state=checked]:!ring-amber-300" />
                      <Label htmlFor={`option-${option.value}`} className="flex flex-col flex-1">
                        <span className="font-medium text-sm sm:text-base">{option.label}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{option.description}</span>
                      </Label>
                    </div>
                  ))
                )}
              </RadioGroup>
            </div>
            
            {/* Gentler support notice for question about thoughts of harming oneself */}
            {mentalHealthQuestions[currentQuestionIndex].id === 13 && (
              <Alert className="bg-amber-50 border-amber-100 mt-4">
                <Brain className="h-4 w-4 text-amber-600" />
                <AlertTitle>A gentle reminder</AlertTitle>
                <AlertDescription className="text-amber-800">
                  Your mental health matters. If you're having difficult thoughts, remember that reaching out to someone you trust or a mental health professional can help.
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
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Depression</Badge>
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
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Anxiety</Badge>
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
        <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
          <div className="w-full sm:w-auto">
            <button 
              onClick={resetAssessment}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 w-full"
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <path d="M19 12H5"></path>
                  <path d="m12 19-7-7 7-7"></path>
                </svg>
                <span>Take Assessment Again</span>
              </div>
            </button>
          </div>
          <div className="w-full sm:w-auto">
            <button 
              onClick={() => window.location.href = '/wellness'}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-600 text-slate-50 hover:bg-amber-700 h-10 px-4 py-2 w-full"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>Back to Wellness Center</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
        <div className="order-2 sm:order-1 w-full sm:w-auto">
          <button 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 w-full"
          >
            <div className="flex items-center justify-center gap-1.5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4"
              >
                <path d="M19 12H5"></path>
                <path d="m12 19-7-7 7-7"></path>
              </svg>
              <span>Previous</span>
            </div>
          </button>
        </div>
        
        <div className="order-1 sm:order-2 w-full sm:w-auto">
          <button 
            onClick={currentQuestionIndex === mentalHealthQuestions.length - 1 ? submitAssessment : handleSkipQuestion}
            disabled={isPending}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-600 text-slate-50 hover:bg-amber-700 h-10 px-4 py-2 w-full"
          >
            <div className="flex items-center justify-center gap-1.5">
              <span>{isPending ? "Processing..." : currentQuestionIndex === mentalHealthQuestions.length - 1 ? "Complete" : "Next"}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    );
  };
  
  // Main JSX
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Coffee className="h-7 w-7 text-amber-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Coffee Talk</h1>
        </div>
        <p className="text-gray-600 mt-1">Let's connect—and realign—with what really matters</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 pb-0">
          {!showResults && (
            <div className="w-full mb-6">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                <span>Question {currentQuestionIndex + 1} of {mentalHealthQuestions.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <Card className="border-0 shadow-none">
            {renderContent()}
            
            <CardFooter className="flex pt-6 px-0">
              {renderNavButtons()}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}