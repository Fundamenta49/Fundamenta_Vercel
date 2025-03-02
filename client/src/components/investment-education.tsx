import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calculator, Percent, LineChart, DollarSign } from "lucide-react";

// Risk tolerance quiz questions
const riskQuestions = [
  {
    id: 1,
    question: "How would you react if your investment lost 20% in a month?",
    options: [
      { value: 1, text: "Sell everything immediately" },
      { value: 2, text: "Sell some investments" },
      { value: 3, text: "Do nothing and wait" },
      { value: 4, text: "Buy more while prices are low" }
    ]
  },
  {
    id: 2,
    question: "When do you plan to start withdrawing from your investments?",
    options: [
      { value: 1, text: "Within 3 years" },
      { value: 2, text: "3-5 years" },
      { value: 3, text: "5-10 years" },
      { value: 4, text: "More than 10 years" }
    ]
  },
  {
    id: 3,
    question: "What's your primary investment goal?",
    options: [
      { value: 1, text: "Preserve my wealth" },
      { value: 2, text: "Grow wealth slowly with minimal risk" },
      { value: 3, text: "Balance growth with security" },
      { value: 4, text: "Maximize long-term growth" }
    ]
  }
];

export default function InvestmentEducation() {
  // Compound Interest Calculator State
  const [principal, setPrincipal] = useState<number>(1000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(7);
  const [futureValue, setFutureValue] = useState<number | null>(null);

  // Risk Quiz State
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [riskProfile, setRiskProfile] = useState<string>("");

  const calculateCompoundInterest = () => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    
    const futureVal = principal * Math.pow(1 + monthlyRate, months) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    setFutureValue(Math.round(futureVal));
  };

  const handleQuizAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
    
    // Calculate risk profile if all questions are answered
    if (Object.keys(answers).length === riskQuestions.length - 1) {
      const total = Object.values({ ...answers, [questionId]: value }).reduce((a, b) => a + b, 0);
      const average = total / riskQuestions.length;
      
      if (average <= 1.5) setRiskProfile("Conservative");
      else if (average <= 2.5) setRiskProfile("Moderate-Conservative");
      else if (average <= 3.5) setRiskProfile("Moderate-Aggressive");
      else setRiskProfile("Aggressive");
    }
  };

  return (
    <div className="space-y-6">
      {/* Investment Types Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Investment Types Explained
          </CardTitle>
          <CardDescription>
            Understanding different investment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="stocks">
              <AccordionTrigger>Stocks</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>When you buy stocks, you own a small piece of a company.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Potential for high returns</li>
                    <li>More volatile than bonds</li>
                    <li>Good for long-term growth</li>
                    <li>Can start with fractional shares</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bonds">
              <AccordionTrigger>Bonds</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Bonds are loans to companies or governments.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Generally lower risk than stocks</li>
                    <li>Regular interest payments</li>
                    <li>Good for income and stability</li>
                    <li>Government bonds are considered very safe</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="realestate">
              <AccordionTrigger>Real Estate</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Invest in physical property or through REITs (Real Estate Investment Trusts).</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Can provide rental income</li>
                    <li>Potential for property value appreciation</li>
                    <li>REITs offer real estate exposure without buying property</li>
                    <li>Can help hedge against inflation</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Risk Tolerance Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Investment Risk Quiz
          </CardTitle>
          <CardDescription>
            Discover your investment risk tolerance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskQuestions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="font-medium">{q.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={answers[q.id] === option.value ? "default" : "outline"}
                    onClick={() => handleQuizAnswer(q.id, option.value)}
                    className="justify-start"
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {riskProfile && (
            <Alert className="mt-4 border-blue-500 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                Your risk profile: <strong>{riskProfile}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Compound Interest Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Compound Interest Calculator
          </CardTitle>
          <CardDescription>
            See how your investments can grow over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Initial Investment ($)</Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Contribution ($)</Label>
              <Input
                id="monthly"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Investment Period (Years)</Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">
                Expected Annual Return (%)
              </Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>

            <Button onClick={calculateCompoundInterest} className="w-full">
              Calculate Growth
            </Button>

            {futureValue !== null && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-lg font-medium">
                  Estimated Future Value:
                </p>
                <p className="text-3xl font-bold text-primary">
                  ${futureValue.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Beginner's Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            How to Start Investing with $100
          </CardTitle>
          <CardDescription>
            Your guide to beginning your investment journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Start with Index Funds</h4>
              <p className="text-muted-foreground">
                Low-cost index funds that track the overall market are a great way to begin. Many brokers offer fractional shares, letting you start with any amount.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. Use Micro-Investing Apps</h4>
              <p className="text-muted-foreground">
                Apps like Acorns or Robinhood let you start investing with small amounts and even round up your purchases to invest the spare change.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. Open a Retirement Account</h4>
              <p className="text-muted-foreground">
                Consider opening a Roth IRA, which offers tax advantages and can be started with a small amount.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">4. Regular Contributions</h4>
              <p className="text-muted-foreground">
                Set up automatic monthly investments, even if it's just $25. Consistency is key to long-term growth.
              </p>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Remember: Start small, stay consistent, and increase your investments as your income grows.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
