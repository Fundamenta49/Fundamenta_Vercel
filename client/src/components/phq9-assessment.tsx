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
import { Brain, AlertCircle, InfoIcon, HelpCircle, Heart, Coffee, Sun, Wind } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mental health assessment tools based on clinical guidelines
// PHQ-9: Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.
// GAD-7: Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097.
// WHO-5: Topp CW, Østergaard SD, Søndergaard S, Bech P. The WHO-5 Well-Being Index: a systematic review of the literature. Psychother Psychosom. 2015;84(3):167-176.

interface MentalHealthResult {
  phq9: {
    score: number;
    level: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
    classification: string;
  };
  gad7: {
    score: number;
    level: "minimal" | "mild" | "moderate" | "severe";
    classification: string;
  };
  who5: {
    score: number;
    percentageScore: number;
    level: "low" | "moderate" | "high";
    classification: string;
  };
  integratedAnalysis: string;
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

type AssessmentType = "phq9" | "gad7" | "who5";
type AssessmentStage = "intro" | "questions" | "results";

export default function PHQ9Assessment({ onComplete }: PHQ9AssessmentProps = {}) {
  // Start directly with the questions instead of the intro screen
  const [stage, setStage] = useState<AssessmentStage>("questions");
  const [activeTab, setActiveTab] = useState<AssessmentType>("phq9");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phq9Answers, setPhq9Answers] = useState<number[]>(new Array(9).fill(-1));
  const [gad7Answers, setGad7Answers] = useState<number[]>(new Array(7).fill(-1));
  const [who5Answers, setWho5Answers] = useState<number[]>(new Array(5).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<MentalHealthResult | null>(null);

  // Modified PHQ-9 questions in a more conversational tone
  const phq9Questions = [
    "How interested have you been in activities you usually enjoy?",
    "Have you been feeling down or like things aren't going to get better?",
    "How has your sleep been lately? Any trouble falling asleep, staying asleep, or sleeping too much?",
    "How have your energy levels been? Do you feel tired or worn out even after resting?",
    "How has your appetite been? Have you noticed changes in how much or little you eat?",
    "Have you been feeling good about yourself, or have you been pretty hard on yourself lately?",
    "Have you found it difficult to focus on everyday things like reading or watching TV?",
    "Have others commented on how quickly or slowly you've been moving or speaking? Or have you felt restless and fidgety?",
    "Have you had thoughts that you'd be better off not being here, or thoughts of hurting yourself?"
  ];

  // GAD-7 questions in conversational tone
  const gad7Questions = [
    "Have you been feeling nervous, anxious, or on edge?",
    "Have you found it difficult to stop worrying or control your worries?",
    "Have you been worrying too much about different things?",
    "How easy or difficult has it been for you to relax?",
    "Have you been so restless that it's been hard to sit still?",
    "Have you been feeling easily annoyed or irritable?",
    "Have you been feeling afraid, as if something awful might happen?"
  ];

  // WHO-5 Well-Being Index questions in conversational tone
  const who5Questions = [
    "How often have you felt cheerful and in good spirits?",
    "How often have you felt calm and relaxed?",
    "How often have you felt active and vigorous?",
    "How often have you woken up feeling fresh and rested?",
    "How often has your daily life been filled with things that interest you?"
  ];

  // Transition prompts between questions
  const transitionPrompts = [
    "Thanks for sharing that. Let's talk about...",
    "I appreciate your honesty. Now I'm curious about...",
    "That's really helpful to know. Moving on to...",
    "Thanks for reflecting on that. Next, I'd like to ask about...",
    "I understand. Let's switch gears and talk about...",
    "That gives me a better picture. How about..."
  ];

  // Get random transition prompt
  const getTransition = () => {
    return transitionPrompts[Math.floor(Math.random() * transitionPrompts.length)];
  };

  // PHQ-9 Frequency options - more conversational with proper spacing
  const phq9FrequencyOptions = [
    { value: 0, label: "Rarely or never", description: "I haven't noticed this" },
    { value: 1, label: "Sometimes", description: "A few days" },
    { value: 2, label: "Often", description: "More than half the time" },
    { value: 3, label: "Almost always", description: "Nearly every day" }
  ];

  // GAD-7 Frequency options - more conversational with proper spacing
  const gad7FrequencyOptions = [
    { value: 0, label: "Hardly at all", description: "This hasn't been an issue" },
    { value: 1, label: "A little bit", description: "Some days" },
    { value: 2, label: "Quite a bit", description: "More than half the time" },
    { value: 3, label: "A lot", description: "Almost every day" }
  ];

  // WHO-5 Frequency options - note these are scored differently (positive framing)
  const who5FrequencyOptions = [
    { value: 0, label: "Never", description: "At no time" },
    { value: 1, label: "Occasionally", description: "Some of the time" },
    { value: 2, label: "Sometimes", description: "Less than half the time" },
    { value: 3, label: "Often", description: "More than half the time" },
    { value: 4, label: "Usually", description: "Most of the time" },
    { value: 5, label: "Always", description: "All of the time" }
  ];

  // Get active questions, frequency options and answers based on current tab
  const getActiveQuestions = () => {
    switch (activeTab) {
      case "phq9": return phq9Questions;
      case "gad7": return gad7Questions;
      case "who5": return who5Questions;
      default: return phq9Questions;
    }
  };

  const getActiveFrequencyOptions = () => {
    switch (activeTab) {
      case "phq9": return phq9FrequencyOptions;
      case "gad7": return gad7FrequencyOptions;
      case "who5": return who5FrequencyOptions;
      default: return phq9FrequencyOptions;
    }
  };

  const getActiveAnswers = () => {
    switch (activeTab) {
      case "phq9": return phq9Answers;
      case "gad7": return gad7Answers;
      case "who5": return who5Answers;
      default: return phq9Answers;
    }
  };

  const setActiveAnswers = (answers: number[]) => {
    switch (activeTab) {
      case "phq9": setPhq9Answers(answers); break;
      case "gad7": setGad7Answers(answers); break;
      case "who5": setWho5Answers(answers); break;
    }
  };

  // Calculate progress percentage for active assessment
  const activeQuestions = getActiveQuestions();
  const progressPercentage = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;

  // Handle starting the assessment
  const handleStartAssessment = () => {
    setStage("questions");
    setCurrentQuestionIndex(0);
  };

  // Handle tab change
  const handleTabChange = (tab: AssessmentType) => {
    setActiveTab(tab);
    setCurrentQuestionIndex(0);
  };

  // Handle answer change
  const handleAnswerChange = (value: number) => {
    const answers = getActiveAnswers();
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setActiveAnswers(newAnswers);

    // Move to next question or switch tabs/show results based on completion
    const questions = getActiveQuestions();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed the current assessment
      switch (activeTab) {
        case "phq9": 
          // Move to GAD-7 assessment
          setActiveTab("gad7");
          setCurrentQuestionIndex(0);
          break;
        case "gad7":
          // Move to WHO-5 assessment
          setActiveTab("who5");
          setCurrentQuestionIndex(0);
          break;
        case "who5":
          // Calculate and show final results
          calculateResults();
          break;
      }
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (activeTab === "gad7") {
      // Go back to PHQ-9 if at first GAD-7 question
      setActiveTab("phq9");
      setCurrentQuestionIndex(phq9Questions.length - 1);
    } else if (activeTab === "who5") {
      // Go back to GAD-7 if at first WHO-5 question
      setActiveTab("gad7");
      setCurrentQuestionIndex(gad7Questions.length - 1);
    }
  };

  // Manual next question button (for when you want to see the question without answering)
  const handleNext = () => {
    const answers = getActiveAnswers();
    if (answers[currentQuestionIndex] >= 0) {
      // If answered, go to next
      const questions = getActiveQuestions();
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Completed the current assessment, move to next assessment or results
        switch (activeTab) {
          case "phq9": 
            setActiveTab("gad7");
            setCurrentQuestionIndex(0);
            break;
          case "gad7":
            setActiveTab("who5");
            setCurrentQuestionIndex(0);
            break;
          case "who5":
            calculateResults();
            break;
        }
      }
    } else {
      // Error message if trying to advance without answering
      toast({
        variant: "destructive",
        title: "No answer selected",
        description: "Please select an answer before proceeding.",
      });
    }
  };

