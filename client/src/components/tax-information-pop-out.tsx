import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, DollarSign, Briefcase, Home, FileText, ScrollText, Award, Star, BookOpen, CheckCircle2, TrendingUp, Clock, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// State tax information interface
interface StateTaxInfo {
  name: string;
  incomeTaxRange: string;
  salesTax: string;
  propertyTax: string;
  businessTaxInfo: string;
  specialFeatures: string;
  filingDeadline: string;
}

// Sample state tax data with relevant, concise information
const STATE_TAX_DATA: Record<string, StateTaxInfo> = {
  "AL": {
    name: "Alabama",
    incomeTaxRange: "2% to 5%",
    salesTax: "4% state + local taxes",
    propertyTax: "Average 0.41%, among the lowest in the US",
    businessTaxInfo: "6.5% corporate income tax; various business privilege taxes",
    specialFeatures: "No tax on Social Security or traditional pension income",
    filingDeadline: "April 15 (may differ for corporate entities)"
  },
  "AK": {
    name: "Alaska",
    incomeTaxRange: "No state income tax",
    salesTax: "No state sales tax, but local taxes may apply",
    propertyTax: "Average 1.19%, varies by municipality",
    businessTaxInfo: "No corporate income tax, but has oil and gas production taxes",
    specialFeatures: "Potential annual Permanent Fund Dividend for residents",
    filingDeadline: "N/A for personal income; varies for business taxes"
  },
  "AZ": {
    name: "Arizona",
    incomeTaxRange: "2.59% to 4.5%",
    salesTax: "5.6% state + local taxes",
    propertyTax: "Average 0.62%, below national average",
    businessTaxInfo: "4.9% flat corporate tax rate",
    specialFeatures: "Tax credits for donations to school tuition organizations",
    filingDeadline: "April 15 for individuals; 15th day of 4th month after year-end for corporations"
  },
  "AR": {
    name: "Arkansas",
    incomeTaxRange: "2% to 5.5%",
    salesTax: "6.5% state + local taxes",
    propertyTax: "Average 0.61%, below national average",
    businessTaxInfo: "1% to 6.5% corporate income tax; franchise tax applies",
    specialFeatures: "Low property taxes, but higher sales taxes",
    filingDeadline: "April 15 for individuals; 15th day of 4th month after year-end for corporations"
  },
  "CA": {
    name: "California",
    incomeTaxRange: "1% to 13.3% (highest in US)",
    salesTax: "7.25% state + local taxes",
    propertyTax: "Average 0.73%, capped at 1% plus special assessments",
    businessTaxInfo: "8.84% corporate tax; $800 minimum franchise tax",
    specialFeatures: "Additional 1% mental health tax on income over $1 million",
    filingDeadline: "April 15 for individuals; 15th day of 4th month after year-end for corporations"
  },
  "CO": {
    name: "Colorado",
    incomeTaxRange: "4.55% flat tax",
    salesTax: "2.9% state + local taxes",
    propertyTax: "Average 0.51%, below national average",
    businessTaxInfo: "4.55% flat corporate tax rate",
    specialFeatures: "TABOR limits on tax increases; flat tax structure",
    filingDeadline: "April 15 for individuals; 15th day of 4th month after year-end for corporations"
  },
  "CT": {
    name: "Connecticut",
    incomeTaxRange: "3% to 6.99%",
    salesTax: "6.35% state (7.75% for luxury items)",
    propertyTax: "Average 1.76%, among the highest in the US",
    businessTaxInfo: "7.5% corporate tax rate; surcharges may apply",
    specialFeatures: "Property tax credit available for income-eligible residents",
    filingDeadline: "April 15 for individuals; 15th day of month after due date of federal return for corporations"
  },
  // More states would be added here - omitted for brevity
  // This is just a representative sample
};

// 2023 Federal Tax Brackets (simplified for demonstration)
const FEDERAL_TAX_BRACKETS = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ],
  married: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 0.10 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: Infinity, rate: 0.37 }
  ]
};

// Default state to show first
const DEFAULT_STATE = "CA";

// Define interface for the tax calculator
interface TaxCalculatorState {
  income: number;
  incomeType: "hourly" | "salary";
  filingStatus: "single" | "married" | "headOfHousehold";
  hoursPerWeek: number;
  weeksPerYear: number;
  state: string;
  includeStateIncome: boolean;
  includeFederalIncome: boolean;
  includeFICA: boolean;
}

interface TaxDeduction {
  name: string;
  amount: number;
  percentage: number;
}

interface TaxCalculatorResult {
  grossIncome: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  deductions: TaxDeduction[];
}



