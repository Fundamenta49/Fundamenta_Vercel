import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  InfoIcon, 
  X, 
  HelpCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMortgageRates } from '@/services/fred-api';

// Enhanced scroll area with proper height limits
const EnhancedScrollArea = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <ScrollArea className={className}>
    {children}
  </ScrollArea>
);

// Default values
const DEFAULT_HOME_PRICE = 400000;
const DEFAULT_DOWN_PAYMENT_PERCENT = 20;
const DEFAULT_INTEREST_RATE = 6.5;
const DEFAULT_LOAN_TERM = 30;
const DEFAULT_PMI_RATE = 0.5;
const DEFAULT_HOME_INSURANCE_RATE = 0.35;
const DEFAULT_HOME_MAINTENANCE = 1;
const DEFAULT_HOA_MONTHLY = 0;
const DEFAULT_UTILITIES = 300;
const DEFAULT_STATE = "CA";

// Format currency without decimal points
const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

// Format currency with decimal points for more precise values
const formatCurrencyPrecise = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

interface StateData {
  name: string;
  propertyTaxRate: number; // percentage annually
  transferTaxRate: number; // percentage of home price
  recordingFees: number; // flat fee
  abbreviation: string;
}

// State data for all 50 states + DC
const STATE_DATA: { [key: string]: StateData } = {
  "AL": { name: "Alabama", propertyTaxRate: 0.41, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "AL" },
  "AK": { name: "Alaska", propertyTaxRate: 1.19, transferTaxRate: 0, recordingFees: 150, abbreviation: "AK" },
  "AZ": { name: "Arizona", propertyTaxRate: 0.62, transferTaxRate: 0, recordingFees: 100, abbreviation: "AZ" },
  "AR": { name: "Arkansas", propertyTaxRate: 0.62, transferTaxRate: 0.33, recordingFees: 75, abbreviation: "AR" },
  "CA": { name: "California", propertyTaxRate: 0.73, transferTaxRate: 0.11, recordingFees: 225, abbreviation: "CA" },
  "CO": { name: "Colorado", propertyTaxRate: 0.51, transferTaxRate: 0.01, recordingFees: 125, abbreviation: "CO" },
  "CT": { name: "Connecticut", propertyTaxRate: 2.14, transferTaxRate: 1.25, recordingFees: 175, abbreviation: "CT" },
  "DE": { name: "Delaware", propertyTaxRate: 0.57, transferTaxRate: 1.5, recordingFees: 100, abbreviation: "DE" },
  "FL": { name: "Florida", propertyTaxRate: 0.89, transferTaxRate: 0.7, recordingFees: 125, abbreviation: "FL" },
  "GA": { name: "Georgia", propertyTaxRate: 0.92, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "GA" },
  "HI": { name: "Hawaii", propertyTaxRate: 0.28, transferTaxRate: 0.1, recordingFees: 125, abbreviation: "HI" },
  "ID": { name: "Idaho", propertyTaxRate: 0.69, transferTaxRate: 0, recordingFees: 100, abbreviation: "ID" },
  "IL": { name: "Illinois", propertyTaxRate: 2.27, transferTaxRate: 0.1, recordingFees: 150, abbreviation: "IL" },
  "IN": { name: "Indiana", propertyTaxRate: 0.85, transferTaxRate: 0, recordingFees: 100, abbreviation: "IN" },
  "IA": { name: "Iowa", propertyTaxRate: 1.53, transferTaxRate: 0.16, recordingFees: 100, abbreviation: "IA" },
  "KS": { name: "Kansas", propertyTaxRate: 1.41, transferTaxRate: 0, recordingFees: 125, abbreviation: "KS" },
  "KY": { name: "Kentucky", propertyTaxRate: 0.86, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "KY" },
  "LA": { name: "Louisiana", propertyTaxRate: 0.55, transferTaxRate: 0, recordingFees: 125, abbreviation: "LA" },
  "ME": { name: "Maine", propertyTaxRate: 1.3, transferTaxRate: 0.44, recordingFees: 100, abbreviation: "ME" },
  "MD": { name: "Maryland", propertyTaxRate: 1.09, transferTaxRate: 0.5, recordingFees: 150, abbreviation: "MD" },
  "MA": { name: "Massachusetts", propertyTaxRate: 1.17, transferTaxRate: 0.46, recordingFees: 175, abbreviation: "MA" },
  "MI": { name: "Michigan", propertyTaxRate: 1.54, transferTaxRate: 0.86, recordingFees: 100, abbreviation: "MI" },
  "MN": { name: "Minnesota", propertyTaxRate: 1.12, transferTaxRate: 0.33, recordingFees: 100, abbreviation: "MN" },
  "MS": { name: "Mississippi", propertyTaxRate: 0.8, transferTaxRate: 0, recordingFees: 100, abbreviation: "MS" },
  "MO": { name: "Missouri", propertyTaxRate: 0.97, transferTaxRate: 0, recordingFees: 125, abbreviation: "MO" },
  "MT": { name: "Montana", propertyTaxRate: 0.84, transferTaxRate: 0, recordingFees: 100, abbreviation: "MT" },
  "NE": { name: "Nebraska", propertyTaxRate: 1.73, transferTaxRate: 0.23, recordingFees: 100, abbreviation: "NE" },
  "NV": { name: "Nevada", propertyTaxRate: 0.69, transferTaxRate: 0.25, recordingFees: 125, abbreviation: "NV" },
  "NH": { name: "New Hampshire", propertyTaxRate: 2.18, transferTaxRate: 0.75, recordingFees: 125, abbreviation: "NH" },
  "NJ": { name: "New Jersey", propertyTaxRate: 2.49, transferTaxRate: 1, recordingFees: 150, abbreviation: "NJ" },
  "NM": { name: "New Mexico", propertyTaxRate: 0.78, transferTaxRate: 0, recordingFees: 100, abbreviation: "NM" },
  "NY": { name: "New York", propertyTaxRate: 1.72, transferTaxRate: 0.4, recordingFees: 200, abbreviation: "NY" },
  "NC": { name: "North Carolina", propertyTaxRate: 0.84, transferTaxRate: 0.2, recordingFees: 125, abbreviation: "NC" },
  "ND": { name: "North Dakota", propertyTaxRate: 0.98, transferTaxRate: 0, recordingFees: 100, abbreviation: "ND" },
  "OH": { name: "Ohio", propertyTaxRate: 1.56, transferTaxRate: 0.1, recordingFees: 125, abbreviation: "OH" },
  "OK": { name: "Oklahoma", propertyTaxRate: 0.9, transferTaxRate: 0, recordingFees: 100, abbreviation: "OK" },
  "OR": { name: "Oregon", propertyTaxRate: 1.04, transferTaxRate: 0.1, recordingFees: 125, abbreviation: "OR" },
  "PA": { name: "Pennsylvania", propertyTaxRate: 1.58, transferTaxRate: 1, recordingFees: 150, abbreviation: "PA" },
  "RI": { name: "Rhode Island", propertyTaxRate: 1.63, transferTaxRate: 0.46, recordingFees: 125, abbreviation: "RI" },
  "SC": { name: "South Carolina", propertyTaxRate: 0.57, transferTaxRate: 0.37, recordingFees: 100, abbreviation: "SC" },
  "SD": { name: "South Dakota", propertyTaxRate: 1.22, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "SD" },
  "TN": { name: "Tennessee", propertyTaxRate: 0.72, transferTaxRate: 0.37, recordingFees: 100, abbreviation: "TN" },
  "TX": { name: "Texas", propertyTaxRate: 1.8, transferTaxRate: 0, recordingFees: 125, abbreviation: "TX" },
  "UT": { name: "Utah", propertyTaxRate: 0.66, transferTaxRate: 0, recordingFees: 100, abbreviation: "UT" },
  "VT": { name: "Vermont", propertyTaxRate: 1.9, transferTaxRate: 0.5, recordingFees: 125, abbreviation: "VT" },
  "VA": { name: "Virginia", propertyTaxRate: 0.8, transferTaxRate: 0.33, recordingFees: 150, abbreviation: "VA" },
  "WA": { name: "Washington", propertyTaxRate: 0.98, transferTaxRate: 1.28, recordingFees: 175, abbreviation: "WA" },
  "WV": { name: "West Virginia", propertyTaxRate: 0.59, transferTaxRate: 0.22, recordingFees: 100, abbreviation: "WV" },
  "WI": { name: "Wisconsin", propertyTaxRate: 1.76, transferTaxRate: 0.3, recordingFees: 125, abbreviation: "WI" },
  "WY": { name: "Wyoming", propertyTaxRate: 0.61, transferTaxRate: 0, recordingFees: 100, abbreviation: "WY" },
  "DC": { name: "District of Columbia", propertyTaxRate: 0.56, transferTaxRate: 1.1, recordingFees: 200, abbreviation: "DC" }
}

