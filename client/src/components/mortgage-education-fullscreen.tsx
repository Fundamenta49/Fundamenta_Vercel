import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Home, 
  BookOpen, 
  DollarSign, 
  FileText, 
  PieChart, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  Award, 
  X,
  Lightbulb,
  Scale,
  BriefcaseBusiness,
  FileCheck,
  School,
  ListChecks,
  ChevronLeft
} from 'lucide-react';
import QuizComponent, { QuizQuestion } from "@/components/quiz-component";
import { Badge } from "@/components/ui/badge";

// Define types
interface MortgageGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  content: React.ReactNode;
}

// Quick reference glossary terms
interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'basic' | 'loan-types' | 'financial' | 'process';
}

// FAQ question and answer
interface FAQ {
  question: string;
  answer: React.ReactNode;
  category: 'general' | 'qualification' | 'process' | 'financial';
}

interface MortgageEducationFullscreenProps {
  onClose: () => void;
}

const MortgageEducationFullscreen: React.FC<MortgageEducationFullscreenProps> = ({ onClose }) => {
  // State
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("guides");
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<MortgageGuide | null>(null);
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([]);
  const [glossaryFilter, setGlossaryFilter] = useState<string>('all');
  const [faqFilter, setFaqFilter] = useState<string>('all');

  // Set mounting state for SSR compatibility
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update filtered glossary terms when filter changes
  useEffect(() => {
    if (glossaryFilter === 'all') {
      setFilteredTerms(glossaryTerms);
    } else {
      setFilteredTerms(glossaryTerms.filter(term => term.category === glossaryFilter));
    }
  }, [glossaryFilter]);

  // Update selected guide when id changes
  useEffect(() => {
    if (selectedGuideId) {
      const guide = mortgageGuides.find(g => g.id === selectedGuideId);
      setSelectedGuide(guide || null);
    } else {
      setSelectedGuide(null);
    }
  }, [selectedGuideId]);

  // Handle guide selection
  const handleGuideSelect = (guideId: string) => {
    setSelectedGuideId(guideId);
  };

  // Handle going back to guide list
  const handleBackToGuides = () => {
    setSelectedGuideId(null);
  };

  // Mortgage quiz questions
  const mortgageQuizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is a mortgage?",
      options: [
        "A type of credit card for home purchases",
        "A loan used to purchase real estate",
        "A government grant for first-time homebuyers",
        "An insurance policy for your home"
      ],
      correctAnswer: 1,
      explanation: "A mortgage is a loan used to purchase or maintain a home, land, or other types of real estate. The borrower agrees to pay the lender over time, typically in a series of regular payments that are divided into principal and interest."
    },
    {
      id: 2,
      question: "What does LTV stand for in mortgage terminology?",
      options: [
        "Long-Term Value",
        "Lender-to-Value",
        "Loan-to-Value",
        "Lifetime Value"
      ],
      correctAnswer: 2,
      explanation: "Loan-to-Value (LTV) is the ratio of the loan amount to the appraised value of the property, expressed as a percentage. For example, if you buy a home appraised at $200,000 and make a down payment of $40,000, your loan amount is $160,000 and your LTV ratio is 80% ($160,000/$200,000)."
    },
    {
      id: 3,
      question: "What is private mortgage insurance (PMI)?",
      options: [
        "Insurance that pays off your mortgage if you lose your job",
        "Insurance that protects the lender if you default on your loan",
        "Insurance that covers home repairs not covered by homeowners insurance",
        "Insurance that guarantees you get the best mortgage rate"
      ],
      correctAnswer: 1,
      explanation: "Private Mortgage Insurance (PMI) is insurance that protects the lender if you default on your loan. It's typically required when you make a down payment of less than 20% of the home's purchase price. PMI adds to your monthly mortgage payment."
    },
    {
      id: 4,
      question: "What is the purpose of a mortgage escrow account?",
      options: [
        "To hold your down payment before closing",
        "To cover the lender's legal fees",
        "To collect and pay property taxes and insurance",
        "To temporarily hold disputed funds"
      ],
      correctAnswer: 2,
      explanation: "A mortgage escrow account is set up by your lender to pay certain property-related expenses on your behalf, like property taxes and homeowners insurance. The lender collects these expenses as part of your monthly mortgage payment, holds the money in the escrow account, and then pays the bills when they're due."
    },
    {
      id: 5,
      question: "Which of these is NOT a common type of mortgage?",
      options: [
        "Fixed-rate mortgage",
        "Adjustable-rate mortgage (ARM)",
        "FHA loan",
        "Reverse credit mortgage"
      ],
      correctAnswer: 3,
      explanation: "There is no such thing as a 'reverse credit mortgage.' Common mortgage types include fixed-rate mortgages (where the interest rate stays the same), adjustable-rate mortgages (where the interest rate can change), FHA loans (insured by the Federal Housing Administration), VA loans, and USDA loans, among others. There are 'reverse mortgages,' which allow homeowners to convert part of their home equity into cash, but these are different products."
    }
  ];

  // Mortgage guides content
  const mortgageGuides: MortgageGuide[] = [
    {
      id: 'mortgage-basics',
      title: 'Mortgage Basics',
      description: 'Learn the fundamentals of mortgages and home loans',
      icon: <Home className="h-5 w-5" />,
      difficulty: 'beginner',
      estimatedTime: '5 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What is a Mortgage?</h3>
          <p>
            A mortgage is a loan used to purchase or maintain a home, land, or other types of real estate. The borrower agrees to pay the lender over time, typically in a series of regular payments that are divided into principal and interest. The property serves as collateral to secure the loan.
          </p>
          
          <h3 className="text-lg font-semibold">Key Mortgage Terms</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Principal:</strong> The original amount borrowed from the lender
            </li>
            <li>
              <strong>Interest:</strong> The cost of borrowing the principal, expressed as a percentage
            </li>
            <li>
              <strong>Down Payment:</strong> The initial upfront payment you make when purchasing a home (typically 3-20% of the purchase price)
            </li>
            <li>
              <strong>Loan Term:</strong> The length of time you have to repay the loan (commonly 15 or 30 years)
            </li>
            <li>
              <strong>Monthly Payment:</strong> The amount you pay each month, which typically includes principal, interest, taxes, and insurance (PITI)
            </li>
          </ul>
          
          <h3 className="text-lg font-semibold">How a Mortgage Works</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>You borrow money from a lender to buy a home</li>
            <li>You make a down payment and finance the rest with the mortgage</li>
            <li>You repay the loan with interest over a set period</li>
            <li>The home serves as collateral until the mortgage is paid off</li>
            <li>Once paid in full, you own the home outright</li>
          </ol>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> A larger down payment means a smaller loan amount, which typically results in lower monthly payments and possibly a better interest rate.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: 'mortgage-types',
      title: 'Types of Mortgages',
      description: 'Explore different mortgage options and find the right fit',
      icon: <FileText className="h-5 w-5" />,
      difficulty: 'beginner',
      estimatedTime: '8 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Common Mortgage Types</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fixed-rate">
              <AccordionTrigger>Fixed-Rate Mortgage</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A home loan with an interest rate that remains the same for the entire term of the loan.</p>
                  <p><strong>Best for:</strong> Buyers who plan to stay in their home for a long time and want predictable payments.</p>
                  <p><strong>Terms:</strong> Typically 15, 20, or 30 years</p>
                  <p><strong>Pros:</strong> Payment amount stays the same, making budgeting easier</p>
                  <p><strong>Cons:</strong> Generally starts with a higher interest rate than adjustable-rate mortgages</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="adjustable-rate">
              <AccordionTrigger>Adjustable-Rate Mortgage (ARM)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A home loan with an interest rate that can change periodically based on market conditions.</p>
                  <p><strong>Best for:</strong> Buyers who plan to sell or refinance before the fixed-rate period ends.</p>
                  <p><strong>Terms:</strong> Described as "5/1," "7/1," where the first number is the years the rate is fixed, and the second is how often it adjusts afterward (in years)</p>
                  <p><strong>Pros:</strong> Lower initial interest rate than fixed-rate mortgages</p>
                  <p><strong>Cons:</strong> Payment amount can increase over time, sometimes significantly</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="fha">
              <AccordionTrigger>FHA Loan</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A government-backed loan insured by the Federal Housing Administration designed for lower-income borrowers.</p>
                  <p><strong>Best for:</strong> First-time homebuyers or those with lower credit scores.</p>
                  <p><strong>Down payment:</strong> As low as 3.5% with a credit score of 580 or higher</p>
                  <p><strong>Pros:</strong> Easier to qualify for with lower credit scores and down payments</p>
                  <p><strong>Cons:</strong> Requires mortgage insurance premium (MIP) for the life of the loan in most cases</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="va">
              <AccordionTrigger>VA Loan</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A loan guaranteed by the Department of Veterans Affairs for service members, veterans, and eligible surviving spouses.</p>
                  <p><strong>Best for:</strong> Eligible veterans, active-duty service members, and qualifying spouses.</p>
                  <p><strong>Down payment:</strong> Often 0% down payment required</p>
                  <p><strong>Pros:</strong> No down payment or mortgage insurance required, competitive interest rates</p>
                  <p><strong>Cons:</strong> Requires VA funding fee, which can be rolled into the loan</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="usda">
              <AccordionTrigger>USDA Loan</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A loan guaranteed by the U.S. Department of Agriculture for rural and suburban homebuyers.</p>
                  <p><strong>Best for:</strong> Low to moderate-income buyers in qualifying rural and suburban areas.</p>
                  <p><strong>Down payment:</strong> 0% down payment required</p>
                  <p><strong>Pros:</strong> No down payment required, lower mortgage insurance than FHA loans</p>
                  <p><strong>Cons:</strong> Property must be in an eligible rural or suburban area, income limits apply</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="jumbo">
              <AccordionTrigger>Jumbo Mortgage</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A loan that exceeds the conforming loan limits set by the Federal Housing Finance Agency.</p>
                  <p><strong>Best for:</strong> Buyers purchasing higher-priced homes that exceed conforming loan limits.</p>
                  <p><strong>Loan amount:</strong> Exceeds the conforming loan limit (varies by location)</p>
                  <p><strong>Pros:</strong> Allows financing for more expensive properties</p>
                  <p><strong>Cons:</strong> Usually requires excellent credit, larger down payments, and higher interest rates</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <h3 className="text-lg font-semibold mt-6">Comparison Table</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Overview of common mortgage types and their features</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Mortgage Type</TableHead>
                  <TableHead>Min. Down Payment</TableHead>
                  <TableHead>Credit Score</TableHead>
                  <TableHead>Best For</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Conventional</TableCell>
                  <TableCell>3-5%</TableCell>
                  <TableCell>620+</TableCell>
                  <TableCell>Borrowers with good credit and stable income</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FHA</TableCell>
                  <TableCell>3.5%</TableCell>
                  <TableCell>580+</TableCell>
                  <TableCell>First-time buyers with lower credit scores</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VA</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>580-620</TableCell>
                  <TableCell>Eligible veterans and service members</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>USDA</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>640+</TableCell>
                  <TableCell>Low-income buyers in rural/suburban areas</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jumbo</TableCell>
                  <TableCell>10-20%</TableCell>
                  <TableCell>700+</TableCell>
                  <TableCell>Luxury home buyers in high-cost areas</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Choose a mortgage that aligns with your long-term goals. If you plan to move within 5 years, an ARM might save you money. If you're settling down for the long term, a fixed-rate mortgage provides stability.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: 'mortgage-process',
      title: 'The Mortgage Process',
      description: 'Step-by-step guide to getting a mortgage and buying a home',
      icon: <ListChecks className="h-5 w-5" />,
      difficulty: 'intermediate',
      estimatedTime: '10 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">The Mortgage Process: Step by Step</h3>
          
          <ol className="space-y-4">
            <li className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Prepare Your Finances
              </h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Check your credit score and report</li>
                <li>Save for a down payment (typically 3-20%)</li>
                <li>Pay down existing debt</li>
                <li>Gather financial documents (tax returns, pay stubs, bank statements)</li>
                <li>Create a budget for housing costs</li>
              </ul>
            </li>
            
            <li className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Get Pre-Approved
              </h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Shop around with multiple lenders</li>
                <li>Submit your financial information</li>
                <li>Receive a pre-approval letter showing how much you can borrow</li>
                <li>Understand the terms of the pre-approval</li>
              </ul>
            </li>
            
            <li className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Shop for a Home
              </h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Work with a real estate agent</li>
                <li>Visit properties within your budget</li>
                <li>Consider location, size, condition, and future needs</li>
                <li>Make an offer when you find the right home</li>
              </ul>
            </li>
            
            <li className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Apply for the Mortgage
              </h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Submit a formal mortgage application</li>
                <li>Pay the application fee</li>
                <li>Lock in your interest rate (optional)</li>
                <li>Receive a Loan Estimate within 3 days</li>
              </ul>
            </li>
            
            <li className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                Go Through Underwriting
              </h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>The lender verifies your financial information</li>
                <li>The home is appraised to determine its value</li>
                <li>A title search is conducted to check for issues</li>
                <li>Additional documentation may be requested</li>
              </ul>
            </li>
            
            <li className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                Closing
              </h4>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Review the Closing Disclosure (sent at least 3 days before closing)</li>
                <li>Conduct a final walkthrough of the property</li>
                <li>Bring a certified check for closing costs or arrange wire transfer</li>
                <li>Sign the mortgage documents and other paperwork</li>
                <li>Receive the keys to your new home</li>
              </ul>
            </li>
          </ol>
          
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Timeline Note:</strong> The entire mortgage process typically takes 30-45 days from application to closing, though it can vary based on market conditions and your financial situation.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: 'qualification-factors',
      title: 'Qualification Factors',
      description: 'Understanding what lenders look for when approving mortgages',
      icon: <FileCheck className="h-5 w-5" />,
      difficulty: 'intermediate',
      estimatedTime: '7 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What Lenders Look For</h3>
          <p>
            Mortgage lenders evaluate your loan application based on several key factors, often 
            referred to as the "5 C's of Credit." Understanding these factors can help you prepare 
            for the mortgage application process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">1</Badge>
                  Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Your credit history and score indicate your past behavior with borrowed money. 
                  Most lenders require a minimum score of 620 for conventional loans, though FHA 
                  loans may accept scores as low as 580.
                </p>
                <p className="text-sm mt-2">
                  <strong>Tip:</strong> Check your credit reports from all three bureaus and address any errors before applying.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">2</Badge>
                  Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Your ability to repay the loan, measured primarily by your debt-to-income (DTI) ratio. 
                  Most lenders prefer a DTI of 43% or lower, though some loan programs may accept up to 50%.
                </p>
                <p className="text-sm mt-2">
                  <strong>Formula:</strong> DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">3</Badge>
                  Capital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  The money you have available for a down payment and closing costs. A larger down payment 
                  shows lenders you're financially stable and reduces the loan amount, often resulting in 
                  better terms.
                </p>
                <p className="text-sm mt-2">
                  <strong>Typical Requirement:</strong> 3-20% down payment, depending on loan type
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">4</Badge>
                  Collateral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  The home itself serves as security for the loan. Lenders evaluate the property's value 
                  through an appraisal to ensure it's worth at least as much as the loan amount.
                </p>
                <p className="text-sm mt-2">
                  <strong>Key Metric:</strong> Loan-to-Value (LTV) ratio = (Loan Amount ÷ Appraised Value) × 100
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">5</Badge>
                  Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  External factors that may affect the loan, including:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  <li>The state of the economy and housing market</li>
                  <li>The type and purpose of the loan</li>
                  <li>Property-specific requirements</li>
                  <li>Current interest rates and lender terms</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Common Qualification Requirements</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Min. Credit Score</TableHead>
                  <TableHead>Max DTI</TableHead>
                  <TableHead>Down Payment</TableHead>
                  <TableHead>LTV Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Conventional</TableCell>
                  <TableCell>620+</TableCell>
                  <TableCell>36-43%</TableCell>
                  <TableCell>3-20%</TableCell>
                  <TableCell>80-97%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FHA</TableCell>
                  <TableCell>580+ (or 500+ with 10% down)</TableCell>
                  <TableCell>43-50%</TableCell>
                  <TableCell>3.5% (or 10% if credit score 500-579)</TableCell>
                  <TableCell>96.5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VA</TableCell>
                  <TableCell>580-620+</TableCell>
                  <TableCell>41%</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>100%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>USDA</TableCell>
                  <TableCell>640+</TableCell>
                  <TableCell>41%</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>100%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jumbo</TableCell>
                  <TableCell>700+</TableCell>
                  <TableCell>36-43%</TableCell>
                  <TableCell>10-20%</TableCell>
                  <TableCell>80-90%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Start improving your qualification factors at least 6-12 months before applying for a mortgage. Pay down debt, save for a larger down payment, and avoid opening new credit accounts.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: 'costs-and-fees',
      title: 'Mortgage Costs & Fees',
      description: 'Understanding the true cost of a mortgage beyond the principal and interest',
      icon: <DollarSign className="h-5 w-5" />,
      difficulty: 'intermediate',
      estimatedTime: '7 min',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Beyond Principal and Interest</h3>
          <p>
            When budgeting for a mortgage, many first-time homebuyers focus only on the principal and interest payment. 
            However, the true cost of a mortgage includes several other expenses that can significantly affect 
            your monthly payment and the total cost over the life of the loan.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Monthly Mortgage Costs</h3>
          <p className="text-sm text-muted-foreground mb-3">Your monthly mortgage payment typically includes:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  The amount that goes toward paying off the original loan amount. Early in your loan, this is a small portion 
                  of your payment, but it increases over time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  The cost of borrowing the money, calculated as a percentage of your remaining loan balance. 
                  This makes up a larger portion of early payments and decreases over time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Property Taxes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Taxes assessed by local governments based on your property's value. Typically, lenders collect 
                  these monthly and hold them in an escrow account until they're due.
                </p>
                <p className="text-sm mt-2">
                  <strong>Average:</strong> 0.5-2.5% of home value annually, varies by location
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Homeowners Insurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Insurance that protects your home against damage and liability. Most lenders require this and 
                  collect the payments monthly to hold in escrow.
                </p>
                <p className="text-sm mt-2">
                  <strong>Average:</strong> $1,200-$1,500 annually for a $250,000 home
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mortgage Insurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  If your down payment is less than 20%, you'll likely pay private mortgage insurance (PMI) for conventional 
                  loans or mortgage insurance premium (MIP) for FHA loans.
                </p>
                <p className="text-sm mt-2">
                  <strong>Average:</strong> 0.5-1.5% of loan amount annually for PMI
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">HOA Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  If your property is in a homeowners association, you'll pay monthly or quarterly fees for communal 
                  amenities and services.
                </p>
                <p className="text-sm mt-2">
                  <strong>Average:</strong> $200-$400 monthly, varies widely by community
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">One-Time Closing Costs</h3>
          <p className="text-sm text-muted-foreground mb-3">In addition to your down payment, you'll pay various closing costs:</p>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Typical Cost</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Loan Origination Fee</TableCell>
                  <TableCell>0.5-1% of loan amount</TableCell>
                  <TableCell>Fee charged by the lender for processing your mortgage application</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Appraisal Fee</TableCell>
                  <TableCell>$300-$500</TableCell>
                  <TableCell>Cost for a professional to determine the home's market value</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Title Search & Insurance</TableCell>
                  <TableCell>$500-$1,500</TableCell>
                  <TableCell>Research to ensure clear property ownership and insurance against title issues</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Home Inspection</TableCell>
                  <TableCell>$300-$500</TableCell>
                  <TableCell>Professional examination of the home's condition and systems</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Survey Fee</TableCell>
                  <TableCell>$400-$600</TableCell>
                  <TableCell>Verification of property boundaries</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recording Fees</TableCell>
                  <TableCell>$25-$250</TableCell>
                  <TableCell>Government charges for recording the new deed and mortgage</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Transfer Taxes</TableCell>
                  <TableCell>Varies by location</TableCell>
                  <TableCell>Taxes imposed by state/local governments on property transfers</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Attorney Fees</TableCell>
                  <TableCell>$500-$1,500</TableCell>
                  <TableCell>Legal representation during the closing process (required in some states)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> In total, expect to pay about 2-5% of the home's purchase price in closing costs. 
              Some costs are negotiable, and you can ask the seller to pay some of these expenses in your purchase offer.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ];

  // FAQ content
  const faqs: FAQ[] = [
    {
      question: "How much house can I afford?",
      answer: (
        <p>
          Financial experts typically recommend that your monthly mortgage payment (including principal, interest, taxes, and insurance) should not exceed 28% of your gross monthly income. Additionally, your total debt payments (mortgage, car loans, student loans, credit cards, etc.) should not exceed 36% of your gross monthly income. Use our mortgage calculator to estimate payments based on your income and existing debts.
        </p>
      ),
      category: 'financial'
    },
    {
      question: "What credit score do I need for a mortgage?",
      answer: (
        <>
          <p>The minimum credit score requirement varies by loan type:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Conventional loans:</strong> Usually 620 or higher</li>
            <li><strong>FHA loans:</strong> 580 for a 3.5% down payment; 500-579 with a 10% down payment</li>
            <li><strong>VA loans:</strong> No official minimum, but lenders typically look for 580-620</li>
            <li><strong>USDA loans:</strong> Typically 640 or higher</li>
            <li><strong>Jumbo loans:</strong> Usually 700+</li>
          </ul>
          <p className="mt-2">However, higher scores will qualify you for better interest rates, potentially saving you thousands over the life of the loan.</p>
        </>
      ),
      category: 'qualification'
    },
    {
      question: "How much should I save for a down payment?",
      answer: (
        <>
          <p>The traditional recommendation is 20% of the purchase price, which allows you to avoid private mortgage insurance (PMI). However, many loan programs accept much lower down payments:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Conventional loans:</strong> As low as 3% for first-time homebuyers</li>
            <li><strong>FHA loans:</strong> 3.5% with a credit score of 580+</li>
            <li><strong>VA loans:</strong> 0% down payment for eligible veterans</li>
            <li><strong>USDA loans:</strong> 0% down payment for eligible rural properties</li>
          </ul>
          <p className="mt-2">Remember that a smaller down payment means a larger loan amount, higher monthly payments, and additional costs like PMI.</p>
        </>
      ),
      category: 'financial'
    },
    {
      question: "What's the difference between pre-qualification and pre-approval?",
      answer: (
        <>
          <p><strong>Pre-qualification</strong> is an informal process where you provide basic financial information to a lender, who then gives you an estimate of how much you might be able to borrow. This is a quick process based on self-reported information without verification.</p>
          <p className="mt-2"><strong>Pre-approval</strong> is a more rigorous process where the lender verifies your financial information (credit, income, assets, debts) and provides a conditional commitment to lend you up to a specific amount. This typically includes a hard credit inquiry and requires documentation.</p>
          <p className="mt-2">A pre-approval letter holds more weight when making an offer on a home because it shows sellers you're serious and financially capable.</p>
        </>
      ),
      category: 'process'
    },
    {
      question: "How long does it take to close on a mortgage?",
      answer: (
        <p>
          The average time to close on a mortgage is 30-45 days from application to closing, though it can vary based on several factors. Conventional loans typically close faster than government-backed loans (FHA, VA, USDA). The timeline can be affected by how quickly you provide requested documentation, the lender's current workload, appraisal scheduling, and any issues discovered during underwriting. To ensure a smooth process, respond promptly to requests for information, avoid making major financial changes (like opening new credit accounts), and stay in regular communication with your lender.
        </p>
      ),
      category: 'process'
    },
    {
      question: "Can I pay off my mortgage early?",
      answer: (
        <>
          <p>Yes, most mortgages can be paid off early, which can save you thousands in interest. Common strategies include:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Making extra principal payments</li>
            <li>Making bi-weekly instead of monthly payments</li>
            <li>Refinancing to a shorter term</li>
            <li>Applying windfalls (bonuses, tax refunds, inheritance) to the principal</li>
          </ul>
          <p className="mt-2">However, check if your mortgage has a prepayment penalty, which is a fee for paying off the loan early. These are less common now but still exist on some loans.</p>
        </>
      ),
      category: 'financial'
    },
    {
      question: "What is escrow and why do I need an escrow account?",
      answer: (
        <p>
          An escrow account is a third-party account set up by your lender to collect and pay certain property-related expenses on your behalf, typically property taxes and homeowners insurance. Each month, a portion of your mortgage payment goes into this account, and when these bills come due, the lender pays them from the escrow funds. This arrangement benefits both parties: it helps you budget by spreading these large expenses over monthly payments, and it protects the lender by ensuring these obligations are paid to maintain the property's value and coverage. Most lenders require an escrow account if your down payment is less than 20%.
        </p>
      ),
      category: 'general'
    },
    {
      question: "What happens if I miss a mortgage payment?",
      answer: (
        <>
          <p>Missing a mortgage payment can have serious consequences:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Grace period:</strong> Most mortgages have a 15-day grace period after the due date before a late fee is charged.</li>
            <li><strong>Late fee:</strong> If you pay within 30 days of the due date, you'll typically incur a late fee (often 4-5% of the payment).</li>
            <li><strong>Credit report:</strong> Payments over 30 days late are usually reported to credit bureaus, damaging your credit score.</li>
            <li><strong>Default:</strong> After 90-120 days of missed payments, you're typically considered in default.</li>
            <li><strong>Foreclosure:</strong> After default, the lender may begin foreclosure proceedings to take possession of the property.</li>
          </ul>
          <p className="mt-2">If you're struggling to make payments, contact your lender immediately to discuss options like forbearance, loan modification, or repayment plans.</p>
        </>
      ),
      category: 'financial'
    }
  ];

  // Glossary terms
  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "Amortization",
      definition: "The process of spreading out a loan into a series of fixed payments over time. Each payment is allocated between principal and interest.",
      category: "basic"
    },
    {
      term: "Annual Percentage Rate (APR)",
      definition: "The yearly cost of a mortgage, including interest and other loan-related fees, expressed as a percentage.",
      category: "financial"
    },
    {
      term: "Appraisal",
      definition: "A professional assessment of a home's market value, typically required by lenders before approving a mortgage.",
      category: "process"
    },
    {
      term: "Closing",
      definition: "The final step in the home buying process where documents are signed, funds are transferred, and the property changes ownership.",
      category: "process"
    },
    {
      term: "Closing Costs",
      definition: "Fees and expenses paid by both buyer and seller at the closing of a real estate transaction, typically 2-5% of the loan amount.",
      category: "financial"
    },
    {
      term: "Conventional Loan",
      definition: "A mortgage not backed by a government agency (like FHA, VA, or USDA), typically requiring higher credit scores and down payments.",
      category: "loan-types"
    },
    {
      term: "Debt-to-Income Ratio (DTI)",
      definition: "The percentage of your gross monthly income that goes toward paying debts, including your potential mortgage payment.",
      category: "financial"
    },
    {
      term: "Down Payment",
      definition: "An initial, upfront payment made when purchasing a home, expressed as a percentage of the total home price.",
      category: "basic"
    },
    {
      term: "Escrow",
      definition: "An account held by a third party to collect and pay certain property-related expenses, such as property taxes and insurance.",
      category: "financial"
    },
    {
      term: "Fixed-Rate Mortgage",
      definition: "A home loan with an interest rate that remains the same for the entire term of the loan.",
      category: "loan-types"
    },
    {
      term: "Adjustable-Rate Mortgage (ARM)",
      definition: "A home loan with an interest rate that can change periodically based on a specific financial index.",
      category: "loan-types"
    },
    {
      term: "FHA Loan",
      definition: "A mortgage insured by the Federal Housing Administration, designed for lower-income borrowers with lower minimum down payments and credit scores.",
      category: "loan-types"
    },
    {
      term: "VA Loan",
      definition: "A mortgage guaranteed by the Department of Veterans Affairs for eligible veterans, active-duty service members, and surviving spouses.",
      category: "loan-types"
    },
    {
      term: "USDA Loan",
      definition: "A mortgage program for rural and suburban homebuyers, administered by the U.S. Department of Agriculture.",
      category: "loan-types"
    },
    {
      term: "Jumbo Loan",
      definition: "A mortgage that exceeds the conforming loan limits set by the Federal Housing Finance Agency, typically used for high-value properties.",
      category: "loan-types"
    },
    {
      term: "Loan-to-Value Ratio (LTV)",
      definition: "The ratio of the loan amount to the appraised value of the property, expressed as a percentage.",
      category: "financial"
    },
    {
      term: "Principal",
      definition: "The original amount borrowed in a mortgage, excluding interest and other fees.",
      category: "basic"
    },
    {
      term: "Private Mortgage Insurance (PMI)",
      definition: "Insurance required by lenders when a conventional loan's down payment is less than 20%, protecting the lender if the borrower defaults.",
      category: "financial"
    },
    {
      term: "Points",
      definition: "Fees paid to the lender at closing in exchange for a reduced interest rate; one point equals 1% of the loan amount.",
      category: "financial"
    },
    {
      term: "Pre-approval",
      definition: "A conditional commitment from a lender for a specific loan amount based on verification of financial information.",
      category: "process"
    },
    {
      term: "Refinance",
      definition: "The process of replacing an existing mortgage with a new one, typically to secure a lower interest rate or change the loan term.",
      category: "process"
    },
    {
      term: "Underwriting",
      definition: "The process by which a lender evaluates the risk of lending money and determines if the loan application meets their requirements.",
      category: "process"
    }
  ];

  // Filtered FAQs based on category
  const filteredFAQs = faqFilter === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === faqFilter);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Mortgage Education
          </h2>
          <p className="text-green-100">
            Essential guides and resources for understanding the mortgage process
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-green-700">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="guides" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learning</span> Guides
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge</span> Quiz
            </TabsTrigger>
            <TabsTrigger value="glossary" className="flex items-center gap-1">
              <School className="h-4 w-4" />
              Glossary
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>
          
          {/* Learning Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            {selectedGuide ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBackToGuides}
                  className="mb-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Guides
                </Button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    {selectedGuide.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedGuide.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedGuide.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="h-3 w-3 mr-1" /> {selectedGuide.estimatedTime}
                  </Badge>
                  <Badge variant="outline" className={
                    selectedGuide.difficulty === 'beginner' 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : selectedGuide.difficulty === 'intermediate'
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }>
                    <Award className="h-3 w-3 mr-1" /> 
                    {selectedGuide.difficulty.charAt(0).toUpperCase() + selectedGuide.difficulty.slice(1)}
                  </Badge>
                </div>
                
                <Card className="border-green-100">
                  <CardContent className="pt-6">
                    {selectedGuide.content}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mortgageGuides.map((guide) => (
                  <Card 
                    key={guide.id} 
                    className="border-green-100 hover:border-green-300 cursor-pointer transition-all"
                    onClick={() => handleGuideSelect(guide.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          {guide.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground">{guide.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              <Clock className="h-3 w-3 mr-1" /> {guide.estimatedTime}
                            </Badge>
                            <Badge variant="outline" className={
                              guide.difficulty === 'beginner' 
                                ? "bg-green-50 text-green-700 border-green-200 text-xs" 
                                : guide.difficulty === 'intermediate'
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                                  : "bg-red-50 text-red-700 border-red-200 text-xs"
                            }>
                              <Award className="h-3 w-3 mr-1" /> 
                              {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <Card className="border-green-100">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  Mortgage Knowledge Quiz
                </CardTitle>
                <CardDescription>
                  Test your understanding of mortgage concepts with this 5-question quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <QuizComponent 
                  questions={mortgageQuizQuestions}
                  pathwayId="finance-fundamentals"
                  moduleId="mortgage-basics"
                  onComplete={(score, total) => {
                    console.log(`Quiz completed with score ${score}/${total}`);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Glossary Tab */}
          <TabsContent value="glossary" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={glossaryFilter === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setGlossaryFilter('all')}
                className={glossaryFilter === 'all' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                All Terms
              </Button>
              <Button
                variant={glossaryFilter === 'basic' ? "default" : "outline"}
                size="sm"
                onClick={() => setGlossaryFilter('basic')}
                className={glossaryFilter === 'basic' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Basic Concepts
              </Button>
              <Button
                variant={glossaryFilter === 'loan-types' ? "default" : "outline"}
                size="sm"
                onClick={() => setGlossaryFilter('loan-types')}
                className={glossaryFilter === 'loan-types' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Loan Types
              </Button>
              <Button
                variant={glossaryFilter === 'financial' ? "default" : "outline"}
                size="sm"
                onClick={() => setGlossaryFilter('financial')}
                className={glossaryFilter === 'financial' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Financial Terms
              </Button>
              <Button
                variant={glossaryFilter === 'process' ? "default" : "outline"}
                size="sm"
                onClick={() => setGlossaryFilter('process')}
                className={glossaryFilter === 'process' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Mortgage Process
              </Button>
            </div>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-green-600" />
                  Mortgage Glossary
                </CardTitle>
                <CardDescription>
                  {filteredTerms.length} terms in the {glossaryFilter === 'all' ? 'complete' : glossaryFilter} glossary
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {filteredTerms.map((item) => (
                    <div key={item.term} className="pb-4 border-b border-gray-100 last:border-0">
                      <h3 className="font-semibold">{item.term}</h3>
                      <p className="text-sm text-gray-700 mt-1">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={faqFilter === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setFaqFilter('all')}
                className={faqFilter === 'all' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                All Questions
              </Button>
              <Button
                variant={faqFilter === 'general' ? "default" : "outline"}
                size="sm"
                onClick={() => setFaqFilter('general')}
                className={faqFilter === 'general' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                General Questions
              </Button>
              <Button
                variant={faqFilter === 'qualification' ? "default" : "outline"}
                size="sm"
                onClick={() => setFaqFilter('qualification')}
                className={faqFilter === 'qualification' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Qualification
              </Button>
              <Button
                variant={faqFilter === 'process' ? "default" : "outline"}
                size="sm"
                onClick={() => setFaqFilter('process')}
                className={faqFilter === 'process' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Mortgage Process
              </Button>
              <Button
                variant={faqFilter === 'financial' ? "default" : "outline"}
                size="sm"
                onClick={() => setFaqFilter('financial')}
                className={faqFilter === 'financial' ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Financial Questions
              </Button>
            </div>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-600" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about mortgages and home buying
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 text-gray-700">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MortgageEducationFullscreen;