// Helper function to extract tax rate from state tax information
const getStateIncomeTaxRate = (stateInfo: StateTaxInfo): number => {
  // Extract the highest rate from the income tax range
  const match = stateInfo.incomeTaxRange.match(/(\d+(\.\d+)?)%/g);
  if (match && match.length > 0) {
    // If there are multiple rates, use the average of the highest and lowest
    const rates = match.map(rate => parseFloat(rate.replace('%', '')));
    if (rates.length > 1) {
      // If there's a range, calculate average
      return (Math.max(...rates) + Math.min(...rates)) / 2 / 100;
    } else {
      // If there's just one rate or a flat rate
      return rates[0] / 100;
    }
  }
  // Return 0 if no income tax or couldn't parse
  return stateInfo.incomeTaxRange.toLowerCase().includes('no state income tax') ? 0 : 0.05; // Default to 5% if parsing fails
};

// Define an interface for learning modules (calendar functionality removed)
interface TaxLearningModule {
  id: string;
  title: string;
  category: "skill" | "goal" | "project" | "webinar" | "other";
  points: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTimeMinutes: number;
  description: string;
}

// Tax learning modules (calendar tracking functionality removed)
const TAX_LEARNING_MODULES: TaxLearningModule[] = [
  {
    id: "tax-basics-101",
    title: "Tax Basics 101",
    category: "skill",
    points: 25,
    difficulty: "beginner",
    estimatedTimeMinutes: 15,
    description: "Learn the fundamental concepts of taxation and how the tax system works"
  },
  {
    id: "income-tax-essentials",
    title: "Income Tax Essentials",
    category: "skill",
    points: 30,
    difficulty: "beginner",
    estimatedTimeMinutes: 20,
    description: "Understanding income tax brackets, deductions, and credits"
  },
  {
    id: "property-tax-understanding",
    title: "Property Tax Deep Dive",
    category: "skill",
    points: 35,
    difficulty: "intermediate",
    estimatedTimeMinutes: 25,
    description: "Learn how property taxes are assessed and their impact on homeownership"
  },
  {
    id: "sales-tax-fundamentals",
    title: "Sales Tax Fundamentals",
    category: "skill",
    points: 20,
    difficulty: "beginner",
    estimatedTimeMinutes: 15,
    description: "Understand how sales taxes work and vary across states"
  },
  {
    id: "business-tax-planning",
    title: "Business Tax Planning",
    category: "project",
    points: 50,
    difficulty: "advanced",
    estimatedTimeMinutes: 40,
    description: "Strategic approaches to business tax planning and structure optimization"
  },
  {
    id: "tax-filing-mastery",
    title: "Tax Filing Mastery",
    category: "skill",
    points: 40,
    difficulty: "intermediate",
    estimatedTimeMinutes: 35,
    description: "Become proficient in understanding tax forms and filing requirements"
  },
  {
    id: "tax-saving-strategies",
    title: "Tax-Saving Strategies",
    category: "goal",
    points: 45,
    difficulty: "intermediate",
    estimatedTimeMinutes: 30,
    description: "Learn legal strategies to minimize your tax burden"
  }
];

