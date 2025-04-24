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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Brain, 
  Dumbbell, 
  Apple, 
  AlertCircle,
  InfoIcon, 
  ArrowRight,
  RefreshCw,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PHQ9Assessment from "./phq9-assessment";
import PAVSAssessment from "./pavs-assessment";

// Types for assessment data
interface PHQ9Data {
  score: number;
  level: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
  classification: string;
  description: string;
  recommendations: string[];
  mentalHealthPathway: string;
  warningLevel: "none" | "caution" | "warning" | "severe";
  selfCareSteps: string[];
  followUp: string;
  date?: string;
}

interface PAVSData {
  minutesPerWeek: number;
  daysPerWeek: number;
  intensity: "light" | "moderate" | "vigorous" | "mixed";
  classificationLevel: "inactive" | "insufficient" | "active";
  classificationText: string;
  recommendationLevel: string;
  recommendations: string[];
  actions: string[];
  date?: string;
}

interface NutritionData {
  // Basic nutritional assessment data
  fruitsVegetablesDaily: number;
  proteinSources: string[];
  waterIntake: number;
  mealPattern: string;
  restrictions: string[];
  goals: string[];
  date?: string;
}

interface WellnessProfile {
  mentalHealth: PHQ9Data | null;
  physicalActivity: PAVSData | null;
  nutrition: NutritionData | null;
  lastUpdated: string;
}

