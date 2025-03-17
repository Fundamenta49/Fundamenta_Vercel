import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, DollarSign, Calculator, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample rates - in production, these would come from an API
const SAMPLE_RATES = {
  "30-year": 6.5,
  "15-year": 5.875,
  "10-year": 5.25,
};

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function MortgageCalculator() {
  const { toast } = useToast();
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [loanTerm, setLoanTerm] = useState<string>("30-year");
  const [interestRate, setInterestRate] = useState<number>(SAMPLE_RATES["30-year"]);
  const [state, setState] = useState<string>("California");
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Calculate monthly payment whenever inputs change
  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, loanTerm, interestRate]);

  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = parseInt(loanTerm) * 12;

    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(monthlyPayment);
  };

  const handleLoanTermChange = (value: string) => {
    setLoanTerm(value);
    setInterestRate(SAMPLE_RATES[value as keyof typeof SAMPLE_RATES]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Mortgage Calculator
          </CardTitle>
          <CardDescription>
            Calculate your estimated monthly mortgage payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="homePrice">Home Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="homePrice"
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term</Label>
              <Select value={loanTerm} onValueChange={handleLoanTermChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-year">30 Year Fixed</SelectItem>
                  <SelectItem value="15-year">15 Year Fixed</SelectItem>
                  <SelectItem value="10-year">10 Year Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Current Interest Rate</Label>
                <span className="font-semibold text-primary">
                  {interestRate.toFixed(3)}%
                </span>
              </div>
              <Progress value={(interestRate / 10) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Monthly Payment Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(monthlyPayment)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Principal and Interest Only
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-1">
              <Label className="text-sm">Loan Amount</Label>
              <div className="text-lg font-semibold">
                {formatCurrency(homePrice - downPayment)}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Down Payment</Label>
              <div className="text-lg font-semibold">
                {formatCurrency(downPayment)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({((downPayment / homePrice) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