export default function TaxInformationPopOut() {
  const [selectedState, setSelectedState] = useState<string>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [userPoints, setUserPoints] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  const [recentAchievement, setRecentAchievement] = useState<string>("");
  
  // Calendar functionality removed
  
  // Tax calculator state
  const [calculatorState, setCalculatorState] = useState<TaxCalculatorState>({
    income: 50000,
    incomeType: "salary",
    filingStatus: "single",
    hoursPerWeek: 40,
    weeksPerYear: 50,
    state: selectedState,
    includeStateIncome: true,
    includeFederalIncome: true,
    includeFICA: true
  });
  
  const [calculatorResult, setCalculatorResult] = useState<TaxCalculatorResult>({
    grossIncome: 0,
    federalTax: 0,
    stateTax: 0,
    ficaTax: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveTaxRate: 0,
    deductions: []
  });
  
  // Sort states alphabetically by name for the dropdown
  const sortedStates = Object.entries(STATE_TAX_DATA)
    .sort(([, a], [, b]) => a.name.localeCompare(b.name))
    .map(([code]) => code);
  
  // Store progress in localStorage to persist between sessions
  useEffect(() => {
    // Load from localStorage on component mount
    const savedProgress = localStorage.getItem('taxLearningProgress');
    const savedBadges = localStorage.getItem('taxLearningBadges');
    // Calendar functionality removed
    
    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress));
      // Calculate points based on completed lessons
      const points = JSON.parse(savedProgress).reduce((total: number, lessonId: string) => {
        const module = TAX_LEARNING_MODULES.find(m => m.id === lessonId);
        return total + (module ? module.points : 0);
      }, 0);
      setUserPoints(points);
    }
    
    if (savedBadges) {
      setUserBadges(JSON.parse(savedBadges));
    }
    
    // Calendar functionality removed
  }, []);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('taxLearningProgress', JSON.stringify(completedLessons));
    localStorage.setItem('taxLearningBadges', JSON.stringify(userBadges));
    // Calendar functionality removed
    
    // Create a custom event to notify other components
    // Calendar references removed
    if (typeof window !== 'undefined') {
      const progressEvent = new CustomEvent('taxLearningProgressUpdated', {
        detail: {
          completedModules: completedLessons,
          badges: userBadges,
          points: userPoints
        }
      });
      window.dispatchEvent(progressEvent);
    }
  }, [completedLessons, userBadges, userPoints]);
  
  // Handle completing a section and award points
  const completeSection = (sectionId: string) => {
    if (!completedLessons.includes(sectionId)) {
      const module = TAX_LEARNING_MODULES.find(m => m.id === sectionId);
      if (module) {
        setUserPoints(prev => prev + module.points);
        setCompletedLessons(prev => [...prev, sectionId]);
        
        // Check for badges based on number of completed lessons
        if (completedLessons.length + 1 === 3) {
          awardBadge("tax-novice", "Tax Novice");
        } else if (completedLessons.length + 1 === 5) {
          awardBadge("tax-pro", "Tax Pro");
        } else if (completedLessons.length + 1 === 7) {
          awardBadge("tax-master", "Tax Master");
        }
      }
    }
  };
  
  // Award a badge
  const awardBadge = (badgeId: string, badgeName: string) => {
    if (!userBadges.includes(badgeId)) {
      setUserBadges(prev => [...prev, badgeId]);
      setRecentAchievement(badgeName);
      setShowAchievement(true);
      
      // Hide achievement notification after 3 seconds
      setTimeout(() => {
        setShowAchievement(false);
      }, 3000);
      
      // Dispatch event for badge earned (for Fundi to react to)
      if (typeof window !== 'undefined') {
        const badgeEvent = new CustomEvent('taxBadgeEarned', {
          detail: {
            badgeId,
            badgeName
          }
        });
        window.dispatchEvent(badgeEvent);
      }
    }
  };
  
  // Calculate federal income tax
  const calculateFederalTax = (income: number, filingStatus: "single" | "married" | "headOfHousehold"): number => {
    let tax = 0;
    const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
    
    for (let i = 0; i < brackets.length; i++) {
      const { min, max, rate } = brackets[i];
      if (income > min) {
        const taxableInThisBracket = Math.min(income, max) - min;
        tax += taxableInThisBracket * rate;
      }
      if (income <= max) break;
    }
    
    return tax;
  };
  
  // Calculate state income tax (simplified)
  const calculateStateTax = (income: number, stateCode: string): number => {
    const stateInfo = STATE_TAX_DATA[stateCode];
    const rate = getStateIncomeTaxRate(stateInfo);
    return income * rate;
  };
  
  // Calculate FICA taxes (Social Security + Medicare)
  const calculateFICATax = (income: number): number => {
    const socialSecurityRate = 0.062; // 6.2%
    const medicareRate = 0.0145; // 1.45%
    const socialSecurityWageCap = 160200; // 2023 cap
    
    const socialSecurityTax = Math.min(income, socialSecurityWageCap) * socialSecurityRate;
    const medicareTax = income * medicareRate;
    
    return socialSecurityTax + medicareTax;
  };
  
  // Calculate total taxes and net income
  const calculateTaxes = () => {
    // Convert hourly wage to annual salary if needed
    const annualIncome = calculatorState.incomeType === "hourly" 
      ? calculatorState.income * calculatorState.hoursPerWeek * calculatorState.weeksPerYear 
      : calculatorState.income;
    
    // Calculate different tax components
    const federalTax = calculatorState.includeFederalIncome 
      ? calculateFederalTax(annualIncome, calculatorState.filingStatus) 
      : 0;
      
    const stateTax = calculatorState.includeStateIncome 
      ? calculateStateTax(annualIncome, calculatorState.state) 
      : 0;
      
    const ficaTax = calculatorState.includeFICA 
      ? calculateFICATax(annualIncome) 
      : 0;
    
    const totalTax = federalTax + stateTax + ficaTax;
    const netIncome = annualIncome - totalTax;
    const effectiveTaxRate = (totalTax / annualIncome) * 100;
    
    // Create deduction entries for the breakdown
    const deductions: TaxDeduction[] = [
      {
        name: "Federal Income Tax",
        amount: federalTax,
        percentage: (federalTax / annualIncome) * 100
      },
      {
        name: "State Income Tax",
        amount: stateTax,
        percentage: (stateTax / annualIncome) * 100
      },
      {
        name: "FICA (Social Security & Medicare)",
        amount: ficaTax,
        percentage: (ficaTax / annualIncome) * 100
      }
    ];
    
    // Update calculator results
    setCalculatorResult({
      grossIncome: annualIncome,
      federalTax,
      stateTax,
      ficaTax,
      totalTax,
      netIncome,
      effectiveTaxRate,
      deductions
    });
  };
  
  // Update calculator state when inputs change
  const handleCalculatorChange = (field: keyof TaxCalculatorState, value: any) => {
    setCalculatorState(prev => ({ 
      ...prev, 
      [field]: value,
      // Update state to match selected state in the main component
      ...(field === 'state' ? { state: value } : {})
    }));
  };
  
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Run calculation when calculator state changes or when tab is selected
  useEffect(() => {
    if (activeTab === 'calculator') {
      calculateTaxes();
    }
  }, [calculatorState, activeTab]);
  
  // Calendar integration functionality
  const addTaxDeadlineToCalendar = () => {
    const deadlineDate = new Date();
    // Set to April 15th of next year
    deadlineDate.setFullYear(deadlineDate.getFullYear() + 1);
    deadlineDate.setMonth(3); // April (0-indexed)
    deadlineDate.setDate(15);
    
    // Create calendar event
    const taxDeadlineEvent = {
      id: `tax-deadline-${Date.now()}`,
      title: `Tax Filing Deadline - ${STATE_TAX_DATA[selectedState].name}`,
      category: "finance",
      date: deadlineDate,
      description: `Federal and ${STATE_TAX_DATA[selectedState].name} tax filing deadline. Don't forget to file your taxes!`
    };
    
    // Get existing events or initialize empty array
    const existingEvents = localStorage.getItem('fundamentaCalendarEvents');
    let events = [];
    
    if (existingEvents) {
      events = JSON.parse(existingEvents);
    }
    
    // Add new event
    events.push(taxDeadlineEvent);
    
    // Save back to localStorage
    localStorage.setItem('fundamentaCalendarEvents', JSON.stringify(events));
    
    // Show success message
    alert("Tax deadline added to your Smart Calendar!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-2">Tax Guide</h1>
      <p className="text-gray-500 text-center mb-6">
        Understand tax basics and explore state-specific tax information
      </p>

      <Alert variant="default" className="mb-6 border-amber-500 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800 text-sm">
          This information is for educational purposes only and may not reflect recent tax law changes. 
          Always consult with a tax professional for advice specific to your situation.
        </AlertDescription>
      </Alert>
      
      {/* State selector */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Select Your State</h2>
        <Select
          value={selectedState}
          onValueChange={(value) => {
            setSelectedState(value);
            // Also update the calculator state with the new state value
            setCalculatorState(prev => ({
              ...prev,
              state: value
            }));
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {sortedStates.map((code) => (
              <SelectItem key={code} value={code}>
                {STATE_TAX_DATA[code].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main content tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex flex-wrap bg-green-50 mb-6 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm sm:text-base"
          >
            Tax Overview
          </TabsTrigger>
          <TabsTrigger 
            value="personal" 
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm sm:text-base"
          >
            Personal Taxes
          </TabsTrigger>
          <TabsTrigger 
            value="calculator" 
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm sm:text-base"
          >
            Tax Calculator
          </TabsTrigger>
          <TabsTrigger 
            value="business" 
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm sm:text-base"
          >
            Business Taxes
          </TabsTrigger>
          <TabsTrigger 
            value="learn" 
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm sm:text-base"
          >
            Learn More
          </TabsTrigger>
        </TabsList>

        {/* Tax Calculator Tab */}
        <TabsContent value="calculator" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tax Calculator for {STATE_TAX_DATA[selectedState].name}</CardTitle>
              <CardDescription>
                Estimate your tax burden and take-home pay based on your income and filing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Income Information</h3>
                  
                  {/* Income Type Selection */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Income Type</h4>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant={calculatorState.incomeType === "salary" ? "default" : "outline"}
                        onClick={() => handleCalculatorChange("incomeType", "salary")}
                        className="flex-1"
                      >
                        Annual Salary
                      </Button>
                      <Button 
                        type="button"
                        variant={calculatorState.incomeType === "hourly" ? "default" : "outline"}
                        onClick={() => handleCalculatorChange("incomeType", "hourly")}
                        className="flex-1"
                      >
                        Hourly Wage
                      </Button>
                    </div>
                  </div>
                  
                  {/* Income Input */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      {calculatorState.incomeType === "salary" ? "Annual Salary" : "Hourly Rate"}
                    </h4>
                    <div className="flex items-center">
                      <span className="bg-gray-100 p-2 rounded-l-md border border-r-0">$</span>
                      <input 
                        type="number" 
                        value={calculatorState.income}
                        onChange={(e) => handleCalculatorChange("income", parseFloat(e.target.value) || 0)}
                        className="flex-1 p-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  {/* Show hourly options if hourly is selected */}
                  {calculatorState.incomeType === "hourly" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Hours Per Week</h4>
                        <input 
                          type="number" 
                          value={calculatorState.hoursPerWeek}
                          onChange={(e) => handleCalculatorChange("hoursPerWeek", parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Weeks Per Year</h4>
                        <input 
                          type="number" 
                          value={calculatorState.weeksPerYear}
                          onChange={(e) => handleCalculatorChange("weeksPerYear", parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Filing Status */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Filing Status</h4>
                    <Select
                      value={calculatorState.filingStatus}
                      onValueChange={(value) => handleCalculatorChange("filingStatus", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select filing status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married Filing Jointly</SelectItem>
                        <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Tax Inclusions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Include Taxes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="federal-tax"
                          checked={calculatorState.includeFederalIncome}
                          onChange={(e) => handleCalculatorChange("includeFederalIncome", e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="federal-tax">Federal Income Tax</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="state-tax"
                          checked={calculatorState.includeStateIncome}
                          onChange={(e) => handleCalculatorChange("includeStateIncome", e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="state-tax">State Income Tax ({STATE_TAX_DATA[selectedState].name})</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="fica-tax"
                          checked={calculatorState.includeFICA}
                          onChange={(e) => handleCalculatorChange("includeFICA", e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="fica-tax">FICA (Social Security & Medicare)</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Results section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Tax Calculation Results</h3>
                  
                  {/* Summary */}
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md border">
                      <h4 className="text-sm text-gray-500">Gross Income</h4>
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(calculatorResult.grossIncome)}</p>
                      <p className="text-xs text-gray-500">
                        {calculatorState.incomeType === "hourly" ? `$${calculatorState.income}/hr × ${calculatorState.hoursPerWeek}hrs × ${calculatorState.weeksPerYear}wks` : "Annual"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-md border">
                      <h4 className="text-sm text-gray-500">Total Tax</h4>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(calculatorResult.totalTax)}</p>
                      <p className="text-xs text-gray-500">{calculatorResult.effectiveTaxRate.toFixed(1)}% effective rate</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-md border col-span-2">
                      <h4 className="text-sm text-gray-500">Take-Home Pay</h4>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(calculatorResult.netIncome)}</p>
                      <p className="text-xs text-gray-500">
                        {calculatorState.incomeType === "hourly" 
                          ? `${formatCurrency(calculatorResult.netIncome / (calculatorState.hoursPerWeek * calculatorState.weeksPerYear))}/hr after taxes` 
                          : `${formatCurrency(calculatorResult.netIncome / 12)}/month after taxes`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tax Breakdown */}
                  <div>
                    <h4 className="font-medium mb-2">Tax Breakdown</h4>
                    <div className="space-y-3">
                      {calculatorResult.deductions.map((deduction, index) => (
                        deduction.amount > 0 ? (
                          <div key={index} className="bg-white p-3 rounded-md border">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{deduction.name}</span>
                              <span className="text-sm font-semibold">{formatCurrency(deduction.amount)}</span>
                            </div>
                            <Progress value={deduction.percentage} className="h-2" />
                            <div className="text-right text-xs text-gray-500 mt-1">
                              {deduction.percentage.toFixed(1)}% of income
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Alert variant="default" className="border-amber-500 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertDescription className="text-amber-800 text-xs">
                        This is a simplified tax estimation based on {STATE_TAX_DATA[selectedState].name}'s tax rates. 
                        Actual tax calculations may differ based on specific deductions, credits, and other factors.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tax Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{STATE_TAX_DATA[selectedState].name} Tax Overview</CardTitle>
              <CardDescription>
                A snapshot of key tax rates and information for {STATE_TAX_DATA[selectedState].name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Income Tax Range
                  </h3>
                  <p className="text-gray-700 mb-4">{STATE_TAX_DATA[selectedState].incomeTaxRange}</p>
                  
                  <h3 className="text-lg font-medium flex items-center">
                    <Home className="h-5 w-5 mr-2 text-green-600" />
                    Property Tax
                  </h3>
                  <p className="text-gray-700 mb-4">{STATE_TAX_DATA[selectedState].propertyTax}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Sales Tax
                  </h3>
                  <p className="text-gray-700 mb-4">{STATE_TAX_DATA[selectedState].salesTax}</p>
                  
                  <h3 className="text-lg font-medium flex items-center">
                    <ScrollText className="h-5 w-5 mr-2 text-green-600" />
                    Filing Deadline
                  </h3>
                  <p className="text-gray-700 mb-4">{STATE_TAX_DATA[selectedState].filingDeadline}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Special Features</h3>
                <p className="text-gray-700">{STATE_TAX_DATA[selectedState].specialFeatures}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Taxes Tab */}
        <TabsContent value="personal" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Personal Taxes in {STATE_TAX_DATA[selectedState].name}</CardTitle>
              <CardDescription>
                How taxes affect your salary and personal finances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Income Tax Basics</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">In {STATE_TAX_DATA[selectedState].name}, the income tax range is {STATE_TAX_DATA[selectedState].incomeTaxRange}.</p>
                      
                      <h4 className="font-bold mt-4 mb-2">How This Affects Your Salary</h4>
                      <p className="mb-2">For a typical $50,000 annual salary in {STATE_TAX_DATA[selectedState].name}:</p>
                      
                      <div className="pl-4 mb-4 border-l-2 border-green-300">
                        <p className="mb-1">• Federal tax: Approx. 12-22% bracket (varies based on filing status)</p>
                        <p className="mb-1">• State income tax: Based on {STATE_TAX_DATA[selectedState].incomeTaxRange}</p>
                        <p className="mb-1">• FICA taxes: 7.65% (Medicare and Social Security)</p>
                        <p className="font-medium mt-2">Your take-home pay will be reduced by these combined percentages</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm italic">Note: This is a simplified example. Actual taxes depend on deductions, credits, filing status, and other factors.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Property & Home Ownership</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3">Property tax in {STATE_TAX_DATA[selectedState].name}: {STATE_TAX_DATA[selectedState].propertyTax}</p>
                      
                      <h4 className="font-bold mt-4 mb-2">Impact on Homeowners</h4>
                      <p className="mb-3">For a $300,000 home, your annual property tax would be approximately ${(parseFloat(STATE_TAX_DATA[selectedState].propertyTax.match(/[\d.]+/)?.[0] || "0") * 3000).toFixed(0)}.</p>
                      
                      <h4 className="font-bold mt-4 mb-2">Tax Benefits</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Mortgage interest deduction (federal)</li>
                        <li>Property tax deduction (subject to SALT limits)</li>
                        <li>Potential state-specific homeowner benefits</li>
                      </ul>
                      
                      <div className="bg-green-50 p-3 rounded-md mb-3">
                        <p className="font-medium">Tip: Property taxes fund local services like schools, roads, and emergency services.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Sales Tax & Purchasing</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3">Sales tax in {STATE_TAX_DATA[selectedState].name}: {STATE_TAX_DATA[selectedState].salesTax}</p>
                      
                      <h4 className="font-bold mt-3 mb-2">Daily Impact</h4>
                      <p className="mb-3">Sales tax affects your everyday purchases. On a $100 purchase, you'll pay approximately ${(parseFloat(STATE_TAX_DATA[selectedState].salesTax.match(/[\d.]+/)?.[0] || "0")).toFixed(2)} in additional tax.</p>
                      
                      <h4 className="font-bold mt-4 mb-2">Common Exemptions</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Groceries (exempt or reduced rate in many states)</li>
                        <li>Prescription medications</li>
                        <li>Certain clothing items (state-dependent)</li>
                      </ul>
                      
                      <div className="bg-amber-50 p-3 rounded-md">
                        <p className="font-medium">Note: Local taxes may add to the base state rate, especially in urban areas.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Tax Filing Tips</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">In {STATE_TAX_DATA[selectedState].name}, the tax filing deadline is typically {STATE_TAX_DATA[selectedState].filingDeadline}.</p>
                      
                      <div className="mb-4 flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-indigo-400 text-indigo-600 hover:bg-indigo-50"
                          onClick={addTaxDeadlineToCalendar}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Add Tax Deadline to Calendar
                        </Button>
                      </div>
                      
                      <h4 className="font-bold mt-3 mb-2">Common Deductions</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Standard deduction or itemized deductions</li>
                        <li>Student loan interest</li>
                        <li>Retirement contributions</li>
                        <li>Medical expenses (if they exceed threshold)</li>
                      </ul>
                      
                      <h4 className="font-bold mt-4 mb-2">Tax Credits</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Earned Income Tax Credit</li>
                        <li>Child Tax Credit</li>
                        <li>Education credits</li>
                        <li>State-specific credits</li>
                      </ul>
                      
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="font-medium">Tip: Most tax software can file both federal and state returns. Free filing options are available for many taxpayers.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Business Taxes Tab */}
        <TabsContent value="business" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Business Taxes in {STATE_TAX_DATA[selectedState].name}</CardTitle>
              <CardDescription>
                Tax considerations for entrepreneurs and business owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium flex items-center mb-3">
                    <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                    Business Tax Overview
                  </h3>
                  <p className="text-gray-700 mb-3">{STATE_TAX_DATA[selectedState].businessTaxInfo}</p>
                  
                  <Alert variant="default" className="mb-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800 text-sm">
                      Business structure (LLC, S-Corp, etc.) significantly impacts your tax obligations. Consider consulting a tax professional when forming your business.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Starting a Business</AccordionTrigger>
                    <AccordionContent>
                      <h4 className="font-bold mb-2">Tax Registration Requirements</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Federal Employer Identification Number (EIN)</li>
                        <li>State tax registration</li>
                        <li>Sales tax permit (if selling taxable goods/services)</li>
                        <li>Local business licenses</li>
                      </ul>
                      
                      <h4 className="font-bold mt-4 mb-2">Initial Tax Considerations</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Business structure tax implications</li>
                        <li>Startup expense deductions</li>
                        <li>Equipment depreciation options</li>
                      </ul>
                      
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="font-medium">Tip: Many startup costs can be deducted or amortized over time, reducing your initial tax burden.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Business Structure & Taxation</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold mb-1">Sole Proprietorship</h4>
                          <p className="text-sm mb-2">Pass-through taxation on personal returns via Schedule C</p>
                          <Progress value={40} className="h-2 mb-1" />
                          <p className="text-xs text-gray-500">Tax Complexity: Low</p>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-1">Limited Liability Company (LLC)</h4>
                          <p className="text-sm mb-2">Flexible taxation (default: pass-through, can elect corporate)</p>
                          <Progress value={60} className="h-2 mb-1" />
                          <p className="text-xs text-gray-500">Tax Complexity: Medium</p>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-1">S Corporation</h4>
                          <p className="text-sm mb-2">Pass-through with potential self-employment tax savings</p>
                          <Progress value={75} className="h-2 mb-1" />
                          <p className="text-xs text-gray-500">Tax Complexity: Medium-High</p>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-1">C Corporation</h4>
                          <p className="text-sm mb-2">Corporate tax rate with potential double taxation</p>
                          <Progress value={90} className="h-2 mb-1" />
                          <p className="text-xs text-gray-500">Tax Complexity: High</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-md mt-4">
                        <p className="font-medium">In {STATE_TAX_DATA[selectedState].name}, consider state-specific tax treatments for different business entities when making your choice.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Employer Tax Obligations</AccordionTrigger>
                    <AccordionContent>
                      <h4 className="font-bold mb-2">Payroll Taxes</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Federal income tax withholding</li>
                        <li>Social Security and Medicare (FICA) taxes</li>
                        <li>Federal unemployment (FUTA) tax</li>
                        <li>State income tax withholding</li>
                        <li>State unemployment insurance</li>
                      </ul>
                      
                      <h4 className="font-bold mt-4 mb-2">Filing Requirements</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Quarterly payroll tax returns</li>
                        <li>Annual W-2 forms for employees</li>
                        <li>1099 forms for independent contractors</li>
                      </ul>
                      
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="font-medium">Tip: Consider using a payroll service to handle tax calculations, payments, and filings.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Tax Planning Strategies</AccordionTrigger>
                    <AccordionContent>
                      <h4 className="font-bold mb-2">Legitimate Tax Minimization</h4>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Qualified business income deduction (Section 199A)</li>
                        <li>Home office deduction for eligible businesses</li>
                        <li>Business retirement plans (SEP IRA, Solo 401(k), etc.)</li>
                        <li>Health insurance premium deductions</li>
                        <li>Strategic timing of income/expenses</li>
                      </ul>
                      
                      <h4 className="font-bold mt-4 mb-2">{STATE_TAX_DATA[selectedState].name} Specific Incentives</h4>
                      <p className="mb-3">Research state-specific tax credits and incentives for:</p>
                      <ul className="list-disc pl-5 mb-4">
                        <li>Job creation</li>
                        <li>Research and development</li>
                        <li>Investment in certain areas or industries</li>
                        <li>Energy efficiency improvements</li>
                      </ul>
                      
                      <div className="bg-amber-50 p-3 rounded-md">
                        <p className="font-medium">Important: Tax planning should be done proactively throughout the year, not just at tax time.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Learn More Tab with Gamification */}
        <TabsContent value="learn" className="mt-0">
          <Card>
            <CardHeader className="relative">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tax Learning Center</CardTitle>
                  <CardDescription>
                    Master tax concepts and track your learning progress
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-50 rounded-lg px-3 py-1 border border-green-200 flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="font-medium">{userPoints} Points</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative flex">
                          {userBadges.includes('tax-master') ? (
                            <Award className="h-6 w-6 text-amber-500" />
                          ) : userBadges.includes('tax-pro') ? (
                            <Award className="h-6 w-6 text-slate-400" />
                          ) : userBadges.includes('tax-novice') ? (
                            <Award className="h-6 w-6 text-amber-800" />
                          ) : (
                            <Award className="h-6 w-6 text-slate-300" />
                          )}
                          <span className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                            {userBadges.length}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You've earned {userBadges.length} badges</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {/* Achievement notification */}
              {showAchievement && (
                <div className="absolute top-0 left-0 right-0 -mt-10 flex justify-center">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    <span>Achievement Unlocked: {recentAchievement}</span>
                  </div>
                </div>
              )}
              
              {/* Progress bar showing completion towards next badge */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Learning Progress</span>
                  <span>{completedLessons.length}/{TAX_LEARNING_MODULES.length} Modules</span>
                </div>
                <Progress 
                  value={(completedLessons.length / TAX_LEARNING_MODULES.length) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    {userBadges.includes('tax-master') ? 'Master Level Achieved!' : 
                     userBadges.includes('tax-pro') ? 'Next: Tax Master Badge' : 
                     userBadges.includes('tax-novice') ? 'Next: Tax Pro Badge' : 
                     'Next: Tax Novice Badge'}
                  </span>
                  <span>
                    {userBadges.includes('tax-master') ? '100%' : 
                     userBadges.includes('tax-pro') ? `${Math.round((completedLessons.length - 5) / 2 * 100)}%` : 
                     userBadges.includes('tax-novice') ? `${Math.round((completedLessons.length - 3) / 2 * 100)}%` : 
                     `${Math.round(completedLessons.length / 3 * 100)}%`}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                    Tax Learning Modules
                  </h3>
                  
                  {TAX_LEARNING_MODULES.map((module) => (
                    <div 
                      key={module.id}
                      className={`border rounded-lg p-4 transition-all ${
                        completedLessons.includes(module.id) 
                          ? 'bg-green-50 border-green-200' 
                          : 'hover:shadow-md hover:border-green-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{module.title}</h4>
                            {completedLessons.includes(module.id) && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${module.category === 'skill' ? 'bg-blue-50 text-blue-800 border-blue-200' : 
                              module.category === 'project' ? 'bg-purple-50 text-purple-800 border-purple-200' : 
                              'bg-green-50 text-green-800 border-green-200'} 
                            ml-2
                          `}
                        >
                          {module.category.charAt(0).toUpperCase() + module.category.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 mr-1" />
                          <span>{module.points} points</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{module.estimatedTimeMinutes} min</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="font-normal bg-gray-50">
                            {module.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap mt-4 gap-2">
                        {!completedLessons.includes(module.id) ? (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => completeSection(module.id)}
                          >
                            Complete Module
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-200 text-green-800 bg-green-50 hover:bg-green-100"
                            onClick={() => completeSection(module.id)}
                            disabled
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completed
                          </Button>
                        )}
                        
                        {/* Calendar functionality removed */}
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => !completedLessons.includes(module.id) && completeSection(module.id)}
                          className={completedLessons.includes(module.id) ? "border-green-200 text-green-800 bg-green-50" : ""}
                          disabled={completedLessons.includes(module.id)}
                        >
                          {completedLessons.includes(module.id) ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-4 w-4 mr-1" />
                              Start Learning
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Achievements & Badges
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`border rounded-lg p-4 text-center ${userBadges.includes('tax-novice') ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 opacity-70'}`}>
                      <Award className={`h-12 w-12 mx-auto mb-2 ${userBadges.includes('tax-novice') ? 'text-amber-500' : 'text-gray-300'}`} />
                      <h4 className="font-medium">Tax Novice</h4>
                      <p className="text-xs text-gray-600 mt-1 mb-2">Complete 3 tax learning modules</p>
                      <Progress 
                        value={Math.min(completedLessons.length / 3 * 100, 100)} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div className={`border rounded-lg p-4 text-center ${userBadges.includes('tax-pro') ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 opacity-70'}`}>
                      <Award className={`h-12 w-12 mx-auto mb-2 ${userBadges.includes('tax-pro') ? 'text-blue-500' : 'text-gray-300'}`} />
                      <h4 className="font-medium">Tax Pro</h4>
                      <p className="text-xs text-gray-600 mt-1 mb-2">Complete 5 tax learning modules</p>
                      <Progress 
                        value={Math.min(completedLessons.length / 5 * 100, 100)} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div className={`border rounded-lg p-4 text-center ${userBadges.includes('tax-master') ? 'bg-green-50 border-green-200' : 'bg-gray-50 opacity-70'}`}>
                      <Award className={`h-12 w-12 mx-auto mb-2 ${userBadges.includes('tax-master') ? 'text-green-500' : 'text-gray-300'}`} />
                      <h4 className="font-medium">Tax Master</h4>
                      <p className="text-xs text-gray-600 mt-1 mb-2">Complete 7 tax learning modules</p>
                      <Progress 
                        value={Math.min(completedLessons.length / 7 * 100, 100)} 
                        className="h-1.5"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3">Official Tax Resources</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center justify-start text-left h-auto p-3" onClick={() => window.open("https://www.irs.gov", "_blank")}>
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Internal Revenue Service</div>
                        <div className="text-xs text-gray-500">Federal tax forms and information</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="flex items-center justify-start text-left h-auto p-3">
                      <div className="bg-green-50 p-2 rounded-lg mr-3">
                        <ScrollText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{STATE_TAX_DATA[selectedState].name} Tax Authority</div>
                        <div className="text-xs text-gray-500">State tax resources</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}