export default function WellnessIntegration() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [wellnessProfile, setWellnessProfile] = useState<WellnessProfile>({
    mentalHealth: null,
    physicalActivity: null,
    nutrition: null,
    lastUpdated: new Date().toISOString()
  });
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [showPAVS, setShowPAVS] = useState(false);

  // Load wellness profile from localStorage on mount
  useEffect(() => {
    const loadWellnessData = () => {
      try {
        // Load PHQ-9 data
        const phq9Data = localStorage.getItem('phq9Assessment');
        const phq9Date = localStorage.getItem('phq9AssessmentDate');
        
        // Load PAVS data
        const pavsData = localStorage.getItem('pavsAssessment');
        const pavsDate = localStorage.getItem('pavsAssessmentDate');
        
        // Load nutrition data
        const nutritionData = localStorage.getItem('nutritionAssessment');
        const nutritionDate = localStorage.getItem('nutritionAssessmentDate');
        
        // Update wellness profile with available data
        const updatedProfile: WellnessProfile = {
          mentalHealth: phq9Data ? { 
            ...JSON.parse(phq9Data),
            date: phq9Date || new Date().toISOString()
          } : null,
          physicalActivity: pavsData ? {
            ...JSON.parse(pavsData),
            date: pavsDate || new Date().toISOString()
          } : null,
          nutrition: nutritionData ? {
            ...JSON.parse(nutritionData),
            date: nutritionDate || new Date().toISOString()
          } : null,
          lastUpdated: new Date().toISOString()
        };
        
        setWellnessProfile(updatedProfile);
        
      } catch (error) {
        console.error("Error loading wellness profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your wellness profile. Some data may be missing.",
        });
      }
    };
    
    loadWellnessData();
  }, []);

  // Calculate assessment status and age
  const getAssessmentStatus = (dateString?: string) => {
    if (!dateString) return "Not Completed";
    
    const assessmentDate = new Date(dateString);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 1) return "Completed Today";
    if (daysDifference === 1) return "Completed Yesterday";
    if (daysDifference < 30) return `Completed ${daysDifference} days ago`;
    if (daysDifference < 60) return "Completed about 1 month ago";
    return `Completed ${Math.floor(daysDifference / 30)} months ago`;
  };

  // Determine if assessment needs updating (older than 30 days)
  const needsUpdate = (dateString?: string) => {
    if (!dateString) return true;
    
    const assessmentDate = new Date(dateString);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDifference >= 30;
  };

  // Get wellness pathway based on combined assessment results
  const getWellnessPathway = () => {
    const mentalHealthNeeds = wellnessProfile.mentalHealth?.level || "unknown";
    const activityLevel = wellnessProfile.physicalActivity?.classificationLevel || "unknown";
    
    // Default pathway if assessments are incomplete
    if (mentalHealthNeeds === "unknown" || activityLevel === "unknown") {
      return {
        name: "Basic Wellness",
        description: "Complete your assessments to unlock personalized pathways.",
        recommendations: [
          "Complete the PHQ-9 assessment to evaluate your emotional wellbeing",
          "Complete the PAVS assessment to determine your physical activity level",
          "Complete a nutrition assessment for dietary recommendations"
        ]
      };
    }
    
    // Define pathways based on assessment combinations
    if ((mentalHealthNeeds === "moderate" || mentalHealthNeeds === "moderately_severe" || mentalHealthNeeds === "severe") && 
        (activityLevel === "inactive" || activityLevel === "insufficient")) {
      return {
        name: "Mental Wellness Focus",
        description: "This pathway prioritizes mental health support while gradually building physical activity.",
        recommendations: [
          "Work with Fundi coach to develop stress management techniques",
          "Begin with very gentle physical activity like short walks",
          "Focus on nutrition that supports brain health",
          "Establish consistent sleep patterns"
        ]
      };
    } else if ((mentalHealthNeeds === "minimal" || mentalHealthNeeds === "mild") && 
               (activityLevel === "inactive")) {
      return {
        name: "Physical Activation",
        description: "This pathway focuses on building consistent physical activity habits.",
        recommendations: [
          "Start with short, enjoyable physical activities",
          "Gradually increase duration and frequency",
          "Use the activity tracker to monitor progress",
          "Incorporate movement throughout your day"
        ]
      };
    } else if ((mentalHealthNeeds === "minimal" || mentalHealthNeeds === "mild") && 
               (activityLevel === "active")) {
      return {
        name: "Wellness Optimization",
        description: "This pathway helps maintain your good physical habits while optimizing overall wellness.",
        recommendations: [
          "Continue your current activity routine",
          "Focus on nutrition quality and variety",
          "Consider adding mindfulness practices",
          "Track sleep quality and optimize your rest"
        ]
      };
    } else if ((mentalHealthNeeds === "moderate" || mentalHealthNeeds === "moderately_severe") && 
               (activityLevel === "active")) {
      return {
        name: "Balanced Recovery",
        description: "This pathway balances emotional support with continued physical activity.",
        recommendations: [
          "Maintain physical activity as a supportive practice",
          "Add stress reduction techniques",
          "Work with Fundi coach on emotional wellness",
          "Consider journaling to track mood patterns"
        ]
      };
    } else {
      return {
        name: "Holistic Progress",
        description: "This pathway provides a balanced approach to improving all aspects of wellness.",
        recommendations: [
          "Build consistent habits across exercise, nutrition, and mental wellness",
          "Use the tracking tools to monitor your progress",
          "Work with Fundi coach to address specific challenges",
          "Gradually increase activity intensity and duration"
        ]
      };
    }
  };

  const pathway = getWellnessPathway();

  // Handle assessment completion
  const handleAssessmentComplete = () => {
    // Reload wellness profile data
    const loadWellnessData = () => {
      try {
        // Load PHQ-9 data
        const phq9Data = localStorage.getItem('phq9Assessment');
        const phq9Date = localStorage.getItem('phq9AssessmentDate');
        
        // Load PAVS data
        const pavsData = localStorage.getItem('pavsAssessment');
        const pavsDate = localStorage.getItem('pavsAssessmentDate');
        
        // Load nutrition data
        const nutritionData = localStorage.getItem('nutritionAssessment');
        const nutritionDate = localStorage.getItem('nutritionAssessmentDate');
        
        // Update wellness profile with available data
        const updatedProfile: WellnessProfile = {
          mentalHealth: phq9Data ? { 
            ...JSON.parse(phq9Data),
            date: phq9Date || new Date().toISOString()
          } : null,
          physicalActivity: pavsData ? {
            ...JSON.parse(pavsData),
            date: pavsDate || new Date().toISOString()
          } : null,
          nutrition: nutritionData ? {
            ...JSON.parse(nutritionData),
            date: nutritionDate || new Date().toISOString()
          } : null,
          lastUpdated: new Date().toISOString()
        };
        
        setWellnessProfile(updatedProfile);
        
        // Reset assessment views
        setShowPHQ9(false);
        setShowPAVS(false);
        
        // Show success message
        toast({
          title: "Assessment Complete",
          description: "Your wellness profile has been updated with your new assessment results.",
          style: { borderColor: "#8b5cf6", borderWidth: "1px" },
        });
        
      } catch (error) {
        console.error("Error loading wellness profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your wellness profile. Some data may be missing.",
        });
      }
    };
    
    loadWellnessData();
  };

  if (showPHQ9) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <PHQ9Assessment onComplete={handleAssessmentComplete} />
      </div>
    );
  }

  if (showPAVS) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <PAVSAssessment onComplete={handleAssessmentComplete} />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="bg-wellness-50 border-b border-wellness-100">
        <CardTitle className="text-wellness-700 flex items-center gap-2">
          <Heart className="h-5 w-5" /> 
          Your Wellness Profile
        </CardTitle>
        <CardDescription>
          Integrated assessment results and personalized recommendations
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <CardContent className="pt-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mental">Mental Health</TabsTrigger>
            <TabsTrigger value="physical">Physical Activity</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-wellness-50 p-6 rounded-lg border border-wellness-100">
              <h3 className="text-xl font-semibold text-wellness-700 mb-4">Your Wellness Pathway</h3>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <h4 className="text-lg font-medium text-wellness-700">{pathway.name}</h4>
                <p className="text-gray-600 mt-1">{pathway.description}</p>
              </div>
              
              <h4 className="text-md font-medium text-wellness-700 mb-3">Recommended Focus Areas</h4>
              <ul className="space-y-2">
                {pathway.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-0.5 text-wellness-500">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="py-3 xs:py-4 bg-purple-50 border-b border-purple-100">
                  <CardTitle className="text-sm xs:text-base text-purple-700 flex items-center gap-2">
                    <Brain className="h-4 w-4" /> 
                    Mental Wellbeing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 xs:p-4">
                  {wellnessProfile.mentalHealth ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm text-gray-600">PHQ-9 Score:</span>
                        <span className="font-medium text-xs xs:text-sm">{wellnessProfile.mentalHealth.score}/27</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm text-gray-600">Classification:</span>
                        <span className="font-medium text-xs xs:text-sm capitalize">{wellnessProfile.mentalHealth.level.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2">
                        {getAssessmentStatus(wellnessProfile.mentalHealth.date)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs xs:text-sm text-gray-500 mb-2">Assessment not completed</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 w-full text-xs xs:text-sm"
                        onClick={() => setShowPHQ9(true)}
                      >
                        Complete PHQ-9
                      </Button>
                    </div>
                  )}
                </CardContent>
                {wellnessProfile.mentalHealth && (
                  <CardFooter className="p-2 bg-gray-50 border-t border-gray-100">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-purple-700 hover:bg-purple-50 text-xs"
                      onClick={() => setActiveTab("mental")}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="py-3 xs:py-4 bg-blue-50 border-b border-blue-100">
                  <CardTitle className="text-sm xs:text-base text-blue-700 flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" /> 
                    Physical Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 xs:p-4">
                  {wellnessProfile.physicalActivity ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm text-gray-600">Minutes/Week:</span>
                        <span className="font-medium text-xs xs:text-sm">{wellnessProfile.physicalActivity.minutesPerWeek}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm text-gray-600">Classification:</span>
                        <span className="font-medium text-xs xs:text-sm capitalize">{wellnessProfile.physicalActivity.classificationLevel}</span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2">
                        {getAssessmentStatus(wellnessProfile.physicalActivity.date)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs xs:text-sm text-gray-500 mb-2">Assessment not completed</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full text-xs xs:text-sm"
                        onClick={() => setShowPAVS(true)}
                      >
                        Complete PAVS
                      </Button>
                    </div>
                  )}
                </CardContent>
                {wellnessProfile.physicalActivity && (
                  <CardFooter className="p-2 bg-gray-50 border-t border-gray-100">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-blue-700 hover:bg-blue-50 text-xs"
                      onClick={() => setActiveTab("physical")}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              <Card className="overflow-hidden sm:col-span-2 md:col-span-1">
                <CardHeader className="py-3 xs:py-4 bg-green-50 border-b border-green-100">
                  <CardTitle className="text-sm xs:text-base text-green-700 flex items-center gap-2">
                    <Apple className="h-4 w-4" /> 
                    Nutrition
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 xs:p-4">
                  {wellnessProfile.nutrition ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm text-gray-600">Fruits & Vegetables:</span>
                        <span className="font-medium text-xs xs:text-sm">{wellnessProfile.nutrition.fruitsVegetablesDaily} servings/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm text-gray-600">Water Intake:</span>
                        <span className="font-medium text-xs xs:text-sm">{wellnessProfile.nutrition.waterIntake} oz/day</span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2">
                        {getAssessmentStatus(wellnessProfile.nutrition.date)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs xs:text-sm text-gray-500 mb-2">Assessment not completed</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-200 text-green-700 hover:bg-green-50 w-full text-xs xs:text-sm"
                      >
                        Complete Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
                {wellnessProfile.nutrition && (
                  <CardFooter className="p-2 bg-gray-50 border-t border-gray-100">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-green-700 hover:bg-green-50 text-xs"
                      onClick={() => setActiveTab("nutrition")}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
            
            <Alert className="bg-blue-50 border-blue-100">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle>Assessment Integration</AlertTitle>
              <AlertDescription className="text-blue-800">
                Your assessment results are used to personalize your experience across the platform. 
                Recommendations, content, and Fundi's coaching approach will adapt based on your wellness profile.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="mental" className="space-y-6">
            {wellnessProfile.mentalHealth ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-purple-700">Mental Health Assessment</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      onClick={() => setShowPHQ9(true)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      {needsUpdate(wellnessProfile.mentalHealth.date) ? 
                        "Update Assessment" : "Retake Assessment"}
                    </Button>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-600">PHQ-9 Score</span>
                      <span className="text-xl font-bold text-purple-700">{wellnessProfile.mentalHealth.score}/27</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={
                            wellnessProfile.mentalHealth.level === "minimal" ? "bg-green-500" :
                            wellnessProfile.mentalHealth.level === "mild" ? "bg-blue-500" :
                            wellnessProfile.mentalHealth.level === "moderate" ? "bg-yellow-500" :
                            wellnessProfile.mentalHealth.level === "moderately_severe" ? "bg-orange-500" :
                            "bg-red-500"
                          }
                          style={{ width: `${(wellnessProfile.mentalHealth.score / 27) * 100}%`, height: '100%' }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-purple-600">Minimal</span>
                      <span className="text-xs text-purple-600">Mild</span>
                      <span className="text-xs text-purple-600">Moderate</span>
                      <span className="text-xs text-purple-600">Mod. Severe</span>
                      <span className="text-xs text-purple-600">Severe</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-purple-700 mb-2">Classification</h4>
                    <p className="text-gray-700 mb-2">{wellnessProfile.mentalHealth.classification}</p>
                    <p className="text-gray-600">{wellnessProfile.mentalHealth.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-700">Personal Recommendations</h4>
                    <ul className="space-y-2 list-disc pl-5">
                      {wellnessProfile.mentalHealth.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-purple-700">Self-Care Steps</h4>
                      <span className="text-xs text-gray-500">
                        Assessment Date: {new Date(wellnessProfile.mentalHealth.date || "").toLocaleDateString()}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {wellnessProfile.mentalHealth.selfCareSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-0.5 text-purple-500">
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
                </div>
                
                {wellnessProfile.mentalHealth.warningLevel === "severe" && (
                  <Alert className="bg-red-50 border-red-100">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-700">Important</AlertTitle>
                    <AlertDescription className="text-red-800">
                      Based on your assessment, we recommend speaking with a healthcare professional. If you're experiencing thoughts of harming yourself, please contact a crisis service such as the National Suicide Prevention Lifeline at 988.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Alert className="bg-purple-50 border-purple-100">
                  <InfoIcon className="h-4 w-4 text-purple-600" />
                  <AlertTitle>Your Mental Wellness Pathway</AlertTitle>
                  <AlertDescription className="text-purple-800">
                    Based on your assessment, Fundi will adapt conversations to provide appropriate support for your current needs. The wellness modules will highlight content most relevant to your mental wellbeing journey.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-purple-50 rounded-full p-4 inline-flex mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Mental Health Assessment Not Completed</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Complete the PHQ-9 assessment to receive personalized mental wellness recommendations and unlock adaptive support from Fundi.
                </p>
                <Button 
                  onClick={() => setShowPHQ9(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Complete PHQ-9 Assessment
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="physical" className="space-y-6">
            {wellnessProfile.physicalActivity ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-blue-700">Physical Activity Assessment</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => setShowPAVS(true)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      {needsUpdate(wellnessProfile.physicalActivity.date) ? 
                        "Update Assessment" : "Retake Assessment"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">Days Per Week</p>
                      <p className="text-2xl font-bold text-blue-700">{wellnessProfile.physicalActivity.daysPerWeek}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">Minutes Per Week</p>
                      <p className="text-2xl font-bold text-blue-700">{wellnessProfile.physicalActivity.minutesPerWeek}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">Intensity</p>
                      <p className="text-2xl font-bold text-blue-700 capitalize">{wellnessProfile.physicalActivity.intensity}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-blue-700 mb-2">Activity Classification</h4>
                    <div className={`p-4 rounded-lg ${
                      wellnessProfile.physicalActivity.classificationLevel === "active" ? "bg-green-50 border border-green-100" :
                      wellnessProfile.physicalActivity.classificationLevel === "insufficient" ? "bg-yellow-50 border border-yellow-100" :
                      "bg-orange-50 border border-orange-100"
                    }`}>
                      <p className={`font-semibold ${
                        wellnessProfile.physicalActivity.classificationLevel === "active" ? "text-green-700" :
                        wellnessProfile.physicalActivity.classificationLevel === "insufficient" ? "text-yellow-700" :
                        "text-orange-700"
                      }`}>
                        {wellnessProfile.physicalActivity.classificationLevel === "active" ? "Meeting Recommendations" :
                        wellnessProfile.physicalActivity.classificationLevel === "insufficient" ? "Approaching Recommendations" :
                        "Below Recommendations"}
                      </p>
                      <p className="mt-1 text-gray-700">{wellnessProfile.physicalActivity.classificationText}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-blue-700">Activity Recommendations</h4>
                    <ul className="space-y-2 list-disc pl-5">
                      {wellnessProfile.physicalActivity.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-blue-700">Action Steps</h4>
                      <span className="text-xs text-gray-500">
                        Assessment Date: {new Date(wellnessProfile.physicalActivity.date || "").toLocaleDateString()}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {wellnessProfile.physicalActivity.actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-0.5 text-blue-500">
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
                  <AlertTitle>Your Activity Recommendations</AlertTitle>
                  <AlertDescription className="text-blue-800">
                    These recommendations are based on the Physical Activity Vital Sign (PAVS) assessment and U.S. Department of Health and Human Services guidelines. Your personalized fitness and exercise content will align with these recommendations.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-full p-4 inline-flex mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Physical Activity Assessment Not Completed</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Complete the PAVS assessment to receive personalized activity recommendations and unlock tailored fitness plans based on your current activity level.
                </p>
                <Button 
                  onClick={() => setShowPAVS(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Complete PAVS Assessment
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-6">
            {wellnessProfile.nutrition ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-green-700">Nutrition Assessment</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      {needsUpdate(wellnessProfile.nutrition.date) ? 
                        "Update Assessment" : "Retake Assessment"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium mb-1">Daily Fruit & Vegetable Intake</p>
                      <p className="text-xl font-bold text-green-700">{wellnessProfile.nutrition.fruitsVegetablesDaily} servings</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {wellnessProfile.nutrition.fruitsVegetablesDaily >= 5 ? 
                          "Meeting recommendations" : "Below recommended 5+ servings/day"}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium mb-1">Daily Water Intake</p>
                      <p className="text-xl font-bold text-green-700">{wellnessProfile.nutrition.waterIntake} oz</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {wellnessProfile.nutrition.waterIntake >= 64 ? 
                          "Meeting recommendations" : "Below recommended 64+ oz/day"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-green-700 mb-2">Meal Pattern</h4>
                    <p className="text-gray-700">{wellnessProfile.nutrition.mealPattern}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-md font-medium text-green-700 mb-2">Dietary Preferences/Restrictions</h4>
                      <div className="flex flex-wrap gap-2">
                        {wellnessProfile.nutrition.restrictions.map((restriction, index) => (
                          <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            {restriction}
                          </span>
                        ))}
                        {wellnessProfile.nutrition.restrictions.length === 0 && (
                          <span className="text-gray-500 text-sm">No restrictions reported</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-green-700 mb-2">Protein Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {wellnessProfile.nutrition.proteinSources.map((source, index) => (
                          <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-medium text-green-700">Nutritional Goals</h4>
                      <span className="text-xs text-gray-500">
                        Assessment Date: {new Date(wellnessProfile.nutrition.date || "").toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {wellnessProfile.nutrition.goals.map((goal, index) => (
                        <span key={index} className="px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-md text-sm">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-green-50 border-green-100">
                  <InfoIcon className="h-4 w-4 text-green-600" />
                  <AlertTitle>Nutritional Recommendations</AlertTitle>
                  <AlertDescription className="text-green-800">
                    Based on your assessment, your meal planning tools and recipe recommendations will be personalized to match your preferences, restrictions, and nutritional goals.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-50 rounded-full p-4 inline-flex mx-auto mb-4">
                  <Apple className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Nutrition Assessment Not Completed</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Complete the nutrition assessment to receive personalized dietary recommendations and unlock tailored meal plans and recipes.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Complete Nutrition Assessment
                </Button>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between pt-2 pb-6">
        <Button variant="outline" onClick={() => setActiveTab("overview")}>
          Back to Overview
        </Button>
        <Button 
          className="bg-wellness-600 hover:bg-wellness-700 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Wellness Report
        </Button>
      </CardFooter>
    </Card>
  );
}