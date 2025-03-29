import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function CreditSkills() {
  const [creditScore, setCreditScore] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number[]>([650]);
  const [creditFactors, setCreditFactors] = useState({
    payments: 35,
    utilization: 30,
    length: 15,
    mix: 10,
    inquiries: 10,
  });

  // Credit score simulator handler
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setCreditScore(value[0]);
  };

  // Credit score rating calculation
  const getCreditRating = (score: number): string => {
    if (score >= 800) return "Exceptional";
    if (score >= 740) return "Very Good";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor";
  };

  // Get color based on credit score
  const getCreditScoreColor = (score: number): string => {
    if (score >= 800) return "text-green-600";
    if (score >= 740) return "text-green-500";
    if (score >= 670) return "text-blue-500";
    if (score >= 580) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="basics">Credit Basics</TabsTrigger>
          <TabsTrigger value="improvement">Improvement Tips</TabsTrigger>
          <TabsTrigger value="simulator">Score Simulator</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Understanding Credit Scores</h2>
          
          <p className="mb-4">
            A credit score is a 3-digit number that lenders use to evaluate your creditworthiness.
            The most common credit scoring model is FICO®, which ranges from 300 to 850.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>What Makes Up Your Credit Score?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Payment History</span>
                    <span className="text-green-600 font-medium">35%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Credit Utilization</span>
                    <span className="text-blue-600 font-medium">30%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "30%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Length of Credit History</span>
                    <span className="text-amber-600 font-medium">15%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "15%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Credit Mix</span>
                    <span className="text-indigo-600 font-medium">10%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">New Credit Inquiries</span>
                    <span className="text-purple-600 font-medium">10%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is a good credit score?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong className="text-green-600">Exceptional:</strong> 800-850</p>
                  <p><strong className="text-green-500">Very Good:</strong> 740-799</p>
                  <p><strong className="text-blue-500">Good:</strong> 670-739</p>
                  <p><strong className="text-amber-500">Fair:</strong> 580-669</p>
                  <p><strong className="text-red-500">Poor:</strong> 300-579</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Why is credit important?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Good credit can help you qualify for loans, credit cards, housing, and even some jobs.
                  It can also help you get lower interest rates, which saves you money over time.
                  Bad credit can make it harder to qualify for these things and may result in higher interest rates.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How often does your credit score update?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Credit scores typically update once a month when lenders report account activity to the credit bureaus.
                  However, not all lenders report to all bureaus at the same time, so your scores can change throughout the month.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="improvement" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Improving Your Credit Score</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-500">Do These</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Pay all bills on time, every time</li>
                  <li>Keep credit card balances low (under 30% of limit)</li>
                  <li>Check your credit reports regularly for errors</li>
                  <li>Keep old accounts open to maintain history length</li>
                  <li>Use different types of credit (installment and revolving)</li>
                  <li>Only apply for credit when necessary</li>
                  <li>Pay down high-interest debt first</li>
                  <li>Set up automatic payments to avoid late fees</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Avoid These</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Missing payments or paying late</li>
                  <li>Maxing out credit cards</li>
                  <li>Closing old credit accounts</li>
                  <li>Applying for multiple new accounts in a short time</li>
                  <li>Having accounts go to collections</li>
                  <li>Carrying high balances month to month</li>
                  <li>Ignoring credit report errors</li>
                  <li>Co-signing for unreliable borrowers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Fixes vs. Long-Term Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2 text-amber-500">Short-Term Actions (1-3 months)</h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Pay down credit card balances</li>
                    <li>Become an authorized user on a responsible person's card</li>
                    <li>Dispute errors on your credit report</li>
                    <li>Request a credit limit increase (but don't use it)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-green-500">Long-Term Habits (6+ months)</h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Maintain perfect payment history</li>
                    <li>Keep utilization consistently low</li>
                    <li>Build a diverse mix of credit accounts</li>
                    <li>Let negative information age off your report</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="simulator" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Credit Score Simulator</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Simulated Credit Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className={`text-5xl font-bold ${getCreditScoreColor(sliderValue[0])}`}>
                {sliderValue[0]}
              </div>
              <div className="text-lg mt-2">{getCreditRating(sliderValue[0])}</div>
              
              <div className="w-full mt-8">
                <Slider
                  min={300}
                  max={850}
                  step={1}
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>300</span>
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Very Good</span>
                  <span>850</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>What If You...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Paid off $1,000 in credit card debt?</h3>
                  <div className="flex items-center">
                    <span className="text-lg">+15 points</span>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Simulate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Made all payments on time for 6 months?</h3>
                  <div className="flex items-center">
                    <span className="text-lg">+30 points</span>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Simulate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Applied for a new credit card?</h3>
                  <div className="flex items-center">
                    <span className="text-lg">-5 points</span>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Simulate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Had a late payment?</h3>
                  <div className="flex items-center">
                    <span className="text-lg">-80 points</span>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Simulate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Credit Resources</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Free Credit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Federal law allows you to get a free copy of your credit report every 12 months from each of the three major consumer reporting companies.
              </p>
              <Button variant="outline" className="w-full sm:w-auto">
                AnnualCreditReport.com
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Official Resources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span>Consumer Financial Protection Bureau</span>
                      <Button variant="ghost" size="sm" className="ml-auto py-0 h-6">
                        Visit
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <span>Federal Trade Commission - Credit</span>
                      <Button variant="ghost" size="sm" className="ml-auto py-0 h-6">
                        Visit
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <span>MyMoney.gov</span>
                      <Button variant="ghost" size="sm" className="ml-auto py-0 h-6">
                        Visit
                      </Button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Educational Sites</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span>Credit Karma Learning Center</span>
                      <Button variant="ghost" size="sm" className="ml-auto py-0 h-6">
                        Visit
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <span>Experian Education Hub</span>
                      <Button variant="ghost" size="sm" className="ml-auto py-0 h-6">
                        Visit
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <span>NerdWallet Credit Score Resource</span>
                      <Button variant="ghost" size="sm" className="ml-auto py-0 h-6">
                        Visit
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Credit Repair Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-600">
                Be cautious of companies promising to "fix" or "repair" your credit quickly. Many of these
                services charge high fees for things you can do yourself for free. There are no quick fixes
                for rebuilding credit—it takes time and responsible financial habits.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}