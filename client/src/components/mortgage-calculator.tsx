import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

export default function MortgageCalculator() {
  // User inputs
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [propertyTax, setPropertyTax] = useState<number>(1.2);
  const [homeInsurance, setHomeInsurance] = useState<number>(1200);
  const [pmi, setPmi] = useState<number>(0.5);
  const [hoa, setHoa] = useState<number>(0);
  
  // Define types for our calculation data
  interface AmortizationData {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }

  interface PaymentBreakdown {
    name: string;
    value: number;
  }

  // Calculation results
  const [calculations, setCalculations] = useState({
    loanAmount: 0,
    monthlyPrincipalAndInterest: 0,
    monthlyPropertyTax: 0,
    monthlyHomeInsurance: 0,
    monthlyPMI: 0,
    monthlyHOA: 0,
    totalMonthlyPayment: 0,
    totalPaymentLifetime: 0,
    totalInterestPaid: 0,
    isPMIRequired: false,
    amortizationSchedule: [] as AmortizationData[],
    paymentBreakdown: [] as PaymentBreakdown[],
  });
  
  // Update down payment % when down payment amount changes
  useEffect(() => {
    if (homePrice > 0) {
      const percent = (downPayment / homePrice) * 100;
      setDownPaymentPercent(parseFloat(percent.toFixed(1)));
    }
  }, [downPayment, homePrice]);
  
  // Update down payment amount when down payment % changes
  useEffect(() => {
    const amount = (homePrice * downPaymentPercent) / 100;
    setDownPayment(Math.round(amount));
  }, [downPaymentPercent, homePrice]);
  
  // Calculate mortgage details when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, loanTerm, interestRate, propertyTax, homeInsurance, pmi, hoa]);
  
  const calculateMortgage = () => {
    // Calculate loan amount
    const loanAmount = homePrice - downPayment;
    
    // Determine if PMI is required (typically for down payments < 20%)
    const isPMIRequired = (downPayment / homePrice) < 0.2;
    
    // Calculate monthly principal and interest payment
    // M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPrincipalAndInterest = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Calculate other monthly costs
    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyPMI = isPMIRequired ? (loanAmount * (pmi / 100)) / 12 : 0;
    const monthlyHOA = hoa;
    
    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + 
      monthlyHomeInsurance + monthlyPMI + monthlyHOA;
    
    // Calculate total payment over the life of the loan
    const totalPaymentLifetime = totalMonthlyPayment * numberOfPayments;
    
    // Calculate total interest paid
    const totalInterestPaid = (monthlyPrincipalAndInterest * numberOfPayments) - loanAmount;
    
    // Generate amortization schedule for the first 5 years
    const amortizationSchedule: AmortizationData[] = [];
    let remainingLoan = loanAmount;
    
    for (let year = 1; year <= Math.min(5, loanTerm); year++) {
      let annualPrincipal = 0;
      let annualInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interest = remainingLoan * monthlyInterestRate;
        const principal = monthlyPrincipalAndInterest - interest;
        
        annualPrincipal += principal;
        annualInterest += interest;
        remainingLoan -= principal;
      }
      
      amortizationSchedule.push({
        year,
        principal: Math.round(annualPrincipal),
        interest: Math.round(annualInterest),
        balance: Math.round(remainingLoan),
      });
    }
    
    // Generate payment breakdown for pie chart
    const paymentBreakdown: PaymentBreakdown[] = [
      { name: "Principal & Interest", value: monthlyPrincipalAndInterest },
      { name: "Property Tax", value: monthlyPropertyTax },
      { name: "Home Insurance", value: monthlyHomeInsurance },
    ];
    
    if (isPMIRequired) {
      paymentBreakdown.push({ name: "PMI", value: monthlyPMI });
    }
    
    if (monthlyHOA > 0) {
      paymentBreakdown.push({ name: "HOA", value: monthlyHOA });
    }
    
    setCalculations({
      loanAmount,
      monthlyPrincipalAndInterest,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthlyPayment,
      totalPaymentLifetime,
      totalInterestPaid,
      isPMIRequired,
      amortizationSchedule,
      paymentBreakdown,
    });
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="calculator">Mortgage Calculator</TabsTrigger>
          <TabsTrigger value="amortization">Amortization</TabsTrigger>
          <TabsTrigger value="homebuying">Home Buying Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Home Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="home-price">Home Price</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$100k</span>
                      <Slider
                        id="home-price"
                        min={100000}
                        max={1000000}
                        step={5000}
                        value={[homePrice]}
                        onValueChange={(value) => setHomePrice(value[0])}
                      />
                      <span className="text-sm">$1M</span>
                    </div>
                    <Input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="down-payment">Down Payment</Label>
                      <Input
                        id="down-payment"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="down-payment-percent">Down Payment %</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="down-payment-percent"
                          min={0}
                          max={50}
                          step={0.5}
                          value={[downPaymentPercent]}
                          onValueChange={(value) => setDownPaymentPercent(value[0])}
                        />
                        <span className="w-12 text-right">{downPaymentPercent}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term (Years)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="loan-term"
                        min={5}
                        max={30}
                        step={5}
                        value={[loanTerm]}
                        onValueChange={(value) => setLoanTerm(value[0])}
                      />
                      <span className="w-12 text-right">{loanTerm}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Interest & Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="interest-rate"
                        min={2}
                        max={10}
                        step={0.125}
                        value={[interestRate]}
                        onValueChange={(value) => setInterestRate(value[0])}
                      />
                      <span className="w-12 text-right">{interestRate}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property-tax">Property Tax (%)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="property-tax"
                          min={0}
                          max={5}
                          step={0.1}
                          value={[propertyTax]}
                          onValueChange={(value) => setPropertyTax(value[0])}
                        />
                        <span className="w-12 text-right">{propertyTax}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="home-insurance">Home Insurance ($/yr)</Label>
                      <Input
                        id="home-insurance"
                        type="number"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pmi">PMI Rate (%)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="pmi"
                          min={0.1}
                          max={2}
                          step={0.1}
                          value={[pmi]}
                          onValueChange={(value) => setPmi(value[0])}
                          disabled={!calculations.isPMIRequired}
                        />
                        <span className="w-12 text-right">{pmi}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hoa">HOA Fees ($/month)</Label>
                      <Input
                        id="hoa"
                        type="number"
                        value={hoa}
                        onChange={(e) => setHoa(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-center mb-1">
                      {formatCurrency(calculations.totalMonthlyPayment)}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </h3>
                    <p className="text-center text-sm text-gray-500">
                      Loan Amount: {formatCurrency(calculations.loanAmount)}
                    </p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={calculations.paymentBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {calculations.paymentBreakdown.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                index === 0 ? "#8884d8" : 
                                index === 1 ? "#82ca9d" : 
                                index === 2 ? "#ffc658" : 
                                index === 3 ? "#ff8042" : 
                                "#8dd1e1"
                              } 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`$${Math.round(value).toLocaleString()}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <ul className="space-y-2 mt-4">
                    <li className="flex justify-between">
                      <span>Principal & Interest:</span>
                      <span className="font-medium">{formatCurrency(calculations.monthlyPrincipalAndInterest)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Property Tax:</span>
                      <span className="font-medium">{formatCurrency(calculations.monthlyPropertyTax)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Home Insurance:</span>
                      <span className="font-medium">{formatCurrency(calculations.monthlyHomeInsurance)}</span>
                    </li>
                    {calculations.isPMIRequired && (
                      <li className="flex justify-between">
                        <span>PMI:</span>
                        <span className="font-medium">{formatCurrency(calculations.monthlyPMI)}</span>
                      </li>
                    )}
                    {calculations.monthlyHOA > 0 && (
                      <li className="flex justify-between">
                        <span>HOA Fees:</span>
                        <span className="font-medium">{formatCurrency(calculations.monthlyHOA)}</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Loan Amount</p>
                      <p className="text-lg font-medium">{formatCurrency(calculations.loanAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loan Term</p>
                      <p className="text-lg font-medium">{loanTerm} years</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Interest Paid</p>
                      <p className="text-lg font-medium">{formatCurrency(calculations.totalInterestPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Payments</p>
                      <p className="text-lg font-medium">{formatCurrency(calculations.totalPaymentLifetime)}</p>
                    </div>
                  </div>
                  
                  {calculations.isPMIRequired && (
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                      <p className="text-sm text-amber-700">
                        PMI is required because your down payment is less than 20% of the home price.
                        You can typically remove PMI once you reach 20% equity in your home.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="amortization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-500">
                This shows how your payments are applied to the principal and interest over the first 5 years of your loan.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calculations.amortizationSchedule.map((row) => (
                      <tr key={row.year}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{row.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(row.principal)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(row.interest)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={calculations.amortizationSchedule}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="principal" name="Principal Paid" fill="#82ca9d" />
                    <Bar dataKey="interest" name="Interest Paid" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={calculations.amortizationSchedule}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" name="Remaining Balance" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="homebuying" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Buying Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg">1. Prepare Your Finances</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Review your credit score and report</li>
                    <li>Determine how much you can afford</li>
                    <li>Save for a down payment (aim for 20% to avoid PMI)</li>
                    <li>Get pre-approved for a mortgage</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg">2. House Hunting</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Define your needs vs. wants in a home</li>
                    <li>Consider location, school districts, commute, etc.</li>
                    <li>Work with a real estate agent</li>
                    <li>Visit multiple properties and neighborhoods</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-semibold text-lg">3. Making an Offer</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Research comparable home prices in the area</li>
                    <li>Determine your offer price and contingencies</li>
                    <li>Submit your offer through your real estate agent</li>
                    <li>Negotiate if necessary</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg">4. Closing Process</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Complete a home inspection</li>
                    <li>Review all closing documents</li>
                    <li>Secure your financing with your lender</li>
                    <li>Pay closing costs and sign final paperwork</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Types of Mortgages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Conventional Loans</h3>
                    <p className="text-sm mt-1">
                      Not insured by the federal government. Typically require good credit
                      and at least 3% down payment. Can be conforming or non-conforming.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">FHA Loans</h3>
                    <p className="text-sm mt-1">
                      Insured by the Federal Housing Administration. Lower down payment requirements
                      (minimum 3.5%) and more flexible credit requirements than conventional loans.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">VA Loans</h3>
                    <p className="text-sm mt-1">
                      Guaranteed by the Department of Veterans Affairs. Available to eligible
                      veterans and service members with no down payment requirement.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">USDA Loans</h3>
                    <p className="text-sm mt-1">
                      Backed by the Department of Agriculture. Available for homes in eligible
                      rural areas with no down payment requirement for qualified buyers.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Fixed vs. Adjustable Rate</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Fixed Rate Mortgage</h4>
                    <p className="text-sm mt-1">
                      Interest rate remains the same for the entire term of the loan,
                      providing predictable monthly payments.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">Adjustable Rate Mortgage (ARM)</h4>
                    <p className="text-sm mt-1">
                      Interest rate may change periodically, often starting lower than
                      fixed rates but potentially increasing over time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>First-Time Homebuyer Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Down Payment Assistance Programs</h3>
                  <p className="text-sm mt-1">
                    Many states and local governments offer grants or low-interest loans
                    to help first-time buyers with down payments and closing costs.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Find Programs in Your Area
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-semibold">Homebuyer Education Courses</h3>
                  <p className="text-sm mt-1">
                    Many lenders and assistance programs require completion of a
                    homebuyer education course, which can provide valuable information.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Find Homebuyer Courses
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-semibold">Tax Benefits of Homeownership</h3>
                  <p className="text-sm mt-1">
                    Homeowners may qualify for tax deductions on mortgage interest,
                    property taxes, and more. Consult a tax professional for advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}