  // Calculate results from all three assessments
  const calculateResults = () => {
    // Calculate PHQ-9 score (depression)
    const phq9Score = phq9Answers.reduce((acc, value) => acc + value, 0);
    
    // Determine PHQ-9 level
    let phq9Level: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
    let phq9Classification = "";
    
    if (phq9Score <= 4) {
      phq9Level = "minimal";
      phq9Classification = "Minimal or no depression symptoms";
    } else if (phq9Score <= 9) {
      phq9Level = "mild";
      phq9Classification = "Mild depression symptoms";
    } else if (phq9Score <= 14) {
      phq9Level = "moderate";
      phq9Classification = "Moderate depression symptoms";
    } else if (phq9Score <= 19) {
      phq9Level = "moderately_severe";
      phq9Classification = "Moderately severe depression symptoms";
    } else {
      phq9Level = "severe";
      phq9Classification = "Severe depression symptoms";
    }
    
    // Calculate GAD-7 score (anxiety)
    const gad7Score = gad7Answers.reduce((acc, value) => acc + value, 0);
    
    // Determine GAD-7 level
    let gad7Level: "minimal" | "mild" | "moderate" | "severe";
    let gad7Classification = "";
    
    if (gad7Score <= 4) {
      gad7Level = "minimal";
      gad7Classification = "Minimal anxiety symptoms";
    } else if (gad7Score <= 9) {
      gad7Level = "mild";
      gad7Classification = "Mild anxiety symptoms";
    } else if (gad7Score <= 14) {
      gad7Level = "moderate";
      gad7Classification = "Moderate anxiety symptoms";
    } else {
      gad7Level = "severe";
      gad7Classification = "Severe anxiety symptoms";
    }
    
    // Calculate WHO-5 score (well-being) - note this is positively scored
    const who5Score = who5Answers.reduce((acc, value) => acc + value, 0);
    
    // WHO-5 is scored 0-25, convert to percentage
    const who5Percentage = (who5Score / 25) * 100;
    
    // Determine WHO-5 level
    let who5Level: "low" | "moderate" | "high";
    let who5Classification = "";
    
    if (who5Percentage <= 30) {
      who5Level = "low";
      who5Classification = "Low well-being, possible depression";
    } else if (who5Percentage <= 70) {
      who5Level = "moderate";
      who5Classification = "Moderate well-being";
    } else {
      who5Level = "high";
      who5Classification = "High well-being";
    }
    
    // Integrated analysis
    let integratedAnalysis = "";
    let description = "";
    let recommendations: string[] = [];
    let mentalHealthPathway = "";
    let warningLevel: "none" | "caution" | "warning" | "severe" = "none";
    let selfCareSteps: string[] = [];
    let followUp = "";
    
    // Determine overall severity based on worst score
    if (phq9Level === "severe" || gad7Level === "severe" || who5Level === "low") {
      warningLevel = "severe";
      integratedAnalysis = "Your responses suggest you might be experiencing significant mental health challenges right now.";
      
      if (phq9Level === "severe" && gad7Level === "severe") {
        description = "You appear to be dealing with both significant depression and anxiety symptoms, which can feel overwhelming.";
        mentalHealthPathway = "critical_support";
      } else if (phq9Level === "severe") {
        description = "You seem to be experiencing significant depression symptoms that might be affecting your daily life.";
        mentalHealthPathway = "depression_support";
      } else if (gad7Level === "severe") {
        description = "You appear to be experiencing considerable anxiety that might be interfering with your day-to-day activities.";
        mentalHealthPathway = "anxiety_support";
      } else {
        description = "Your overall sense of well-being seems to be lower than ideal right now.";
        mentalHealthPathway = "wellbeing_support";
      }
      
      recommendations = [
        "Consider speaking with a mental health professional for guidance and support",
        "Establish a daily self-care routine that includes rest, movement, and social connection",
        "Try to maintain regular sleep and eating patterns even when difficult",
        "Reach out to supportive friends or family for connection"
      ];
      
      selfCareSteps = [
        "Daily brief mindfulness practice (even 5 minutes helps)",
        "Gentle physical movement as you're able",
        "Connect with someone supportive each day",
        "Create small moments of joy or comfort in your routine"
      ];
      
      followUp = "Based on your responses, speaking with a healthcare professional soon would be beneficial.";
    } 
    else if (phq9Level === "moderately_severe" || phq9Level === "moderate" || 
             gad7Level === "moderate" || who5Level === "moderate") {
      warningLevel = "warning";
      integratedAnalysis = "Your responses suggest you might be experiencing some mental health challenges.";
      
      if (phq9Level === "moderately_severe" || phq9Level === "moderate") {
        description = "You appear to be experiencing moderate depression symptoms. These can affect your energy, mood, and enjoyment of activities.";
        mentalHealthPathway = "moderate_support";
      } else if (gad7Level === "moderate") {
        description = "Your responses indicate moderate anxiety symptoms, which can affect your ability to relax and feel at ease.";
        mentalHealthPathway = "anxiety_support";
      } else {
        description = "Your sense of well-being is in the moderate range, suggesting there could be room for improvement in how you're feeling.";
        mentalHealthPathway = "wellbeing_support";
      }
      
      recommendations = [
        "Consider speaking with a healthcare provider about your mental health",
        "Establish consistent routines for sleep, meals, and physical activity",
        "Practice stress reduction techniques like deep breathing or meditation",
        "Spend time in activities that typically bring you joy or meaning"
      ];
      
      selfCareSteps = [
        "Daily mood tracking in a journal or app",
        "Regular physical activity (aim for 30 minutes daily)",
        "Connect with supportive people in your life",
        "Mindfulness or relaxation practice (10-15 minutes daily)"
      ];
      
      followUp = "Consider following up with a healthcare provider if these symptoms persist or worsen.";
    }
    else if (phq9Level === "mild" || gad7Level === "mild") {
      warningLevel = "caution";
      integratedAnalysis = "Your responses suggest you might be experiencing mild mental health symptoms.";
      
      if (phq9Level === "mild" && gad7Level === "mild") {
        description = "You seem to be experiencing mild symptoms of both depression and anxiety. While these are common, they can still affect your quality of life.";
        mentalHealthPathway = "mild_support";
      } else if (phq9Level === "mild") {
        description = "You appear to be experiencing mild depression symptoms, which might occasionally affect your mood and energy.";
        mentalHealthPathway = "mild_support";
      } else {
        description = "Your responses suggest mild anxiety symptoms, which might sometimes make you feel on edge or worried.";
        mentalHealthPathway = "mild_support";
      }
      
      recommendations = [
        "Continue monitoring your mood and mental health",
        "Maintain regular physical activity and good sleep habits",
        "Practice stress reduction techniques that work for you",
        "Stay connected with supportive people in your life"
      ];
      
      selfCareSteps = [
        "Regular physical activity (walking, yoga, etc.)",
        "Consistent sleep schedule",
        "Mindfulness practice or relaxation techniques",
        "Social connection and enjoyable activities"
      ];
      
      followUp = "Consider reassessing in 4-6 weeks to monitor any changes in your symptoms.";
    }
    else {
      warningLevel = "none";
      integratedAnalysis = "Your responses suggest your mental health is in a generally positive state right now.";
      description = "You appear to be experiencing minimal symptoms of depression or anxiety, and your sense of well-being seems good.";
      mentalHealthPathway = "wellness_maintenance";
      
      recommendations = [
        "Continue your current wellness practices",
        "Maintain regular physical activity and good sleep habits",
        "Practice stress management for everyday challenges",
        "Stay connected with your support network"
      ];
      
      selfCareSteps = [
        "Regular physical activity",
        "Healthy sleep routine",
        "Social connections",
        "Activities that bring you joy and meaning"
      ];
      
      followUp = "Consider reassessing in 3-6 months to ensure continued well-being.";
    }
    
    // Special warning for suicide risk (question 9 on PHQ-9)
    if (phq9Answers[8] >= 1) {
      warningLevel = "severe";
      followUp = "Your response to the question about thoughts of self-harm or suicide is important. Please speak with a healthcare provider or mental health professional right away, or contact a crisis helpline such as the National Suicide Prevention Lifeline at 988.";
    }
    
    // Set results
    const finalResult: MentalHealthResult = {
      phq9: {
        score: phq9Score,
        level: phq9Level,
        classification: phq9Classification
      },
      gad7: {
        score: gad7Score,
        level: gad7Level,
        classification: gad7Classification
      },
      who5: {
        score: who5Score,
        percentageScore: who5Percentage,
        level: who5Level,
        classification: who5Classification
      },
      integratedAnalysis,
      description,
      recommendations,
      mentalHealthPathway,
      warningLevel,
      selfCareSteps,
      followUp
    };
    
    setResult(finalResult);
    setStage("results");
    setShowResults(true);
    
    // Save results to localStorage for integration with other components
    try {
      localStorage.setItem('mentalHealthAssessment', JSON.stringify(finalResult));
      localStorage.setItem('mentalHealthAssessmentDate', new Date().toISOString());
      
      // Trigger onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving mental health assessment:", error);
    }
  };
  
