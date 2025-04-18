import { useState, useEffect } from "react";
import { Receipt, AlertCircle, X, FileText, DollarSign, Calculator, Lightbulb, Calendar, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useStateTaxData } from "@/hooks/use-state-tax-data";
import { useToast } from "@/hooks/use-toast";
import QuizComponent, { QuizQuestion } from "@/components/quiz-component";
import { trackLearningProgress } from "@/lib/quiz-service";

// Default pathway and module IDs for the Financial Literacy pathway
const DEFAULT_PATHWAY_ID = "financial-literacy";
const DEFAULT_MODULE_ID = "tax-education";
const DEFAULT_USER_ID = 1; // Default user ID for demo purposes

interface TaxEducationFullscreenProps {
  onClose: () => void;
  pathwayId?: string; // Financial literacy pathway ID
  moduleId?: string; // Tax education module ID
  userId?: number; // User ID for progress tracking
}

export default function TaxEducationFullscreen({ 
  onClose,
  pathwayId = DEFAULT_PATHWAY_ID,
  moduleId = DEFAULT_MODULE_ID,
  userId = DEFAULT_USER_ID
}: TaxEducationFullscreenProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedState, setSelectedState] = useState("ny");
  
  // Get tax data for all states using our hook
  const { stateData, loading } = useStateTaxData();
  
  // Paycheck Calculator State
  const [hourlyWage, setHourlyWage] = useState(15);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [allowances, setAllowances] = useState(1);
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState(true);
  const [includeMedicare, setIncludeMedicare] = useState(true);
  const [includeStateIncomeTax, setIncludeStateIncomeTax] = useState(true);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    
    // Force body to be non-scrollable while this is open
    document.body.style.overflow = "hidden";
    setMounted(true);
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const states = [
    { value: "al", name: "Alabama" },
    { value: "ak", name: "Alaska" },
    { value: "az", name: "Arizona" },
    { value: "ar", name: "Arkansas" },
    { value: "ca", name: "California" },
    { value: "co", name: "Colorado" },
    { value: "ct", name: "Connecticut" },
    { value: "de", name: "Delaware" },
    { value: "fl", name: "Florida" },
    { value: "ga", name: "Georgia" },
    { value: "hi", name: "Hawaii" },
    { value: "id", name: "Idaho" },
    { value: "il", name: "Illinois" },
    { value: "in", name: "Indiana" },
    { value: "ia", name: "Iowa" },
    { value: "ks", name: "Kansas" },
    { value: "ky", name: "Kentucky" },
    { value: "la", name: "Louisiana" },
    { value: "me", name: "Maine" },
    { value: "md", name: "Maryland" },
    { value: "ma", name: "Massachusetts" },
    { value: "mi", name: "Michigan" },
    { value: "mn", name: "Minnesota" },
    { value: "ms", name: "Mississippi" },
    { value: "mo", name: "Missouri" },
    { value: "mt", name: "Montana" },
    { value: "ne", name: "Nebraska" },
    { value: "nv", name: "Nevada" },
    { value: "nh", name: "New Hampshire" },
    { value: "nj", name: "New Jersey" },
    { value: "nm", name: "New Mexico" },
    { value: "ny", name: "New York" },
    { value: "nc", name: "North Carolina" },
    { value: "nd", name: "North Dakota" },
    { value: "oh", name: "Ohio" },
    { value: "ok", name: "Oklahoma" },
    { value: "or", name: "Oregon" },
    { value: "pa", name: "Pennsylvania" },
    { value: "ri", name: "Rhode Island" },
    { value: "sc", name: "South Carolina" },
    { value: "sd", name: "South Dakota" },
    { value: "tn", name: "Tennessee" },
    { value: "tx", name: "Texas" },
    { value: "ut", name: "Utah" },
    { value: "vt", name: "Vermont" },
    { value: "va", name: "Virginia" },
    { value: "wa", name: "Washington" },
    { value: "wv", name: "West Virginia" },
    { value: "wi", name: "Wisconsin" },
    { value: "wy", name: "Wyoming" },
    { value: "dc", name: "District of Columbia" },
  ];

  interface StateInfo {
    name: string;
    hasIncomeTax: boolean;
    taxRate: string;
    salaryExample: {
      job: string;
      salary: number;
      taxesPaid: number;
      takeHome: number;
    };
    funFacts: string[];
    salesTax: string;
    firstJobTip: string;
    thingsToWatch: string[];
  }

  const stateTaxInfo: Record<string, StateInfo> = {
    ny: {
      name: "New York",
      hasIncomeTax: true,
      taxRate: "From 4% to 10.9%, depending on your income",
      salaryExample: {
        job: "Summer camp counselor",
        salary: 3500,
        taxesPaid: 385,
        takeHome: 3115
      },
      funFacts: [
        "New York was the first state to collect a state income tax in 1919!",
        "New York City has its own additional income tax on top of state taxes.",
        "New York uses tax money to fund the MTA (subway system) and huge parks like Central Park."
      ],
      salesTax: "4% state sales tax, plus additional local taxes that can bring it to 8.875% in NYC",
      firstJobTip: "In NY, even part-time workers under 18 usually need to file a tax return if they earn more than $4,300 per year.",
      thingsToWatch: [
        "City income tax (if you live in NYC)",
        "Higher sales tax on clothing items over $110",
        "Property taxes (which your parents might pay) are among the highest in the country"
      ]
    },
    ca: {
      name: "California",
      hasIncomeTax: true,
      taxRate: "From 1% to 13.3%, depending on your income",
      salaryExample: {
        job: "Lifeguard at beach",
        salary: 4000,
        taxesPaid: 400,
        takeHome: 3600
      },
      funFacts: [
        "California has the highest state income tax rate in the US at 13.3% for the super wealthy!",
        "California uses tax money to fund free community college for many residents.",
        "The state collects special taxes on things like marijuana sales and high-value real estate."
      ],
      salesTax: "7.25% state sales tax, with total rates up to 10.75% with local taxes",
      firstJobTip: "California has special protections for workers under 18, including limits on hours during school weeks.",
      thingsToWatch: [
        "High sales tax on almost everything you buy",
        "Special local taxes in cities like San Francisco and Los Angeles",
        "Car registration fees are higher than many other states"
      ]
    },
    tx: {
      name: "Texas",
      hasIncomeTax: false,
      taxRate: "No state income tax!",
      salaryExample: {
        job: "Retail store associate",
        salary: 3200,
        taxesPaid: 0,
        takeHome: 3200
      },
      funFacts: [
        "Texas is one of only seven states with no income tax!",
        "Instead of income tax, Texas relies heavily on sales tax and property tax for revenue.",
        "The no income tax policy helps attract businesses and new residents to the state."
      ],
      salesTax: "6.25% state sales tax, with total rates up to 8.25% with local taxes",
      firstJobTip: "In Texas, you won't have state income tax withheld from your paycheck, but you'll still have federal taxes.",
      thingsToWatch: [
        "Higher property taxes (which affect your parents or if you buy a home later)",
        "Sales taxes on almost everything you purchase",
        "Special taxes on things like hotel stays and rental cars"
      ]
    },
    fl: {
      name: "Florida",
      hasIncomeTax: false,
      taxRate: "No state income tax!",
      salaryExample: {
        job: "Theme park attendant",
        salary: 3800,
        taxesPaid: 0,
        takeHome: 3800
      },
      funFacts: [
        "Florida has no state income tax, which is written into the state constitution!",
        "Tourism helps Florida collect taxes without taxing residents' incomes.",
        "Florida uses lottery revenue to fund education programs."
      ],
      salesTax: "6% state sales tax, with total rates up to 8.5% with local taxes",
      firstJobTip: "Working at Florida theme parks and tourist attractions often comes with employee perks and discounts!",
      thingsToWatch: [
        "Tourist areas often have higher prices and special tourist taxes",
        "Property taxes can be high in desirable areas",
        "Insurance costs (like hurricane insurance) are higher than most states"
      ]
    }
  };

  // Tax Quiz questions in the standard platform format
  const standardizedQuizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What happens to the taxes that are taken out of your paycheck?",
      options: [
        "The money disappears forever",
        "It funds government services like schools, roads, and parks",
        "It all goes to the president",
        "It's saved in your personal account for later"
      ],
      correctAnswer: 1, // Index of correct answer
      explanation: "Taxes fund important services we all use! From the roads you travel on to the schools you attend, taxes help pay for many public services in your community."
    },
    {
      id: 2,
      question: "What's the difference between gross pay and net pay?",
      options: [
        "Gross pay is paid monthly, net pay is paid weekly",
        "Gross pay is before taxes, net pay is what you actually take home",
        "Gross pay is for full-time workers, net pay is for part-time workers",
        "They're exactly the same thing"
      ],
      correctAnswer: 1,
      explanation: "Gross pay is the total amount you earn before any deductions. Net pay is your 'take-home pay' after taxes and other deductions are subtracted. This is why your paycheck is smaller than your hourly rate might suggest!"
    },
    {
      id: 3,
      question: "What is a W-4 form?",
      options: [
        "A form that shows how much you earned last year",
        "A form your parents fill out to claim you as a dependent",
        "A form you fill out when starting a job to determine tax withholding",
        "A receipt for the taxes you've paid"
      ],
      correctAnswer: 2,
      explanation: "When you start a new job, you'll fill out a W-4 form. This tells your employer how much tax to withhold from each paycheck based on your situation. Getting this right helps avoid owing a lot of tax or getting too big a refund later."
    },
    {
      id: 4,
      question: "In which of these states would you NOT pay state income tax?",
      options: [
        "California",
        "New York",
        "Texas",
        "Illinois"
      ],
      correctAnswer: 2,
      explanation: "Texas is one of seven states with no income tax! The others are Alaska, Florida, Nevada, South Dakota, Washington, and Wyoming. However, these states typically have higher sales or property taxes instead."
    },
    {
      id: 5,
      question: "What is sales tax?",
      options: [
        "A tax on your income from a job",
        "A tax added to purchases you make in stores",
        "A tax only adults have to pay",
        "A tax on owning property"
      ],
      correctAnswer: 1,
      explanation: "Sales tax is added to the price of items you buy. It varies by state and sometimes even by city! That's why a $10 item might actually cost $10.60 or more at the register."
    }
  ];
  
  // For backward compatibility with the original quiz questions format
  const quizQuestions = standardizedQuizQuestions.map(q => ({
    question: q.question,
    options: q.options,
    correctAnswer: q.options[q.correctAnswer],
    explanation: q.explanation
  }));

  // Calculate estimated taxes based on inputs
  const calculatePaycheck = () => {
    // Calculate gross pay
    const weeklyGrossPay = hourlyWage * hoursPerWeek;
    const annualGrossPay = weeklyGrossPay * 52;
    
    // Federal tax rates (simplified)
    let federalWithholding = 0;
    if (annualGrossPay > 11000) {
      federalWithholding = ((annualGrossPay - 11000) * 0.10) / 52;
    }
    
    // Adjust for allowances (simplified)
    federalWithholding = Math.max(0, federalWithholding - (allowances * 4 * hourlyWage));
    
    // Social Security and Medicare
    const socialSecurityTax = includeSocialSecurity ? (weeklyGrossPay * 0.062) : 0;
    const medicareTax = includeMedicare ? (weeklyGrossPay * 0.0145) : 0;
    
    // State income tax (simplified)
    let stateIncomeTax = 0;
    if (includeStateIncomeTax) {
      // Get state tax info from either our detailed data or the FRED API data
      const stateInfo = stateTaxInfo[selectedState];
      const fredStateData = stateData[selectedState];
      
      // States known to have no income tax
      const noIncomeTaxStates = ['ak', 'fl', 'nv', 'sd', 'tx', 'wa', 'wy', 'tn', 'nh'];
      
      // Check if state has income tax
      const hasIncomeTax = stateInfo?.hasIncomeTax ?? fredStateData?.hasIncomeTax ?? !noIncomeTaxStates.includes(selectedState);
      
      if (hasIncomeTax) {
        // First check if we have actual data from FRED
        if (fredStateData?.incomeTaxRate) {
          // Convert the percentage to decimal (and adjust based on income level)
          const taxRate = fredStateData.incomeTaxRate / 100;
          stateIncomeTax = weeklyGrossPay * taxRate;
          console.log(`Using FRED tax rate for ${selectedState}: ${taxRate * 100}%`);
        }
        // If no FRED data, use our pre-defined rates for known states
        else if (stateInfo) {
          if (selectedState === "ca") {
            stateIncomeTax = weeklyGrossPay * 0.04;
          } else if (selectedState === "ny") {
            stateIncomeTax = weeklyGrossPay * 0.05;
          } else {
            stateIncomeTax = weeklyGrossPay * 0.03; // Default for states with income tax
          }
        } 
        // Generic fallback rate for states with income tax
        else {
          stateIncomeTax = weeklyGrossPay * 0.03;
        }
      }
    }
    
    // Total deductions
    const totalDeductions = federalWithholding + socialSecurityTax + medicareTax + stateIncomeTax;
    
    // Net pay
    const weeklyNetPay = weeklyGrossPay - totalDeductions;
    
    return {
      weeklyGrossPay: weeklyGrossPay.toFixed(2),
      weeklyNetPay: weeklyNetPay.toFixed(2),
      federalWithholding: federalWithholding.toFixed(2),
      socialSecurityTax: socialSecurityTax.toFixed(2),
      medicareTax: medicareTax.toFixed(2),
      stateIncomeTax: stateIncomeTax.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      takeHomePercentage: ((weeklyNetPay / weeklyGrossPay) * 100).toFixed(0)
    };
  };

  const paycheckResults = calculatePaycheck();
  
  // Get state-specific content
  // Function to get state content, with debug logging
  const getStateContent = () => {
    // Try to get the selected state info, fall back to a default if not found
    const stateInfo = stateTaxInfo[selectedState];
    
    // If we don't have specific info for this state, create a template using FRED API data
    if (!stateInfo) {
      console.log(`No specific data for ${selectedState}, creating data-driven template`);
      
      // Get state name (reference the stateNames from our states array)
      const stateName = states.find(s => s.value === selectedState)?.name || selectedState.toUpperCase();
      
      // Get tax info from our FRED API data hook
      const stateTaxInfo = stateData[selectedState];
      
      // States with no income tax (from our hook)
      const noIncomeTaxStates = ['ak', 'fl', 'nv', 'sd', 'tx', 'wa', 'wy', 'tn', 'nh'];
      
      // Create info based on whether it has income tax and actual FRED data
      const hasIncomeTax = stateTaxInfo?.hasIncomeTax ?? !noIncomeTaxStates.includes(selectedState);
      
      // Return generic template
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{stateName} Tax Facts</CardTitle>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200">
                  {hasIncomeTax ? "Has Income Tax" : "No Income Tax!"}
                </div>
              </div>
              <CardDescription>
                Learn how taxes work in {stateName} and what it means for your money
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <Alert variant="default">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-bold block mb-1">Detailed information for {stateName} coming soon!</span>
                  We're working on adding comprehensive tax information for all 50 states.
                  In the meantime, you can use the Paycheck Calculator with real tax data for {stateName}.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // We have specific state info, so return the detailed view
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">{stateInfo.name} Tax Facts</CardTitle>
              <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200">
                {stateInfo.hasIncomeTax ? "Has Income Tax" : "No Income Tax!"}
              </div>
            </div>
            <CardDescription>
              Learn how taxes work in {stateInfo.name} and what it means for your money
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                State Income Tax Rate
              </h3>
              <p className="text-gray-700">{stateInfo.taxRate}</p>
              
              <div className="mt-4 border border-blue-100 rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-2">Example: Summer Job in {stateInfo.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Job: {stateInfo.salaryExample.job}</span>
                    <span className="font-medium">${stateInfo.salaryExample.salary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Taxes Paid:</span>
                    <span className="font-medium">- ${stateInfo.salaryExample.taxesPaid.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Money You Keep:</span>
                    <span>${stateInfo.salaryExample.takeHome.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Cool Facts About {stateInfo.name} Taxes
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {stateInfo.funFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Sales Tax in {stateInfo.name}</h3>
              <p className="text-gray-700">{stateInfo.salesTax}</p>
              <div className="mt-2 bg-blue-50 p-3 rounded-md">
                <p><span className="font-medium">What this means:</span> If you buy a $20 video game in {stateInfo.name}, you'll actually pay around ${(20 * (1 + parseFloat(stateInfo.salesTax.split("%")[0].split("up to ")[0].trim()) / 100)).toFixed(2)}!</p>
              </div>
            </div>
            
            <Card className="border-green-200">
              <CardHeader className="pb-2 bg-green-50">
                <CardTitle className="text-base">First Job Tip for {stateInfo.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p>{stateInfo.firstJobTip}</p>
              </CardContent>
            </Card>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Things to Watch Out For</h3>
              <ul className="space-y-2 list-disc pl-5">
                {stateInfo.thingsToWatch.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // This function is called when a quiz is completed through the QuizComponent
  const handleQuizCompletion = (
    score: number, 
    totalQuestions: number, 
    userAnswers?: number[], 
    correctAnswers?: number[]
  ) => {
    // Record the quiz completion with the learning progress tracking system
    toast({
      title: "Quiz completed!",
      description: `You scored ${score} out of ${totalQuestions}`,
      duration: 3000
    });
    
    // Track learning progress if the pathway and module IDs are available
    if (pathwayId && moduleId) {
      // In a real implementation, this would call the API to track progress
      // trackLearningProgress({
      //   userId,
      //   pathwayId,
      //   moduleId,
      //   activityType: "quiz",
      //   score,
      //   totalQuestions,
      //   completed: true
      // });
      
      console.log(`Quiz completed: ${score}/${totalQuestions} for module ${moduleId} in pathway ${pathwayId}`);
    }
  };
  
  // Legacy quiz handlers for backward compatibility
  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === quizQuestions[quizStep].correctAnswer) {
      setQuizScore(quizScore + 1);
    }
  };

  const nextQuizQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz completed
      setQuizStep(quizQuestions.length); // Set to length to show results
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizScore(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Understanding Taxes
          </h2>
          <p className="text-green-100">
            Learn how taxes work and why they matter for your future
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-green-700">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Alert variant="default" className="mb-6 border-green-500 bg-green-50">
          <Lightbulb className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            Understanding taxes now will help you make smart money decisions when you start earning!
          </AlertDescription>
        </Alert>
        
        <Tabs
          defaultValue="learn"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="learn">
              <Lightbulb className="h-4 w-4 mr-2" />
              Learn About Taxes
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              Paycheck Calculator
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <FileText className="h-4 w-4 mr-2" />
              Tax Quiz
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="learn" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>What Are Taxes?</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p>
                    Taxes are money that people and businesses pay to the government. This money helps pay for things we all use and need, like:
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md">
                      <div className="mt-1 bg-blue-100 p-1 rounded">🏫</div>
                      <div>
                        <h4 className="font-medium">Schools</h4>
                        <p className="text-sm">Public education for everyone</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-green-50 p-3 rounded-md">
                      <div className="mt-1 bg-green-100 p-1 rounded">🚑</div>
                      <div>
                        <h4 className="font-medium">Emergency Services</h4>
                        <p className="text-sm">Police, fire, and ambulances</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-md">
                      <div className="mt-1 bg-yellow-100 p-1 rounded">🛣️</div>
                      <div>
                        <h4 className="font-medium">Roads & Bridges</h4>
                        <p className="text-sm">Transportation infrastructure</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-purple-50 p-3 rounded-md">
                      <div className="mt-1 bg-purple-100 p-1 rounded">🏞️</div>
                      <div>
                        <h4 className="font-medium">Parks & Libraries</h4>
                        <p className="text-sm">Public spaces and resources</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <p>When you start working, you'll notice that taxes are taken out of your paycheck. This might seem frustrating at first, but remember that taxes help pay for services we all need!</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Types of Taxes You'll Encounter</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="income-tax">
                      <AccordionTrigger>Income Tax</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">This is a tax on the money you earn from working. There are two main types:</p>
                        <ul className="space-y-3 list-disc pl-5">
                          <li>
                            <span className="font-medium">Federal income tax:</span> This goes to the U.S. government and is the same no matter which state you live in.
                          </li>
                          <li>
                            <span className="font-medium">State income tax:</span> This goes to your state government. Some states (like Texas and Florida) don't have income tax at all!
                          </li>
                        </ul>
                        <div className="mt-3 bg-amber-50 p-3 rounded-md">
                          <p><span className="font-medium">Did you know?</span> The amount of income tax you pay depends on how much money you make. This is called a "progressive tax system," which means people who earn more pay a higher percentage in taxes.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="sales-tax">
                      <AccordionTrigger>Sales Tax</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">This is a tax added to things you buy, like clothes, video games, or food at restaurants.</p>
                        <ul className="space-y-3 list-disc pl-5">
                          <li>Sales tax rates are different in each state and even in different cities.</li>
                          <li>Some things might be tax-free (like groceries in many states).</li>
                          <li>You pay this tax every time you buy something - it's added at the checkout.</li>
                        </ul>
                        <div className="mt-3 p-3 rounded-md bg-green-50">
                          <p><span className="font-medium">Example:</span> If you buy a $50 pair of shoes in a state with 6% sales tax, you'll actually pay $53 ($50 + $3 in tax).</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="fica-tax">
                      <AccordionTrigger>Social Security & Medicare Taxes</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2">These taxes (sometimes called FICA) are taken out of your paycheck to fund:</p>
                        <ul className="space-y-3 list-disc pl-5">
                          <li>
                            <span className="font-medium">Social Security:</span> This program provides money to retirees and people with disabilities. You pay 6.2% of your earnings.
                          </li>
                          <li>
                            <span className="font-medium">Medicare:</span> This provides healthcare for people who are 65 or older. You pay 1.45% of your earnings.
                          </li>
                        </ul>
                        <div className="mt-3 p-3 rounded-md bg-green-50">
                          <p>These taxes might seem far away from your life now, but they're investing in your future and helping current retirees!</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="property-tax">
                      <AccordionTrigger>Property Tax</AccordionTrigger>
                      <AccordionContent>
                        <p>This is a tax that homeowners pay based on the value of their house and land. While you probably don't pay this now, your parents might if they own a home.</p>
                        <div className="mt-3 p-3 rounded-md bg-green-50">
                          <p><span className="font-medium">Important to know:</span> Property taxes typically fund local schools and community services. That's why schools in areas with high property values often have more resources!</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Understanding Your First Paycheck</CardTitle>
                <CardDescription>
                  When you get your first job, you might be surprised to see your paycheck is smaller than expected! Here's why:
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="max-w-3xl mx-auto bg-white p-4 border rounded-lg">
                  <h3 className="text-center font-bold border-b pb-2 mb-4">Sample Paycheck Breakdown</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between font-medium">
                        <span>Hours Worked:</span>
                        <span>20 hours</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Hourly Rate:</span>
                        <span>$15.00/hour</span>
                      </div>
                      <div className="flex justify-between font-bold text-green-600 text-lg border-t pt-2">
                        <span>Gross Pay:</span>
                        <span>$300.00</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 border-l pl-4">
                      <h4 className="font-medium mb-2">Deductions:</h4>
                      <div className="flex justify-between text-red-500">
                        <span>Federal Income Tax:</span>
                        <span>-$30.00</span>
                      </div>
                      <div className="flex justify-between text-red-500">
                        <span>Social Security:</span>
                        <span>-$18.60</span>
                      </div>
                      <div className="flex justify-between text-red-500">
                        <span>Medicare:</span>
                        <span>-$4.35</span>
                      </div>
                      <div className="flex justify-between text-red-500">
                        <span>State Income Tax:</span>
                        <span>-$12.00</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1 mt-1">
                        <span>Total Deductions:</span>
                        <span className="text-red-500">-$64.95</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-dashed">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Net Pay (Take-Home):</span>
                      <span className="text-green-600">$235.05</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm bg-gray-50 p-3 rounded">
                    <p><span className="font-medium">Important Terms:</span> "Gross pay" is what you earn before taxes, and "net pay" is what you actually take home after taxes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Tax Rules in Your State</h3>
              <p className="mb-4">Each state has different tax rules that affect how much money you take home from your job. Select your state to learn more:</p>
              
              <div className="mb-4">
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full sm:w-[300px] rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  style={{ backgroundColor: "white", borderColor: "#10b981" }}
                >
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-green-600 mt-1">Tax data for all 50 states now available via the FRED API!</p>
              </div>
              
              {getStateContent()}
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paycheck Calculator</CardTitle>
                <CardDescription>
                  See how taxes will affect your earnings from a job or side gig.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-3">Your Job Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label htmlFor="hourly-wage" className="font-medium">Hourly Wage: ${hourlyWage.toFixed(2)}</label>
                          </div>
                          <Slider 
                            id="hourly-wage"
                            min={7.25} 
                            max={50} 
                            step={0.25} 
                            value={[hourlyWage]}
                            onValueChange={(value) => setHourlyWage(value[0])} 
                          />
                          <p className="text-sm text-gray-500">Federal minimum wage is $7.25/hour, but some states have higher minimums.</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label htmlFor="hours-worked" className="font-medium">Hours Worked Per Week: {hoursPerWeek}</label>
                          </div>
                          <Slider 
                            id="hours-worked"
                            min={1} 
                            max={40} 
                            step={1} 
                            value={[hoursPerWeek]}
                            onValueChange={(value) => setHoursPerWeek(value[0])} 
                          />
                          <p className="text-sm text-gray-500">Part-time is usually under 30 hours, full-time is 40 hours.</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label htmlFor="allowances" className="font-medium">Tax Allowances: {allowances}</label>
                          </div>
                          <Slider 
                            id="allowances"
                            min={0} 
                            max={3} 
                            step={1} 
                            value={[allowances]}
                            onValueChange={(value) => setAllowances(value[0])} 
                          />
                          <p className="text-sm text-gray-500">More allowances = less tax withheld from each paycheck.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Your Location</h3>
                      <select 
                        value={selectedState} 
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                        style={{ backgroundColor: "white", borderColor: "#10b981" }}
                      >
                        {states.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-green-600 mt-1">Tax data for all 50 states now available via the FRED API!</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Tax Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="social-security" 
                            checked={includeSocialSecurity}
                            onChange={() => setIncludeSocialSecurity(!includeSocialSecurity)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="social-security">Include Social Security Tax (6.2%)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="medicare" 
                            checked={includeMedicare}
                            onChange={() => setIncludeMedicare(!includeMedicare)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="medicare">Include Medicare Tax (1.45%)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="state-tax" 
                            checked={includeStateIncomeTax}
                            onChange={() => setIncludeStateIncomeTax(!includeStateIncomeTax)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="state-tax">Include State Income Tax</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-5">
                    <h3 className="text-xl font-bold mb-6 text-center text-green-700">Your Estimated Paycheck</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-center">
                          <h4 className="text-sm uppercase text-gray-500 mb-1">Weekly Gross Pay</h4>
                          <p className="text-2xl font-bold text-green-600">${paycheckResults.weeklyGrossPay}</p>
                          <p className="text-xs text-gray-500">Before any taxes</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                        <h4 className="font-medium text-red-500">Taxes & Deductions:</h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Federal Income Tax:</span>
                            <span>-${paycheckResults.federalWithholding}</span>
                          </div>
                          {includeSocialSecurity && (
                            <div className="flex justify-between">
                              <span>Social Security:</span>
                              <span>-${paycheckResults.socialSecurityTax}</span>
                            </div>
                          )}
                          {includeMedicare && (
                            <div className="flex justify-between">
                              <span>Medicare:</span>
                              <span>-${paycheckResults.medicareTax}</span>
                            </div>
                          )}
                          {includeStateIncomeTax && stateTaxInfo[selectedState]?.hasIncomeTax && (
                            <div className="flex justify-between">
                              <span>State Income Tax:</span>
                              <span>-${paycheckResults.stateIncomeTax}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span>Total Deductions:</span>
                            <span className="text-red-500">-${paycheckResults.totalDeductions}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-center">
                          <h4 className="text-sm uppercase text-gray-500 mb-1">Weekly Take-Home Pay</h4>
                          <p className="text-2xl font-bold text-green-600">${paycheckResults.weeklyNetPay}</p>
                          <p className="text-xs text-gray-500">What you'll receive in your paycheck</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="text-sm font-medium mb-1 block">You keep {paycheckResults.takeHomePercentage}% of your earnings:</label>
                        <div className="h-4 bg-gray-200 rounded-full">
                          <div 
                            className="h-4 bg-green-500 rounded-full" 
                            style={{ width: `${paycheckResults.takeHomePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 rounded-b-lg text-sm">
                <p className="text-gray-500">
                  Note: This is an educational estimate. Actual taxes may vary based on your specific situation, 
                  deductions, and current tax laws. The calculator makes some simplifications for educational purposes.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-green-700">Test Your Tax Knowledge</CardTitle>
                  <span className="text-sm font-medium text-green-600 bg-white px-3 py-1 rounded-full">
                    Progress Tracked
                  </span>
                </div>
                <CardDescription>
                  Complete this quiz to demonstrate your understanding of taxes and track your learning progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Platform's standardized quiz component */}
                <QuizComponent
                  subject="Tax Education"
                  questions={standardizedQuizQuestions}
                  difficulty="beginner"
                  pathwayId={pathwayId}
                  moduleId={moduleId}
                  userId={userId}
                  adaptiveLearning={true}
                  onComplete={handleQuizCompletion}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add a more prominent close button at the bottom */}
        <div className="flex justify-center mt-8 mb-4">
          <Button 
            onClick={onClose} 
            className="tax-close-btn px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center gap-2"
            size="lg"
            style={{ zIndex: 999999 }}
          >
            <X className="h-5 w-5" />
            Close Tax Guide
          </Button>
        </div>
      </div>
    </div>
  );
}