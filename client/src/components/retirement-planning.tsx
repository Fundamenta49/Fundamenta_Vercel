import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

export default function RetirementPlanning() {
  // User inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [annualContribution, setAnnualContribution] = useState<number>(6000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [desiredIncome, setDesiredIncome] = useState<number>(60000);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  
  // Define the types for our projection data
  interface ProjectionData {
    age: number;
    savings: number;
    contribution: number;
    interest: number;
  }

  interface WithdrawalData {
    age: number;
    savings: number;
    withdrawal: number;
  }
  
  // Calculation results
  const [retirementResults, setRetirementResults] = useState({
    futureValue: 0,
    yearsToRetirement: 0,
    yearsInRetirement: 0,
    monthlyIncomeInRetirement: 0,
    inflationAdjustedMonthlyIncome: 0,
    savingsGap: 0,
    additionalMonthlySavingsNeeded: 0,
    projectedSavingsData: [] as ProjectionData[],
    withdrawalData: [] as WithdrawalData[],
  });
  
  // Calculate retirement projections when inputs change
  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, currentSavings, annualContribution, expectedReturn, inflationRate, desiredIncome, lifeExpectancy]);
  
  const calculateRetirement = () => {
    // Basic calculations
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Future value calculation with compound interest
    let futureValue = currentSavings;
    const realRate = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    
    // Generate projection data for chart
    const projectedSavingsData: ProjectionData[] = [];
    for (let year = 0; year <= yearsToRetirement; year++) {
      if (year > 0) {
        futureValue = futureValue * (1 + expectedReturn / 100) + annualContribution;
      }
      
      projectedSavingsData.push({
        age: currentAge + year,
        savings: Math.round(futureValue),
        contribution: year === 0 ? 0 : Math.round(annualContribution),
        interest: year === 0 ? 0 : Math.round(futureValue - (projectedSavingsData[year - 1].savings * (1 + expectedReturn / 100) + annualContribution)),
      });
    }
    
    // Calculate withdrawals in retirement
    const withdrawalRate = 0.04; // 4% rule
    const monthlyIncomeInRetirement = futureValue * withdrawalRate / 12;
    
    // Adjust for inflation
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const inflationAdjustedMonthlyIncome = monthlyIncomeInRetirement / inflationFactor;
    
    // Calculate savings gap
    const totalNeeded = (desiredIncome / withdrawalRate);
    const savingsGap = Math.max(0, totalNeeded - futureValue);
    
    // Calculate additional monthly savings needed
    const additionalSavingsNeeded = savingsGap > 0 ? savingsGap / (Math.pow(1 + expectedReturn / 100, yearsToRetirement) - 1) * (expectedReturn / 100) / 12 : 0;
    
    // Generate withdrawal data for retirement years
    const withdrawalData: WithdrawalData[] = [];
    let remainingSavings = futureValue;
    
    for (let year = 0; year <= yearsInRetirement; year++) {
      const age = retirementAge + year;
      const annualWithdrawal = year === 0 ? 0 : desiredIncome; // Start withdrawals in the first year of retirement
      
      if (year > 0) {
        // Adjust remaining savings based on returns and withdrawals
        remainingSavings = Math.max(0, (remainingSavings * (1 + expectedReturn / 100)) - annualWithdrawal);
      }
      
      withdrawalData.push({
        age,
        savings: Math.round(remainingSavings),
        withdrawal: Math.round(annualWithdrawal),
      });
    }
    
    setRetirementResults({
      futureValue,
      yearsToRetirement,
      yearsInRetirement,
      monthlyIncomeInRetirement,
      inflationAdjustedMonthlyIncome,
      savingsGap,
      additionalMonthlySavingsNeeded: additionalSavingsNeeded,
      projectedSavingsData,
      withdrawalData,
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
          <TabsTrigger value="calculator">Retirement Calculator</TabsTrigger>
          <TabsTrigger value="projections">Savings Projections</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-age">Current Age</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="current-age"
                        min={18}
                        max={80}
                        step={1}
                        value={[currentAge]}
                        onValueChange={(value) => setCurrentAge(value[0])}
                      />
                      <span className="w-12 text-right">{currentAge}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retirement-age">Planned Retirement Age</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="retirement-age"
                        min={Math.max(currentAge + 1, 50)}
                        max={80}
                        step={1}
                        value={[retirementAge]}
                        onValueChange={(value) => setRetirementAge(value[0])}
                      />
                      <span className="w-12 text-right">{retirementAge}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="life-expectancy">Life Expectancy</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="life-expectancy"
                        min={Math.max(retirementAge + 1, 70)}
                        max={105}
                        step={1}
                        value={[lifeExpectancy]}
                        onValueChange={(value) => setLifeExpectancy(value[0])}
                      />
                      <span className="w-12 text-right">{lifeExpectancy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Savings Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-savings">Current Retirement Savings</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$0</span>
                      <Slider
                        id="current-savings"
                        min={0}
                        max={500000}
                        step={1000}
                        value={[currentSavings]}
                        onValueChange={(value) => setCurrentSavings(value[0])}
                      />
                      <span className="text-sm">$500k</span>
                    </div>
                    <Input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="annual-contribution">Annual Contribution</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$0</span>
                      <Slider
                        id="annual-contribution"
                        min={0}
                        max={20000}
                        step={500}
                        value={[annualContribution]}
                        onValueChange={(value) => setAnnualContribution(value[0])}
                      />
                      <span className="text-sm">$20k</span>
                    </div>
                    <Input
                      type="number"
                      value={annualContribution}
                      onChange={(e) => setAnnualContribution(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="desired-income">Desired Annual Income in Retirement</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$20k</span>
                      <Slider
                        id="desired-income"
                        min={20000}
                        max={200000}
                        step={5000}
                        value={[desiredIncome]}
                        onValueChange={(value) => setDesiredIncome(value[0])}
                      />
                      <span className="text-sm">$200k</span>
                    </div>
                    <Input
                      type="number"
                      value={desiredIncome}
                      onChange={(e) => setDesiredIncome(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected-return">
                      Expected Average Annual Return (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">0%</span>
                      <Slider
                        id="expected-return"
                        min={0}
                        max={12}
                        step={0.5}
                        value={[expectedReturn]}
                        onValueChange={(value) => setExpectedReturn(value[0])}
                      />
                      <span className="text-sm">12%</span>
                    </div>
                    <Input
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="mt-1"
                      step={0.1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inflation-rate">
                      Expected Inflation Rate (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">0%</span>
                      <Slider
                        id="inflation-rate"
                        min={0}
                        max={8}
                        step={0.5}
                        value={[inflationRate]}
                        onValueChange={(value) => setInflationRate(value[0])}
                      />
                      <span className="text-sm">8%</span>
                    </div>
                    <Input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="mt-1"
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Results Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Projected Retirement Savings:</span>
                    <span className="font-bold">
                      {formatCurrency(retirementResults.futureValue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Monthly Income in Retirement:</span>
                    <span className="font-bold">
                      {formatCurrency(retirementResults.monthlyIncomeInRetirement)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Inflation-Adjusted Monthly Income:</span>
                    <span className="font-bold">
                      {formatCurrency(retirementResults.inflationAdjustedMonthlyIncome)}
                    </span>
                  </div>
                  
                  {retirementResults.savingsGap > 0 && (
                    <>
                      <div className="flex justify-between text-amber-600">
                        <span>Savings Gap:</span>
                        <span className="font-bold">
                          {formatCurrency(retirementResults.savingsGap)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-amber-600">
                        <span>Additional Monthly Savings Needed:</span>
                        <span className="font-bold">
                          {formatCurrency(retirementResults.additionalMonthlySavingsNeeded)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Years Until Retirement:</span>
                      <span>{retirementResults.yearsToRetirement}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Expected Years in Retirement:</span>
                      <span>{retirementResults.yearsInRetirement}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Growth Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={retirementResults.projectedSavingsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'bottom', offset: 0 }} />
                    <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" name="Total Savings" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Savings Withdrawal in Retirement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={retirementResults.withdrawalData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'bottom', offset: 0 }} />
                    <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" name="Remaining Savings" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={retirementResults.withdrawalData.filter(d => d.withdrawal > 0)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'bottom', offset: 0 }} />
                    <YAxis tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="withdrawal" name="Annual Withdrawal" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Breakdown</CardTitle>
              <p className="text-sm text-gray-500">Recommended Asset Allocation Based on Age</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Stocks', value: 100 - currentAge },
                          { name: 'Bonds', value: currentAge }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Guidelines for Age-Based Allocation</h3>
                  <p className="text-sm">
                    A common rule of thumb for asset allocation is to subtract your age from 100 to determine 
                    the percentage of your portfolio that should be in stocks.
                  </p>
                  <p className="text-sm">
                    At your current age of {currentAge}, you might consider allocating approximately:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex justify-between">
                      <span>Stocks (higher risk, higher return):</span>
                      <span className="font-medium">{100 - currentAge}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Bonds (lower risk, lower return):</span>
                      <span className="font-medium">{currentAge}%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Accounts Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold mb-2">401(k) / 403(b)</h3>
                    <p className="text-sm">
                      Employer-sponsored retirement plans that allow tax-deferred growth.
                      Many employers offer matching contributions.
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>2023 contribution limit: $22,500</li>
                      <li>Catch-up contribution (age 50+): $7,500</li>
                      <li>Traditional: Tax-deductible contributions</li>
                      <li>Roth: Tax-free withdrawals in retirement</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold mb-2">IRA (Individual Retirement Account)</h3>
                    <p className="text-sm">
                      Personal retirement accounts with tax advantages.
                      Available to anyone with earned income.
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>2023 contribution limit: $6,500</li>
                      <li>Catch-up contribution (age 50+): $1,000</li>
                      <li>Traditional: Tax-deductible contributions</li>
                      <li>Roth: Tax-free growth and withdrawals</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold mb-2">HSA (Health Savings Account)</h3>
                    <p className="text-sm">
                      Triple tax advantage: tax-deductible contributions, tax-free growth,
                      and tax-free withdrawals for qualified medical expenses.
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>2023 contribution limit: $3,850 (individual), $7,750 (family)</li>
                      <li>Catch-up contribution (age 55+): $1,000</li>
                      <li>Can be used as an additional retirement account after age 65</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Taxable Brokerage Account</h3>
                    <p className="text-sm">
                      Flexible investment accounts with no contribution limits or withdrawal
                      restrictions, but without special tax advantages.
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>No contribution limits</li>
                      <li>No withdrawal penalties</li>
                      <li>Capital gains tax applies to investment gains</li>
                      <li>Good for medium-term goals or early retirement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">The Power of Compound Interest</h3>
                  <p className="text-sm">
                    Starting early allows your money to grow exponentially through compound interest.
                    Even small contributions can grow significantly over time.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">The 4% Rule</h3>
                  <p className="text-sm">
                    A guideline suggesting that retirees can withdraw 4% of their retirement savings
                    annually with minimal risk of running out of money over a 30-year retirement.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Social Security Optimization</h3>
                  <p className="text-sm">
                    Delaying Social Security benefits until age 70 can increase your monthly benefit
                    by up to 32% compared to taking benefits at full retirement age.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Tax-Efficient Withdrawal Strategy</h3>
                  <p className="text-sm">
                    In retirement, consider withdrawing from taxable accounts first, then tax-deferred
                    accounts (traditional 401(k)/IRA), and tax-free accounts (Roth) last to minimize taxes.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Schedule a Consultation with a Financial Advisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}