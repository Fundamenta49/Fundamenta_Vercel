import { useState, useRef, useCallback } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  UploadCloud, 
  Download, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  RefreshCw,
  Wand2,
  Settings2,
  Pencil,
  BookTemplate,
  List,
  CheckCheck,
  Briefcase,
  GraduationCap,
  Award,
  Layers
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { analyzeResume, type ResumeAnalysis } from "@/lib/resume-analysis";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  projects: z.string().optional(), // New field for projects
  certifications: z.string().optional(), // New field for certifications
  resumeText: z.string().min(1, "Resume content is required"),
  targetJobTitle: z.string().optional(), // New field for optimization
  jobDescription: z.string().optional(), // New field for optimization
});

type ResumeFormData = z.infer<typeof resumeSchema>;

// Resume template options
const RESUME_TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and traditional format suitable for most industries",
    color: "#3b82f6" // blue
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with a creative touch",
    color: "#ec4899" // pink
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and straight-to-the-point layout",
    color: "#22c55e" // green
  },
  {
    id: "executive",
    name: "Executive",
    description: "Refined style for senior positions",
    color: "#8b5cf6" // purple
  },
];

// Styles for PDF generation
const createStyles = (color = "#3b82f6") => StyleSheet.create({
  page: { 
    flexDirection: "column", 
    backgroundColor: "#FFFFFF", 
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: { 
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10
  },
  title: { 
    fontSize: 24, 
    marginBottom: 5, 
    fontWeight: 'bold', 
    color: color
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 10,
    marginRight: 15,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: color,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#1F2937',
  },
});

interface ResumePDFProps extends ResumeFormData {
  template: string;
}

const ResumePDF: React.FC<ResumePDFProps> = ({
  name,
  email,
  phone,
  summary,
  education,
  experience,
  skills,
  projects,
  certifications,
  resumeText,
  template
}) => {
  // Get template color
  const templateObj = RESUME_TEMPLATES.find(t => t.id === template) || RESUME_TEMPLATES[0];
  const styles = createStyles(templateObj.color);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{email}</Text>
            <Text style={styles.contactItem}>{phone}</Text>
          </View>
        </View>

        {summary && (
          <>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.sectionContent}>{summary}</Text>
          </>
        )}

        {experience && (
          <>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <Text style={styles.sectionContent}>{experience}</Text>
          </>
        )}

        {education && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.sectionContent}>{education}</Text>
          </>
        )}

        {skills && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.sectionContent}>{skills}</Text>
          </>
        )}
        
        {projects && (
          <>
            <Text style={styles.sectionTitle}>Projects</Text>
            <Text style={styles.sectionContent}>{projects}</Text>
          </>
        )}
        
        {certifications && (
          <>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Text style={styles.sectionContent}>{certifications}</Text>
          </>
        )}
        
        {/* Include the full text at the bottom if none of the above sections are filled */}
        {(!summary && !education && !experience && !skills && !projects && !certifications) && (
          <Text style={styles.sectionContent}>{resumeText}</Text>
        )}
      </Page>
    </Document>
  );
};

