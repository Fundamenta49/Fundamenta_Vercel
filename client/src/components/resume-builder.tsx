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
  Phone
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Form validation schema
const resumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  resumeText: z.string().min(1, "Resume content is required")
});

type ResumeFormData = z.infer<typeof resumeSchema>;

// Styles for PDF generation
const styles = StyleSheet.create({
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
    color: '#5858FF' 
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
    color: '#5858FF',
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#1F2937',
  },
});

const ResumePDF: React.FC<ResumeFormData> = ({
  name,
  email,
  phone,
  summary,
  education,
  experience,
  skills,
  resumeText
}) => (
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
      
      {/* Include the full text at the bottom if none of the above sections are filled */}
      {(!summary && !education && !experience && !skills) && (
        <Text style={styles.sectionContent}>{resumeText}</Text>
      )}
    </Page>
  </Document>
);

const FileUpload: React.FC<{
  onUpload: (text: string) => void;
  setUploadMessage: (message: string) => void;
  form: any;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}> = ({ onUpload, setUploadMessage, form, isUploading, setIsUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text extraction from file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadMessage("Processing resume...");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        
        // Simple parser - in real app this would be more sophisticated
        const lines = text.split('\n');
        let name = "";
        let email = "";
        let phone = "";
        let summary = "";
        let education = "";
        let experience = "";
        let skills = "";
        
        // Basic extraction logic - find potential name/email/phone
        for (const line of lines) {
          const trimmed = line.trim();
          
          // Look for email pattern
          if (trimmed.includes('@') && !email) {
            email = trimmed;
          }
          
          // Look for phone pattern (simple check for digits)
          if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(trimmed) && !phone) {
            phone = trimmed;
          }
          
          // First non-empty line that's not email/phone is likely a name
          if (trimmed && !trimmed.includes('@') && !/^\d+$/.test(trimmed) && !name) {
            name = trimmed;
          }

          // Very basic section detection
          if (trimmed.toLowerCase().includes('summary') || 
              trimmed.toLowerCase().includes('profile') ||
              trimmed.toLowerCase().includes('objective')) {
            summary = text.substring(text.indexOf(trimmed) + trimmed.length, text.indexOf('experience', text.indexOf(trimmed)) >= 0 ? 
              text.indexOf('experience', text.indexOf(trimmed)) : 
              text.length).trim();
          }

          if (trimmed.toLowerCase().includes('education')) {
            education = text.substring(text.indexOf(trimmed) + trimmed.length, text.indexOf('skills', text.indexOf(trimmed)) >= 0 ? 
              text.indexOf('skills', text.indexOf(trimmed)) : 
              text.length).trim();
          }

          if (trimmed.toLowerCase().includes('experience') || 
              trimmed.toLowerCase().includes('employment')) {
            experience = text.substring(text.indexOf(trimmed) + trimmed.length, text.indexOf('education', text.indexOf(trimmed)) >= 0 ? 
              text.indexOf('education', text.indexOf(trimmed)) : 
              text.length).trim();
          }

          if (trimmed.toLowerCase().includes('skills') || 
              trimmed.toLowerCase().includes('expertise') ||
              trimmed.toLowerCase().includes('technologies')) {
            skills = text.substring(text.indexOf(trimmed) + trimmed.length, text.length).trim().split('\n').slice(0, 15).join('\n');
          }
        }
        
        // Update form
        if (name) form.setValue("name", name);
        if (email) form.setValue("email", email);
        if (phone) form.setValue("phone", phone);
        if (summary) form.setValue("summary", summary);
        if (education) form.setValue("education", education);
        if (experience) form.setValue("experience", experience);
        if (skills) form.setValue("skills", skills);
        form.setValue("resumeText", text);
        
        setUploadMessage(`Successfully parsed: ${file.name}`);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        setUploadMessage(`Error reading file`);
        setIsUploading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Resume upload error:", error);
      setUploadMessage(`Error: ${error instanceof Error ? error.message : 'Failed to upload resume'}`);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-rose-100 hover:border-primary/40 transition-colors bg-white">
        <div className="mb-4 bg-rose-50 p-3 rounded-full">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
          Upload your existing resume and we'll extract the important information automatically
        </p>
        <Button 
          variant="outline" 
          className="relative overflow-hidden bg-white border-primary/30 text-primary hover:bg-primary/5"
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
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
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
        <p className="text-xs text-muted-foreground mt-3">
          Supports .txt, .doc, .docx, .pdf files
        </p>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

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
      resumeText: ""
    }
  });

  const hasContent = form.watch("resumeText") !== "";

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm border-rose-50 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resume Builder
          </CardTitle>
          <CardDescription>
            Create a professional resume in minutes - upload an existing resume or build one from scratch
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
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
                  uploadMessage.includes('Successfully') 
                    ? "bg-green-50/70 text-green-600 border border-green-100" 
                    : "bg-red-50/70 text-red-600 border border-red-100"
                )}>
                  {uploadMessage.includes('Successfully') ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{uploadMessage}</span>
                </div>
              )}
              
              {hasContent && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Review & Edit</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => setActiveTab("manual")}
                    >
                      Edit Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Name</div>
                      <div className="text-sm border border-rose-50 bg-white p-2 rounded shadow-sm">{form.watch("name") || "Not detected"}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm border border-rose-50 bg-white p-2 rounded shadow-sm">{form.watch("email") || "Not detected"}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm border border-rose-50 bg-white p-2 rounded shadow-sm">{form.watch("phone") || "Not detected"}</div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="manual" className="mt-0">
              <Form {...form}>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" {...field} />
                            </div>
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief summary of your professional background and key strengths..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Experience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your work history and job responsibilities..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your educational background..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List your key skills and competencies..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
        
        <CardFooter className="flex justify-end border-t border-rose-50 p-6">
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
                  resumeText={form.watch("resumeText")}
                />
              }
              fileName="professional_resume.pdf"
              className="block w-full md:w-auto"
            >
              {({ loading, error }) => (
                <Button 
                  type="button"
                  size="lg"
                  className="w-full md:w-auto bg-white border-primary text-primary hover:bg-primary/5" 
                  disabled={loading || !form.formState.isValid || isUploading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}