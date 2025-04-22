import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  Apple,
  Utensils,
  Calendar,
  AlertCircle,
  ListChecks,
  Brain,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Send,
  Download,
  BarChart4,
  Bookmark,
  HelpCircle,
  CheckCircle,
  InfoIcon,
  Sparkles,
  Share2,
  FileText,
  Heart,
  Dumbbell,
  Coffee,
  Sun,
} from "lucide-react";
import { FullScreenDialog, FullScreenDialogContent, FullScreenDialogHeader, FullScreenDialogTitle, FullScreenDialogDescription, FullScreenDialogBody, FullScreenDialogFooter } from "./ui/full-screen-dialog";
import { toast } from "@/hooks/use-toast";

// PHQ-9 questions (depression screening)
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
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
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
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
  { value: 0, label: "At no time", description: "" },
  { value: 1, label: "Some of the time", description: "" },
  { value: 2, label: "Less than half of the time", description: "" },
  { value: 3, label: "More than half of the time", description: "" },
  { value: 4, label: "Most of the time", description: "" },
  { value: 5, label: "All of the time", description: "" }
];

// Severity levels for PHQ-9 (depression) - follows official clinical guidelines
// Reference: Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure.
// J Gen Intern Med. 2001;16(9):606-613.
const depressionSeverity = [
  { 
    range: [0, 4], 
    level: "Minimal", 
    description: "You're showing minimal signs of depression.", 
    color: "bg-green-500",
    recommendation: "Your responses suggest minimal symptoms of depression. Continue your self-care and wellness practices." 
  },
  { 
    range: [5, 9], 
    level: "Mild", 
    description: "You may be experiencing mild depression.", 
    color: "bg-blue-500",
    recommendation: "Your responses suggest mild symptoms of depression. Consider physical activity, stress reduction techniques, and maintaining social connections." 
  },
  { 
    range: [10, 14], 
    level: "Moderate", 
    description: "You may be experiencing moderate depression.", 
    color: "bg-yellow-500",
    recommendation: "Your responses suggest moderate symptoms of depression. Consider speaking with a mental health professional and practicing regular self-care." 
  },
  { 
    range: [15, 19], 
    level: "Moderately Severe", 
    description: "You may be experiencing moderately severe depression.", 
    color: "bg-orange-500",
    recommendation: "Your responses suggest moderately severe symptoms of depression. We recommend consulting with a healthcare provider for assessment and support." 
  },
  { 
    range: [20, 27], 
    level: "Severe", 
    description: "You may be experiencing severe depression.", 
    color: "bg-red-500",
    recommendation: "Your responses suggest severe symptoms of depression. We strongly recommend consulting with a healthcare provider as soon as possible." 
  }
];

// Severity levels for GAD-7 (anxiety)
const anxietySeverity = [
  { range: [0, 4], level: "Minimal", description: "You're showing minimal signs of anxiety.", color: "bg-green-500" },
  { range: [5, 9], level: "Mild", description: "You may be experiencing mild anxiety.", color: "bg-blue-500" },
  { range: [10, 14], level: "Moderate", description: "You may be experiencing moderate anxiety.", color: "bg-yellow-500" },
  { range: [15, 21], level: "Severe", description: "You may be experiencing severe anxiety.", color: "bg-red-500" }
];

// WHO-5 wellbeing levels (0-25 scale, transformed to 0-100%)
const wellbeingSeverity = [
  { 
    range: [0, 25], 
    level: "Low", 
    percent: "0-25%",
    description: "Your wellbeing score suggests you may be experiencing significant challenges with your quality of life.", 
    color: "bg-red-500",
    recommendation: "Taking small steps to prioritize activities that bring you joy and meaning could be valuable. Consider reaching out for support from friends, family, or professionals." 
  },
  { 
    range: [26, 50], 
    level: "Moderate", 
    percent: "26-50%",
    description: "Your wellbeing score suggests you're experiencing some moments of positivity, but there's room to enhance your overall quality of life.", 
    color: "bg-yellow-500",
    recommendation: "Consider incorporating more activities that bring you energy and joy. Small daily practices like mindfulness or connecting with others can gradually improve your sense of wellbeing." 
  },
  { 
    range: [51, 75], 
    level: "Good", 
    percent: "51-75%",
    description: "Your wellbeing score shows you're experiencing positive feelings and energy in many areas of your life.", 
    color: "bg-blue-500",
    recommendation: "You're on a positive track! Continue nurturing the aspects of your life that bring you joy, while exploring ways to address the areas where you'd like to feel even better." 
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

// Options for nutritional assessment
const dietaryPreferenceOptions = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Gluten-free",
  "Dairy-free",
  "Low carb",
  "High protein",
];

const healthGoalOptions = [
  "Weight loss",
  "Weight gain",
  "Muscle building",
  "Improved energy",
  "Better sleep",
  "Digestive health",
  "Heart health",
  "Blood sugar management",
  "Reduce inflammation",
  "Mental clarity",
  "Stress reduction",
  "General wellness",
];

const conditionOptions = [
  "None",
  "Diabetes",
  "Hypertension",
  "Heart disease",
  "Celiac disease",
  "IBS/IBD",
  "Food allergies",
  "Lactose intolerance",
  "Thyroid issues",
  "Kidney disease",
  "Arthritis",
  "Anxiety/Depression",
];

const foodRestrictionOptions = [
  "None",
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts",
  "Soy",
  "Fish",
  "Shellfish",
  "Red meat",
  "Nightshades",
  "FODMAPs",
  "Added sugars",
  "Other",
];

const typicalFoodOptions = [
  "Fast food",
  "Processed/Packaged foods",
  "Homemade meals",
  "Fresh fruits",
  "Vegetables",
  "Whole grains",
  "Red meat",
  "Poultry",
  "Fish",
  "Beans/Legumes",
  "Dairy products",
  "Plant-based proteins",
];

const supplementOptions = [
  "None",
  "Multivitamin",
  "Vitamin D",
  "Vitamin B12",
  "Vitamin C",
  "Calcium",
  "Iron",
  "Magnesium",
  "Zinc",
  "Omega-3 (Fish oil)",
  "Probiotics",
  "Protein powder",
  "Creatine",
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

// Create PDF document styles
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7e22ce', // purple-700
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    color: '#9333ea' // purple-600
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#374151' // gray-700
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151' // gray-700
  },
  scoreBox: {
    backgroundColor: '#f3f4f6', // gray-100
    padding: 15,
    borderRadius: 5,
    marginVertical: 10
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  recommendations: {
    backgroundColor: '#f5f3ff', // purple-50
    padding: 15,
    borderRadius: 5,
    marginVertical: 10
  },
  disclaimer: {
    fontSize: 10,
    color: '#9ca3af', // gray-400
    marginTop: 30,
    textAlign: 'center'
  },
  date: {
    fontSize: 10,
    color: '#9ca3af', // gray-400
    marginTop: 5,
    textAlign: 'center'
  }
});

