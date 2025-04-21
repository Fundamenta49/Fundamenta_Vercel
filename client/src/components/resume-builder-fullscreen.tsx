import { useState, useRef } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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
  BookText,
  List,
  CheckCheck,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  X,
  ChevronLeft,
  Zap
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { analyzeResume, type ResumeAnalysis } from "@/lib/resume-analysis";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { sampleResumeStructured, sampleAnalysis } from "@/lib/sample-resume";
import { ResumeGuide } from "./resume-guide";
import { ResumeChecklist } from "./resume-checklist";
import { ResumeTutorial } from "./resume-tutorial";

// Form validation schema
const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  projects: z.string().optional(),
  certifications: z.string().optional(),
  resumeText: z.string().min(1, "Resume content is required"),
  targetJobTitle: z.string().optional(),
  jobDescription: z.string().optional(),
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

// File Upload Component
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
          
          const response = await fetch('/api/resume/upload', {
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
        const aiResponse = await fetch('/api/resume/parse', {
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
    
    setUploadMessage(`Successfully parsed: ${name || "your"} resume`);
    setIsUploading(false);
  };
  
  const handleParsingError = (error: any) => {
    console.error("Parsing error:", error);
    setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to parse resume'}`);
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      <div 
        className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium mb-1">Upload your resume</h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          Drag and drop your file here, or click to browse
        </p>
        <p className="text-xs text-gray-400 text-center">
          Supports PDF, DOCX, and TXT (Max 5MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileUpload}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {uploadMessage && (
        <Alert className={cn(
          "mt-2",
          uploadMessage.includes("Error") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
        )}>
          {uploadMessage.includes("Error") ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          <AlertDescription className="text-sm">
            {isUploading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {uploadMessage}
              </div>
            ) : (
              uploadMessage
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// AI Enhancement Section Component
const EnhanceSection: React.FC<{
  sectionName: string;
  sectionValue: string;
  updateSection: (value: string) => void;
  icon: React.ReactNode;
}> = ({ sectionName, sectionValue, updateSection, icon }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState("");
  const { toast } = useToast();
  
  const enhanceContent = async () => {
    if (!sectionValue) {
      toast({
        title: "Section Empty",
        description: `Please add some content to your ${sectionName.toLowerCase()} first.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsEnhancing(true);
    
    try {
      const response = await fetch('/api/resume/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          section: sectionName.toLowerCase(),
          content: sectionValue
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to enhance ${sectionName.toLowerCase()}`);
      }
      
      const data = await response.json();
      if (data.enhanced) {
        setEnhancedContent(data.enhanced);
      } else {
        throw new Error("No enhanced content returned");
      }
    } catch (error) {
      console.error(`Enhancement error for ${sectionName}:`, error);
      toast({
        title: "Enhancement Failed",
        description: error instanceof Error ? error.message : "Failed to enhance section",
        variant: "destructive"
      });
      
      // Fallback to some basic enhancements
      const basicEnhancement = await getBasicEnhancement(sectionName, sectionValue);
      setEnhancedContent(basicEnhancement);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Basic client-side enhancement as fallback
  const getBasicEnhancement = async (section: string, content: string): Promise<string> => {
    // This is a very simple enhancement - in production you'd want more sophisticated logic
    
    // For bullet points, ensure each line starts with a bullet
    let enhanced = content.split('\n').map(line => {
      line = line.trim();
      if (line.length > 0 && !line.startsWith('•') && !line.startsWith('-')) {
        return `• ${line}`;
      }
      return line;
    }).join('\n');
    
    // Simple capitalization fixes
    enhanced = enhanced.replace(/\bi\b/g, 'I');
    
    // Simple tense improvements for experience sections
    if (section.toLowerCase() === 'experience') {
      // Convert passive to active voice (very basic)
      enhanced = enhanced.replace(/was responsible for/gi, 'managed');
      enhanced = enhanced.replace(/was tasked with/gi, 'led');
      
      // Add action verbs
      const lines = enhanced.split('\n');
      const actionVerbs = [
        'Developed', 'Implemented', 'Managed', 'Led', 'Created', 
        'Designed', 'Analyzed', 'Improved', 'Increased', 'Achieved'
      ];
      
      const enhancedLines = lines.map(line => {
        // If line starts with a bullet but not an action verb, add one
        if ((line.startsWith('•') || line.startsWith('-')) && 
            !actionVerbs.some(verb => line.substring(2).trim().startsWith(verb))) {
          const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
          return `• ${randomVerb} ${line.substring(2).trim()}`;
        }
        return line;
      });
      
      enhanced = enhancedLines.join('\n');
    }
    
    return enhanced;
  };
  
  const applyEnhancement = () => {
    updateSection(enhancedContent);
    setEnhancedContent("");
    toast({
      title: "Enhancement Applied",
      description: `Your ${sectionName.toLowerCase()} has been enhanced successfully.`,
    });
  };
  
  const dismissEnhancement = () => {
    setEnhancedContent("");
  };
  
  return (
    <div className="mb-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-semibold">{sectionName}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={enhanceContent}
          disabled={isEnhancing || !sectionValue}
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Lightbulb className="h-3 w-3 mr-1" />
              Enhance
            </>
          )}
        </Button>
      </div>
      
      {enhancedContent && (
        <div className="mt-2 mb-3 border border-blue-200 rounded-md p-3 bg-blue-50">
          <div className="text-xs text-blue-700 mb-2 font-medium flex items-center">
            <Lightbulb className="h-3 w-3 mr-1 text-blue-500" />
            AI Enhancement Suggestion
          </div>
          <div className="text-xs whitespace-pre-wrap bg-white p-2 rounded border border-blue-100 mb-2">
            {enhancedContent}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs"
              onClick={dismissEnhancement}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
            <Button 
              size="sm" 
              className="h-6 text-xs bg-blue-500 hover:bg-blue-600"
              onClick={applyEnhancement}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Job Targeting Component
const JobTargeting: React.FC<{
  onOptimize: () => void;
  isOptimizing: boolean;
  form: any;
}> = ({ onOptimize, isOptimizing, form }) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm max-w-md mx-auto">
      <div className="space-y-2">
        <h3 className="text-base font-medium flex items-center gap-1.5">
          <Briefcase className="h-4 w-4 text-blue-500" />
          Target Job Optimization
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Enter a job title and/or paste a job description to tailor your resume
        </p>
        
        <Form {...form}>
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
              className="w-full text-xs h-8 bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white"
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
        </Form>
      </div>
    </div>
  );
};

// Resume Preview Component
const ResumePreview: React.FC<{
  form: any;
  selectedTemplate: string;
  fileData?: { fileName: string; fileSize: string };
}> = ({ form, selectedTemplate, fileData }) => {
  const formValues = form.getValues();
  
  return (
    <div className="min-h-[300px] border rounded-lg p-4 bg-white">
      <div className="mb-4 pb-2 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">{formValues.name || "Your Name"}</h3>
        {fileData && (
          <div className="flex items-center text-xs text-gray-500">
            <FileText className="h-3 w-3 mr-1" />
            {fileData.fileName} ({fileData.fileSize})
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm">
          {formValues.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="h-3 w-3 mr-1" />
              {formValues.email}
            </div>
          )}
          
          {formValues.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-3 w-3 mr-1" />
              {formValues.phone}
            </div>
          )}
        </div>
        
        {formValues.summary && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Professional Summary</h4>
            <p className="text-xs whitespace-pre-wrap">{formValues.summary}</p>
          </div>
        )}
        
        {formValues.experience && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Experience</h4>
            <p className="text-xs whitespace-pre-wrap">{formValues.experience}</p>
          </div>
        )}
        
        {formValues.education && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Education</h4>
            <p className="text-xs whitespace-pre-wrap">{formValues.education}</p>
          </div>
        )}
        
        {formValues.skills && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Skills</h4>
            <p className="text-xs whitespace-pre-wrap">{formValues.skills}</p>
          </div>
        )}
        
        {formValues.projects && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Projects</h4>
            <p className="text-xs whitespace-pre-wrap">{formValues.projects}</p>
          </div>
        )}
        
        {formValues.certifications && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Certifications</h4>
            <p className="text-xs whitespace-pre-wrap">{formValues.certifications}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResumeBuilderFullscreen({ onClose }: { onClose: () => void }) {
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const { toast } = useToast();

  // Form setup for resume data
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
      jobDescription: "",
    },
    mode: "onChange",
  });

  // Handle resume file upload
  const handleResumeUpload = (text: string) => {
    // Set the full text content
    form.setValue("resumeText", text);
    
    // Analyze the resume for keyword insights
    analyzeResumeData(text);
  };

  // Analyze the resume to provide insights
  const analyzeResumeData = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const analysis = await analyzeResume(text);
      setAnalysis(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError("Failed to analyze resume. Please try again.");
      
      // Set sample analysis as fallback
      setAnalysis(sampleAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle form submission
  const onSubmit = (data: ResumeFormData) => {
    // In a real application, you'd save the resume to a database here
    console.log("Form submitted:", data);
    
    toast({
      title: "Resume Updated",
      description: "Your resume has been successfully updated.",
    });
  };

  // Handle job targeting optimization
  const handleOptimizeForJob = async () => {
    const { targetJobTitle, jobDescription } = form.getValues();
    
    if (!targetJobTitle) {
      toast({
        title: "Job Title Required",
        description: "Please enter a target job title for optimization.",
        variant: "destructive"
      });
      return;
    }
    
    setIsOptimizing(true);
    
    try {
      const response = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: form.getValues(),
          jobTitle: targetJobTitle,
          jobDescription: jobDescription || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to optimize resume");
      }
      
      const data = await response.json();
      
      // Update form with optimized content
      if (data.optimized) {
        if (data.optimized.summary) form.setValue("summary", data.optimized.summary);
        if (data.optimized.experience) form.setValue("experience", data.optimized.experience);
        if (data.optimized.skills) form.setValue("skills", data.optimized.skills);
        
        toast({
          title: "Resume Optimized",
          description: `Your resume has been optimized for "${targetJobTitle}" position.`,
        });
      } else {
        throw new Error("No optimization data returned");
      }
    } catch (error) {
      console.error("Optimization error:", error);
      
      // Basic client-side optimization as fallback
      const currentValues = form.getValues();
      
      // Enhance summary with job title
      if (currentValues.summary) {
        const enhancedSummary = currentValues.summary
          .replace(/experienced professional/gi, `experienced ${targetJobTitle}`)
          .replace(/seeking a position/gi, `seeking a ${targetJobTitle} position`);
        
        form.setValue("summary", enhancedSummary);
      }
      
      // Simple keyword matching for skills
      if (currentValues.skills && jobDescription) {
        // Extract potential keywords from job description
        const keywords = jobDescription.toLowerCase()
          .split(/[.,;:\s]+/)
          .filter(word => word.length > 3 && !['and', 'the', 'with', 'for'].includes(word));
        
        // Check if any keywords are missing from skills
        const skills = currentValues.skills.toLowerCase();
        const missingKeywords = keywords.filter(
          keyword => !skills.includes(keyword) && Math.random() > 0.7 // Add only some keywords
        ).slice(0, 3); // Limit to 3 keywords
        
        if (missingKeywords.length > 0) {
          const enhancedSkills = currentValues.skills + `\n• ${missingKeywords.join(', ')}`;
          form.setValue("skills", enhancedSkills);
        }
      }
      
      toast({
        title: "Basic Optimization Applied",
        description: "We've made basic optimizations for your target job. API-based optimization failed.",
        variant: "default"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Load sample resume data
  const loadSampleResume = () => {
    // Use sample data
    form.reset(sampleResumeStructured);
    setAnalysis(sampleAnalysis);
    toast({
      title: "Sample Resume Loaded",
      description: "A sample resume has been loaded for demonstration purposes.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close resume builder"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Resume Builder
              </h1>
              <p className="text-sm text-gray-500">Create a professional resume to boost your career</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex items-center gap-1.5"
              onClick={() => setShowGuide(true)}
            >
              <BookOpen className="h-4 w-4" />
              Resume Guide
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex items-center gap-1.5"
              onClick={() => setShowChecklist(true)}
            >
              <List className="h-4 w-4" />
              Checklist
            </Button>
            
            <PDFDownloadLink
              document={
                <ResumePDF 
                  {...form.getValues()} 
                  template={selectedTemplate}
                />
              }
              fileName={`${form.getValues().name || 'resume'}_${new Date().toISOString().split('T')[0]}.pdf`}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                "ring-offset-background transition-colors focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "bg-blue-500 text-white hover:bg-blue-600 h-9 px-4 py-2",
                (!form.getValues().name || !form.getValues().email) && "opacity-50 pointer-events-none"
              )}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </PDFDownloadLink>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto p-4">
        <div className="mb-6">
          <Alert className="mb-4 border-blue-500 bg-blue-50">
            <Zap className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-800 text-sm">
              Our AI-powered resume builder helps you create interview-winning resumes in minutes. 
              Upload an existing resume or start from scratch, and let our AI enhance it with impactful bullet points 
              and targeted optimizations.
            </AlertDescription>
          </Alert>
          
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="target">Job Targeting</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TabsContent value="upload" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <FileUpload 
                        onUpload={handleResumeUpload}
                        setUploadMessage={setUploadMessage}
                        form={form}
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                      />
                      
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={loadSampleResume}
                        >
                          <FileText className="h-3 w-3 mr-1.5" />
                          Load Sample Resume
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="manual" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <Form {...form}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-blue-500" />
                                    Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="johndoe@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-blue-500" />
                                    Phone
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="(123) 456-7890" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="summary"
                              render={({ field }) => (
                                <FormItem>
                                  <EnhanceSection
                                    sectionName="Professional Summary"
                                    sectionValue={field.value || ""}
                                    updateSection={(value) => form.setValue("summary", value)}
                                    icon={<User className="h-3.5 w-3.5 text-blue-500" />}
                                  />
                                  <FormControl>
                                    <Textarea
                                      placeholder="Highly motivated professional with 5+ years of experience..."
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="experience"
                              render={({ field }) => (
                                <FormItem>
                                  <EnhanceSection
                                    sectionName="Work Experience"
                                    sectionValue={field.value || ""}
                                    updateSection={(value) => form.setValue("experience", value)}
                                    icon={<Briefcase className="h-3.5 w-3.5 text-blue-500" />}
                                  />
                                  <FormControl>
                                    <Textarea
                                      placeholder="Senior Developer | XYZ Corp | 2018-Present&#10;• Led development of customer-facing applications&#10;• Improved system performance by 40%"
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="education"
                              render={({ field }) => (
                                <FormItem>
                                  <EnhanceSection
                                    sectionName="Education"
                                    sectionValue={field.value || ""}
                                    updateSection={(value) => form.setValue("education", value)}
                                    icon={<GraduationCap className="h-3.5 w-3.5 text-blue-500" />}
                                  />
                                  <FormControl>
                                    <Textarea
                                      placeholder="Bachelor of Science in Computer Science&#10;University of California, Los Angeles | 2014-2018"
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="skills"
                              render={({ field }) => (
                                <FormItem>
                                  <EnhanceSection
                                    sectionName="Skills"
                                    sectionValue={field.value || ""}
                                    updateSection={(value) => form.setValue("skills", value)}
                                    icon={<Layers className="h-3.5 w-3.5 text-blue-500" />}
                                  />
                                  <FormControl>
                                    <Textarea
                                      placeholder="• JavaScript, TypeScript, React&#10;• Project Management, Team Leadership&#10;• Data Analysis, Visualization"
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="projects"
                              render={({ field }) => (
                                <FormItem>
                                  <EnhanceSection
                                    sectionName="Projects"
                                    sectionValue={field.value || ""}
                                    updateSection={(value) => form.setValue("projects", value)}
                                    icon={<Pencil className="h-3.5 w-3.5 text-blue-500" />}
                                  />
                                  <FormControl>
                                    <Textarea
                                      placeholder="E-commerce Platform Redesign | 2020&#10;• Led UX redesign that increased conversion by 25%&#10;• Implemented new payment processing system"
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={form.control}
                              name="certifications"
                              render={({ field }) => (
                                <FormItem>
                                  <EnhanceSection
                                    sectionName="Certifications"
                                    sectionValue={field.value || ""}
                                    updateSection={(value) => form.setValue("certifications", value)}
                                    icon={<Award className="h-3.5 w-3.5 text-blue-500" />}
                                  />
                                  <FormControl>
                                    <Textarea
                                      placeholder="• AWS Certified Solutions Architect | 2021&#10;• Google Professional Data Engineer | 2020"
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="target" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <JobTargeting 
                        onOptimize={handleOptimizeForJob}
                        isOptimizing={isOptimizing}
                        form={form}
                      />
                      
                      {analysis && (
                        <Card className="mt-6 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium flex items-center gap-1.5">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                Resume Analysis
                              </h3>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => analyzeResumeData(form.getValues().resumeText)}
                                disabled={isAnalyzing}
                                className="h-7 px-2"
                              >
                                {isAnalyzing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            
                            {analysisError ? (
                              <Alert variant="destructive" className="text-xs p-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  {analysisError}
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <>
                                <div className="mb-3">
                                  <h4 className="text-xs font-medium mb-1">Top Skills Detected</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {analysis.skills.map((skill, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mb-3">
                                  <h4 className="text-xs font-medium mb-1">Experience Level</h4>
                                  <p className="text-xs">{analysis.experienceLevel}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium mb-1">Improvement Suggestions</h4>
                                  <ul className="text-xs space-y-1 list-disc pl-4">
                                    {analysis.improvementAreas.map((area, i) => (
                                      <li key={i}>{area}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-[90px]">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <BookTemplate className="h-4 w-4 text-blue-500" />
                      Template Style
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {RESUME_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          className={cn(
                            "border rounded-md p-2 text-center text-xs transition-all",
                            selectedTemplate === template.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          )}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div 
                            className="w-full h-6 mb-1 rounded"
                            style={{ backgroundColor: template.color }}
                          />
                          <span className="font-medium">{template.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Resume Preview
                  </h3>
                  
                  <ResumePreview 
                    form={form}
                    selectedTemplate={selectedTemplate}
                  />
                  
                  <div className="mt-4 flex justify-center">
                    <PDFDownloadLink
                      document={
                        <ResumePDF 
                          {...form.getValues()} 
                          template={selectedTemplate}
                        />
                      }
                      fileName={`${form.getValues().name || 'resume'}_${new Date().toISOString().split('T')[0]}.pdf`}
                      className={cn(
                        "inline-flex items-center justify-center rounded-md text-sm font-medium",
                        "ring-offset-background transition-colors focus-visible:outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:pointer-events-none disabled:opacity-50",
                        "bg-blue-500 text-white hover:bg-blue-600 h-9 px-4 py-2 w-full",
                        (!form.getValues().name || !form.getValues().email) && "opacity-50 pointer-events-none"
                      )}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </PDFDownloadLink>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Mobile bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 flex justify-between items-center lg:hidden">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 text-xs h-8"
            onClick={() => setShowGuide(true)}
          >
            <BookOpen className="h-3 w-3" />
            Guide
          </Button>
            
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 text-xs h-8"
            onClick={() => setShowChecklist(true)}
          >
            <CheckCheck className="h-3 w-3" />
            Checklist
          </Button>
        </div>
        
        <PDFDownloadLink
          document={
            <ResumePDF 
              {...form.getValues()} 
              template={selectedTemplate}
            />
          }
          fileName={`${form.getValues().name || 'resume'}_${new Date().toISOString().split('T')[0]}.pdf`}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium",
            "ring-offset-background transition-colors focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-blue-500 text-white hover:bg-blue-600 text-xs h-8 px-3",
            (!form.getValues().name || !form.getValues().email) && "opacity-50 pointer-events-none"
          )}
        >
          <Download className="h-3 w-3 mr-1.5" />
          Download PDF
        </PDFDownloadLink>
      </div>
      
      {/* Resume Guide Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Resume Writing Guide
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <ResumeGuide />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Resume Checklist Dialog */}
      <Dialog open={showChecklist} onOpenChange={setShowChecklist}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-500" />
              Resume Checklist
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <ResumeChecklist />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Resume Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-500" />
              How to Use the Resume Builder
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <ResumeTutorial />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}