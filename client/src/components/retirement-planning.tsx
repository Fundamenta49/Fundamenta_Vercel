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
import { AlertCircle, Calculator, ExternalLink, Landmark, Percent } from "lucide-react";

export default function RetirementPlanning() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [annualReturn, setAnnualReturn] = useState<number>(7);
  const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = annualReturn / 12 / 100;
    const months = yearsToRetirement * 12;

    // Calculate future value using compound interest formula
    const futureValue = currentSavings * Math.pow(1 + monthlyRate, months) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    setEstimatedAmount(Math.round(futureValue));
  };

  return (
    <div className="space-y-6">
      {/* Main Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            Retirement Account Types
          </CardTitle>
          <CardDescription>
            Understanding different retirement savings options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="401k">
              <AccordionTrigger>401(k) Plans</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A 401(k) is an employer-sponsored retirement plan that allows you to contribute pre-tax dollars from your paycheck.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Contributions are made with pre-tax dollars</li>
                    <li>Many employers offer matching contributions</li>
                    <li>2024 contribution limit: $23,000 ($30,500 if over 50)</li>
                    <li>Withdrawals in retirement are taxed as ordinary income</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="roth">
              <AccordionTrigger>Roth IRA</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A Roth IRA is funded with after-tax dollars and grows tax-free.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Contributions are made with after-tax dollars</li>
                    <li>Qualified withdrawals are tax-free in retirement</li>
                    <li>2024 contribution limit: $7,000 ($8,000 if over 50)</li>
                    <li>Income limits apply for eligibility</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="traditional">
              <AccordionTrigger>Traditional IRA</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>A Traditional IRA offers tax-deferred growth and potentially deductible contributions.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Contributions may be tax-deductible</li>
                    <li>Grows tax-deferred until withdrawal</li>
                    <li>2024 contribution limit: $7,000 ($8,000 if over 50)</li>
                    <li>Required Minimum Distributions (RMDs) start at age 73</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Employer Match Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Employer Match Guide
          </CardTitle>
          <CardDescription>
            Don't leave free money on the table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-green-500 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-800">
                An employer match is essentially free money! If your employer offers a match,
                try to contribute at least enough to get the full match amount.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Common Match Scenarios:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Dollar-for-dollar up to a percentage:</strong>
                  <br />
                  Example: 100% match on first 3% of salary
                </li>
                <li>
                  <strong>Partial match up to a percentage:</strong>
                  <br />
                  Example: 50% match on first 6% of salary
                </li>
                <li>
                  <strong>Multi-tier matching:</strong>
                  <br />
                  Example: 100% on first 3%, then 50% on next 2%
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retirement Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Retirement Calculator
          </CardTitle>
          <CardDescription>
            Estimate your retirement savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentSavings">Current Savings ($)</Label>
              <Input
                id="currentSavings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualReturn">
                Expected Annual Return (%)
              </Label>
              <Input
                id="annualReturn"
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
              />
            </div>

            <Button onClick={calculateRetirement} className="w-full">
              Calculate
            </Button>

            {estimatedAmount !== null && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-lg font-medium">
                  Estimated Retirement Savings:
                </p>
                <p className="text-3xl font-bold text-primary">
                  ${estimatedAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trusted Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            Trusted financial planning tools and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("https://www.investor.gov/", "_blank")}
            >
              SEC's Investor.gov
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("https://www.irs.gov/retirement-plans", "_blank")}
            >
              IRS Retirement Plans
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("https://www.finra.org/investors", "_blank")}
            >
              FINRA Investor Insights
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
