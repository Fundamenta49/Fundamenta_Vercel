import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, DollarSign, Briefcase, Home, FileText, ScrollText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

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

// Default state to show first
const DEFAULT_STATE = "CA";

export default function TaxInformationPopOut() {
  const [selectedState, setSelectedState] = useState<string>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Sort states alphabetically by name for the dropdown
  const sortedStates = Object.entries(STATE_TAX_DATA)
    .sort(([, a], [, b]) => a.name.localeCompare(b.name))
    .map(([code]) => code);

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
          onValueChange={(value) => setSelectedState(value)}
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
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Tax Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Taxes</TabsTrigger>
          <TabsTrigger value="business">Business Taxes</TabsTrigger>
          <TabsTrigger value="learn">Learn More</TabsTrigger>
        </TabsList>

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
                      <p className="mb-3">In {STATE_TAX_DATA[selectedState].name}, the tax filing deadline is typically {STATE_TAX_DATA[selectedState].filingDeadline}.</p>
                      
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
        
        {/* Learn More Tab */}
        <TabsContent value="learn" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tax Education Resources</CardTitle>
              <CardDescription>
                Additional resources to enhance your tax knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Official Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <Button variant="link" className="p-0 h-auto text-left font-normal justify-start" onClick={() => window.open("https://www.irs.gov", "_blank")}>
                        Internal Revenue Service (IRS)
                      </Button>
                      <p className="text-sm text-gray-500">Federal tax information and forms</p>
                    </li>
                    <li>
                      <Button variant="link" className="p-0 h-auto text-left font-normal justify-start">
                        {STATE_TAX_DATA[selectedState].name} Department of Revenue
                      </Button>
                      <p className="text-sm text-gray-500">State-specific tax information</p>
                    </li>
                    <li>
                      <Button variant="link" className="p-0 h-auto text-left font-normal justify-start" onClick={() => window.open("https://www.usa.gov/taxes", "_blank")}>
                        USA.gov Tax Information
                      </Button>
                      <p className="text-sm text-gray-500">Government tax resources</p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Tax Concepts to Learn</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-800">1</div>
                      <div>
                        <h4 className="font-medium">Progressive Taxation</h4>
                        <p className="text-sm text-gray-600">How tax brackets work and why your entire income isn't taxed at your highest rate</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-800">2</div>
                      <div>
                        <h4 className="font-medium">Tax Credits vs. Deductions</h4>
                        <p className="text-sm text-gray-600">Understanding the difference and which provides more benefit</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-800">3</div>
                      <div>
                        <h4 className="font-medium">Tax-Advantaged Accounts</h4>
                        <p className="text-sm text-gray-600">How 401(k)s, IRAs, HSAs, and other accounts provide tax benefits</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Common Tax Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="q1">
                    <AccordionTrigger>What's the difference between marginal and effective tax rates?</AccordionTrigger>
                    <AccordionContent>
                      <p><strong>Marginal tax rate</strong> is the rate applied to your last dollar of income (your tax bracket).</p>
                      <p className="mt-2"><strong>Effective tax rate</strong> is your total tax paid divided by your total income, usually much lower than your marginal rate due to progressive taxation.</p>
                      <p className="mt-2">Example: Someone in the 22% federal tax bracket might have an effective federal tax rate of only 15% when accounting for lower rates on earlier portions of income.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="q2">
                    <AccordionTrigger>How do tax deductions actually save me money?</AccordionTrigger>
                    <AccordionContent>
                      <p>Tax deductions reduce your taxable income, not your tax directly.</p>
                      <p className="mt-2">A $1,000 deduction saves you:
                      <ul className="list-disc pl-5 mt-1">
                        <li>$220 if you're in the 22% tax bracket</li>
                        <li>$320 if you're in the 32% tax bracket</li>
                      </ul>
                      </p>
                      <p className="mt-2">The higher your tax bracket, the more valuable deductions become.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="q3">
                    <AccordionTrigger>What taxes do self-employed people pay?</AccordionTrigger>
                    <AccordionContent>
                      <p>Self-employed individuals pay:</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Income tax (same brackets as employees)</li>
                        <li>Self-employment tax (15.3% covering both employer and employee portions of Social Security and Medicare)</li>
                        <li>Estimated quarterly tax payments</li>
                        <li>State income taxes</li>
                        <li>Local business taxes where applicable</li>
                      </ul>
                      <p className="mt-2">But they can deduct business expenses and 50% of the self-employment tax.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}