// PDF Document component
const ComprehensiveWellnessPDF = ({ results }: { results: any }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Comprehensive Wellness Assessment</Text>
      
      <Text style={pdfStyles.subtitle}>Physical Health Metrics</Text>
      <View style={pdfStyles.scoreBox}>
        <View style={pdfStyles.scoreRow}>
          <Text style={pdfStyles.boldText}>BMI:</Text>
          <Text style={pdfStyles.boldText}>{results.physicalMetrics.bmi.toFixed(1)} - {results.physicalMetrics.weightCategory}</Text>
        </View>
        <View style={pdfStyles.scoreRow}>
          <Text style={pdfStyles.boldText}>Daily Caloric Needs:</Text>
          <Text style={pdfStyles.boldText}>{Math.round(results.physicalMetrics.tdee)} calories</Text>
        </View>
      </View>

      <Text style={pdfStyles.subtitle}>Mental Health Metrics</Text>
      <View style={pdfStyles.scoreBox}>
        <View style={pdfStyles.scoreRow}>
          <Text style={pdfStyles.boldText}>Depression Score (PHQ-9):</Text>
          <Text style={pdfStyles.boldText}>{results.mentalMetrics.depressionScore}/27 - {results.mentalMetrics.depressionLevel}</Text>
        </View>
        <View style={pdfStyles.scoreRow}>
          <Text style={pdfStyles.boldText}>Anxiety Score (GAD-7):</Text>
          <Text style={pdfStyles.boldText}>{results.mentalMetrics.anxietyScore}/21 - {results.mentalMetrics.anxietyLevel}</Text>
        </View>
      </View>

      <Text style={pdfStyles.subtitle}>Integrated Wellness Recommendations</Text>
      <View style={pdfStyles.recommendations}>
        {results.recommendations.integratedWellness.map((rec: string, i: number) => (
          <Text key={i} style={pdfStyles.text}>• {rec}</Text>
        ))}
      </View>

      <Text style={pdfStyles.subtitle}>Nutrition Recommendations</Text>
      <View style={pdfStyles.recommendations}>
        <Text style={pdfStyles.boldText}>Summary:</Text>
        <Text style={pdfStyles.text}>{results.recommendations.nutrition.summary}</Text>
        
        <Text style={pdfStyles.boldText}>Key Dietary Changes:</Text>
        {results.recommendations.nutrition.dietaryChanges.map((change: string, i: number) => (
          <Text key={i} style={pdfStyles.text}>• {change}</Text>
        ))}
      </View>

      <Text style={pdfStyles.subtitle}>Mental Wellness Recommendations</Text>
      <View style={pdfStyles.recommendations}>
        {results.recommendations.mentalWellness.map((rec: string, i: number) => (
          <Text key={i} style={pdfStyles.text}>• {rec}</Text>
        ))}
      </View>

      <Text style={pdfStyles.disclaimer}>
        Disclaimer: This assessment is not a diagnostic tool. The results are meant to provide general guidance and should not replace professional medical advice. If you're experiencing significant physical or mental health concerns, please consult with a healthcare professional.
      </Text>
      <Text style={pdfStyles.date}>
        Date: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

// Main component
export default function ComprehensiveWellnessAssessment() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Track steps in the assessment flow
  const [currentMentalQuestionIndex, setCurrentMentalQuestionIndex] = useState(0);
  const [mentalHealthAnswers, setMentalHealthAnswers] = useState<{id: number, value: number}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState<"overview" | "mental">("overview");
  const [isPending, setIsPending] = useState(false);
  const [consentToStore, setConsentToStore] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Calculate progress percentage for mental health assessment
  const progressPercentage = ((currentMentalQuestionIndex + 1) / mentalHealthQuestions.length) * 100;
  
  // Coffee Talk only includes the three mental health assessments
  const totalSteps = 3; // Introduction, Assessment, Results
  
  // Physical health assessment state
  const [physicalAssessment, setPhysicalAssessment] = useState<PhysicalAssessment>({
    age: 30,
    gender: "female",
    heightFeet: 5,
    heightInches: 6,
    weight: 150,
    activityLevel: "moderately active",
    dietaryPreferences: [],
    healthGoals: [],
    existingConditions: [],
    currentDiet: {
      mealFrequency: 3,
      typicalFoods: [],
      restrictions: [],
      otherRestriction: '',
      supplements: [],
    },
  });

  // Helper function to update physical assessment
  const updatePhysicalAssessment = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPhysicalAssessment(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setPhysicalAssessment(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle array updates for checkboxes
  const handleArrayUpdate = (field: string, item: string, isChecked: boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentObj = physicalAssessment[parent as keyof typeof physicalAssessment] as Record<string, any>;
      const currentArray = [...parentObj[child]] as string[];
      
      const newArray = isChecked 
        ? [...currentArray, item]
        : currentArray.filter(i => i !== item);
      
      setPhysicalAssessment(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: newArray
        }
      }));
    } else {
      const currentArray = [...physicalAssessment[field as keyof typeof physicalAssessment] as string[]];
      
      const newArray = isChecked 
        ? [...currentArray, item]
        : currentArray.filter(i => i !== item);
      
      setPhysicalAssessment(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };
  
  // Calculate total steps
  const totalSteps = 6; // Basic info, Physical health (2 steps), Mental health, Review, Results

  // Progress percentage calculation
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Reset assessment
  const resetAssessment = () => {
    setCurrentStep(1);
    setCurrentMentalQuestionIndex(0);
    setMentalHealthAnswers([]);
    setPhysicalAssessment({
      age: 30,
      gender: "female",
      heightFeet: 5,
      heightInches: 6,
      weight: 150,
      activityLevel: "moderately active",
      dietaryPreferences: [],
      healthGoals: [],
      existingConditions: [],
      currentDiet: {
        mealFrequency: 3,
        typicalFoods: [],
        restrictions: [],
        otherRestriction: '',
        supplements: [],
      },
    });
    setShowResults(false);
    setActiveResultsTab("overview");
    setResults(null);
    setConsentToStore(false);
  };

  // Handle mental health question answer
  const handleMentalHealthAnswer = (value: number) => {
    const questionId = mentalHealthQuestions[currentMentalQuestionIndex].id;
    
    // Update answers
    setMentalHealthAnswers(prev => {
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
    
    // Move to next question or advance to next step if last question
    if (currentMentalQuestionIndex < mentalHealthQuestions.length - 1) {
      setCurrentMentalQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep(5); // Move to review step
    }
  };

  // Handle skipping a mental health question
  const handleSkipMentalQuestion = () => {
    if (currentMentalQuestionIndex < mentalHealthQuestions.length - 1) {
      setCurrentMentalQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep(5); // Move to review step
    }
  };

  // Handle going back to a previous mental health question
  const handlePreviousMentalQuestion = () => {
    if (currentMentalQuestionIndex > 0) {
      setCurrentMentalQuestionIndex(prev => prev - 1);
    } else {
      setCurrentStep(3); // Go back to previous step
    }
  };

  // Submit the comprehensive assessment
  const submitAssessment = async () => {
    setIsPending(true);
    
    try {
      // Prepare mental health data based on new question ordering
      const who5Answers = mentalHealthAnswers.filter(a => a.id >= 0 && a.id <= 4);
      const phq9Answers = mentalHealthAnswers.filter(a => a.id >= 5 && a.id <= 13);
      const gad7Answers = mentalHealthAnswers.filter(a => a.id >= 14 && a.id <= 20);
      
      // Calculate WHO-5 wellbeing score and percentage
      const who5Score = who5Answers.reduce((sum, curr) => sum + curr.value, 0);
      const wellbeingPercentage = getWellbeingPercentage(who5Score);
      const wellbeingLevel = getWellbeingLevel(who5Score);
      
      // Structure the data for the API
      const assessmentData = {
        physicalHealth: physicalAssessment,
        mentalHealth: {
          who5Answers,
          phq9Answers,
          gad7Answers,
          who5Score,
          wellbeingPercentage,
          wellbeingLevel
        }
      };
      
      // Check for suicidal ideation (PHQ-9 question 9 - now at index 13)
      const suicidalIdeation = mentalHealthAnswers.find(a => a.id === 13 && a.value >= 1) !== undefined;
      
      // Call the API
      const response = await axios.post('/api/wellness/comprehensive/assessment', assessmentData);
      
      // Add suicidal ideation flag to results
      const resultsWithSuicidalIdeation = {
        ...response.data,
        mentalMetrics: {
          ...response.data.mentalMetrics,
          suicidalIdeation
        }
      };
      
      setResults(resultsWithSuicidalIdeation);
      
      // Save results if user consented
      if (consentToStore) {
        try {
          // This would normally save to the database
          console.log('Saving results with consent:', response.data);
          // You could implement an API call here to save to the journal
        } catch (error) {
          console.error('Error saving results:', error);
        }
      }
      
      setShowResults(true);
      setCurrentStep(6);
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
# Comprehensive Wellness Assessment (${date})

## Physical Health Metrics
- BMI: ${results.physicalMetrics.bmi.toFixed(1)} - ${results.physicalMetrics.weightCategory}
- Daily Caloric Needs: ${Math.round(results.physicalMetrics.tdee)} calories

## Mental Health Metrics
- Well-Being Score (WHO-5): ${results.mentalMetrics.wellbeingScore || 0}/25 (${results.mentalMetrics.wellbeingPercentage || 0}%) - ${results.mentalMetrics.wellbeingLevel || "Not assessed"}
- Depression Score (PHQ-9): ${results.mentalMetrics.depressionScore}/27 - ${results.mentalMetrics.depressionLevel}
- Anxiety Score (GAD-7): ${results.mentalMetrics.anxietyScore}/21 - ${results.mentalMetrics.anxietyLevel}

## Integrated Wellness Recommendations:
${results.recommendations.integratedWellness.map((rec: string) => `- ${rec}`).join('\n')}

## Nutrition Recommendations:
- ${results.recommendations.nutrition.summary}

## Mental Wellness Recommendations:
${results.recommendations.mentalWellness.map((rec: string) => `- ${rec}`).join('\n')}

This assessment is not a diagnostic tool. The results are meant to provide general guidance and should not replace professional medical advice.
`;
      
      // Create a new journal entry
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Comprehensive Wellness Assessment - ${date}`,
          content: journalContent,
          mood: "reflective",
          tags: ["wellness", "assessment", "health", "mental-health", "nutrition"],
          isPrivate: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save to journal');
      }
      
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

  // Render content as a conversational assessment focused only on mental health
  const renderStepContent = () => {
    if (showResults) {
      return renderResults();
    }
    
    // Coffee Talk is now only for mental health assessments (GAD-7, WHO-5, PHQ-9)
    return (
      <>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-600" />
            Coffee Talk Check-In
          </CardTitle>
          <CardDescription>
            Let's have a conversation about how you've been feeling. Over the last 2 weeks, how often have you experienced the following?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question {currentMentalQuestionIndex + 1} of {mentalHealthQuestions.length}
              </span>
              <Badge variant="outline" className={
                mentalHealthQuestions[currentMentalQuestionIndex].category === "wellbeing"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : mentalHealthQuestions[currentMentalQuestionIndex].category === "depression"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-purple-200 bg-purple-50 text-purple-700"
              }>
                {mentalHealthQuestions[currentMentalQuestionIndex].category === "wellbeing"
                  ? "About Your Well-Being"
                  : mentalHealthQuestions[currentMentalQuestionIndex].category === "depression"
                    ? "Mood Check-In"
                    : "Stress & Worry"}
              </Badge>
            </div>
            <Progress
              value={((currentMentalQuestionIndex + 1) / mentalHealthQuestions.length) * 100}
              className="h-2 mb-6"
            />
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">{mentalHealthQuestions[currentMentalQuestionIndex].text}</h3>
              
              <RadioGroup
                className="gap-3"
                value={
                  mentalHealthAnswers.find(a => a.id === mentalHealthQuestions[currentMentalQuestionIndex].id)?.value.toString() || ""
                }
                onValueChange={(value) => handleMentalHealthAnswer(parseInt(value))}
              >
                {mentalHealthQuestions[currentMentalQuestionIndex].category === "wellbeing" ? (
                  // WHO-5 uses a different scale (0-5)
                  who5FrequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 rounded-md border p-3">
                      <RadioGroupItem value={option.value.toString()} id={`who5-option-${option.value}`} />
                      <Label htmlFor={`who5-option-${option.value}`} className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                      </Label>
                    </div>
                  ))
                ) : (
                  // PHQ-9 and GAD-7 use the same scale (0-3)
                  frequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 rounded-md border p-3">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-gray-500">{option.description}</span>
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
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-purple-500" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Let's start with some basic information about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={physicalAssessment.age === 0 ? '' : physicalAssessment.age}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                      updatePhysicalAssessment('age', value);
                    }}
                    min={1}
                    max={120}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={physicalAssessment.gender} 
                    onValueChange={(value) => updatePhysicalAssessment('gender', value)}
                  >
                    <SelectTrigger id="gender" className="z-20">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Height</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heightFeet">Feet</Label>
                    <Input
                      id="heightFeet"
                      type="number"
                      value={physicalAssessment.heightFeet === 0 ? '' : physicalAssessment.heightFeet}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                        updatePhysicalAssessment('heightFeet', value);
                      }}
                      min={1}
                      max={8}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heightInches">Inches</Label>
                    <Input
                      id="heightInches"
                      type="number"
                      value={physicalAssessment.heightInches === 0 ? '' : physicalAssessment.heightInches}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                        updatePhysicalAssessment('heightInches', value);
                      }}
                      min={0}
                      max={11}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={physicalAssessment.weight === 0 ? '' : physicalAssessment.weight}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                      updatePhysicalAssessment('weight', value);
                    }}
                    min={1}
                    max={500}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select 
                  value={physicalAssessment.activityLevel} 
                  onValueChange={(value) => updatePhysicalAssessment('activityLevel', value)}
                >
                  <SelectTrigger id="activityLevel" className="z-20">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="lightly active">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately active">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very active">Very active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extra active">Extra active (very hard exercise & physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        );
      
      case 2: // Dietary Preferences & Health Goals
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Utensils className="h-5 w-5 text-purple-500" />
                Dietary Preferences & Goals
              </CardTitle>
              <CardDescription>
                Tell us about your eating style and health objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Dietary Preferences (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryPreferenceOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`diet-${option}`} 
                        checked={physicalAssessment.dietaryPreferences.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('dietaryPreferences', option, checked === true)}
                      />
                      <label
                        htmlFor={`diet-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Health Goals (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthGoalOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`goal-${option}`} 
                        checked={physicalAssessment.healthGoals.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('healthGoals', option, checked === true)}
                      />
                      <label
                        htmlFor={`goal-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Existing Health Conditions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {conditionOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`condition-${option}`} 
                        checked={physicalAssessment.existingConditions.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('existingConditions', option, checked === true)}
                      />
                      <label
                        htmlFor={`condition-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        );
        
      case 3: // Current Diet
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Apple className="h-5 w-5 text-purple-500" />
                Current Diet
              </CardTitle>
              <CardDescription>
                Tell us about your current eating habits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mealFrequency">How many meals do you typically eat per day?</Label>
                <Select 
                  value={physicalAssessment.currentDiet.mealFrequency.toString()} 
                  onValueChange={(value) => updatePhysicalAssessment('currentDiet.mealFrequency', parseInt(value))}
                >
                  <SelectTrigger id="mealFrequency" className="z-20">
                    <SelectValue placeholder="Select meal frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'meal' : 'meals'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>What types of foods do you typically eat? (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {typicalFoodOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`food-${option}`} 
                        checked={physicalAssessment.currentDiet.typicalFoods.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('currentDiet.typicalFoods', option, checked === true)}
                      />
                      <label
                        htmlFor={`food-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Dietary Restrictions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {foodRestrictionOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`restriction-${option}`} 
                        checked={physicalAssessment.currentDiet.restrictions.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('currentDiet.restrictions', option, checked === true)}
                      />
                      <label
                        htmlFor={`restriction-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                
                {physicalAssessment.currentDiet.restrictions.includes("Other") && (
                  <div className="mt-4">
                    <Label htmlFor="otherRestriction">
                      Please specify your other dietary restriction:
                    </Label>
                    <Input
                      id="otherRestriction"
                      type="text"
                      placeholder="Enter your specific restriction"
                      className="mt-1"
                      value={physicalAssessment.currentDiet.otherRestriction || ""}
                      onChange={(e) => updatePhysicalAssessment('currentDiet.otherRestriction', e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Label>Supplements (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {supplementOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`supplement-${option}`} 
                        checked={physicalAssessment.currentDiet.supplements.includes(option)}
                        onCheckedChange={(checked) => handleArrayUpdate('currentDiet.supplements', option, checked === true)}
                      />
                      <label
                        htmlFor={`supplement-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        );
      
      case 4: // Mental Health Assessment
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Mental Health Check-In
              </CardTitle>
              <CardDescription>
                Over the last 2 weeks, how often have you been bothered by the following problems?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentMentalQuestionIndex + 1} of {mentalHealthQuestions.length}
                  </span>
                  <Badge variant="outline" className={
                    mentalHealthQuestions[currentMentalQuestionIndex].category === "wellbeing" 
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : mentalHealthQuestions[currentMentalQuestionIndex].category === "depression" 
                        ? "border-blue-200 bg-blue-50 text-blue-700" 
                        : "border-purple-200 bg-purple-50 text-purple-700"
                  }>
                    {mentalHealthQuestions[currentMentalQuestionIndex].category === "wellbeing" 
                      ? "Well-Being" 
                      : mentalHealthQuestions[currentMentalQuestionIndex].category === "depression" 
                        ? "Depression" 
                        : "Anxiety"} Screening
                  </Badge>
                </div>
                <Progress 
                  value={((currentMentalQuestionIndex + 1) / mentalHealthQuestions.length) * 100} 
                  className="h-2 mb-6" 
                />
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">{mentalHealthQuestions[currentMentalQuestionIndex].text}</h3>
                  
                  <RadioGroup 
                    className="gap-3"
                    value={
                      mentalHealthAnswers.find(a => a.id === mentalHealthQuestions[currentMentalQuestionIndex].id)?.value.toString() || ""
                    }
                    onValueChange={(value) => handleMentalHealthAnswer(parseInt(value))}
                  >
                    {mentalHealthQuestions[currentMentalQuestionIndex].category === "wellbeing" ? (
                      // WHO-5 uses a different scale with positive framing
                      who5FrequencyOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-amber-50 border-amber-100">
                          <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                          <Label 
                            htmlFor={`option-${option.value}`}
                            className="flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-amber-600">{option.description}</span>
                          </Label>
                        </div>
                      ))
                    ) : (
                      // Standard options for PHQ-9 and GAD-7
                      frequencyOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                          <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                          <Label 
                            htmlFor={`option-${option.value}`}
                            className="flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-gray-500">{option.description}</span>
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
        
      case 5: // Review & Submit
        // Calculate WHO-5, depression and anxiety scores for review
        const who5Score = mentalHealthAnswers
          .filter(a => a.id >= 0 && a.id <= 4) // WHO-5 questions
          .reduce((sum, curr) => sum + curr.value, 0);
          
        const phq9Score = mentalHealthAnswers
          .filter(a => a.id >= 5 && a.id <= 13) // PHQ-9 questions
          .reduce((sum, curr) => sum + curr.value, 0);
          
        const gad7Score = mentalHealthAnswers
          .filter(a => a.id >= 14 && a.id <= 20) // GAD-7 questions
          .reduce((sum, curr) => sum + curr.value, 0);
          
        const wellbeingPercentage = getWellbeingPercentage(who5Score);
        const wellbeingLevel = getWellbeingLevel(who5Score);
        const depressionLevel = getDepressionLevel(phq9Score);
        const anxietyLevel = getAnxietyLevel(gad7Score);
        
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-purple-500" />
                Review Your Assessment
              </CardTitle>
              <CardDescription>
                Please review your information before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-md font-medium mb-2">Physical Health Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Age:</span> {physicalAssessment.age}</p>
                    <p><span className="font-medium">Gender:</span> {physicalAssessment.gender}</p>
                    <p><span className="font-medium">Height:</span> {physicalAssessment.heightFeet}' {physicalAssessment.heightInches}"</p>
                    <p><span className="font-medium">Weight:</span> {physicalAssessment.weight} lbs</p>
                    <p><span className="font-medium">Activity Level:</span> {physicalAssessment.activityLevel}</p>
                    <p><span className="font-medium">Dietary Preferences:</span> {physicalAssessment.dietaryPreferences.join(', ') || 'None specified'}</p>
                    <p><span className="font-medium">Health Goals:</span> {physicalAssessment.healthGoals.join(', ') || 'None specified'}</p>
                    <p><span className="font-medium">Health Conditions:</span> {physicalAssessment.existingConditions.length ? physicalAssessment.existingConditions.join(', ') : 'None'}</p>
                    <p><span className="font-medium">Meals per day:</span> {physicalAssessment.currentDiet.mealFrequency}</p>
                    <p><span className="font-medium">Typical Foods:</span> {physicalAssessment.currentDiet.typicalFoods.join(', ') || 'None specified'}</p>
                    <p><span className="font-medium">Restrictions:</span> {
                      physicalAssessment.currentDiet.restrictions.length 
                        ? (
                            physicalAssessment.currentDiet.restrictions.includes("Other") && physicalAssessment.currentDiet.otherRestriction
                              ? physicalAssessment.currentDiet.restrictions.filter(r => r !== "Other").join(', ') + 
                                (physicalAssessment.currentDiet.restrictions.filter(r => r !== "Other").length > 0 ? ", " : "") + 
                                "Other: " + physicalAssessment.currentDiet.otherRestriction
                              : physicalAssessment.currentDiet.restrictions.join(', ')
                          ) 
                        : 'None'
                    }</p>
                    <p><span className="font-medium">Supplements:</span> {physicalAssessment.currentDiet.supplements.length ? physicalAssessment.currentDiet.supplements.join(', ') : 'None'}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Coffee className="h-5 w-5 text-amber-600 mr-2" />
                    <span>Our Coffee Talk Insights</span>
                  </h3>
                  <div className="space-y-4 text-sm">
                    {/* WHO-5 Wellbeing Assessment Section */}
                    <div>
                      <p className="text-gray-700 mb-3">Based on our conversation, here's what I'm hearing:</p>
                      
                      <div className="pl-3 border-l-2 border-amber-200 ml-1 mb-4">
                        <p className="text-gray-700 mb-2">
                          {wellbeingSeverity.find(s => s.level === wellbeingLevel)?.description?.replace("Your wellbeing score", "Your sharing").replace("suggests", "indicates") || 
                          "Your sharing indicates you have some positive moments in your life, along with areas where you might want more energy or joy."}
                        </p>
                        
                        <p className="text-gray-700 mt-3">
                          {wellbeingSeverity.find(s => s.level === wellbeingLevel)?.recommendation || 
                          "Consider adding small activities that bring you energy and joy to your daily routine."}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 mb-4">
                        <span className="text-sm text-gray-600">Your wellbeing:</span>
                        <Badge className={`${getSeverityColor(who5Score, false, true)} text-white ml-2`}>
                          {wellbeingLevel} ({wellbeingPercentage}%)
                        </Badge>
                      </div>
                    </div>
                    
                    {/* PHQ-9 Depression Assessment Section */}
                    <div className="pt-3 border-t border-amber-100">
                      <div className="pl-3 border-l-2 border-amber-200 ml-1 mb-3 mt-3">
                        <p className="text-gray-700 mb-2">
                          {depressionSeverity.find(s => s.level === depressionLevel)?.description.replace("You may be experiencing", "You seem to be experiencing").replace("You're showing", "I notice you're showing")}
                        </p>
                        
                        <p className="text-gray-700 mt-3">
                          {depressionSeverity.find(s => s.level === depressionLevel)?.recommendation.replace("Your responses suggest", "Our conversation suggests").replace("consulting with a healthcare provider", "connecting with someone who can help")}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-gray-600">Where you are right now:</span>
                        <Badge className={`${getSeverityColor(phq9Score, true)} text-white`}>
                          {depressionLevel}
                        </Badge>
                      </div>
                      
                      {/* Special warning for suicide risk - PHQ-9 question 9 */}
                      {mentalHealthAnswers.find(a => a.id >= 5 && a.id <= 13 && a.id === 13 && a.value >= 1) && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                          <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            I'm Concerned About You
                          </p>
                          <p className="text-sm mt-2 text-red-700 leading-relaxed">
                            I noticed something in our conversation that has me concerned about your wellbeing. 
                            It sounds like you might be having some thoughts about harming yourself.
                          </p>
                          <p className="text-sm mt-3 text-red-700 leading-relaxed">
                            This is really important - please reach out to someone who can help right now. 
                            You can call or text 988 anytime (24/7) to speak with someone who cares.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* GAD-7 Anxiety Assessment Section */}
                    <div className="pt-3 border-t border-amber-100 mt-3">
                      <div className="pl-3 border-l-2 border-amber-200 ml-1 mb-3 mt-3">
                        <p className="text-gray-700 mb-2">
                          {anxietySeverity.find(s => s.level === anxietyLevel)?.description.replace("You may be experiencing", "I'm noticing that you might be feeling").replace("You're showing", "You seem to have")} 
                          
                          It's normal to feel this way sometimes, and recognizing it is an important first step.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-gray-600">Your tension level:</span>
                        <Badge className={`${getSeverityColor(gad7Score, false)} text-white ml-2`}>
                          {anxietyLevel}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-600 text-sm">
                      {mentalHealthAnswers.length < mentalHealthQuestions.length ? 
                        `It looks like we left a few questions for another time, and that's perfectly fine. We can always revisit them when you're ready.` : 
                        `Thanks for sharing so openly during our chat. It helps me understand where you're at right now.`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="consent" 
                    checked={consentToStore}
                    onCheckedChange={(checked) => setConsentToStore(checked === true)}
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to storing my assessment data for future reference and personalized recommendations.
                  </label>
                </div>
              </div>
              
              <Alert variant="default" className="mt-4 border-amber-200 bg-amber-50">
                <Coffee className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-gray-700 text-sm">
                  Our conversation will help us create some personalized ideas that might support your wellbeing. 
                  <br/>
                  Just remember, this is more like chatting with a thoughtful friend than visiting a doctor - I'm here to listen and suggest, not to diagnose.
                </AlertDescription>
              </Alert>
            </CardContent>
          </>
        );
        
      default:
        return null;
    }
  };

  // Render results content
  const renderResults = () => {
    if (!results) {
      return (
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-lg font-medium">Something went wrong</p>
            <p className="text-sm text-gray-500 mt-1">
              We couldn't generate your wellness recommendations.
            </p>
            <Button 
              variant="default" 
              className="mt-4"
              onClick={() => setCurrentStep(1)}
            >
              Start Over
            </Button>
          </div>
        </CardContent>
      );
    }
    
    return (
      <>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-500" />
            Your Comprehensive Wellness Profile
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your physical and mental health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-5 gap-4">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-purple-700 font-medium">BMI</p>
              <p className="text-xl font-bold">{results.physicalMetrics.bmi.toFixed(1)}</p>
              <p className="text-xs text-purple-600">{results.physicalMetrics.weightCategory}</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-purple-700 font-medium">Daily Calories</p>
              <p className="text-xl font-bold">{Math.round(results.physicalMetrics.tdee)}</p>
              <p className="text-xs text-purple-600">calories/day</p>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-lg text-center border border-amber-100">
              <p className="text-sm text-amber-700 font-medium">Well-Being</p>
              <p className="text-xl font-bold">{results.mentalMetrics.wellbeingScore || 0}/25</p>
              <p className="text-xs text-amber-600">{results.mentalMetrics.wellbeingLevel || "Not assessed"}</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-purple-700 font-medium">Depression</p>
              <p className="text-xl font-bold">{results.mentalMetrics.depressionScore}/27</p>
              <p className="text-xs text-purple-600">{results.mentalMetrics.depressionLevel}</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-purple-700 font-medium">Anxiety</p>
              <p className="text-xl font-bold">{results.mentalMetrics.anxietyScore}/21</p>
              <p className="text-xs text-purple-600">{results.mentalMetrics.anxietyLevel}</p>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeResultsTab} onValueChange={(v) => setActiveResultsTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="physical">Physical Health</TabsTrigger>
              <TabsTrigger value="mental">Mental Health</TabsTrigger>
              <TabsTrigger value="integrated">Integrated Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
                <h3 className="text-lg font-medium text-purple-900 mb-4">Your Wellness Summary</h3>
                
                <Alert variant="default" className="bg-purple-50 border-purple-100 mb-4">
                  <InfoIcon className="h-4 w-4 text-purple-500" />
                  <AlertDescription className="text-purple-800 text-sm">
                    We've analyzed both your physical and mental health data to create a holistic view of your wellbeing.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Badge className="mr-2 bg-purple-100 text-purple-700 hover:bg-purple-200">Physical</Badge>
                      Nutrition Status
                    </h4>
                    <p className="text-gray-700">{results.recommendations.nutrition.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Badge className="mr-2 bg-amber-100 text-amber-700 hover:bg-amber-200">Mental</Badge>
                      Emotional Wellbeing
                    </h4>
                    <p className="text-gray-700">
                      Your wellbeing score is {results.mentalMetrics.wellbeingPercentage || 0}% ({results.mentalMetrics.wellbeingLevel || "Moderate"}), with {results.mentalMetrics.depressionLevel.toLowerCase()} signs of depression and {results.mentalMetrics.anxietyLevel.toLowerCase()} signs of anxiety.
                      {(results.mentalMetrics.depressionLevel !== "Minimal" || results.mentalMetrics.anxietyLevel !== "Minimal" || 
                        (results.mentalMetrics.wellbeingPercentage && results.mentalMetrics.wellbeingPercentage < 50)) && 
                        " We've provided recommendations to help support your mental wellbeing."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                      Key Recommendations
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {results.recommendations.integratedWellness.slice(0, 3).map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => setActiveResultsTab("integrated")}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Your Integrated Wellness Plan
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => saveToJournal()}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save to Journal
                  </Button>
                  
                  <PDFDownloadLink
                    document={<ComprehensiveWellnessPDF results={results} />}
                    fileName={`comprehensive-wellness-assessment-${new Date().toLocaleDateString()}.pdf`}
                    className="flex-1"
                  >
                    {({ loading }) => (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={loading}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {loading ? "Generating PDF..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="physical" className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Macronutrients</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium">Protein:</dt>
                    <dd className="text-sm">{results.recommendations.nutrition.macronutrients.protein}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium">Carbohydrates:</dt>
                    <dd className="text-sm">{results.recommendations.nutrition.macronutrients.carbs}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium">Fat:</dt>
                    <dd className="text-sm">{results.recommendations.nutrition.macronutrients.fat}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2">Key Micronutrients</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.recommendations.nutrition.micronutrients.map((nutrient: string, index: number) => (
                    <li key={index} className="text-sm">{nutrient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">Increase</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.recommendations.nutrition.foodGroups.increase.map((food: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">Decrease</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.recommendations.nutrition.foodGroups.decrease.map((food: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2">Dietary Changes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {results.recommendations.nutrition.dietaryChanges.map((change: string, index: number) => (
                    <div key={index} className="bg-white p-2 rounded-md border text-sm shadow-sm hover:shadow-md transition-shadow">
                      {change}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2">Hydration</h3>
                <p className="text-sm">{results.recommendations.nutrition.hydration}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="mental" className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Coffee className="h-5 w-5 text-amber-600 mr-2" />
                  <span>How You're Feeling</span>
                </h3>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-700">Based on our conversation, here's what I'm hearing:</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {depressionSeverity.find(s => s.level === results.mentalMetrics.depressionLevel)?.description.replace("You may be experiencing", "You seem to be experiencing").replace("You're showing", "You're showing")}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {depressionSeverity.find(s => s.level === results.mentalMetrics.depressionLevel)?.recommendation.replace("Your responses suggest", "Our conversation suggests").replace("consulting with a healthcare provider", "connecting with someone who can help")}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Where you are right now:</span>
                    <Badge className={`${getSeverityColor(results.mentalMetrics.depressionScore, true)} text-white ml-2`}>
                      {results.mentalMetrics.depressionLevel}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-1 text-xs text-gray-500 mb-6">
                    <div className="text-center">
                      <div className="h-1 bg-green-500 mb-1"></div>
                      <span>Doing Well</span>
                    </div>
                    <div className="text-center">
                      <div className="h-1 bg-blue-500 mb-1"></div>
                      <span>Mild Dip</span>
                    </div>
                    <div className="text-center">
                      <div className="h-1 bg-yellow-500 mb-1"></div>
                      <span>Challenging</span>
                    </div>
                    <div className="text-center">
                      <div className="h-1 bg-orange-500 mb-1"></div>
                      <span>Difficult</span>
                    </div>
                    <div className="text-center">
                      <div className="h-1 bg-red-500 mb-1"></div>
                      <span>Very Tough</span>
                    </div>
                  </div>
                  
                  {/* Special warning for suicide risk (if Question 9 score was >= 1) */}
                  {results.mentalMetrics.suicidalIdeation && (
                    <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-md">
                      <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        I'm Concerned About You
                      </p>
                      <p className="text-sm mt-2 text-red-700 leading-relaxed">
                        I noticed something in our conversation that has me concerned about your wellbeing. 
                        It sounds like you might be having some thoughts about harming yourself.
                        
                        This is really important - please reach out to someone who can help right now. 
                        You can call or text 988 anytime (24/7) to speak with someone who cares.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Coffee className="h-5 w-5 text-amber-600 mr-2" />
                  <span>Your Stress & Worry Levels</span>
                </h3>
                <div className="flex flex-col">
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {anxietySeverity.find(s => s.level === results.mentalMetrics.anxietyLevel)?.description.replace("You may be experiencing", "I'm noticing that you might be feeling").replace("You're showing", "You seem to have")} It's normal to feel this way sometimes, and recognizing it is an important first step.
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Your tension level:</span>
                    <Badge className={`${getSeverityColor(results.mentalMetrics.anxietyScore, false)} text-white ml-2`}>
                      {results.mentalMetrics.anxietyLevel}
                    </Badge>
                  </div>
                  
                  <Progress
                    value={(results.mentalMetrics.anxietyScore / 21) * 100}
                    className="h-2 mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>Calm</span>
                    <span>Balanced</span>
                    <span>On Edge</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-amber-100">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Sun className="h-5 w-5 text-amber-600 mr-2" />
                  <span>Your Well-Being</span>
                </h3>
                <div className="flex flex-col">
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {wellbeingSeverity.find(s => s.level === (results.mentalMetrics.wellbeingLevel || "Moderate"))?.description?.replace("Your wellbeing score", "Your sharing").replace("suggests", "indicates") || 
                       "Your sharing indicates you have some positive moments in your life, along with areas where you might want more energy or joy."}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {wellbeingSeverity.find(s => s.level === (results.mentalMetrics.wellbeingLevel || "Moderate"))?.recommendation || 
                       "Consider adding small activities that bring you energy and joy to your daily routine."}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Your wellbeing score:</span>
                    <Badge className={`${getSeverityColor(results.mentalMetrics.wellbeingScore || 0, false, true)} text-white ml-2`}>
                      {results.mentalMetrics.wellbeingLevel || "Not assessed"} ({results.mentalMetrics.wellbeingPercentage || 0}%)
                    </Badge>
                  </div>
                  
                  <Progress
                    value={(results.mentalMetrics.wellbeingScore || 0) / 25 * 100}
                    className="h-2 mb-2 bg-amber-100"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Could use a boost</span>
                    <span>Doing well</span>
                    <span>Thriving</span>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      Based on the WHO-5 Well-Being Index, which measures positive psychological well-being on a scale from 0-100%.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Coffee className="h-5 w-5 text-amber-600 mr-2" />
                  <span>Ideas Worth Sipping On</span>
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Here are some thoughts that might resonate with you. Take what feels right, leave what doesn't.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {results.recommendations.mentalWellness.map((rec: string, index: number) => (
                    <div key={index} className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm hover:shadow-md transition-shadow">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
              
              {(results.mentalMetrics.depressionScore > 9 || results.mentalMetrics.anxietyScore > 9) && (
                <Alert variant="default" className="border-amber-200 bg-amber-50">
                  <Coffee className="h-4 w-4 text-amber-600 mr-2" />
                  <AlertTitle>A gentle nudge</AlertTitle>
                  <AlertDescription className="text-gray-700 text-sm leading-relaxed">
                    Based on our conversation, it sounds like you've been going through a lot lately with 
                    {results.mentalMetrics.depressionScore > 9 ? " some challenging feelings" : ""} 
                    {results.mentalMetrics.depressionScore > 9 && results.mentalMetrics.anxietyScore > 9 ? " and " : ""}
                    {results.mentalMetrics.anxietyScore > 9 ? " some ongoing stress and worry" : ""}.
                    <br/><br/> 
                    Finding someone to talk to who specializes in this stuff can make a real difference. You don't have to figure it all out alone.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="integrated" className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Integrated Wellness Plan
                </h3>
                <p className="text-sm mb-4">
                  These recommendations address the connection between your physical and mental health, creating a holistic approach to wellness.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {results.recommendations.integratedWellness.map((rec: string, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-md border text-sm shadow-sm hover:shadow-md transition-shadow">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium mb-2">Long-Term Strategy</h3>
                <p className="text-sm mb-4">{results.recommendations.nutrition.longTermStrategy}</p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveToJournal()}
                    className="text-purple-600 border-purple-200"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save to Journal
                  </Button>
                </div>
              </div>
              
              <Alert variant="default" className="border-purple-500 bg-purple-50">
                <InfoIcon className="h-4 w-4 text-purple-500" />
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription className="text-purple-800 text-sm">
                  Consider reviewing your assessment regularly and tracking your progress in the Wellness Journal. 
                  Small, consistent changes lead to significant improvements in both physical and mental wellbeing.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </>
    );
  };

  // Navigation buttons for multistep form
  const renderNavButtons = () => {
    if (showResults) {
      return (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetAssessment}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Start New Assessment
          </Button>
        </div>
      );
    }
    
    if (currentStep === 4) {
      // Mental health assessment navigation
      return (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousMentalQuestion}
            disabled={currentMentalQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleSkipMentalQuestion}
              className="text-gray-500"
            >
              Skip
            </Button>
            
            <Button
              onClick={() => handleMentalHealthAnswer(
                mentalHealthAnswers.find(a => a.id === mentalHealthQuestions[currentMentalQuestionIndex].id)?.value || 0
              )}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              {currentMentalQuestionIndex < mentalHealthQuestions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={submitAssessment}
            disabled={isPending}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
          >
            {isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Submit Assessment
                <Send className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="w-[calc(100%-12px)] mx-auto shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              <Coffee className="h-6 w-6 text-purple-600" />
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
              Let's have a friendly conversation about your mental wellbeing in a comfortable, casual setting.
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
                <h4 className="font-medium text-amber-700">Friendly Mental Health Check-In</h4>
              </div>
              <p className="text-gray-700 text-sm">
                A warm, conversation-style assessment focusing on your wellbeing, mood, and stress levels. This brief chat helps us understand how you're feeling and provides personalized support.
              </p>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-64 h-64 -mb-12 -mr-12 opacity-10">
            <Coffee className="absolute w-full h-full text-amber-700" />
          </div>
        </div>
      </CardContent>
      
      <FullScreenDialog open={isOpen} onOpenChange={setIsOpen}>
        <FullScreenDialogContent>
          <FullScreenDialogHeader className="mb-6">
            <FullScreenDialogTitle className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-amber-600" />
              Coffee Talk
            </FullScreenDialogTitle>
            <FullScreenDialogDescription>
              {!showResults && (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    <span>Step {currentStep} of {totalSteps}</span>
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
                {renderStepContent()}
                
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