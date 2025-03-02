import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Education {
  school: string;
  degree: string;
  year: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface OptimizationSuggestions {
  enhancedSummary: string;
  keywords: string[];
  experienceSuggestions: Array<{
    original: string;
    improved: string;
  }>;
  structuralChanges: string[];
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
  });

  const [targetPosition, setTargetPosition] = useState("");
  const [education, setEducation] = useState<Education[]>([
    { school: "", degree: "", year: "" },
  ]);
  const [experience, setExperience] = useState<Experience[]>([
    { company: "", position: "", duration: "", description: "" },
  ]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestions | null>(null);

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/resume/optimize", {
        personalInfo,
        education,
        experience,
        targetPosition,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions);
      toast({
        title: "Resume Optimized",
        description: "AI suggestions have been generated for your resume.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Failed to optimize resume. Please try again.",
      });
    },
  });

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { company: "", position: "", duration: "", description: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleOptimize = () => {
    if (!targetPosition) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your target position to optimize the resume.",
      });
      return;
    }
    optimizeMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={personalInfo.name}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={personalInfo.summary}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, summary: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Education
            <Button variant="outline" size="sm" onClick={addEducation}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].school = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].degree = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].year = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Experience
            <Button variant="outline" size="sm" onClick={addExperience}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].company = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].position = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].duration = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].description = e.target.value;
                    setExperience(newExperience);
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimize for Target Position</CardTitle>
          <CardDescription>
            After filling in your information above, enter your target position to get AI-powered optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetPosition">Target Position</Label>
            <Input
              id="targetPosition"
              value={targetPosition}
              onChange={(e) => setTargetPosition(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <Button
            onClick={handleOptimize}
            disabled={optimizeMutation.isPending || !targetPosition}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {optimizeMutation.isPending ? "Optimizing..." : "Optimize Resume"}
          </Button>
        </CardContent>
      </Card>

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>Recommended improvements for your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Enhanced Summary</Label>
              <div className="p-4 bg-muted rounded-lg">
                <p>{suggestions.enhancedSummary}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recommended Keywords</Label>
              <div className="flex flex-wrap gap-2">
                {suggestions.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Experience Improvements</Label>
              <div className="space-y-4">
                {suggestions.experienceSuggestions.map((suggestion, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm text-muted-foreground">Original:</p>
                    <p className="pl-4">{suggestion.original}</p>
                    <p className="text-sm text-muted-foreground">Improved:</p>
                    <p className="pl-4 text-primary">{suggestion.improved}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Structural Changes</Label>
              <ul className="list-disc pl-4 space-y-1">
                {suggestions.structuralChanges.map((change, index) => (
                  <li key={index} className="text-sm">{change}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}