  // Reset assessment
  const resetAssessment = () => {
    setStage("intro");
    setActiveTab("phq9");
    setCurrentQuestionIndex(0);
    setPhq9Answers(new Array(9).fill(-1));
    setGad7Answers(new Array(7).fill(-1));
    setWho5Answers(new Array(5).fill(-1));
    setShowResults(false);
    setResult(null);
  };

  // Render different screens based on the current stage
  if (stage === "results" && result) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <CardTitle className="text-amber-700 flex items-center gap-2">
            <Coffee className="h-5 w-5" /> 
            Coffee Talk Insights
          </CardTitle>
          <CardDescription>
            Thanks for the meaningful conversation about how you've been feeling
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-amber-700 mb-4">Our Coffee Talk Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-amber-600">Mood Assessment</span>
                    <span className="text-lg font-bold text-amber-700">{result.phq9.score}/27</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        result.phq9.level === "minimal" ? "bg-green-500" :
                        result.phq9.level === "mild" ? "bg-amber-400" :
                        result.phq9.level === "moderate" ? "bg-amber-500" :
                        result.phq9.level === "moderately_severe" ? "bg-amber-600" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${(result.phq9.score / 27) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-amber-700 mt-2">{result.phq9.classification}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-600">Anxiety Check-in</span>
                    <span className="text-lg font-bold text-blue-700">{result.gad7.score}/21</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        result.gad7.level === "minimal" ? "bg-green-500" :
                        result.gad7.level === "mild" ? "bg-blue-400" :
                        result.gad7.level === "moderate" ? "bg-blue-500" :
                        "bg-blue-600"
                      }`}
                      style={{ width: `${(result.gad7.score / 21) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">{result.gad7.classification}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-600">Well-being Index</span>
                    <span className="text-lg font-bold text-green-700">{Math.round(result.who5.percentageScore)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        result.who5.level === "high" ? "bg-green-500" :
                        result.who5.level === "moderate" ? "bg-green-400" :
                        "bg-yellow-500"
                      }`}
                      style={{ width: `${result.who5.percentageScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-700 mt-2">{result.who5.classification}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-amber-700 mb-2">What Our Conversation Revealed</h4>
                <p className="text-gray-700 mb-2">{result.integratedAnalysis}</p>
                <p className="text-gray-600">{result.description}</p>
              </div>
              
              {result.warningLevel === "severe" && (
                <Alert className="bg-orange-50 border-orange-100 mb-6">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-700">Support Available</AlertTitle>
                  <AlertDescription className="text-orange-800">
                    Based on our conversation, it might be helpful to speak with a healthcare professional soon. If you're experiencing thoughts of harming yourself, please contact a crisis service such as the National Suicide Prevention Lifeline at 988, or go to your nearest emergency room.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-amber-700">Recommendations</h4>
                <ul className="space-y-2 list-disc pl-5">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-amber-700">Self-Care Steps</h4>
                <ul className="space-y-2">
                  {result.selfCareSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 text-amber-500">
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
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <h4 className="text-md font-medium text-amber-700 mb-2">Follow-up Thoughts</h4>
                <p className="text-gray-700">{result.followUp}</p>
              </div>
            </div>
            
            <Alert className="bg-amber-50 border-amber-100">
              <InfoIcon className="h-4 w-4 text-amber-600" />
              <AlertTitle>About Our Coffee Talk</AlertTitle>
              <AlertDescription className="text-amber-800">
                This conversation provides a snapshot of your current emotional wellbeing. It's not a diagnostic tool, but can help identify patterns that may benefit from attention. Your results have been saved to your wellness profile to help personalize your experience.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-amber-50/70 border-amber-100">
              <Coffee className="h-4 w-4 text-amber-600" />
              <AlertTitle>Seeking Support</AlertTitle>
              <AlertDescription className="text-amber-800">
                Emotional wellbeing is an important part of your overall health. If you're struggling, remember that support is available. Explore the wellness resources in the app, or reach out to a trusted friend, family member, or healthcare provider for additional support.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-2 pb-6">
          <div 
            className="flex items-center justify-center rounded-md cursor-pointer shadow-sm px-4 py-2 transition-all duration-200 w-full sm:w-auto text-center"
            onClick={resetAssessment}
            style={{
              backgroundColor: 'white',
              color: '#b45309', /* amber-700 */
              border: '1px solid #fcd34d', /* amber-300 */
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#fffbeb'; /* amber-50 */
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          >
            <span className="font-medium whitespace-nowrap text-center">Start a New Coffee Talk</span>
          </div>
          <div 
            className="flex items-center justify-center rounded-md cursor-pointer shadow-sm px-4 py-2 w-full sm:w-auto text-center"
            style={{
              backgroundColor: '#d97706', /* amber-600 */
              color: 'white',
              border: '1px solid #b45309', /* amber-700 */
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#b45309'; /* amber-700 */
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706'; /* amber-600 */
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          >
            <Coffee className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap text-center">Save to Wellness Profile</span>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  // Introduction/welcome screen
  if (stage === "intro") {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <CardTitle className="text-amber-700 flex items-center gap-2">
            <Coffee className="h-5 w-5" /> 
            Coffee Talk
          </CardTitle>
          <CardDescription>
            Let's have a relaxed chat about how you've been feeling lately
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">Welcome to Coffee Talk</h3>
              <p className="text-gray-700 mb-4">
                Imagine we're sitting together at a cozy coffee shop, taking a moment to check in on how you're really doing. This is a judgment-free space to reflect on your mental wellbeing.
              </p>
              <p className="text-gray-700">
                We'll explore three areas that help paint a complete picture of your emotional health:
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Coffee className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-700">Mood Check</h4>
                    <p className="text-sm text-gray-600">How your mood and energy have been recently</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Wind className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Anxiety Check</h4>
                    <p className="text-sm text-gray-600">Your experiences with worry and tension</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Sun className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700">Well-being Check</h4>
                    <p className="text-sm text-gray-600">The positive aspects of your mental health</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert className="bg-amber-50 border-amber-100">
              <InfoIcon className="h-4 w-4 text-amber-600" />
              <AlertTitle>A Few Things to Know</AlertTitle>
              <AlertDescription className="text-amber-800">
                This conversation takes about 5-7 minutes and your answers are private and stored securely. This isn't a diagnostic tool, but it can help identify patterns and provide personalized insights about your mental wellbeing.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-6">
          <div 
            className="flex items-center justify-center w-full py-3 px-6 rounded-md cursor-pointer shadow-sm transition-all duration-200 hover:shadow text-center"
            onClick={handleStartAssessment}
            style={{
              backgroundColor: '#d97706', /* amber-600 */
              color: 'white',
              border: '1px solid #b45309', /* amber-700 */
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b45309'} /* amber-700 */
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d97706'} /* amber-600 */
          >
            <Coffee className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap text-center">Start Our Coffee Talk</span>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  // Questions screen with tabs for different assessments
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <CardTitle className="text-amber-700 flex items-center gap-2">
          <Coffee className="h-5 w-5" /> 
          Coffee Talk
        </CardTitle>
        <CardDescription>
          Let's chat about how you've been feeling lately
        </CardDescription>
        <Tabs value={activeTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="phq9"
              className={activeTab === "phq9" ? "bg-amber-100 text-amber-800" : ""}
              disabled={activeTab !== "phq9"}
            >
              <Coffee className="h-4 w-4 mr-2" />
              Mood
            </TabsTrigger>
            <TabsTrigger 
              value="gad7"
              className={activeTab === "gad7" ? "bg-blue-100 text-blue-800" : ""}
              disabled={activeTab !== "gad7"}
            >
              <Wind className="h-4 w-4 mr-2" />
              Anxiety
            </TabsTrigger>
            <TabsTrigger 
              value="who5"
              className={activeTab === "who5" ? "bg-green-100 text-green-800" : ""}
              disabled={activeTab !== "who5"}
            >
              <Sun className="h-4 w-4 mr-2" />
              Well-being
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${
              activeTab === "phq9" ? "bg-amber-100 [&>div]:bg-amber-500" :
              activeTab === "gad7" ? "bg-blue-100 [&>div]:bg-blue-500" :
              "bg-green-100 [&>div]:bg-green-500"
            }`} 
          />
        </div>
        
        <div className="space-y-6">
          {currentQuestionIndex > 0 && (
            <div className="text-sm italic text-gray-500 pl-2 border-l-2 border-gray-200">
              {getTransition()}
            </div>
          )}
          
          <div className={`p-4 rounded-lg ${
            activeTab === "phq9" ? "bg-amber-50" :
            activeTab === "gad7" ? "bg-blue-50" :
            "bg-green-50"
          }`}>
            <p className={`text-sm font-medium mb-1 ${
              activeTab === "phq9" ? "text-amber-700" :
              activeTab === "gad7" ? "text-blue-700" :
              "text-green-700"
            }`}>
              {activeTab === "phq9" 
                ? "Over the past two weeks..." 
                : activeTab === "gad7" 
                  ? "How often have you been bothered by..." 
                  : "Over the last two weeks..."}
            </p>
            <p className={`text-lg font-medium ${
              activeTab === "phq9" ? "text-amber-800" :
              activeTab === "gad7" ? "text-blue-800" :
              "text-green-800"
            }`}>
              {activeQuestions[currentQuestionIndex]}
            </p>
          </div>
          
          <div className="space-y-1">
            <RadioGroup
              value={getActiveAnswers()[currentQuestionIndex] >= 0 ? getActiveAnswers()[currentQuestionIndex].toString() : ""}
              onValueChange={(value) => handleAnswerChange(parseInt(value))}
              className="space-y-3"
            >
              {getActiveFrequencyOptions().map((option) => {
                const isSelected = getActiveAnswers()[currentQuestionIndex]?.toString() === option.value.toString();
                return (
                  <div 
                    key={option.value} 
                    className={`flex items-start space-x-2 rounded-md border p-3 hover:bg-gray-50 ${
                      isSelected && activeTab === "phq9" ? "bg-amber-50 border-amber-400" :
                      isSelected && activeTab === "gad7" ? "bg-blue-50 border-blue-400" :
                      isSelected && activeTab === "who5" ? "bg-green-50 border-green-400" :
                      activeTab === "phq9" ? "hover:border-amber-200" :
                      activeTab === "gad7" ? "hover:border-blue-200" :
                      "hover:border-green-200"
                    }`}
                  >
                    <RadioGroupItem 
                      value={option.value.toString()} 
                      id={`q${currentQuestionIndex}-${option.value}`} 
                      className={`mt-1 ${
                        activeTab === "phq9" ? "text-amber-600 border-amber-600" :
                        activeTab === "gad7" ? "text-blue-600 border-blue-600" :
                        "text-green-600 border-green-600"
                      }`}
                    />
                    <div>
                      <Label htmlFor={`q${currentQuestionIndex}-${option.value}`} className="text-base font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          
          {/* Special alert for suicide question on PHQ-9 */}
          {activeTab === "phq9" && currentQuestionIndex === 8 && (
            <Alert className="bg-amber-50 border-amber-100">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Support Available</AlertTitle>
              <AlertDescription className="text-amber-800">
                If you're experiencing thoughts of harming yourself, please reach out for help. The National Suicide Prevention Lifeline is available 24/7 at 988, or you can text HOME to 741741 to reach the Crisis Text Line.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-6">
        <div 
          className="flex items-center justify-center rounded-md cursor-pointer shadow-sm transition-all duration-200 px-4 py-2"
          onClick={handlePrevious}
          style={{
            backgroundColor: 'white',
            color: currentQuestionIndex === 0 && activeTab === "phq9" ? '#9ca3af' /* gray-400 */ : 
                  activeTab === "phq9" ? '#b45309' /* amber-700 */ : 
                  activeTab === "gad7" ? '#1d4ed8' /* blue-700 */ : 
                  '#15803d' /* green-700 */,
            border: `1px solid ${
              currentQuestionIndex === 0 && activeTab === "phq9" ? '#e5e7eb' /* gray-200 */ : 
              activeTab === "phq9" ? '#fcd34d' /* amber-300 */ : 
              activeTab === "gad7" ? '#93c5fd' /* blue-300 */ : 
              '#86efac' /* green-300 */
            }`,
            opacity: currentQuestionIndex === 0 && activeTab === "phq9" ? 0.5 : 1,
            cursor: currentQuestionIndex === 0 && activeTab === "phq9" ? 'not-allowed' : 'pointer',
            pointerEvents: (currentQuestionIndex === 0 && activeTab === "phq9") ? "none" : "auto"
          }}
          onMouseOver={(e) => {
            if (!(currentQuestionIndex === 0 && activeTab === "phq9")) {
              e.currentTarget.style.backgroundColor = 
                activeTab === "phq9" ? '#fffbeb' /* amber-50 */ : 
                activeTab === "gad7" ? '#eff6ff' /* blue-50 */ : 
                '#f0fdf4' /* green-50 */;
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }
          }}
          onMouseOut={(e) => {
            if (!(currentQuestionIndex === 0 && activeTab === "phq9")) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
          }}
        >
          <span className="font-medium whitespace-nowrap text-center">Previous</span>
        </div>
        
        <div 
          className="flex items-center justify-center rounded-md cursor-pointer shadow-sm transition-all duration-200 px-4 py-2 text-white"
          onClick={handleNext}
          style={{
            backgroundColor: activeTab === "phq9" ? '#d97706' /* amber-600 */ : 
                            activeTab === "gad7" ? '#2563eb' /* blue-600 */ : 
                            '#16a34a' /* green-600 */,
            border: `1px solid ${
              activeTab === "phq9" ? '#b45309' /* amber-700 */ : 
              activeTab === "gad7" ? '#1d4ed8' /* blue-700 */ : 
              '#15803d' /* green-700 */
            }`
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 
              activeTab === "phq9" ? '#b45309' /* amber-700 */ : 
              activeTab === "gad7" ? '#1d4ed8' /* blue-700 */ : 
              '#15803d' /* green-700 */;
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 
              activeTab === "phq9" ? '#d97706' /* amber-600 */ : 
              activeTab === "gad7" ? '#2563eb' /* blue-600 */ : 
              '#16a34a' /* green-600 */;
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        >
          <span className="font-medium whitespace-nowrap text-center">
            {currentQuestionIndex < activeQuestions.length - 1 ? "Next" : 
             activeTab === "who5" ? "Complete Coffee Talk" : "Continue"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}