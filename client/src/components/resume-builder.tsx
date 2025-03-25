import { useState, useCallback } from "react";
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
import { PlusCircle, Trash2, Wand2, Loader2, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    color: '#2D3748',
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4A5568',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#1A202C',
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

const ResumePDF = ({ personalInfo, education, experience }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>{personalInfo.name}</Text>
        <View style={styles.contact}>
          <Text style={styles.text}>{personalInfo.email}</Text>
          <Text style={styles.text}>{personalInfo.phone}</Text>
        </View>
        <Text style={styles.text}>{personalInfo.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {experience.map((exp, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subHeading}>{exp.position} at {exp.company}</Text>
            <Text style={styles.text}>{exp.duration}</Text>
            <Text style={styles.text}>{exp.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {education.map((edu, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subHeading}>{edu.degree}</Text>
            <Text style={styles.text}>{edu.school} - {edu.year}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);


export default function ResumeBuilder() {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
  });

  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);

  const [targetPosition, setTargetPosition] = useState("");
  const [education, setEducation] = useState<Education[]>([
    { school: "", degree: "", year: "" },
  ]);
  const [experience, setExperience] = useState<Experience[]>([
    { company: "", position: "", duration: "", description: "" },
  ]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestions | null>(null);

  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationSuggestions[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);


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
      setOptimizationHistory(prev => [...prev, data.suggestions]);
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

  const [company, setCompany] = useState("");
  const [keyExperience, setKeyExperience] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const coverLetterMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/resume/cover-letter", {
        personalInfo,
        education,
        experience,
        targetPosition,
        company,
        keyExperience: experience.map((exp) =>
          `${exp.position} at ${exp.company}: ${exp.description}`
        ),
        additionalNotes,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setCoverLetter(data.coverLetter);
      toast({
        title: "Cover Letter Generated",
        description: "Your cover letter has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate cover letter. Please try again.",
      });
    },
  });

  const generateCoverLetter = () => {
    if (!personalInfo.name || !targetPosition) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in your personal information and target position first.",
      });
      return;
    }

    const formattedExperience = experience.map((exp) =>
      `${exp.position} at ${exp.company}: ${exp.description}`
    );

    const formattedEducation = education.map((edu) =>
      `${edu.degree} from ${edu.school} (${edu.year})`
    );

    const allExperience = [
      ...formattedExperience,
      ...keyExperience,
    ].filter((exp) => exp.trim());

    coverLetterMutation.mutate();
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Get file from event and reset the input
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PDF or Word document.",
      });
      return;
    }

    setUploadedResume(file);
    setIsParsingResume(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      setParsedData(data);

      setPersonalInfo({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        summary: data.summary || '',
      });

      if (data.experience) {
        setExperience(data.experience.map((exp: any) => ({
          company: exp.company || '',
          position: exp.position || '',
          duration: exp.duration || '',
          description: exp.description || '',
        })));
      }

      if (data.education) {
        setEducation(data.education.map((edu: any) => ({
          school: edu.school || '',
          degree: edu.degree || '',
          year: edu.year || '',
        })));
      }

      toast({
        title: "Resume Parsed Successfully",
        description: "Your resume has been analyzed. Starting optimization...",
      });

      if (targetPosition) {
        setIsOptimizing(true);
        try {
          const optimizeResponse = await fetch("/api/resume/optimize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personalInfo,
              education,
              experience,
              targetPosition,
            }),
          });

          if (!optimizeResponse.ok) {
            throw new Error('Failed to optimize resume');
          }

          const optimizeData = await optimizeResponse.json();
          setSuggestions(optimizeData.suggestions);
          setOptimizationHistory(prev => [...prev, optimizeData.suggestions]);

          toast({
            title: "Resume Optimized",
            description: "AI suggestions have been generated based on your parsed resume.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Optimization Failed",
            description: "Failed to optimize resume. Please try again.",
          });
        } finally {
          setIsOptimizing(false);
        }
      }

    } catch (error) {
      console.error('Error parsing resume:', error);
      toast({
        variant: "destructive",
        title: "Parsing Failed",
        description: "Failed to parse your resume. Please try again or enter the information manually.",
      });
    } finally {
      setIsParsingResume(false);
    }
  };

  const applyAllSuggestions = () => {
    if (!suggestions) return;

    setPersonalInfo(prev => ({
      ...prev,
      summary: suggestions.enhancedSummary
    }));

    setExperience(prev =>
      prev.map((exp, idx) => ({
        ...exp,
        description: suggestions.experienceSuggestions[idx]?.improved || exp.description
      }))
    );

    toast({
      title: "AI Suggestions Applied",
      description: "Your resume has been updated with all optimized content."
    });
  };

  const handleResumeUpdate = (updates: {
    summary?: string;
    experience?: Experience[];
    education?: Education[];
  }) => {
    if (updates.summary) {
      setPersonalInfo(prev => ({
        ...prev,
        summary: updates.summary
      }));
    }
    if (updates.experience) {
      setExperience(updates.experience);
    }
    if (updates.education) {
      setEducation(updates.education);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Existing Resume</CardTitle>
          <CardDescription>
            Start by uploading your current resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              disabled={isParsingResume}
              className="flex-1"
            />
            {isParsingResume && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing resume...</span>
              </div>
            )}
          </div>
          {uploadedResume && (
            <p className="text-sm text-muted-foreground">
              Uploaded: {uploadedResume.name}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimize for Target Position</CardTitle>
          <CardDescription>
            Enter your target position to get AI-powered optimization suggestions
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

      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Generator</CardTitle>
          <CardDescription>
            Generate a customized cover letter based on your optimized resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyExperience">Key Experience Points</Label>
            <p className="text-sm text-muted-foreground">
              Add specific experiences or skills relevant to this position
            </p>
            {keyExperience.map((exp, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={exp}
                  onChange={(e) => {
                    const newExp = [...keyExperience];
                    newExp[index] = e.target.value;
                    setKeyExperience(newExp);
                  }}
                  placeholder="E.g., Led a team of 5 developers..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setKeyExperience(keyExperience.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setKeyExperience([...keyExperience, ""])}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience Point
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any specific points you'd like to emphasize..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>

          <Button
            onClick={generateCoverLetter}
            disabled={
              coverLetterMutation.isPending ||
              !personalInfo.name ||
              !targetPosition
            }
            className="w-full"
          >
            {coverLetterMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Cover Letter
              </>
            )}
          </Button>

          {coverLetter && (
            <div className="space-y-2">
              <Label>Generated Cover Letter</Label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[300px] font-mono"
              />
            </div>
          )}
        </CardContent>
      </Card>

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
              className="text-black placeholder:text-navy-300"
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
              className="text-black placeholder:text-navy-300"
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
              className="text-black placeholder:text-navy-300"
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
              className="text-black placeholder:text-navy-300"
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

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={applyAllSuggestions}
                disabled={isOptimizing}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Apply All Suggestions
              </Button>

              <PDFDownloadLink
                document={<ResumePDF
                  personalInfo={personalInfo}
                  education={education}
                  experience={experience}
                />}
                fileName={`${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>

            {optimizationHistory.length > 1 && (
              <div className="mt-6">
                <Label>Optimization History</Label>
                <ScrollArea className="h-[200px] mt-2">
                  {optimizationHistory.map((hist, index) => (
                    <div key={index} className="p-4 border-b">
                      <p className="text-sm text-muted-foreground">Version {index + 1}</p>
                      <p className="mt-1">{hist.enhancedSummary.substring(0, 100)}...</p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}