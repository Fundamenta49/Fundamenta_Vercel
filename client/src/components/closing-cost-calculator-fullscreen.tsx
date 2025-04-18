import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  X, 
  HelpCircle, 
  Home, 
  Building, 
  CreditCard, 
  FileText, 
  Gauge, 
  Clock, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  BarChart4, 
  Info, 
  Percent,
  RefreshCw,
  CheckCircle2,
  Download
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FullScreenDialog, FullScreenDialogContent, FullScreenDialogHeader, FullScreenDialogTitle, FullScreenDialogBody, FullScreenDialogClose, FullScreenDialogFooter } from '@/components/ui/full-screen-dialog';
import { getMortgageRates } from '@/lib/mortgage-data-service';
import { 
  DEFAULT_HOME_PRICE, 
  DEFAULT_DOWN_PAYMENT_PERCENT,
  DEFAULT_INTEREST_RATE,
  DEFAULT_LOAN_TERM,
  DEFAULT_PMI_RATE,
  DEFAULT_HOME_INSURANCE_RATE,
  DEFAULT_HOME_MAINTENANCE,
  DEFAULT_HOA_MONTHLY,
  DEFAULT_UTILITIES,
  DEFAULT_STATE,
  STATE_DATA
} from '../lib/mortgage-constants';

// A wrapper component for ScrollArea with consistent styling
const ScrollAreaWrapper = ({ children, className = "h-[300px]" }: { children: React.ReactNode, className?: string }) => (
  <ScrollArea className={className}>
    {children}
  </ScrollArea>
);

// Format currency without decimal points
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(amount);
};

// Format currency with decimal points for more precise values
const formatCurrencyPrecise = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(amount);
};

// Format percentage
const formatPercent = (amount: number): string => {
  return `${amount}%`;
};

// Format rate with 3 decimal places
const formatRate = (rate: number): string => {
  return rate.toFixed(3);
};

// Data types
interface ClosingCosts {
  loanOrigination: number;
  appraisalFee: number;
  creditReportFee: number;
  titleServices: number;
  governmentRecordingCharges: number;
  transferTaxes: number;
  homeInspection: number;
  other: number;
}

interface RecurringCosts {
  propertyTax: number;
  homeownersInsurance: number;
  mortgageInsurance: number;
  hoaFees: number;
  utilities: number;
  maintenance: number;
}

interface MortgageBreakdown {
  principal: number;
  interest: number;
  pmi: number;
  taxes: number;
  insurance: number;
  hoa: number;
  total: number;
}

interface NetSheet {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  closingCosts: ClosingCosts;
  downPaymentPercent: number;
  loanTerm: number;
  interestRate: number;
  recurringCosts: RecurringCosts;
  monthlyPayment: MortgageBreakdown;
  cashToClose: number;
  firstYearTotal: number;
  selectedState: string;
}

interface NetSheetResults {
  upfrontCosts: {
    downPayment: number;
    closingCosts: number;
    totalCashNeeded: number;
  };
  monthlyPayment: MortgageBreakdown;
  yearlyTotal: number;
  fiveYearTotal: number;
  thirtyYearTotal: number;
}

interface ClosingCostCalculatorFullscreenProps {
  onClose: () => void;
}

