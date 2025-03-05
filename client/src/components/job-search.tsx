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
import { Loader2, Briefcase, Building2, MapPin } from "lucide-react";
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
        <CardHeader>
          <CardTitle>Job Search</CardTitle>
          <CardDescription>
            Search across multiple job boards to find your next opportunity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Job Title or Keywords</Label>
            <Input
              id="searchQuery"
              placeholder="e.g. Software Engineer, Marketing Manager"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F3F4F6] border-wood/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-[#F3F4F6] border-wood/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Job Boards</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="indeed"
                  checked={selectedSources.indeed}
                  onCheckedChange={(checked) =>
                    setSelectedSources({ ...selectedSources, indeed: !!checked })
                  }
                />
                <Label htmlFor="indeed">Indeed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linkedin"
                  checked={selectedSources.linkedin}
                  onCheckedChange={(checked) =>
                    setSelectedSources({ ...selectedSources, linkedin: !!checked })
                  }
                />
                <Label htmlFor="linkedin">LinkedIn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ziprecruiter"
                  checked={selectedSources.ziprecruiter}
                  onCheckedChange={(checked) =>
                    setSelectedSources({
                      ...selectedSources,
                      ziprecruiter: !!checked,
                    })
                  }
                />
                <Label htmlFor="ziprecruiter">ZipRecruiter</Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending}
            className="w-full"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Jobs"
            )}
          </Button>
        </CardContent>
      </Card>

      {jobListings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {jobListings.length} matching positions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(job.url, "_blank")}
                  >
                    View Job
                  </Button>
                </div>
                <p className="text-sm line-clamp-3">{job.description}</p>
                <div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
                  <span>Source: {job.source}</span>
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