const FileUpload: React.FC<{
  onUpload: (text: string) => void;
  setUploadMessage: (message: string) => void;
  form: any;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}> = ({ onUpload, setUploadMessage, form, isUploading, setIsUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Enhanced text extraction from file with improved section detection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadMessage("Processing resume...");
      
      // Use OpenAI to parse resume if available or fall back to manual parsing
      if (file.type === 'application/pdf') {
        try {
          // For PDF files, we'd ideally use server-side parsing
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/resume-analysis/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error("PDF parsing failed - falling back to text extraction");
          }
          
          const data = await response.json();
          
          if (data.success && data.text) {
            // Successfully parsed the PDF, now process the text
            processResumeText(data.text);
          } else {
            throw new Error("PDF parsing failed - falling back to text extraction");
          }
        } catch (pdfError) {
          console.log("PDF parsing fallback:", pdfError);
          toast({
            title: "PDF Parsing Limited",
            description: "Direct PDF parsing is limited. For best results, try a .txt or .docx file.",
            variant: "destructive"
          });
          
          // Continue with text-based parsing for PDFs using FileReader
          const reader = new FileReader();
          
          reader.onload = async (event) => {
            try {
              const text = event.target?.result as string;
              processResumeText(text);
            } catch (error) {
              handleParsingError(error);
            }
          };
          
          reader.onerror = () => {
            setUploadMessage(`Error reading file`);
            setIsUploading(false);
          };
          
          reader.readAsText(file);
        }
      } else {
        // For non-PDF files, use FileReader
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const text = event.target?.result as string;
            processResumeText(text);
          } catch (error) {
            handleParsingError(error);
          }
        };
        
        reader.onerror = () => {
          setUploadMessage(`Error reading file`);
          setIsUploading(false);
        };
        
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to upload resume'}`);
      setIsUploading(false);
    }
  };
  
  const processResumeText = async (text: string) => {
    try {
      // Try server-side AI parsing first
      try {
        const aiResponse = await fetch('/api/resume-analysis/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resumeText: text }),
        });
        
        if (aiResponse.ok) {
          const parsedData = await aiResponse.json();
          
          // Update form with the AI parsed data
          if (parsedData.name) form.setValue("name", parsedData.name);
          if (parsedData.email) form.setValue("email", parsedData.email);
          if (parsedData.phone) form.setValue("phone", parsedData.phone);
          if (parsedData.summary) form.setValue("summary", parsedData.summary);
          if (parsedData.education) form.setValue("education", parsedData.education);
          if (parsedData.experience) form.setValue("experience", parsedData.experience);
          if (parsedData.skills) form.setValue("skills", parsedData.skills);
          if (parsedData.projects) form.setValue("projects", parsedData.projects);
          if (parsedData.certifications) form.setValue("certifications", parsedData.certifications);
          
          // Always set the complete resume text
          form.setValue("resumeText", text);
          
          setUploadMessage(`Successfully parsed with AI: ${parsedData.name}'s resume`);
          setIsUploading(false);
          return;
        }
      } catch (aiError) {
        console.log("AI parsing fallback:", aiError);
      }
      
      // Fallback to client-side parsing
      fallbackParsing(text);
    } catch (error) {
      handleParsingError(error);
    }
  };
  
  const fallbackParsing = (text: string) => {
    // Enhanced parser logic
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let name = "";
    let email = "";
    let phone = "";
    let summary = "";
    let education = "";
    let experience = "";
    let skills = "";
    let projects = "";
    let certifications = "";
    
    // Try to detect structural patterns in the resume
    // Improved email detection with regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    // Improved phone detection for various formats
    const phoneRegex = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/;
    
    // First pass - identify email and phone
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for email pattern with regex
      const emailMatch = trimmed.match(emailRegex);
      if (emailMatch && !email) {
        email = emailMatch[0];
      }
      
      // Look for phone pattern with enhanced regex
      const phoneMatch = trimmed.match(phoneRegex);
      if (phoneMatch && !phone) {
        phone = trimmed;
      }
    }
    
    // Second pass - try to find the name (typically at the beginning)
    // Assume the first line that's not contact info is likely the name
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const trimmed = lines[i].trim();
      if (trimmed && 
          !trimmed.match(emailRegex) && 
          !trimmed.match(phoneRegex) && 
          !trimmed.match(/^https?:\/\//) && // Not a URL
          trimmed.split(' ').length <= 5 && // Likely a name (not too many words)
          !name) {
        name = trimmed;
        break;
      }
    }
    
    // Third pass - identify sections
    const sectionIndexes = [];
    const sectionNames = [];
    
    // Common section titles in resumes
    const sectionKeywords = {
      summary: ['summary', 'profile', 'objective', 'about', 'professional summary'],
      education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
      experience: ['experience', 'employment', 'work history', 'job history', 'professional experience'],
      skills: ['skills', 'expertise', 'technologies', 'technical skills', 'competencies', 'qualifications'],
      projects: ['projects', 'portfolio', 'case studies', 'project experience'],
      certifications: ['certifications', 'certificates', 'licenses', 'professional development']
    };
    
    // Find section headings
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      
      // Check if this line looks like a section heading
      let sectionType = null;
      for (const [type, keywords] of Object.entries(sectionKeywords)) {
        if (keywords.some(keyword => line.includes(keyword))) {
          sectionType = type;
          break;
        }
      }
      
      if (sectionType) {
        sectionIndexes.push(i);
        sectionNames.push(sectionType);
      }
    }
    
    // Extract section content based on identified sections
    for (let i = 0; i < sectionIndexes.length; i++) {
      const sectionStart = sectionIndexes[i] + 1; // Start after the heading
      const sectionEnd = i < sectionIndexes.length - 1 ? sectionIndexes[i + 1] : lines.length;
      const sectionContent = lines.slice(sectionStart, sectionEnd).join('\n');
      
      switch (sectionNames[i]) {
        case 'summary':
          summary = sectionContent;
          break;
        case 'education':
          education = sectionContent;
          break;
        case 'experience':
          experience = sectionContent;
          break;
        case 'skills':
          skills = sectionContent;
          break;
        case 'projects':
          projects = sectionContent;
          break;
        case 'certifications':
          certifications = sectionContent;
          break;
      }
    }
    
    // Clean up and format the extracted content
    const cleanText = (txt: string) => {
      return txt.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    };
    
    // Update form with the parsed data
    if (name) form.setValue("name", name);
    if (email) form.setValue("email", email);
    if (phone) form.setValue("phone", phone);
    if (summary) form.setValue("summary", cleanText(summary));
    if (education) form.setValue("education", cleanText(education));
    if (experience) form.setValue("experience", cleanText(experience));
    if (skills) form.setValue("skills", cleanText(skills));
    if (projects) form.setValue("projects", cleanText(projects));
    if (certifications) form.setValue("certifications", cleanText(certifications));
    
    // Always set the complete resume text
    form.setValue("resumeText", text);
    
    setUploadMessage(`Resume parsed: ${name || "Unnamed resume"}`);
    setIsUploading(false);
  };
  
  const handleParsingError = (error: any) => {
    console.error("Error parsing resume:", error);
    setUploadMessage(`Parsing error: ${error instanceof Error ? error.message : "Unknown error"}`);
    setIsUploading(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-3 sm:p-6 border-2 border-dashed rounded-lg border-blue-100 hover:border-primary/40 transition-colors bg-white">
        <div className="mb-3 sm:mb-4 bg-blue-50 p-2 sm:p-3 rounded-full">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
        </div>
        <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-center">Upload your resume</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center max-w-xs">
          Upload your existing resume and we'll extract the important information automatically
        </p>
        <Button 
          variant="outline" 
          className="relative overflow-hidden bg-white border-blue-500/30 text-blue-500 hover:bg-blue-500/5 text-xs sm:text-sm py-1 sm:py-2 h-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          type="button"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UploadCloud className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Select File
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.doc,.docx,.pdf,.rtf"
          onChange={handleFileUpload}
          onClick={(e) => e.stopPropagation()}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground mt-2 sm:mt-3">
          Supports .txt, .doc, .docx, .pdf files
        </p>
      </div>
    </div>
  );
};

