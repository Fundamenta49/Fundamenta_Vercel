import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Loader2, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  BarChart4, 
  Network,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  Map,
  BookOpen,
  BarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  source: string;
  postedDate: string;
}

// Sample salary data for different job titles
const sampleSalaryData: Record<string, {
  median: number, 
  range: [number, number],
  growth: number, // Annual growth rate as percentage
  stateData: Record<string, {median: number, range: [number, number]}>,
  education: string[],
  certifications: string[]
}> = {
  "software engineer": { 
    median: 110000, 
    range: [85000, 150000],
    growth: 15.2, // 15.2% annual growth
    stateData: {
      "california": { median: 135000, range: [105000, 175000] },
      "new york": { median: 125000, range: [95000, 165000] },
      "texas": { median: 105000, range: [80000, 140000] },
      "florida": { median: 95000, range: [75000, 130000] },
      "washington": { median: 130000, range: [100000, 170000] },
      "massachusetts": { median: 120000, range: [90000, 160000] },
      "illinois": { median: 105000, range: [80000, 140000] },
      "colorado": { median: 110000, range: [85000, 145000] },
      "georgia": { median: 100000, range: [75000, 135000] },
      "oregon": { median: 115000, range: [90000, 150000] }
    },
    education: ["Bachelor's in Computer Science", "Bachelor's in Software Engineering", "Bachelor's in Information Technology"],
    certifications: ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Google Cloud Professional Developer", "Oracle Certified Professional, Java SE Programmer"]
  },
  // Rest of the entries with default structure
  "software developer": { 
    median: 105000, 
    range: [80000, 145000] as [number, number],
    growth: 12.8,
    stateData: { "national": { median: 105000, range: [80000, 145000] as [number, number] } },
    education: ["Bachelor's in Computer Science", "Associates in Software Development"],
    certifications: ["Full Stack Developer Certification", "JavaScript Certification"]
  },
  "web developer": { 
    median: 95000, 
    range: [70000, 125000] as [number, number],
    growth: 8.5,
    stateData: { "national": { median: 95000, range: [70000, 125000] as [number, number] } },
    education: ["Bachelor's in Web Development", "Associates in Web Design"],
    certifications: ["HTML/CSS Certification", "JavaScript Framework Certification"]
  },
  "data scientist": { 
    median: 120000, 
    range: [90000, 160000] as [number, number],
    growth: 22.0,
    stateData: { "national": { median: 120000, range: [90000, 160000] as [number, number] } },
    education: ["Master's in Data Science", "PhD in Statistics"],
    certifications: ["Microsoft Certified: Azure Data Scientist", "IBM Data Science Professional"]
  },
  "data analyst": { 
    median: 85000, 
    range: [65000, 110000] as [number, number],
    growth: 18.5,
    stateData: { "national": { median: 85000, range: [65000, 110000] as [number, number] } },
    education: ["Bachelor's in Statistics", "Bachelor's in Computer Science"],
    certifications: ["Tableau Certification", "Google Data Analytics Certificate"]
  },
  "product manager": { 
    median: 115000, 
    range: [95000, 160000] as [number, number],
    growth: 10.0,
    stateData: { "national": { median: 115000, range: [95000, 160000] as [number, number] } },
    education: ["Bachelor's in Business", "MBA"],
    certifications: ["Certified Scrum Product Owner", "Product Management Certification"]
  },
};

// Format currency function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  // Default selected sources (hidden from UI)
  const [selectedSources] = useState({
    indeed: true,
    adzuna: true,
  });
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [salaryData, setSalaryData] = useState<{
    median: number, 
    range: [number, number],
    growth?: number,
    stateData?: Record<string, {median: number, range: [number, number]}>,
    education?: string[],
    certifications?: string[]
  } | null>(null);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/jobs/search", {
        query: searchQuery,
        location,
        industry: industry || undefined, // Only include if it has a value
        sources: Object.entries(selectedSources)
          .filter(([_, enabled]) => enabled)
          .map(([source]) => source),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to search jobs");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setJobListings(data.jobs);
      toast({
        title: "Search Complete",
        description: `Found ${data.jobs.length} matching jobs`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "Failed to search jobs. Please try again.",
      });
    },
  });

  // Look up salary data for a job title
  const lookupSalaryData = (jobTitle: string) => {
    const normalizedTitle = jobTitle.toLowerCase();
    
    // Try to find exact match first
    if (sampleSalaryData[normalizedTitle]) {
      return sampleSalaryData[normalizedTitle];
    }
    
    // If no exact match, look for partial matches
    for (const [title, data] of Object.entries(sampleSalaryData)) {
      if (normalizedTitle.includes(title) || title.includes(normalizedTitle)) {
        return data;
      }
    }
    
    // Default fallback for unknown titles
    return { 
      median: 75000, 
      range: [50000, 120000] as [number, number],
      growth: 5.0,
      stateData: { "national": { median: 75000, range: [50000, 120000] as [number, number] } },
      education: ["Bachelor's degree (recommended)"],
      certifications: ["Industry-specific certifications may be required"]
    };
  };
  
  // Update salary data when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSalaryData(lookupSalaryData(searchQuery));
    } else {
      setSalaryData(null);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title or keywords to search.",
      });
      return;
    }
    // Set salary data based on search query
    setSalaryData(lookupSalaryData(searchQuery));
    searchMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" /> 
            Fundamenta Connects
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Discover career opportunities and salary insights tailored to your skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery" className="text-sm sm:text-base">Job Title or Keywords</Label>
            <Input
              id="searchQuery"
              placeholder="e.g. Software Engineer, Marketing Manager"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-wood/20 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-wood/20 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm sm:text-base">Industry (Optional)</Label>
            <Select
              value={industry}
              onValueChange={setIndustry}
            >
              <SelectTrigger id="industry" className="border-wood/20 text-sm sm:text-base">
                <SelectValue placeholder="Select an industry (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="marketing">Marketing & Media</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="nonprofit">Nonprofit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job sources selection removed as requested */}

          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending}
            className="w-full bg-white border-2 border-primary text-primary hover:bg-primary/5 text-sm sm:text-base py-2 h-auto"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Network className="h-4 w-4 mr-2" /> Find Opportunities
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {jobListings.length > 0 && (
        <Card>
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-4 border-b-2 border-primary/20">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Opportunities Found
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Discovered {jobListings.length} matching positions for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3 py-2 sm:px-6 sm:py-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="p-3 sm:p-4 border border-primary/20 bg-white rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1 sm:gap-2">
                      <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{job.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {job.company}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {job.location}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-primary/30 text-primary hover:bg-primary/5 text-xs sm:text-sm py-1 h-auto self-start flex items-center gap-1"
                    onClick={() => window.open(job.url, "_blank")}
                  >
                    Connect <Network className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{job.description}</p>
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <span>Posted: {job.postedDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}