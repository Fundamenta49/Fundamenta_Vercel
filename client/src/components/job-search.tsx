import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Loader2, Briefcase, Building2, MapPin, Users, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSources, setSelectedSources] = useState({
    indeed: true,
    linkedin: true,
    ziprecruiter: true,
    adzuna: true,
  });
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/jobs/search", {
        query: searchQuery,
        location,
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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title or keywords to search.",
      });
      return;
    }
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
            Discover career opportunities tailored to your skills and interests
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
            <Label className="text-sm sm:text-base">Job Sources</Label>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Checkbox
                  id="adzuna"
                  checked={selectedSources.adzuna}
                  onCheckedChange={(checked) =>
                    setSelectedSources({
                      ...selectedSources,
                      adzuna: !!checked,
                    })
                  }
                />
                <Label htmlFor="adzuna" className="text-sm sm:text-base">Adzuna API (Real-time Data)</Label>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Checkbox
                  id="indeed"
                  checked={selectedSources.indeed}
                  onCheckedChange={(checked) =>
                    setSelectedSources({ ...selectedSources, indeed: !!checked })
                  }
                />
                <Label htmlFor="indeed" className="text-sm sm:text-base">Sample Data</Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Only Adzuna provides real-time job listings. Sample data is used when Adzuna is unavailable.
            </p>
          </div>

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