const ResumePreview: React.FC<{
  formData: ResumeFormData;
  templateId: string;
}> = ({ formData, templateId }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
        <h3 className="font-medium text-sm text-blue-700">Live Preview</h3>
        <Badge variant="outline" className="text-xs bg-white">
          {RESUME_TEMPLATES.find(t => t.id === templateId)?.name || "Professional"} Template
        </Badge>
      </div>
      <div className="h-[400px] overflow-hidden relative">
        <PDFViewer className="w-full h-full">
          <ResumePDF 
            {...formData}
            template={templateId}
          />
        </PDFViewer>
      </div>
    </div>
  );
};

const ResumeTemplateSelector: React.FC<{
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}> = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {RESUME_TEMPLATES.map(template => (
        <div 
          key={template.id}
          className={cn(
            "border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md",
            selectedTemplate === template.id 
              ? "ring-2 ring-offset-1 bg-blue-50 border-blue-200" 
              : "bg-white hover:border-blue-200"
          )}
          onClick={() => onSelectTemplate(template.id)}
        >
          <div 
            className="w-full h-24 mb-2 rounded border flex items-center justify-center"
            style={{ borderColor: `${template.color}40`, backgroundColor: `${template.color}10` }}
          >
            <BookTemplate className="h-8 w-8" style={{ color: template.color }} />
          </div>
          <div className="text-sm font-medium text-center">{template.name}</div>
          <div className="text-xs text-center text-muted-foreground mt-1">{template.description}</div>
        </div>
      ))}
    </div>
  );
};

