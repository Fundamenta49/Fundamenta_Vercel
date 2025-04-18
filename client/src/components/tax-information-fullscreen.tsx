import { useState, useEffect } from "react";
import { Receipt, AlertCircle, X, FileText, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

interface TaxInformationFullscreenProps {
  onClose: () => void;
}

export default function TaxInformationFullscreen({ 
  onClose 
}: TaxInformationFullscreenProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("federal");
  const [selectedState, setSelectedState] = useState("ny");
  const [searchQuery, setSearchQuery] = useState("");

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

  const federalTaxRates = [
    { bracket: "10%", single: "$0 - $10,275", joint: "$0 - $20,550" },
    { bracket: "12%", single: "$10,276 - $41,775", joint: "$20,551 - $83,550" },
    { bracket: "22%", single: "$41,776 - $89,075", joint: "$83,551 - $178,150" },
    { bracket: "24%", single: "$89,076 - $170,050", joint: "$178,151 - $340,100" },
    { bracket: "32%", single: "$170,051 - $215,950", joint: "$340,101 - $431,900" },
    { bracket: "35%", single: "$215,951 - $539,900", joint: "$431,901 - $647,850" },
    { bracket: "37%", single: "Over $539,900", joint: "Over $647,850" },
  ];

  const stateTaxInfo: Record<string, any> = {
    ny: {
      name: "New York",
      hasIncomeTax: true,
      incomeTaxRates: [
        { rate: "4%", range: "$0 - $8,500" },
        { rate: "4.5%", range: "$8,501 - $11,700" },
        { rate: "5.25%", range: "$11,701 - $13,900" },
        { rate: "5.9%", range: "$13,901 - $80,650" },
        { rate: "6.09%", range: "$80,651 - $215,400" },
        { rate: "6.41%", range: "$215,401 - $1,077,550" },
        { rate: "6.85%", range: "$1,077,551 - $5,000,000" },
        { rate: "9.65%", range: "$5,000,001 - $25,000,000" },
        { rate: "10.3%", range: "Over $25,000,000" },
      ],
      salesTax: "4% state, local varies from 3% to 4.5%",
      propertyTax: "Local rates vary, median effective rate of 1.23%",
      deadlines: {
        incomeTax: "April 15",
        extensions: "October 15 with extension",
        estimatedTaxes: "April 15, June 15, September 15, and January 15",
      },
      specialNotes: [
        "New York City residents pay additional income tax of 3.078% to 3.876%",
        "Standard deduction is $8,000 for single filers",
        "STAR program provides school tax relief for homeowners",
      ],
    },
    ca: {
      name: "California",
      hasIncomeTax: true,
      incomeTaxRates: [
        { rate: "1%", range: "$0 - $9,325" },
        { rate: "2%", range: "$9,326 - $22,107" },
        { rate: "4%", range: "$22,108 - $34,892" },
        { rate: "6%", range: "$34,893 - $48,435" },
        { rate: "8%", range: "$48,436 - $61,214" },
        { rate: "9.3%", range: "$61,215 - $312,686" },
        { rate: "10.3%", range: "$312,687 - $375,221" },
        { rate: "11.3%", range: "$375,222 - $625,369" },
        { rate: "12.3%", range: "Over $625,370" },
      ],
      salesTax: "7.25% state minimum, total can reach 10.75% with local taxes",
      propertyTax: "Limited to 1% of purchase price with max 2% annual increase",
      deadlines: {
        incomeTax: "April 15",
        extensions: "October 15 with extension",
        estimatedTaxes: "April 15, June 15, September 15, and January 15",
      },
      specialNotes: [
        "No tax on Social Security income",
        "Property taxes limited by Proposition 13",
        "Mental Health Services Tax adds 1% tax on income over $1 million",
      ],
    },
    tx: {
      name: "Texas",
      hasIncomeTax: false,
      incomeTaxRates: [],
      salesTax: "6.25% state, up to 2% local for max 8.25%",
      propertyTax: "No state property tax, but local rates are among highest nationally",
      deadlines: {
        salesTax: "20th of each month for monthly filers",
      },
      specialNotes: [
        "No state income tax",
        "Heavy reliance on property and sales taxes",
        "Business franchise tax of 0.5% to 1% on taxable margin",
      ],
    },
    fl: {
      name: "Florida",
      hasIncomeTax: false,
      incomeTaxRates: [],
      salesTax: "6% state, up to 2% local",
      propertyTax: "Average effective property tax rate is 0.83%",
      deadlines: {
        salesTax: "20th of each month for monthly filers",
      },
      specialNotes: [
        "No state income tax",
        "Homestead exemption of up to $50,000 for primary residences",
        "Save Our Homes amendment caps annual assessment increases at 3%",
      ],
    },
  };

  // List of common tax forms
  const taxForms = [
    { id: "1040", name: "Form 1040: U.S. Individual Income Tax Return", description: "The standard federal income tax form used by most individuals." },
    { id: "1040a", name: "Form 1040-SR: U.S. Tax Return for Seniors", description: "A simplified version of Form 1040 for taxpayers age 65 or older." },
    { id: "w2", name: "Form W-2: Wage and Tax Statement", description: "Shows the income and taxes withheld from your pay for the year." },
    { id: "w4", name: "Form W-4: Employee's Withholding Certificate", description: "Used to determine the amount of federal income tax to withhold from your pay." },
    { id: "1099", name: "Form 1099 Series", description: "Various forms reporting different types of income other than wages." },
    { id: "1099-misc", name: "Form 1099-MISC: Miscellaneous Income", description: "Reports payments to independent contractors and other miscellaneous income." },
    { id: "1099-int", name: "Form 1099-INT: Interest Income", description: "Reports interest income earned from banks and investments." },
    { id: "1099-div", name: "Form 1099-DIV: Dividends and Distributions", description: "Reports dividend income and capital gain distributions from investments." },
    { id: "8829", name: "Form 8829: Expenses for Business Use of Your Home", description: "Used to figure the allowable expenses for business use of your home." },
    { id: "schedule-c", name: "Schedule C: Profit or Loss From Business", description: "Used to report income from self-employment or small business." },
    { id: "schedule-a", name: "Schedule A: Itemized Deductions", description: "Used to claim various deductions like medical expenses, taxes, and charitable contributions." },
    { id: "schedule-b", name: "Schedule B: Interest and Ordinary Dividends", description: "Used to report interest and dividend income over a certain threshold." },
  ];

  const taxDeadlines = [
    { date: "January 15", description: "4th quarter estimated tax payment deadline for the previous year" },
    { date: "January 31", description: "Deadline for employers to send W-2 forms and 1099 forms" },
    { date: "April 15", description: "Federal tax return filing deadline and 1st quarter estimated tax payment for current year" },
    { date: "June 15", description: "2nd quarter estimated tax payment deadline" },
    { date: "September 15", description: "3rd quarter estimated tax payment deadline" },
    { date: "October 15", description: "Extended federal tax return filing deadline" },
    { date: "December 31", description: "Deadline for most tax-saving moves for the current tax year" },
  ];

  const stateTaxContent = () => {
    const stateInfo = stateTaxInfo[selectedState] || stateTaxInfo.ny;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{stateInfo.name} Tax Information</CardTitle>
            <CardDescription>
              Overview of tax rates and regulations specific to {stateInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Income Tax</h3>
              {stateInfo.hasIncomeTax ? (
                <div>
                  <p className="mb-2">State income tax rates:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {stateInfo.incomeTaxRates.map((rate: { rate: string; range: string }, index: number) => (
                      <li key={index}>
                        {rate.rate} on income {rate.range}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>{stateInfo.name} does not have a state income tax.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sales Tax</h3>
              <p>{stateInfo.salesTax}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Property Tax</h3>
              <p>{stateInfo.propertyTax}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Important Deadlines</h3>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(stateInfo.deadlines).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</span>: {value as React.ReactNode}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Special Considerations</h3>
              <ul className="list-disc pl-5 space-y-1">
                {stateInfo.specialNotes.map((note: string, index: number) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const filteredForms = taxForms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-indigo-500" />
            Tax Information
          </h2>
          <p className="text-sm text-gray-500">
            Learn about federal and state tax requirements
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800 text-sm">
            This information is for educational purposes only and should not be considered tax advice. Consult with a tax professional for your specific situation.
          </AlertDescription>
        </Alert>
        
        <Tabs
          defaultValue="federal"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="federal">Federal Taxes</TabsTrigger>
            <TabsTrigger value="state">State Taxes</TabsTrigger>
            <TabsTrigger value="forms">Tax Forms</TabsTrigger>
            <TabsTrigger value="deadlines">Tax Deadlines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="federal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Federal Income Tax Brackets</CardTitle>
                <CardDescription>
                  The U.S. uses a progressive tax system, which means tax rates increase as income increases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 border">Tax Rate</th>
                        <th className="text-left p-3 border">Single Filers</th>
                        <th className="text-left p-3 border">Married Filing Jointly</th>
                      </tr>
                    </thead>
                    <tbody>
                      {federalTaxRates.map((rate, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-3 border font-medium">{rate.bracket}</td>
                          <td className="p-3 border">{rate.single}</td>
                          <td className="p-3 border">{rate.joint}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Federal Tax Deductions and Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="deductions">
                    <AccordionTrigger>Standard Deduction vs. Itemized Deductions</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">You can either take the standard deduction or itemize deductions, whichever gives you the greater tax benefit.</p>
                      <p className="font-medium mt-3">Standard Deduction (2023):</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Single: $13,850</li>
                        <li>Married Filing Jointly: $27,700</li>
                        <li>Head of Household: $20,800</li>
                      </ul>
                      <p className="font-medium mt-3">Common Itemized Deductions:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Medical expenses (exceeding 7.5% of AGI)</li>
                        <li>State and local taxes (up to $10,000)</li>
                        <li>Mortgage interest</li>
                        <li>Charitable contributions</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tax-credits">
                    <AccordionTrigger>Popular Tax Credits</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Tax credits directly reduce your tax bill and can sometimes result in a refund.</p>
                      <ul className="list-disc pl-5 space-y-3 mt-2">
                        <li>
                          <span className="font-medium">Earned Income Tax Credit (EITC)</span>
                          <p className="text-sm mt-1">A refundable tax credit for low to moderate income workers.</p>
                        </li>
                        <li>
                          <span className="font-medium">Child Tax Credit</span>
                          <p className="text-sm mt-1">Credit of up to $2,000 per qualifying child under age 17.</p>
                        </li>
                        <li>
                          <span className="font-medium">Child and Dependent Care Credit</span>
                          <p className="text-sm mt-1">Credit for expenses related to care for a child or dependent.</p>
                        </li>
                        <li>
                          <span className="font-medium">American Opportunity Tax Credit</span>
                          <p className="text-sm mt-1">Credit of up to $2,500 per eligible student for qualified education expenses.</p>
                        </li>
                        <li>
                          <span className="font-medium">Lifetime Learning Credit</span>
                          <p className="text-sm mt-1">Credit of up to $2,000 per tax return for qualified education expenses.</p>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="retirement">
                    <AccordionTrigger>Retirement Account Tax Benefits</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-3">
                        <li>
                          <span className="font-medium">Traditional IRA & 401(k)</span>
                          <p className="text-sm mt-1">Contributions are tax-deductible, reducing your current taxable income. Withdrawals during retirement are taxed as ordinary income.</p>
                        </li>
                        <li>
                          <span className="font-medium">Roth IRA & Roth 401(k)</span>
                          <p className="text-sm mt-1">Contributions are made with after-tax dollars. Qualified withdrawals during retirement are tax-free.</p>
                        </li>
                        <li>
                          <span className="font-medium">Contribution Limits (2023)</span>
                          <p className="text-sm mt-1">401(k): $22,500 ($30,000 if age 50+)<br />IRA: $6,500 ($7,500 if age 50+)</p>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="state" className="space-y-6">
            <div className="mb-6">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>{state.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {stateTaxContent()}
          </TabsContent>
          
          <TabsContent value="forms" className="space-y-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10" 
                  placeholder="Search tax forms..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredForms.map((form) => (
                <Card key={form.id} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{form.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{form.description}</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        View Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredForms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No forms match your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deadlines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  Key Tax Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {taxDeadlines.map((deadline, index) => (
                    <li key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="rounded-md min-w-[80px] px-2 py-1 bg-red-100 text-red-800 text-center font-medium">
                        {deadline.date}
                      </div>
                      <div>
                        <p>{deadline.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                When a tax deadline falls on a weekend or holiday, it typically moves to the next business day.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
        
        {/* Add a more prominent close button at the bottom */}
        <div className="flex justify-center mt-8 mb-4">
          <Button 
            onClick={onClose} 
            className="tax-close-btn px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md flex items-center gap-2"
            size="lg"
            style={{ zIndex: 999999 }}
          >
            <X className="h-5 w-5" />
            Close Tax Information
          </Button>
        </div>
      </div>
    </div>
  );
}