const ClosingCostCalculatorFullscreen: React.FC<ClosingCostCalculatorFullscreenProps> = ({ onClose }) => {
  // State for net sheet
  const [netSheet, setNetSheet] = useState<NetSheet>({
    homePrice: DEFAULT_HOME_PRICE,
    downPayment: DEFAULT_HOME_PRICE * (DEFAULT_DOWN_PAYMENT_PERCENT / 100),
    downPaymentPercent: DEFAULT_DOWN_PAYMENT_PERCENT,
    loanAmount: DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100),
    loanTerm: DEFAULT_LOAN_TERM,
    interestRate: DEFAULT_INTEREST_RATE,
    selectedState: DEFAULT_STATE,
    closingCosts: {
      loanOrigination: DEFAULT_HOME_PRICE * 0.01,
      appraisalFee: 500,
      creditReportFee: 25,
      titleServices: 1200,
      governmentRecordingCharges: STATE_DATA[DEFAULT_STATE].recordingFees,
      transferTaxes: DEFAULT_HOME_PRICE * (STATE_DATA[DEFAULT_STATE].transferTaxRate / 100),
      homeInspection: 400,
      other: 500
    },
    recurringCosts: {
      propertyTax: (DEFAULT_HOME_PRICE * STATE_DATA[DEFAULT_STATE].propertyTaxRate) / 100 / 12,
      homeownersInsurance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12,
      mortgageInsurance: DEFAULT_DOWN_PAYMENT_PERCENT < 20 ? 
        (DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100) * DEFAULT_PMI_RATE) / 100 / 12 : 0,
      hoaFees: DEFAULT_HOA_MONTHLY,
      utilities: DEFAULT_UTILITIES,
      maintenance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_MAINTENANCE) / 100 / 12
    },
    monthlyPayment: { principal: 0, interest: 0, pmi: 0, taxes: 0, insurance: 0, hoa: 0, total: 0 },
    cashToClose: 0,
    firstYearTotal: 0
  });

  // Results state
  const [results, setResults] = useState<NetSheetResults>({
    upfrontCosts: {
      downPayment: 0,
      closingCosts: 0,
      totalCashNeeded: 0
    },
    monthlyPayment: { principal: 0, interest: 0, pmi: 0, taxes: 0, insurance: 0, hoa: 0, total: 0 },
    yearlyTotal: 0,
    fiveYearTotal: 0,
    thirtyYearTotal: 0
  });

  // Market data
  const [currentRates, setCurrentRates] = useState<{ [key: string]: number }>({
    thirtyYearFixed: 0,
    fifteenYearFixed: 0
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>("purchase");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [selectedBreakdownView, setSelectedBreakdownView] = useState<string>("monthly");
  const [showEducation, setShowEducation] = useState<{ [key: string]: boolean }>({
    pmi: false,
    taxes: false,
    insurance: false,
    closingCosts: false
  });
  const [showStateSelector, setShowStateSelector] = useState<boolean>(false);
  
  // Calculate mortgage payment
  const calculateMonthlyPayment = (): MortgageBreakdown => {
    // Monthly interest rate
    const monthlyRate = netSheet.interestRate / 100 / 12;
    
    // Total number of payments
    const numberOfPayments = netSheet.loanTerm * 12;
    
    // Calculate principal and interest payment using formula
    let principalAndInterest = 0;
    
    if (monthlyRate > 0) {
      principalAndInterest = netSheet.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      principalAndInterest = netSheet.loanAmount / numberOfPayments;
    }
    
    // Separate principal and interest for the first payment
    const interestPayment = netSheet.loanAmount * monthlyRate;
    const principalPayment = principalAndInterest - interestPayment;
    
    // Calculate total monthly payment
    const monthlyPayment: MortgageBreakdown = {
      principal: principalPayment,
      interest: interestPayment,
      pmi: netSheet.recurringCosts.mortgageInsurance,
      taxes: netSheet.recurringCosts.propertyTax,
      insurance: netSheet.recurringCosts.homeownersInsurance,
      hoa: netSheet.recurringCosts.hoaFees,
      total: principalAndInterest + 
        netSheet.recurringCosts.propertyTax + 
        netSheet.recurringCosts.homeownersInsurance + 
        netSheet.recurringCosts.mortgageInsurance +
        netSheet.recurringCosts.hoaFees
    };
    
    return monthlyPayment;
  };

  // Calculate total closing costs
  const calculateTotalClosingCosts = (): number => {
    return (
      netSheet.closingCosts.loanOrigination +
      netSheet.closingCosts.appraisalFee +
      netSheet.closingCosts.creditReportFee +
      netSheet.closingCosts.titleServices +
      netSheet.closingCosts.governmentRecordingCharges +
      netSheet.closingCosts.transferTaxes +
      netSheet.closingCosts.homeInspection +
      netSheet.closingCosts.other
    );
  };

  // Calculate all results
  const calculateResults = () => {
    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment();
    
    // Calculate cash needed to close
    const totalClosingCosts = calculateTotalClosingCosts();
    const cashToClose = netSheet.downPayment + totalClosingCosts;
    
    // Calculate yearly costs
    const yearlyPrincipalAndInterest = (monthlyPayment.principal + monthlyPayment.interest) * 12;
    const yearlyTaxes = netSheet.recurringCosts.propertyTax * 12;
    const yearlyInsurance = netSheet.recurringCosts.homeownersInsurance * 12;
    const yearlyPMI = netSheet.recurringCosts.mortgageInsurance * 12;
    const yearlyHOA = netSheet.recurringCosts.hoaFees * 12;
    const yearlyUtilities = netSheet.recurringCosts.utilities * 12;
    const yearlyMaintenance = netSheet.recurringCosts.maintenance * 12;
    
    const yearlyTotal = (yearlyPrincipalAndInterest + yearlyTaxes + yearlyInsurance + 
      yearlyPMI + yearlyHOA + yearlyUtilities + yearlyMaintenance);
    
    // Calculate total costs over time
    const fiveYearTotal = yearlyTotal * 5;
    const thirtyYearTotal = yearlyTotal * netSheet.loanTerm;
    
    // Update state
    setNetSheet(prevState => ({
      ...prevState,
      loanAmount: prevState.homePrice - prevState.downPayment,
      monthlyPayment,
      cashToClose,
      firstYearTotal: yearlyTotal
    }));
    
    setResults({
      upfrontCosts: {
        downPayment: netSheet.downPayment,
        closingCosts: totalClosingCosts,
        totalCashNeeded: cashToClose
      },
      monthlyPayment,
      yearlyTotal,
      fiveYearTotal,
      thirtyYearTotal
    });
  };

  // Fetch current rates
  const getRates = async () => {
    try {
      const rates = await getMortgageRates();
      setCurrentRates({
        thirtyYearFixed: rates.thirtyYearFixed.rate,
        fifteenYearFixed: rates.fifteenYearFixed.rate
      });
      
      // Update interest rate in form to match current market rate
      setNetSheet(prev => ({
        ...prev,
        interestRate: rates.thirtyYearFixed.rate
      }));
    } catch (error) {
      console.error("Failed to fetch mortgage rates:", error);
      // Keep default interest rate if API fails
    }
  };

  // Initialization
  useEffect(() => {
    getRates();
  }, []);

  // Calculate monthly payment whenever loan details change
  useEffect(() => {
    calculateResults();
  }, [
    netSheet.homePrice, 
    netSheet.downPayment, 
    netSheet.interestRate, 
    netSheet.loanTerm,
    netSheet.recurringCosts.propertyTax,
    netSheet.recurringCosts.homeownersInsurance,
    netSheet.recurringCosts.mortgageInsurance,
    netSheet.recurringCosts.hoaFees
  ]);

  // Handle home price change
  const handleHomePriceChange = (value: string) => {
    const price = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    // Calculate new down payment amount while keeping percentage the same
    const newDownPayment = Math.round((price * netSheet.downPaymentPercent) / 100);
    
    // Get state data for the currently selected state
    const stateData = STATE_DATA[netSheet.selectedState];
    
    // Update property tax and insurance based on new home price and selected state
    const newPropertyTax = (price * stateData.propertyTaxRate) / 100 / 12;
    const newHomeownersInsurance = (price * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12;
    
    // Update PMI based on new loan amount
    const newLoanAmount = price - newDownPayment;
    const newMortgageInsurance = netSheet.downPaymentPercent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
    
    // Update maintenance cost
    const newMaintenance = (price * DEFAULT_HOME_MAINTENANCE) / 100 / 12;
    
    // Update transfer taxes based on selected state
    const newTransferTaxes = price * (stateData.transferTaxRate / 100);
    
    // Update loan origination fee
    const newLoanOrigination = price * 0.01;
    
    setNetSheet(prev => ({
      ...prev,
      homePrice: price,
      downPayment: newDownPayment,
      loanAmount: newLoanAmount,
      closingCosts: {
        ...prev.closingCosts,
        loanOrigination: newLoanOrigination,
        transferTaxes: newTransferTaxes
      },
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: newPropertyTax,
        homeownersInsurance: newHomeownersInsurance,
        mortgageInsurance: newMortgageInsurance,
        maintenance: newMaintenance
      }
    }));
  };

  // Handle down payment changes
  const handleDownPaymentChange = (value: string) => {
    const downPayment = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const downPaymentPercent = Math.min(100, Math.round((downPayment / netSheet.homePrice) * 100));
    
    // Recalculate PMI
    const newLoanAmount = netSheet.homePrice - downPayment;
    const newMortgageInsurance = downPaymentPercent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
    
    setNetSheet(prev => ({
      ...prev,
      downPayment,
      downPaymentPercent,
      loanAmount: newLoanAmount,
      recurringCosts: {
        ...prev.recurringCosts,
        mortgageInsurance: newMortgageInsurance
      }
    }));
  };

  // Handle down payment percentage changes
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    const downPayment = Math.round((netSheet.homePrice * percent) / 100);
    
    // Recalculate PMI
    const newLoanAmount = netSheet.homePrice - downPayment;
    const newMortgageInsurance = percent < 20 ? 
      (newLoanAmount * DEFAULT_PMI_RATE) / 100 / 12 : 0;
    
    setNetSheet(prev => ({
      ...prev,
      downPayment,
      downPaymentPercent: percent,
      loanAmount: newLoanAmount,
      recurringCosts: {
        ...prev.recurringCosts,
        mortgageInsurance: newMortgageInsurance
      }
    }));
  };

  // Handle interest rate change
  const handleInterestRateChange = (value: number[]) => {
    setNetSheet(prev => ({
      ...prev,
      interestRate: value[0]
    }));
  };

  // Handle loan term change
  const handleLoanTermChange = (value: string) => {
    setNetSheet(prev => ({
      ...prev,
      loanTerm: parseInt(value)
    }));
  };
  
  // Handle state change
  const handleStateChange = (value: string) => {
    const stateData = STATE_DATA[value];
    
    // Calculate new property tax based on selected state
    const newPropertyTax = (netSheet.homePrice * stateData.propertyTaxRate) / 100 / 12;
    
    // Update transfer taxes and recording fees based on selected state
    const newTransferTaxes = netSheet.homePrice * (stateData.transferTaxRate / 100);
    
    setNetSheet(prev => ({
      ...prev,
      selectedState: value,
      closingCosts: {
        ...prev.closingCosts,
        governmentRecordingCharges: stateData.recordingFees,
        transferTaxes: newTransferTaxes
      },
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: newPropertyTax
      }
    }));
    
    // Hide state selector after selection
    setShowStateSelector(false);
  };

  // Handle HOA fees change
  const handleHoaFeesChange = (value: string) => {
    const hoaFees = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    setNetSheet(prev => ({
      ...prev,
      recurringCosts: {
        ...prev.recurringCosts,
        hoaFees
      }
    }));
  };

  // Handle property tax change directly (for advanced mode)
  const handlePropertyTaxChange = (value: string) => {
    const annualTax = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    setNetSheet(prev => ({
      ...prev,
      recurringCosts: {
        ...prev.recurringCosts,
        propertyTax: annualTax / 12 // Convert to monthly
      }
    }));
  };

  // Handle homeowners insurance change directly (for advanced mode)
  const handleInsuranceChange = (value: string) => {
    const annualInsurance = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    setNetSheet(prev => ({
      ...prev,
      recurringCosts: {
        ...prev.recurringCosts,
        homeownersInsurance: annualInsurance / 12 // Convert to monthly
      }
    }));
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle advanced mode toggle
  const handleAdvancedModeToggle = (checked: boolean) => {
    setAdvancedMode(checked);
  };

  // Handle breakdown view change
  const handleBreakdownViewChange = (value: string) => {
    setSelectedBreakdownView(value);
  };

  // Toggle education dialogs
  const toggleEducation = (section: string) => {
    setShowEducation(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Apply current market rate based on loan term
  const useMarketRate = (term: number) => {
    if (term === 30 && currentRates.thirtyYearFixed) {
      setNetSheet(prev => ({
        ...prev,
        interestRate: currentRates.thirtyYearFixed
      }));
    } else if (term === 15 && currentRates.fifteenYearFixed) {
      setNetSheet(prev => ({
        ...prev,
        interestRate: currentRates.fifteenYearFixed
      }));
    } else {
      // Use typical rates if FRED data isn't available
      const typicalRate = term === 15 ? 6.2 : 6.8; // Typical rates as of early 2024
      setNetSheet(prev => ({
        ...prev,
        interestRate: typicalRate
      }));
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setNetSheet({
      homePrice: DEFAULT_HOME_PRICE,
      downPayment: DEFAULT_HOME_PRICE * (DEFAULT_DOWN_PAYMENT_PERCENT / 100),
      downPaymentPercent: DEFAULT_DOWN_PAYMENT_PERCENT,
      loanAmount: DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100),
      loanTerm: DEFAULT_LOAN_TERM,
      interestRate: currentRates.thirtyYearFixed > 0 ? currentRates.thirtyYearFixed : DEFAULT_INTEREST_RATE,
      selectedState: DEFAULT_STATE,
      closingCosts: {
        loanOrigination: DEFAULT_HOME_PRICE * 0.01,
        appraisalFee: 500,
        creditReportFee: 25,
        titleServices: 1200,
        governmentRecordingCharges: STATE_DATA[DEFAULT_STATE].recordingFees,
        transferTaxes: DEFAULT_HOME_PRICE * (STATE_DATA[DEFAULT_STATE].transferTaxRate / 100),
        homeInspection: 400,
        other: 500
      },
      recurringCosts: {
        propertyTax: (DEFAULT_HOME_PRICE * STATE_DATA[DEFAULT_STATE].propertyTaxRate) / 100 / 12,
        homeownersInsurance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_INSURANCE_RATE) / 100 / 12,
        mortgageInsurance: DEFAULT_DOWN_PAYMENT_PERCENT < 20 ? 
          (DEFAULT_HOME_PRICE * (1 - DEFAULT_DOWN_PAYMENT_PERCENT / 100) * DEFAULT_PMI_RATE) / 100 / 12 : 0,
        hoaFees: DEFAULT_HOA_MONTHLY,
        utilities: DEFAULT_UTILITIES,
        maintenance: (DEFAULT_HOME_PRICE * DEFAULT_HOME_MAINTENANCE) / 100 / 12
      },
      monthlyPayment: { principal: 0, interest: 0, pmi: 0, taxes: 0, insurance: 0, hoa: 0, total: 0 },
      cashToClose: 0,
      firstYearTotal: 0
    });
    setAdvancedMode(false);
    setSelectedBreakdownView("monthly");
  };

  return (
    <FullScreenDialog open={true} onOpenChange={onClose}>
      <FullScreenDialogContent className="overflow-auto bg-neutral-50">
        {/* Header with accent color and navigation */}
        <div className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 sticky top-0 z-10 shadow-md">
          <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Closing Cost Calculator</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-green-700 hover:text-white"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-green-700 rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Main content area */}
          <div className="flex flex-col gap-8">
            {/* Alert banner */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">Real-time calculation</h3>
                  <p className="text-green-700">Using market data updated daily. All results are for estimation purposes only.</p>
                </div>
              </div>
            </div>
            
            {/* Main calculator grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left column - Inputs */}
              <div className="lg:col-span-5">
                <div className="space-y-6">
                  {/* Key inputs panel */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-white border-b pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Home className="h-5 w-5 text-green-500" />
                        <span>Property Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 pb-5 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="home-price" className="text-base">Home Price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            id="home-price"
                            type="text"
                            className="pl-8 h-12 text-lg w-full min-w-[160px]"
                            value={formatCurrency(netSheet.homePrice)}
                            onChange={(e) => handleHomePriceChange(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="state" className="text-base">Property Location</Label>
                          <Badge variant="outline" className="font-normal">
                            Tax Rate: {STATE_DATA[netSheet.selectedState].propertyTaxRate.toFixed(2)}%
                          </Badge>
                        </div>
                        <Select value={netSheet.selectedState} onValueChange={handleStateChange}>
                          <SelectTrigger id="state" className="h-12 text-md border-gray-300 shadow-sm bg-white">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {Object.keys(STATE_DATA).sort().map((stateCode) => (
                              <SelectItem key={stateCode} value={stateCode} className="text-base">
                                {STATE_DATA[stateCode].name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="down-payment" className="text-base">Down Payment</Label>
                          <Badge variant="outline" className="font-normal">
                            {formatPercent(netSheet.downPaymentPercent)} of home price
                          </Badge>
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            id="down-payment"
                            type="text"
                            className="pl-8 h-12 text-lg w-full min-w-[160px]"
                            value={formatCurrency(netSheet.downPayment)}
                            onChange={(e) => handleDownPaymentChange(e.target.value)}
                          />
                        </div>
                        <Slider
                          defaultValue={[DEFAULT_DOWN_PAYMENT_PERCENT]}
                          max={50}
                          step={1}
                          value={[netSheet.downPaymentPercent]}
                          onValueChange={handleDownPaymentPercentChange}
                          className="mt-3"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>10%</span>
                          <span>20%</span>
                          <span>30%</span>
                          <span>40%</span>
                          <span>50%</span>
                        </div>
                        
                        {netSheet.downPaymentPercent < 20 && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 mt-2 shadow-sm">
                            <div className="flex items-center gap-2 mb-1 font-medium">
                              <Info className="h-4 w-4 flex-shrink-0" />
                              <span>Private Mortgage Insurance (PMI) Required</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-amber-700">
                                Because your down payment is less than 20%, PMI of {formatCurrencyPrecise(netSheet.recurringCosts.mortgageInsurance)}/month will be added.
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="ml-2 h-7 border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs whitespace-nowrap"
                                onClick={() => toggleEducation('pmi')}
                              >
                                <HelpCircle className="h-3 w-3 mr-1" />
                                Learn More
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Loan details panel */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-white border-b pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-green-500" />
                        <span>Loan Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 pb-5 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="loan-term" className="text-base">Loan Term</Label>
                          <Select value={netSheet.loanTerm.toString()} onValueChange={handleLoanTermChange}>
                            <SelectTrigger id="loan-term" className="h-12 text-md">
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 Years</SelectItem>
                              <SelectItem value="20">20 Years</SelectItem>
                              <SelectItem value="15">15 Years</SelectItem>
                              <SelectItem value="10">10 Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="rate-display" className="text-base">Interest Rate</Label>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 py-0 text-xs text-green-700 border-green-200 bg-green-50 hover:bg-green-100 flex items-center"
                              onClick={() => useMarketRate(netSheet.loanTerm)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1.5" />
                              Use Current Rate
                            </Button>
                          </div>
                          <div className="relative">
                            <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              id="rate-display"
                              value={netSheet.interestRate.toFixed(3)}
                              className="pl-8 h-12 text-lg w-full min-w-[160px]"
                              readOnly
                            />
                          </div>
                          <Slider
                            min={2}
                            max={10}
                            step={0.125}
                            value={[netSheet.interestRate]}
                            onValueChange={handleInterestRateChange}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>2%</span>
                            <span>4%</span>
                            <span>6%</span>
                            <span>8%</span>
                            <span>10%</span>
                          </div>
                        </div>
                      </div>

                      {(currentRates.thirtyYearFixed > 0 || currentRates.fifteenYearFixed > 0) && (
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                          <div className="font-medium mb-1">Current Average Rates:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {currentRates.thirtyYearFixed > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">30-Year Fixed:</span>
                                <span className="font-medium">{formatRate(currentRates.thirtyYearFixed)}%</span>
                              </div>
                            )}
                            {currentRates.fifteenYearFixed > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">15-Year Fixed:</span>
                                <span className="font-medium">{formatRate(currentRates.fifteenYearFixed)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-600 font-medium">Loan Amount:</span>
                          <span className="font-semibold text-lg">{formatCurrency(netSheet.loanAmount)}</span>
                        </div>
                        
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(netSheet.loanAmount / netSheet.homePrice) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional costs panel */}
                  <Card className="shadow-sm">
                    <CardHeader className="bg-white border-b pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Building className="h-5 w-5 text-green-500" />
                          <span>Additional Costs</span>
                        </CardTitle>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAdvancedMode(!advancedMode)}
                          className={advancedMode ? "bg-green-50 text-green-700 border-green-200" : ""}
                        >
                          {advancedMode ? "Hide Details" : "Show Details"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-5">
                      {!advancedMode ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-medium">Property Tax</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => toggleEducation('taxes')}
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrencyPrecise(netSheet.recurringCosts.propertyTax)} / month</div>
                              <div className="text-xs text-gray-500">{formatCurrencyPrecise(netSheet.recurringCosts.propertyTax * 12)} annually</div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-medium">Homeowners Insurance</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => toggleEducation('insurance')}
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrencyPrecise(netSheet.recurringCosts.homeownersInsurance)} / month</div>
                              <div className="text-xs text-gray-500">{formatCurrencyPrecise(netSheet.recurringCosts.homeownersInsurance * 12)} annually</div>
                            </div>
                          </div>
                          
                          {netSheet.recurringCosts.hoaFees > 0 && (
                            <>
                              <Separator />
                              <div className="flex justify-between items-center">
                                <span className="font-medium">HOA Fees</span>
                                <div className="text-right">
                                  <div className="font-medium">{formatCurrencyPrecise(netSheet.recurringCosts.hoaFees)} / month</div>
                                  <div className="text-xs text-gray-500">{formatCurrencyPrecise(netSheet.recurringCosts.hoaFees * 12)} annually</div>
                                </div>
                              </div>
                            </>
                          )}
                          
                          {netSheet.recurringCosts.mortgageInsurance > 0 && (
                            <>
                              <Separator />
                              <div className="flex justify-between items-center p-2 bg-amber-50 rounded-md border border-amber-200">
                                <div className="flex items-center">
                                  <span className="font-medium text-amber-800">Private Mortgage Insurance (PMI)</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 ml-1 text-amber-700"
                                    onClick={() => toggleEducation('pmi')}
                                  >
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-amber-800">{formatCurrencyPrecise(netSheet.recurringCosts.mortgageInsurance)} / month</div>
                                  <div className="text-xs text-amber-700">{formatCurrencyPrecise(netSheet.recurringCosts.mortgageInsurance * 12)} annually</div>
                                </div>
                              </div>
                            </>
                          )}
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-medium">Closing Costs</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => toggleEducation('closingCosts')}
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </div>
                            <div>
                              <span className="font-medium">{formatCurrency(calculateTotalClosingCosts())}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Tabs defaultValue="closing" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                            <TabsTrigger value="closing" className="data-[state=active]:bg-white data-[state=active]:text-green-700">Closing Costs</TabsTrigger>
                            <TabsTrigger value="recurring" className="data-[state=active]:bg-white data-[state=active]:text-green-700">Monthly Costs</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="closing" className="space-y-4 pt-4">
                            <div className="space-y-3">
                              <Label>Loan Origination Fee</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                  type="text"
                                  className="pl-8"
                                  value={formatCurrency(netSheet.closingCosts.loanOrigination)}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                    setNetSheet(prev => ({
                                      ...prev,
                                      closingCosts: {
                                        ...prev.closingCosts,
                                        loanOrigination: value
                                      }
                                    }));
                                  }}
                                />
                              </div>
                              <div className="text-xs text-gray-500">Typically 0.5-1% of loan amount</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Appraisal Fee</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                  <Input
                                    type="text"
                                    className="pl-8"
                                    value={formatCurrency(netSheet.closingCosts.appraisalFee)}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                      setNetSheet(prev => ({
                                        ...prev,
                                        closingCosts: {
                                          ...prev.closingCosts,
                                          appraisalFee: value
                                        }
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Credit Report Fee</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                  <Input
                                    type="text"
                                    className="pl-8"
                                    value={formatCurrency(netSheet.closingCosts.creditReportFee)}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                      setNetSheet(prev => ({
                                        ...prev,
                                        closingCosts: {
                                          ...prev.closingCosts,
                                          creditReportFee: value
                                        }
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Title Services</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                  <Input
                                    type="text"
                                    className="pl-8"
                                    value={formatCurrency(netSheet.closingCosts.titleServices)}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                      setNetSheet(prev => ({
                                        ...prev,
                                        closingCosts: {
                                          ...prev.closingCosts,
                                          titleServices: value
                                        }
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Home Inspection</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                  <Input
                                    type="text"
                                    className="pl-8"
                                    value={formatCurrency(netSheet.closingCosts.homeInspection)}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                      setNetSheet(prev => ({
                                        ...prev,
                                        closingCosts: {
                                          ...prev.closingCosts,
                                          homeInspection: value
                                        }
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Recording Charges</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                  <Input
                                    type="text"
                                    className="pl-8"
                                    value={formatCurrency(netSheet.closingCosts.governmentRecordingCharges)}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                      setNetSheet(prev => ({
                                        ...prev,
                                        closingCosts: {
                                          ...prev.closingCosts,
                                          governmentRecordingCharges: value
                                        }
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Transfer Taxes</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                  <Input
                                    type="text"
                                    className="pl-8"
                                    value={formatCurrency(netSheet.closingCosts.transferTaxes)}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                      setNetSheet(prev => ({
                                        ...prev,
                                        closingCosts: {
                                          ...prev.closingCosts,
                                          transferTaxes: value
                                        }
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500">Based on {STATE_DATA[netSheet.selectedState].name} rates</div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Other Closing Costs</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                  type="text"
                                  className="pl-8"
                                  value={formatCurrency(netSheet.closingCosts.other)}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                    setNetSheet(prev => ({
                                      ...prev,
                                      closingCosts: {
                                        ...prev.closingCosts,
                                        other: value
                                      }
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex justify-between font-medium">
                                <span>Total Closing Costs:</span>
                                <span>{formatCurrency(calculateTotalClosingCosts())}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Approximately {(calculateTotalClosingCosts() / netSheet.homePrice * 100).toFixed(1)}% of home price</div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="recurring" className="space-y-4 pt-4">
                            <div className="space-y-3">
                              <Label>Property Tax (Annual)</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                  type="text"
                                  className="pl-8"
                                  value={formatCurrency(netSheet.recurringCosts.propertyTax * 12)}
                                  onChange={(e) => handlePropertyTaxChange(e.target.value)}
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                Rate: {STATE_DATA[netSheet.selectedState].propertyTaxRate.toFixed(2)}% in {STATE_DATA[netSheet.selectedState].name}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <Label>Homeowners Insurance (Annual)</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                  type="text"
                                  className="pl-8"
                                  value={formatCurrency(netSheet.recurringCosts.homeownersInsurance * 12)}
                                  onChange={(e) => handleInsuranceChange(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <Label>HOA Fees (Monthly)</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                  type="text"
                                  className="pl-8"
                                  value={formatCurrency(netSheet.recurringCosts.hoaFees)}
                                  onChange={(e) => handleHoaFeesChange(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            {netSheet.downPaymentPercent < 20 && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Private Mortgage Insurance (Monthly)</Label>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => toggleEducation('pmi')}
                                  >
                                    <HelpCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="text-sm bg-amber-50 p-3 rounded border border-amber-100">
                                  <div className="font-medium text-amber-800 mb-1">PMI Calculation</div>
                                  <div className="text-amber-700">
                                    {formatCurrencyPrecise(netSheet.recurringCosts.mortgageInsurance)} per month
                                    <div className="text-xs mt-1">Based on {formatPercent(DEFAULT_PMI_RATE)} of loan amount annually</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex justify-between font-medium">
                                <span>Total Monthly Recurring Costs:</span>
                                <span>{formatCurrencyPrecise(
                                  netSheet.recurringCosts.propertyTax + 
                                  netSheet.recurringCosts.homeownersInsurance + 
                                  netSheet.recurringCosts.mortgageInsurance +
                                  netSheet.recurringCosts.hoaFees
                                )}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">In addition to principal and interest payments</div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Right column - Results */}
              <div className="lg:col-span-7">
                {/* Monthly payment card */}
                <Card className="shadow-sm">
                  <CardHeader className="bg-white border-b pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calculator className="h-5 w-5 text-green-500" />
                        <span>Payment Summary</span>
                      </CardTitle>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Save PDF</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Monthly payment block */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
                        <div className="text-green-700 font-medium mb-1 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Monthly Payment</span>
                        </div>
                        <div className="text-4xl font-bold text-green-800 tracking-tight mb-2">
                          {formatCurrencyPrecise(results.monthlyPayment.total)}
                        </div>
                        <div className="text-sm text-green-700">Principal + Interest + Escrow</div>
                      </div>
                      
                      {/* Cash to close block */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-lg">
                        <div className="text-blue-700 font-medium mb-1 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Cash to Close</span>
                        </div>
                        <div className="text-4xl font-bold text-blue-800 tracking-tight mb-2">
                          {formatCurrency(results.upfrontCosts.totalCashNeeded)}
                        </div>
                        <div className="text-sm text-blue-700">Down Payment + Closing Costs</div>
                      </div>
                      
                      {/* Total cost block */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 rounded-lg">
                        <div className="text-purple-700 font-medium mb-1 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Total over {netSheet.loanTerm} Years</span>
                        </div>
                        <div className="text-4xl font-bold text-purple-800 tracking-tight mb-2">
                          {formatCurrency(results.thirtyYearTotal)}
                        </div>
                        <div className="text-sm text-purple-700">Including principal, interest, and all costs</div>
                      </div>
                    </div>

                    {/* Breakdown charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Monthly payment breakdown */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Monthly Payment Breakdown</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span>Principal & Interest</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrencyPrecise(results.monthlyPayment.principal + results.monthlyPayment.interest)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span>Property Tax</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrencyPrecise(results.monthlyPayment.taxes)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              <span>Insurance</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrencyPrecise(results.monthlyPayment.insurance)}
                            </span>
                          </div>
                          
                          {results.monthlyPayment.pmi > 0 && (
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span>PMI</span>
                              </div>
                              <span className="font-medium">
                                {formatCurrencyPrecise(results.monthlyPayment.pmi)}
                              </span>
                            </div>
                          )}
                          
                          {results.monthlyPayment.hoa > 0 && (
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <span>HOA</span>
                              </div>
                              <span className="font-medium">
                                {formatCurrencyPrecise(results.monthlyPayment.hoa)}
                              </span>
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="h-14 w-full bg-gray-100 rounded-md overflow-hidden flex shadow-inner">
                              {/* Principal & Interest */}
                              <div 
                                className="h-full bg-blue-600 border-r border-white flex items-center justify-center"
                                style={{ 
                                  width: `${((results.monthlyPayment.principal + results.monthlyPayment.interest) / 
                                    results.monthlyPayment.total) * 100}%` 
                                }}
                              >
                                <span className="text-white text-xs font-medium px-1 truncate">P&I</span>
                              </div>
                              
                              {/* Taxes */}
                              <div 
                                className="h-full bg-green-600 border-r border-white flex items-center justify-center"
                                style={{ 
                                  width: `${(results.monthlyPayment.taxes / 
                                    results.monthlyPayment.total) * 100}%` 
                                }}
                              >
                                <span className="text-white text-xs font-medium px-1 truncate">Tax</span>
                              </div>
                              
                              {/* Insurance - Make minimum width to ensure visibility */}
                              <div 
                                className="h-full bg-purple-600 border-r border-white flex items-center justify-center"
                                style={{ 
                                  width: `${Math.max(3, (results.monthlyPayment.insurance / 
                                    results.monthlyPayment.total) * 100)}%` 
                                }}
                              >
                                <span className="text-white text-xs font-medium px-1 truncate">Ins</span>
                              </div>
                              
                              {/* PMI */}
                              {results.monthlyPayment.pmi > 0 && (
                                <div 
                                  className="h-full bg-amber-600 border-r border-white flex items-center justify-center"
                                  style={{ 
                                    width: `${Math.max(4, (results.monthlyPayment.pmi / 
                                      results.monthlyPayment.total) * 100)}%` 
                                  }}
                                >
                                  <span className="text-white text-xs font-medium px-1 truncate">PMI</span>
                                </div>
                              )}
                              
                              {/* HOA */}
                              {results.monthlyPayment.hoa > 0 && (
                                <div 
                                  className="h-full bg-pink-600 flex items-center justify-center"
                                  style={{ 
                                    width: `${Math.max(3, (results.monthlyPayment.hoa / 
                                      results.monthlyPayment.total) * 100)}%` 
                                  }}
                                >
                                  <span className="text-white text-xs font-medium px-1 truncate">HOA</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Accordion type="single" collapsible className="border rounded-md">
                              <AccordionItem value="item-1" className="border-0">
                                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                                  Payment Details
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="py-2 pl-0">Principal & Interest</TableCell>
                                        <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.principal + results.monthlyPayment.interest)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="py-2 pl-0">Principal Payment</TableCell>
                                        <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.principal)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="py-2 pl-0">Interest Payment</TableCell>
                                        <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.interest)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="py-2 pl-0">Property Tax</TableCell>
                                        <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.taxes)}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="py-2 pl-0">Homeowners Insurance</TableCell>
                                        <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.insurance)}</TableCell>
                                      </TableRow>
                                      {results.monthlyPayment.pmi > 0 && (
                                        <TableRow>
                                          <TableCell className="py-2 pl-0">Private Mortgage Insurance</TableCell>
                                          <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.pmi)}</TableCell>
                                        </TableRow>
                                      )}
                                      {results.monthlyPayment.hoa > 0 && (
                                        <TableRow>
                                          <TableCell className="py-2 pl-0">HOA Fees</TableCell>
                                          <TableCell className="py-2 text-right">{formatCurrencyPrecise(results.monthlyPayment.hoa)}</TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      </div>
                      
                      {/* Upfront and long-term costs */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Upfront Costs</h3>
                          <div className="border rounded-md p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Down Payment</span>
                              <span className="font-medium">{formatCurrency(results.upfrontCosts.downPayment)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span>Closing Costs</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 ml-1"
                                  onClick={() => toggleEducation('closingCosts')}
                                >
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-medium">{formatCurrency(results.upfrontCosts.closingCosts)}</span>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center font-bold">
                              <span>Total Cash to Close</span>
                              <span>{formatCurrency(results.upfrontCosts.totalCashNeeded)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Total Cost Analysis</h3>
                          <div className="border rounded-md overflow-hidden">
                            <div className="grid grid-cols-4 divide-x">
                              <div>
                                <div className="p-3 bg-gray-50 text-center text-sm text-gray-700 font-medium border-b">
                                  Term
                                </div>
                                <div className="p-4 text-center">
                                  <div className="text-3xl font-bold text-gray-900">{netSheet.loanTerm}</div>
                                  <div className="text-xs text-gray-500 mt-1">years</div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="p-3 bg-gray-50 text-center text-sm text-gray-700 font-medium border-b">
                                  1 Year
                                </div>
                                <div className="p-4 text-center">
                                  <div className="text-sm font-semibold text-gray-900">{formatCurrency(results.yearlyTotal)}</div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="p-3 bg-gray-50 text-center text-sm text-gray-700 font-medium border-b">
                                  5 Years
                                </div>
                                <div className="p-4 text-center">
                                  <div className="text-sm font-semibold text-gray-900">{formatCurrency(results.fiveYearTotal)}</div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="p-3 bg-gray-50 text-center text-sm text-gray-700 font-medium border-b">
                                  Full Term
                                </div>
                                <div className="p-4 text-center">
                                  <div className="text-sm font-semibold text-gray-900">{formatCurrency(results.thirtyYearTotal)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 bg-amber-50 p-4 rounded-md border border-amber-100">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-amber-800">Costs Beyond Principal</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                  Over the full term, you'll pay approximately {formatCurrency(results.thirtyYearTotal - netSheet.homePrice)} in interest, taxes, insurance, and other costs beyond the home price of {formatCurrency(netSheet.homePrice)}.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      
        {/* Education popups */}
        <Dialog open={showEducation.pmi} onOpenChange={() => toggleEducation('pmi')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Private Mortgage Insurance (PMI)</DialogTitle>
            </DialogHeader>
            <ScrollAreaWrapper className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What is PMI?</strong> Private Mortgage Insurance protects the lender if you stop making payments on your loan. It's typically required when your down payment is less than 20% of the home's value.
                </p>
                <p>
                  <strong>How much does it cost?</strong> Usually between 0.3% and 1.5% of your loan amount annually, depending on your credit score, loan term, and down payment percentage.
                </p>
                <p>
                  <strong>How to avoid PMI:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Make a down payment of at least 20%</li>
                  <li>Consider a piggyback loan (80-10-10 loan structure)</li>
                  <li>Look for lender-paid PMI options (higher interest rate but no separate PMI payment)</li>
                </ul>
                <p>
                  <strong>How to remove PMI:</strong> Once you have at least 20% equity in your home, you can request to have PMI removed. It will automatically terminate when you reach 22% equity based on your original amortization schedule.
                </p>
              </div>
            </ScrollAreaWrapper>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.taxes} onOpenChange={() => toggleEducation('taxes')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Property Taxes</DialogTitle>
            </DialogHeader>
            <ScrollAreaWrapper className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What are property taxes?</strong> Property taxes are annual fees based on your home's assessed value that fund local services like schools, roads, and emergency services.
                </p>
                <p>
                  <strong>How are they calculated?</strong> Property tax rates vary widely by location. The annual amount is typically between 0.5% to 2.5% of your home's assessed value, which may differ from its market value.
                </p>
                <p>
                  <strong>How are they paid?</strong> Most homeowners pay property taxes monthly as part of their mortgage payment. The lender holds these funds in an escrow account and pays the tax bill when due.
                </p>
                <p>
                  <strong>Can property taxes change?</strong> Yes. Property taxes can increase if:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Your home is reassessed at a higher value</li>
                  <li>Local tax rates increase</li>
                  <li>Special assessments are approved in your area</li>
                </ul>
              </div>
            </ScrollAreaWrapper>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.insurance} onOpenChange={() => toggleEducation('insurance')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Homeowners Insurance</DialogTitle>
            </DialogHeader>
            <ScrollAreaWrapper className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What is homeowners insurance?</strong> Homeowners insurance protects your home and possessions against damage or loss from events like fire, storms, theft, and some natural disasters.
                </p>
                <p>
                  <strong>What does it cover?</strong> Typical policies include:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Dwelling coverage (structure of your home)</li>
                  <li>Personal property coverage</li>
                  <li>Liability protection</li>
                  <li>Additional living expenses if you need temporary housing</li>
                </ul>
                <p>
                  <strong>How much does it cost?</strong> The average annual cost is between $800 and $1,500, but varies based on your home's value, location, coverage level, deductible, and other factors.
                </p>
                <p>
                  <strong>How is it paid?</strong> Like property taxes, insurance is typically paid monthly as part of your mortgage payment and held in an escrow account.
                </p>
                <p>
                  <strong>Note:</strong> Flood and earthquake insurance are usually separate policies not included in standard homeowners insurance.
                </p>
              </div>
            </ScrollAreaWrapper>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.closingCosts} onOpenChange={() => toggleEducation('closingCosts')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Closing Costs</DialogTitle>
            </DialogHeader>
            <ScrollAreaWrapper className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What are closing costs?</strong> Closing costs are the fees and expenses you pay when finalizing a mortgage, typically ranging from 2% to 5% of the loan amount.
                </p>
                <p>
                  <strong>Common closing costs include:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li><strong>Loan origination fee:</strong> Charged by the lender for processing your application</li>
                  <li><strong>Appraisal fee:</strong> Cost of having the home's value assessed</li>
                  <li><strong>Title services:</strong> Fees for title search, insurance, and settlement</li>
                  <li><strong>Government recording charges:</strong> Fees paid to record the deed and mortgage</li>
                  <li><strong>Transfer taxes:</strong> Taxes on transferring the property title</li>
                  <li><strong>Home inspection:</strong> Cost of inspecting the home's condition</li>
                  <li><strong>Prepaid expenses:</strong> Property taxes, insurance, and interest paid in advance</li>
                </ul>
                <p>
                  <strong>Can closing costs be negotiated?</strong> Yes, some fees can be negotiated or shopped around for better rates. You can also ask the seller to pay for some of your closing costs.
                </p>
                <p>
                  <strong>Can closing costs be included in the loan?</strong> In some cases, closing costs can be rolled into the mortgage amount (increasing your loan balance and monthly payments).
                </p>
              </div>
            </ScrollAreaWrapper>
          </DialogContent>
        </Dialog>
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default ClosingCostCalculatorFullscreen;