// AI optimization component
const JobTargeting: React.FC<{
  form: any;
  isOptimizing: boolean;
  onOptimize: () => void;
}> = ({ form, isOptimizing, onOptimize }) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-blue-50/50">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-500" />
          Target Job Position
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Enter a job title and/or paste a job description to tailor your resume
        </p>
        
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="targetJobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Job Title</FormLabel>
                <FormControl>
                  <Input 
                    className="text-xs h-8" 
                    placeholder="e.g. Marketing Manager" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Job Description (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    className="text-xs min-h-[80px]" 
                    placeholder="Paste the job description here for better keyword matching..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <Button
            type="button"
            className="w-full text-xs h-8"
            onClick={onOptimize}
            disabled={isOptimizing || !form.watch("targetJobTitle")}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Optimizing Resume...
              </>
            ) : (
              <>
                <Wand2 className="mr-1 h-3 w-3" />
                Optimize Resume
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// AI bullet point suggestion component
const BulletPointEnhancer: React.FC<{
  section: string;
  content: string;
  onApplySuggestion: (newContent: string) => void;
}> = ({ section, content, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const generateSuggestions = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: `Please add some text to your ${section.toLowerCase()} section first.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/resume-analysis/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate suggestions (${response.status})`);
      }
      
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setError(error instanceof Error ? error.message : "Failed to generate suggestions");
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="ml-auto h-7 text-xs border-blue-200 text-blue-500 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <Wand2 className="mr-1 h-3 w-3" />
          Enhance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-500" />
            Enhance {section} Section
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            Our AI can suggest improvements to your {section.toLowerCase()} to make it more impactful.
          </p>
          
          {!suggestions.length && !isLoading && (
            <Button
              type="button"
              onClick={generateSuggestions}
              className="w-full text-sm"
            >
              <Wand2 className="mr-1 h-4 w-4" />
              Generate AI Suggestions
            </Button>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm text-muted-foreground">Generating suggestions...</p>
              </div>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Suggested Improvements:</h3>
              <ScrollArea className="h-[200px] border rounded-md p-3 bg-blue-50/30">
                <div className="space-y-3">
                  {suggestions.map((suggestion, i) => (
                    <div key={i} className="p-2 bg-white rounded border text-sm">
                      <p className="mb-1">{suggestion}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 text-xs h-7"
                        onClick={() => onApplySuggestion(suggestion)}
                      >
                        <CheckCheck className="mr-1 h-3 w-3" />
                        Apply This
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Button
                type="button"
                onClick={generateSuggestions}
                variant="outline"
                className="text-sm"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Generate New Suggestions
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ResumeBuilderEnhanced() {
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      summary: "",
      education: "",
      experience: "",
      skills: "",
      projects: "",
      certifications: "",
      resumeText: "",
      targetJobTitle: "",
      jobDescription: ""
    }
  });

  const hasContent = form.watch("resumeText") !== "";
  
  const handleAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      const resumeText = form.getValues("resumeText");
      if (!resumeText) {
        setAnalysisError("Please upload or enter resume content first");
        return;
      }
      
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
      
      // Update form with AI analysis results
      if (result.name) form.setValue("name", result.name);
      if (result.email) form.setValue("email", result.email);
      if (result.phone) form.setValue("phone", result.phone);
      if (result.summary) form.setValue("summary", result.summary);
      if (result.education) form.setValue("education", result.education);
      if (result.experience) form.setValue("experience", result.experience);
      if (result.skills) form.setValue("skills", result.skills);
      
      toast({
        title: "AI Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
      
    } catch (error) {
      console.error("AI analysis error:", error);
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze resume");
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleResumeOptimize = async () => {
    const targetJob = form.getValues("targetJobTitle");
    const jobDescription = form.getValues("jobDescription");
    
    if (!targetJob) {
      toast({
        title: "Missing Information",
        description: "Please enter a target job title.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsOptimizing(true);
      
      const response = await fetch('/api/resume-analysis/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: {
            summary: form.getValues("summary"),
            experience: form.getValues("experience"),
            education: form.getValues("education"),
            skills: form.getValues("skills"),
            projects: form.getValues("projects"),
            certifications: form.getValues("certifications"),
          },
          targetJob,
          jobDescription
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to optimize resume (${response.status})`);
      }
      
      const data = await response.json();
      
      // Update form with optimized content
      if (data.summary) form.setValue("summary", data.summary);
      if (data.experience) form.setValue("experience", data.experience);
      if (data.skills) form.setValue("skills", data.skills);
      
      toast({
        title: "Resume Optimized",
        description: `Your resume has been optimized for "${targetJob}" positions.`,
      });
      
    } catch (error) {
      console.error("Resume optimization error:", error);
      toast({
        title: "Optimization Error",
        description: error instanceof Error ? error.message : "Failed to optimize resume",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Function to handle applying AI suggestions to a specific section
  const handleApplySuggestion = useCallback((section: keyof ResumeFormData, suggestion: string) => {
    form.setValue(section, suggestion);
    toast({
      title: "Suggestion Applied",
      description: `The ${section} section has been updated.`,
    });
  }, [form, toast]);
  
  // Sections to show in the editor
  const editorSections = [
    { id: "summary", label: "Professional Summary", icon: User },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: List },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Controls */}
        <div className="col-span-1 space-y-4 sm:space-y-6">
          <Card className="shadow-sm bg-white border-t-4 border-t-blue-500">
            <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Resume Builder
              </CardTitle>
              <CardDescription>
                Create a professional resume in minutes
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-3 py-2 sm:px-6 sm:py-0">
              <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                  <TabsTrigger value="upload" className="px-2 py-1 sm:px-4 sm:py-2">Upload Resume</TabsTrigger>
                  <TabsTrigger value="manual" className="px-2 py-1 sm:px-4 sm:py-2">Manual Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0">
                  <FileUpload 
                    onUpload={(text) => form.setValue("resumeText", text)}
                    setUploadMessage={setUploadMessage}
                    form={form}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />
                  
                  {uploadMessage && (
                    <div className={cn(
                      "flex items-center gap-2 mt-4 p-3 rounded-md text-sm",
                      uploadMessage.includes('Successfully') || uploadMessage.includes('parsed') 
                        ? "bg-green-50/70 text-green-600 border border-green-100" 
                        : "bg-red-50/70 text-red-600 border border-red-100"
                    )}>
                      {uploadMessage.includes('Successfully') || uploadMessage.includes('parsed') ? (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span>{uploadMessage}</span>
                    </div>
                  )}
                  
                  {hasContent && (
                    <div className="mt-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-sm">Resume Data</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white border-blue-300 text-blue-500 hover:bg-blue-50 text-xs h-7"
                            onClick={handleAIAnalysis}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Lightbulb className="mr-1 h-3 w-3" />
                                AI Analysis
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white border-blue-300 text-blue-500 hover:bg-blue-50 text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab("manual");
                            }}
                          >
                            <Pencil className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      {analysisError && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{analysisError}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Name</div>
                          <div className="text-sm border border-blue-50 bg-blue-50/50 p-1.5 rounded">{form.watch("name") || "Not detected"}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Email</div>
                          <div className="text-sm border border-blue-50 bg-blue-50/50 p-1.5 rounded">{form.watch("email") || "Not detected"}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Phone</div>
                          <div className="text-sm border border-blue-50 bg-blue-50/50 p-1.5 rounded truncate">{form.watch("phone") || "Not detected"}</div>
                        </div>
                      </div>
                      
                      {analysis && (
                        <div className="mt-4 border border-blue-200 rounded-md p-3 bg-blue-50/50">
                          <h3 className="text-xs font-medium mb-2 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-blue-500" />
                            AI Resume Analysis
                          </h3>
                          
                          <div className="space-y-3 text-xs">
                            <div>
                              <h4 className="font-medium flex items-center gap-1 text-green-600 mb-1">
                                <ThumbsUp className="h-3 w-3" /> Strengths
                              </h4>
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {analysis.analysis.strengths.map((strength, i) => (
                                  <li key={`strength-${i}`} className="text-gray-700">{strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium flex items-center gap-1 text-amber-600 mb-1">
                                <ThumbsDown className="h-3 w-3" /> Areas for Improvement
                              </h4>
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {analysis.analysis.weaknesses.map((weakness, i) => (
                                  <li key={`weakness-${i}`} className="text-gray-700">{weakness}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium flex items-center gap-1 text-blue-500 mb-1">
                                <Lightbulb className="h-3 w-3" /> Suggestions
                              </h4>
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {analysis.analysis.suggestions.map((suggestion, i) => (
                                  <li key={`suggestion-${i}`} className="text-gray-700">{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="manual" className="mt-0">
                  <Form {...form}>
                    <form className="space-y-4 sm:space-y-5" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-2 sm:left-3 top-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                  <Input className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-2 sm:left-3 top-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                  <Input className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-9" type="email" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-2 sm:left-3 top-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                <Input className="pl-7 sm:pl-9 text-xs sm:text-sm h-8 sm:h-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      {/* Each editable section with AI enhancement option */}
                      {editorSections.map(section => (
                        <FormField
                          key={section.id}
                          control={form.control}
                          name={section.id as keyof ResumeFormData}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-xs flex items-center gap-1.5">
                                  <section.icon className="h-3 w-3 text-blue-500" />
                                  {section.label}
                                </FormLabel>
                                <BulletPointEnhancer 
                                  section={section.label}
                                  content={field.value as string}
                                  onApplySuggestion={(newContent) => 
                                    handleApplySuggestion(section.id as keyof ResumeFormData, newContent)
                                  }
                                />
                              </div>
                              <FormControl>
                                <Textarea 
                                  placeholder={`Enter your ${section.label.toLowerCase()}...`}
                                  className="min-h-[60px] text-xs"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      ))}
                      
                      <FormField
                        control={form.control}
                        name="resumeText"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="border-t border-blue-50 p-3 sm:p-6">
              {hasContent && (
                <PDFDownloadLink
                  document={
                    <ResumePDF 
                      name={form.watch("name")}
                      email={form.watch("email")}
                      phone={form.watch("phone")}
                      summary={form.watch("summary")}
                      education={form.watch("education")}
                      experience={form.watch("experience")}
                      skills={form.watch("skills")}
                      projects={form.watch("projects")}
                      certifications={form.watch("certifications")}
                      resumeText={form.watch("resumeText")}
                      template={selectedTemplate}
                    />
                  }
                  fileName="professional_resume.pdf"
                  className="block w-full"
                >
                  {({ loading, error }) => (
                    <Button 
                      type="button"
                      size="default"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm py-1.5 sm:py-2 h-auto" 
                      disabled={loading || !form.formState.isValid || isUploading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          <span className="sm:inline">Generating PDF...</span>
                          <span className="inline sm:hidden">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="sm:inline">Download Resume PDF</span>
                          <span className="inline sm:hidden">Download PDF</span>
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </CardFooter>
          </Card>
          
          {/* AI Targeting Card */}
          {hasContent && (
            <Card className="shadow-sm bg-white">
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-blue-500" />
                  Resume Optimization
                </CardTitle>
                <CardDescription>
                  Tailor your resume for specific jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-0">
                <JobTargeting 
                  form={form} 
                  isOptimizing={isOptimizing} 
                  onOptimize={handleResumeOptimize} 
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Preview and Templates */}
        <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
          {hasContent && (
            <>
              <Card className="shadow-sm bg-white">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookTemplate className="h-4 w-4 text-blue-500" />
                    Resume Template
                  </CardTitle>
                  <CardDescription>
                    Choose a style for your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ResumeTemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                  />
                </CardContent>
              </Card>
              
              {/* Live Preview */}
              <ResumePreview 
                formData={{
                  name: form.watch("name"),
                  email: form.watch("email"),
                  phone: form.watch("phone"),
                  summary: form.watch("summary"),
                  education: form.watch("education"),
                  experience: form.watch("experience"),
                  skills: form.watch("skills"),
                  projects: form.watch("projects"),
                  certifications: form.watch("certifications"),
                  resumeText: form.watch("resumeText"),
                  targetJobTitle: form.watch("targetJobTitle"),
                  jobDescription: form.watch("jobDescription")
                }}
                templateId={selectedTemplate}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}