export const ClosingCostCalculator: React.FC<{onClose?: () => void, isWrappedInFullscreen?: boolean}> = ({ 
  onClose, 
  isWrappedInFullscreen = false 
}) => {
  // When used inside a fullscreen component, we don't need to handle our own fullscreen state
  // This has been moved to closing-cost-calculator-fullscreen.tsx
  
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
    const yearlyPrincipalAndInterest = monthlyPayment.principal + monthlyPayment.interest;
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
    const thirtyYearTotal = yearlyTotal * 30;
    
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
    <div className={isWrappedInFullscreen ? "" : "container max-w-5xl mx-auto"}>
      {/* Main content */}
      <div className="container max-w-5xl mx-auto">
        {/* Show the header only if not wrapped in a fullscreen component */}
        {!isWrappedInFullscreen && (
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-green-600" />
                  Closing Cost & Total Ownership Calculator
                </h1>
                <p className="text-gray-600">
                  Understand all costs associated with buying a home, from closing to long-term ownership
                </p>
              </div>
              
              {/* Desktop Close Button */}
              {onClose && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:flex rounded-full h-10 w-10 p-0 border-2 border-green-500"
                  onClick={onClose}
                >
                  <X className="h-6 w-6 text-green-600" />
                  <span className="sr-only">Close</span>
                </Button>
              )}
            </div>
            <Separator className="my-4" />
          </div>
        )}
        
        {/* Main Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {/* Input Section */}
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900">
                <CardTitle className="text-lg text-green-900 dark:text-green-50">Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="home-price">Home Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="home-price"
                      type="text"
                      className="pl-8"
                      value={formatCurrency(netSheet.homePrice)}
                      onChange={(e) => handleHomePriceChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="down-payment">Down Payment</Label>
                    <span className="text-sm text-gray-500">{formatPercent(netSheet.downPaymentPercent)}</span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="down-payment"
                      type="text"
                      className="pl-8"
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
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate">Interest Rate</Label>
                    <span className="text-sm text-gray-500">{netSheet.interestRate.toFixed(2)}%</span>
                  </div>
                  <Slider
                    defaultValue={[DEFAULT_INTEREST_RATE]}
                    min={2}
                    max={10}
                    step={0.125}
                    value={[netSheet.interestRate]}
                    onValueChange={handleInterestRateChange}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>2%</span>
                    <span>6%</span>
                    <span>10%</span>
                  </div>
                  {currentRates.thirtyYearFixed > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      Current average 30-year rate: {formatRate(currentRates.thirtyYearFixed)}%
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loan-term">Loan Term</Label>
                  <Select value={netSheet.loanTerm.toString()} onValueChange={handleLoanTermChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Years</SelectItem>
                      <SelectItem value="20">20 Years</SelectItem>
                      <SelectItem value="15">15 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                  {currentRates.fifteenYearFixed > 0 && netSheet.loanTerm === 15 && (
                    <div className="mt-1 text-xs text-gray-600">
                      Current average 15-year rate: {formatRate(currentRates.fifteenYearFixed)}%
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={netSheet.selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(STATE_DATA).sort().map((stateCode) => (
                        <SelectItem key={stateCode} value={stateCode}>
                          {STATE_DATA[stateCode].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-1 text-xs text-gray-600">
                    Rates are specific to each state
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="advanced-mode"
                      checked={advancedMode}
                      onCheckedChange={handleAdvancedModeToggle}
                    />
                    <Label htmlFor="advanced-mode">Advanced Options</Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {advancedMode && (
              <Card className="mt-4">
                <CardHeader className="bg-green-50 dark:bg-green-900">
                  <CardTitle className="text-lg text-green-900 dark:text-green-50">Advanced Options</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Tabs defaultValue="closing" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-green-100 dark:bg-green-950">
                      <TabsTrigger value="closing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Closing Costs</TabsTrigger>
                      <TabsTrigger value="recurring" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Recurring Costs</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="closing" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Loan Origination Fee</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
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
                      </div>
                      
                      {/* Add more closing cost fields here */}
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
                    </TabsContent>
                    
                    <TabsContent value="recurring" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Property Tax (Monthly)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            className="pl-8"
                            value={formatCurrencyPrecise(netSheet.recurringCosts.propertyTax)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                              setNetSheet(prev => ({
                                ...prev,
                                recurringCosts: {
                                  ...prev.recurringCosts,
                                  propertyTax: value
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Homeowners Insurance (Monthly)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            className="pl-8"
                            value={formatCurrencyPrecise(netSheet.recurringCosts.homeownersInsurance)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                              setNetSheet(prev => ({
                                ...prev,
                                recurringCosts: {
                                  ...prev.recurringCosts,
                                  homeownersInsurance: value
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>HOA Fees (Monthly)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            className="pl-8"
                            value={formatCurrencyPrecise(netSheet.recurringCosts.hoaFees)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                              setNetSheet(prev => ({
                                ...prev,
                                recurringCosts: {
                                  ...prev.recurringCosts,
                                  hoaFees: value
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Utilities (Monthly)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            className="pl-8"
                            value={formatCurrencyPrecise(netSheet.recurringCosts.utilities)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                              setNetSheet(prev => ({
                                ...prev,
                                recurringCosts: {
                                  ...prev.recurringCosts,
                                  utilities: value
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Maintenance (Monthly)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            className="pl-8"
                            value={formatCurrencyPrecise(netSheet.recurringCosts.maintenance)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                              setNetSheet(prev => ({
                                ...prev,
                                recurringCosts: {
                                  ...prev.recurringCosts,
                                  maintenance: value
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {/* Results Section */}
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900">
                <CardTitle className="text-lg text-green-900 dark:text-green-50">
                  Results Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Upfront Costs */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
                      <span>Cash Needed to Close</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {formatCurrency(results.upfrontCosts.totalCashNeeded)}
                      </Badge>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center">
                          Down Payment
                        </span>
                        <span>{formatCurrency(results.upfrontCosts.downPayment)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          Closing Costs
                          <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => toggleEducation('closingCosts')}>
                            <HelpCircle className="h-3 w-3" />
                            <span className="sr-only">Learn about closing costs</span>
                          </Button>
                        </span>
                        <span>{formatCurrency(results.upfrontCosts.closingCosts)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-medium">
                        <span>Total Cash Needed</span>
                        <span>{formatCurrency(results.upfrontCosts.totalCashNeeded)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Breakdown */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
                      <span>Monthly Payment</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {formatCurrencyPrecise(results.monthlyPayment.total)}
                      </Badge>
                    </h3>
                    
                    <Tabs defaultValue="breakdown" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-green-100 dark:bg-green-950">
                        <TabsTrigger value="breakdown" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Payment Breakdown</TabsTrigger>
                        <TabsTrigger value="chart" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400">Payment Chart</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="breakdown" className="pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Principal & Interest</span>
                            <span>{formatCurrencyPrecise(results.monthlyPayment.principal + results.monthlyPayment.interest)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1">
                              Property Taxes
                              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => toggleEducation('taxes')}>
                                <HelpCircle className="h-3 w-3" />
                                <span className="sr-only">Learn about property taxes</span>
                              </Button>
                            </span>
                            <span>{formatCurrencyPrecise(results.monthlyPayment.taxes)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1">
                              Homeowners Insurance
                              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => toggleEducation('insurance')}>
                                <HelpCircle className="h-3 w-3" />
                                <span className="sr-only">Learn about homeowners insurance</span>
                              </Button>
                            </span>
                            <span>{formatCurrencyPrecise(results.monthlyPayment.insurance)}</span>
                          </div>
                          {results.monthlyPayment.pmi > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-1">
                                Mortgage Insurance (PMI)
                                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => toggleEducation('pmi')}>
                                  <HelpCircle className="h-3 w-3" />
                                  <span className="sr-only">Learn about PMI</span>
                                </Button>
                              </span>
                              <span>{formatCurrencyPrecise(results.monthlyPayment.pmi)}</span>
                            </div>
                          )}
                          {results.monthlyPayment.hoa > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span>HOA Fees</span>
                              <span>{formatCurrencyPrecise(results.monthlyPayment.hoa)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between items-center font-medium">
                            <span>Total Monthly Payment</span>
                            <span>{formatCurrencyPrecise(results.monthlyPayment.total)}</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="chart" className="pt-4">
                        <div className="text-center p-4 bg-gray-50 rounded-md">
                          <p className="text-gray-500 mb-2">Monthly Payment Breakdown</p>
                          {/* Simple visual breakdown with colored boxes - responsive alternative to chart */}
                          <div className="w-full h-10 flex rounded-md overflow-hidden">
                            {/* Principal & Interest */}
                            <div 
                              className="bg-green-500 h-full flex items-center justify-center"
                              style={{ 
                                width: `${((results.monthlyPayment.principal + results.monthlyPayment.interest) / results.monthlyPayment.total * 100)}%` 
                              }}
                            >
                              <span className="text-white text-xs px-1 truncate">P&I</span>
                            </div>
                            
                            {/* Taxes */}
                            <div 
                              className="bg-blue-500 h-full flex items-center justify-center"
                              style={{ 
                                width: `${(results.monthlyPayment.taxes / results.monthlyPayment.total * 100)}%` 
                              }}
                            >
                              <span className="text-white text-xs px-1 truncate">Tax</span>
                            </div>
                            
                            {/* Insurance */}
                            <div 
                              className="bg-purple-500 h-full flex items-center justify-center"
                              style={{ 
                                width: `${(results.monthlyPayment.insurance / results.monthlyPayment.total * 100)}%` 
                              }}
                            >
                              <span className="text-white text-xs px-1 truncate">Ins</span>
                            </div>
                            
                            {/* PMI (if applicable) */}
                            {results.monthlyPayment.pmi > 0 && (
                              <div 
                                className="bg-yellow-500 h-full flex items-center justify-center"
                                style={{ 
                                  width: `${(results.monthlyPayment.pmi / results.monthlyPayment.total * 100)}%` 
                                }}
                              >
                                <span className="text-white text-xs px-1 truncate">PMI</span>
                              </div>
                            )}
                            
                            {/* HOA (if applicable) */}
                            {results.monthlyPayment.hoa > 0 && (
                              <div 
                                className="bg-orange-500 h-full flex items-center justify-center"
                                style={{ 
                                  width: `${(results.monthlyPayment.hoa / results.monthlyPayment.total * 100)}%` 
                                }}
                              >
                                <span className="text-white text-xs px-1 truncate">HOA</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Legend */}
                          <div className="flex flex-wrap gap-3 justify-center mt-3">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                              <span className="text-xs">Principal & Interest</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                              <span className="text-xs">Property Taxes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                              <span className="text-xs">Insurance</span>
                            </div>
                            {results.monthlyPayment.pmi > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                                <span className="text-xs">PMI</span>
                              </div>
                            )}
                            {results.monthlyPayment.hoa > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                                <span className="text-xs">HOA</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  {/* Long-term Costs */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      <span>Long-term Cost Projections</span>
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Annual Housing Costs</span>
                        <span>{formatCurrency(results.yearlyTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>5-Year Total Cost</span>
                        <span>{formatCurrency(results.fiveYearTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>30-Year Total Cost</span>
                        <span>{formatCurrency(results.thirtyYearTotal)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loan Summary */}
                  <Card className="border border-green-100">
                    <CardHeader className="bg-green-50 py-3">
                      <CardTitle className="text-base text-green-900">Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Loan Amount</p>
                          <p className="font-medium">{formatCurrency(netSheet.loanAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="font-medium">{netSheet.interestRate.toFixed(3)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loan Term</p>
                          <p className="font-medium">{netSheet.loanTerm} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Property Tax Rate</p>
                          <p className="font-medium">{STATE_DATA[netSheet.selectedState].propertyTaxRate.toFixed(2)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Education popups */}
        <Dialog open={showEducation.pmi} onOpenChange={() => toggleEducation('pmi')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Private Mortgage Insurance (PMI)</DialogTitle>
            </DialogHeader>
            <EnhancedScrollArea className="max-h-[60vh] pr-4">
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
                  <strong>How to remove PMI:</strong> Once you reach 22% equity (based on original purchase price), PMI automatically terminates. You can request cancellation at 20% equity if your payment history is good.
                </p>
              </div>
            </EnhancedScrollArea>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.taxes} onOpenChange={() => toggleEducation('taxes')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Property Taxes Explained</DialogTitle>
            </DialogHeader>
            <EnhancedScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What are property taxes?</strong> These are local taxes assessed by your county or municipality based on your home's value, used to fund schools, infrastructure, and public services.
                </p>
                <p>
                  <strong>How they're calculated:</strong> Your home's assessed value multiplied by the local tax rate. In {STATE_DATA[netSheet.selectedState].name}, the average rate is {STATE_DATA[netSheet.selectedState].propertyTaxRate.toFixed(2)}% of your home's value annually.
                </p>
                <p>
                  <strong>How they're paid:</strong> Usually included in your monthly mortgage payment and held in an escrow account until your lender pays them on your behalf.
                </p>
                <p>
                  <strong>Important considerations:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Property taxes can increase over time as your home's value increases</li>
                  <li>Some areas offer exemptions for primary residences or senior citizens</li>
                  <li>Tax rates vary significantly by location, even within the same state</li>
                </ul>
              </div>
            </EnhancedScrollArea>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.insurance} onOpenChange={() => toggleEducation('insurance')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Homeowners Insurance Guide</DialogTitle>
            </DialogHeader>
            <EnhancedScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What it covers:</strong> Damage to your home's structure, personal belongings, liability protection, and additional living expenses if your home becomes uninhabitable.
                </p>
                <p>
                  <strong>What it doesn't cover:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Flood damage (requires separate policy)</li>
                  <li>Earthquake damage (requires separate policy)</li>
                  <li>Normal wear and tear</li>
                </ul>
                <p>
                  <strong>Factors affecting premiums:</strong> Location, home value, deductible amount, credit score, claim history, and coverage options.
                </p>
                <p>
                  <strong>How to save:</strong> Bundle with auto insurance, increase deductibles, install security systems, or improve your home's resilience.
                </p>
              </div>
            </EnhancedScrollArea>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEducation.closingCosts} onOpenChange={() => toggleEducation('closingCosts')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Closing Costs</DialogTitle>
            </DialogHeader>
            <EnhancedScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>What are closing costs?</strong> Closing costs are fees and expenses you pay when finalizing your mortgage and home purchase.
                </p>
                <p>
                  <strong>How much are they?</strong> Typically, closing costs range from 2% to 5% of the loan amount. In {STATE_DATA[netSheet.selectedState].name}, transfer taxes are approximately {STATE_DATA[netSheet.selectedState].transferTaxRate.toFixed(2)}% of the property value.
                </p>
                <p>
                  <strong>Common closing costs include:</strong>
                </p>
                <div className="space-y-2">
                  <p><strong>Loan costs:</strong> Origination fees, application fees, underwriting fees</p>
                  <p><strong>Third-party fees:</strong> Appraisal, credit report, home inspection, title search</p>
                  <p><strong>Government fees:</strong> Recording fees, transfer taxes</p>
                  <p><strong>Prepaid items:</strong> Homeowners insurance, property taxes, mortgage insurance</p>
                </div>
                <p>
                  <strong>How to reduce closing costs:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Shop around for lenders and service providers</li>
                  <li>Ask for seller concessions</li>
                  <li>Close at the end of the month</li>
                  <li>Look for lender credits (in exchange for a higher interest rate)</li>
                </ul>
              </div>
            </EnhancedScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};