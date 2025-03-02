import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, TrendingUp, DollarSign, Users, BadgePercent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalaryData {
  title: string;
  averageSalary: string;
  salaryRange: {
    min: string;
    max: string;
  };
  growthRate: string;
  demandLevel: string;
  requiredSkills: string[];
  marketOutlook: string;
  industryTrends: string[];
}

export default function SalaryInsights() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const { toast } = useToast();

  const salaryMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/career/salary-insights", {
        jobTitle,
        location,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch salary insights");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setSalaryData(data);
      toast({
        title: "Insights Retrieved",
        description: "Here are the salary insights and market trends.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Get Insights",
        description: error.message || "Failed to fetch salary insights. Please try again.",
      });
    },
  });

  const handleSearch = () => {
    if (!jobTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title to search.",
      });
      return;
    }
    salaryMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Salary Insights & Growth Trends</CardTitle>
          <CardDescription>
            Explore salary ranges, growth potential, and market demand for various careers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Software Engineer, Chef, Marketing Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={salaryMutation.isPending}
            className="w-full"
          >
            {salaryMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Get Salary Insights"
            )}
          </Button>
        </CardContent>
      </Card>

      {salaryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {salaryData.title}
            </CardTitle>
            <CardDescription>
              Comprehensive salary and market analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Salary Range</h4>
                </div>
                <p className="text-2xl font-bold">{salaryData.averageSalary}</p>
                <p className="text-sm text-muted-foreground">
                  Range: {salaryData.salaryRange.min} - {salaryData.salaryRange.max}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Growth Rate</h4>
                </div>
                <p className="text-2xl font-bold">{salaryData.growthRate}</p>
                <p className="text-sm text-muted-foreground">Annual growth</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Market Demand</h4>
                </div>
                <p className="text-2xl font-bold">{salaryData.demandLevel}</p>
                <p className="text-sm text-muted-foreground">Current demand level</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {salaryData.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Market Outlook</h4>
                <p className="text-muted-foreground">{salaryData.marketOutlook}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Industry Trends</h4>
                <ul className="space-y-2">
                  {salaryData.industryTrends.map((trend, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <BadgePercent className="h-4 w-4 text-primary" />
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}