import React, { useState, useRef } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, FileText, Download, Trash, Plus, Lightbulb, RefreshCw, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

// Resume form schema
const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(6, "Phone number is required"),
    location: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    summary: z.string().max(500, "Summary should be at most 500 characters").optional(),
  }),
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution name is required"),
      degree: z.string().min(1, "Degree is required"),
      field: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().optional(),
    })
  ).optional(),
  experience: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().optional(),
      achievements: z.array(z.string()).optional(),
    })
  ).optional(),
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
    })
  ).optional(),
  certifications: z.array(
    z.object({
      name: z.string().min(1, "Certification name is required"),
      issuer: z.string().optional(),
      date: z.string().optional(),
      expiryDate: z.string().optional(),
      neverExpires: z.boolean().optional(),
    })
  ).optional(),
  jobTitle: z.string().optional(),
  targetCompany: z.string().optional(),
  industry: z.string().optional(),
});

type ResumeFormData = z.infer<typeof resumeSchema>;

// PDF Styles for resume
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 2,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 2,
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  dates: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    marginTop: 4,
  },
  skills: {
    fontSize: 10,
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    marginRight: 20,
    marginBottom: 5,
  },
  summary: {
    fontSize: 11,
    marginBottom: 15,
    lineHeight: 1.4,
  },
});

// PDF Document Component
const ResumePDF = ({ data }: { data: ResumeFormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.name}</Text>
        {data.jobTitle && (
          <Text style={styles.title}>{data.jobTitle}</Text>
        )}
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          {data.personalInfo.email && (
            <Text style={[styles.contactInfo, { marginRight: 15 }]}>
              {data.personalInfo.email}
            </Text>
          )}
          {data.personalInfo.phone && (
            <Text style={[styles.contactInfo, { marginRight: 15 }]}>
              {data.personalInfo.phone}
            </Text>
          )}
          {data.personalInfo.location && (
            <Text style={styles.contactInfo}>{data.personalInfo.location}</Text>
          )}
        </View>
        {data.personalInfo.website && (
          <Text style={styles.contactInfo}>{data.personalInfo.website}</Text>
        )}
      </View>

      {/* Summary Section */}
      {data.personalInfo.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experience.map((exp, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              <Text style={styles.dates}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  {exp.achievements.map((achievement, j) => (
                    <Text key={j} style={[styles.description, { marginLeft: 10 }]}>
                      • {achievement}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
              <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              <Text style={styles.dates}>
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </Text>
              {edu.description && (
                <Text style={styles.description}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {data.skills.map((skill, i) => (
              <View key={i} style={styles.skill}>
                <Text>
                  {skill.name}{skill.level ? ` (${skill.level})` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{cert.name}</Text>
              {cert.issuer && (
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
              )}
              {cert.date && (
                <Text style={styles.dates}>
                  Issued: {cert.date}
                  {!cert.neverExpires && cert.expiryDate && ` - Expires: ${cert.expiryDate}`}
                  {cert.neverExpires && ' (No Expiration)'}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default function ResumeBuilderFullscreen() {
  const [activeTab, setActiveTab] = useState("personal");
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeFormData | null>(null);
  const [optimizationTarget, setOptimizationTarget] = useState("");
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[] | null>(null);
  const { toast } = useToast();
  
  // Default form values
  const defaultValues: ResumeFormData = {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
    },
    experience: [{ 
      company: '', 
      position: '', 
      startDate: '', 
      endDate: '', 
      current: false, 
      description: '',
      achievements: ['']
    }],
    education: [{ 
      institution: '', 
      degree: '', 
      field: '', 
      startDate: '', 
      endDate: '', 
      current: false, 
      description: '' 
    }],
    skills: [{ name: '', level: 'Intermediate' }],
    certifications: [{ 
      name: '', 
      issuer: '', 
      date: '', 
      expiryDate: '', 
      neverExpires: false 
    }],
    jobTitle: '',
    targetCompany: '',
    industry: ''
  };

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
    mode: "onChange",
  });

  // Resume optimization mutation
  const optimizeMutation = useMutation({
    mutationFn: async (data: ResumeFormData) => {
      const response = await apiRequest("POST", "/api/resume/optimize", data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to optimize resume");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setOptimizationSuggestions(data.suggestions);
      toast({
        title: "Optimization Complete",
        description: "AI suggestions are ready for your review",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: error.message || "Failed to optimize resume. Please try again.",
      });
    }
  });

  // Function to add a new item to an array field
  const addItem = (fieldName: 'experience' | 'education' | 'skills' | 'certifications') => {
    const currentItems = form.getValues(fieldName) || [];
    
    switch(fieldName) {
      case 'experience': {
        const newItem = { company: '', position: '', startDate: '', endDate: '', current: false, description: '', achievements: [''] };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
      case 'education': {
        const newItem = { institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, description: '' };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
      case 'skills': {
        const newItem = { name: '', level: 'Intermediate' as const };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
      case 'certifications': {
        const newItem = { name: '', issuer: '', date: '', expiryDate: '', neverExpires: false };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
    }
  };
  
  // Function to remove an item from an array field
  const removeItem = (fieldName: 'experience' | 'education' | 'skills' | 'certifications', index: number) => {
    if (fieldName === 'experience') {
      const currentItems = form.getValues('experience') || [];
      form.setValue('experience', currentItems.filter((_, i) => i !== index));
    } else if (fieldName === 'education') {
      const currentItems = form.getValues('education') || [];
      form.setValue('education', currentItems.filter((_, i) => i !== index));
    } else if (fieldName === 'skills') {
      const currentItems = form.getValues('skills') || [];
      form.setValue('skills', currentItems.filter((_, i) => i !== index));
    } else if (fieldName === 'certifications') {
      const currentItems = form.getValues('certifications') || [];
      form.setValue('certifications', currentItems.filter((_, i) => i !== index));
    }
  };
  
  // Function to add an achievement to a specific work experience
  const addAchievement = (expIndex: number) => {
    const experiences = form.getValues('experience') || [];
    if (experiences[expIndex]) {
      const achievements = experiences[expIndex].achievements || [];
      experiences[expIndex].achievements = [...achievements, ''];
      form.setValue('experience', experiences);
    }
  };
  
  // Function to remove an achievement from a specific work experience
  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const experiences = form.getValues('experience') || [];
    if (experiences[expIndex] && experiences[expIndex].achievements) {
      experiences[expIndex].achievements = experiences[expIndex].achievements!.filter((_, i) => i !== achievementIndex);
      form.setValue('experience', experiences);
    }
  };

  // Handle form submission
  const onSubmit = (data: ResumeFormData) => {
    console.log('Form submitted:', data);
    setResumeData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Handle resume optimization
  const handleOptimize = () => {
    const currentData = form.getValues();
    currentData.jobTitle = optimizationTarget;
    optimizeMutation.mutate(currentData);
  };

  // Apply a suggestion to the form
  const applySuggestion = (suggestion: any) => {
    if (!suggestion.section || !suggestion.suggestion) return;
    
    switch (suggestion.section) {
      case 'summary':
        form.setValue('personalInfo.summary', suggestion.suggestion);
        break;
      case 'experience':
        // This is simplified - in a real implementation you'd need to identify which experience to update
        if (form.getValues('experience') && form.getValues('experience')!.length > 0) {
          const experiences = form.getValues('experience')!;
          experiences[0].description = suggestion.suggestion;
          form.setValue('experience', experiences);
        }
        break;
      case 'skills':
        // This would need a more sophisticated implementation in a real app
        toast({
          title: "Skill update suggested",
          description: suggestion.suggestion,
        });
        break;
      default:
        toast({
          title: "Suggestion received",
          description: suggestion.suggestion,
        });
    }
  };

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resume Builder</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create a professional resume to showcase your skills and experience
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit" : "Preview"}
          </Button>
          
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          {resumeData && (
            <PDFDownloadLink 
              document={<ResumePDF data={resumeData} />} 
              fileName={`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-white hover:bg-green-600 h-10 px-4 py-2"
            >
              {({ loading }) => 
                loading ? 
                'Generating PDF...' : 
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </div>
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>
      
      {saved && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-300">Resume Saved</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Your resume has been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      
      {previewMode ? (
        <div className="border rounded-lg p-8 bg-white dark:bg-gray-900 shadow-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {form.getValues("personalInfo.name") || "Your Name"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {form.getValues("jobTitle") || "Your Job Title"}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {form.getValues("personalInfo.email") && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {form.getValues("personalInfo.email")}
                </span>
              )}
              {form.getValues("personalInfo.phone") && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {form.getValues("personalInfo.phone")}
                </span>
              )}
              {form.getValues("personalInfo.location") && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {form.getValues("personalInfo.location")}
                </span>
              )}
            </div>
          </div>
          
          {form.getValues("personalInfo.summary") && (
            <div className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">Professional Summary</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {form.getValues("personalInfo.summary")}
              </p>
            </div>
          )}
          
          {form.getValues("experience") && form.getValues("experience")!.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">Work Experience</h2>
              {form.getValues("experience")!.map((exp, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-semibold">{exp.position}</h3>
                  <h4 className="text-md text-gray-600 dark:text-gray-400">{exp.company}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] !== '' && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium">Key Achievements:</h5>
                      <ul className="list-disc pl-5 mt-1">
                        {exp.achievements.map((achievement, j) => (
                          <li key={j} className="text-sm text-gray-700 dark:text-gray-300">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {form.getValues("education") && form.getValues("education")!.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">Education</h2>
              {form.getValues("education")!.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <h4 className="text-md text-gray-600 dark:text-gray-400">{edu.institution}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {form.getValues("skills") && form.getValues("skills")!.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.getValues("skills")!.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-sm">
                    {skill.name}{skill.level ? ` (${skill.level})` : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {form.getValues("certifications") && form.getValues("certifications")!.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">Certifications</h2>
              {form.getValues("certifications")!.map((cert, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-semibold">{cert.name}</h3>
                  {cert.issuer && (
                    <h4 className="text-md text-gray-600 dark:text-gray-400">{cert.issuer}</h4>
                  )}
                  {cert.date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Issued: {cert.date}
                      {!cert.neverExpires && cert.expiryDate && ` - Expires: ${cert.expiryDate}`}
                      {cert.neverExpires && ' (No Expiration)'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Build Your Resume</CardTitle>
                    <CardDescription>
                      Fill in the sections below to create your professional resume.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs 
                      value={activeTab} 
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-5 mb-8">
                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="certifications">Certifications</TabsTrigger>
                      </TabsList>
                      
                      {/* Personal Information Tab */}
                      <TabsContent value="personal" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="personalInfo.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name*</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g. Software Engineer" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="personalInfo.email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email*</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="personalInfo.phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone*</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="personalInfo.location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="City, State, Country" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="personalInfo.website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://example.com" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="personalInfo.summary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Summary</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="A brief summary of your professional background and goals."
                                  className="min-h-[120px]" 
                                />
                              </FormControl>
                              <FormDescription>
                                Keep it concise and focused on your most relevant qualifications.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      {/* Work Experience Tab */}
                      <TabsContent value="experience" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Work Experience</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addItem('experience')}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Experience
                          </Button>
                        </div>
                        
                        <Accordion type="multiple" className="w-full">
                          {form.getValues("experience")?.map((_, index) => (
                            <AccordionItem key={index} value={`experience-${index}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 text-left">
                                  <FileText className="h-4 w-4" />
                                  <span>
                                    {form.getValues(`experience.${index}.position`) || 
                                    form.getValues(`experience.${index}.company`) || 
                                    `Experience ${index + 1}`}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 p-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`experience.${index}.company`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Company*</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name={`experience.${index}.position`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Position*</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`experience.${index}.startDate`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Start Date*</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="MM/YYYY" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <div className="space-y-2">
                                      <FormField
                                        control={form.control}
                                        name={`experience.${index}.current`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                                            <FormControl>
                                              <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="h-4 w-4"
                                              />
                                            </FormControl>
                                            <FormLabel>I currently work here</FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                      
                                      {!form.getValues(`experience.${index}.current`) && (
                                        <FormField
                                          control={form.control}
                                          name={`experience.${index}.endDate`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>End Date</FormLabel>
                                              <FormControl>
                                                <Input {...field} placeholder="MM/YYYY" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name={`experience.${index}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Job Description</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            {...field} 
                                            placeholder="Describe your responsibilities and the scope of your role."
                                            className="min-h-[100px]" 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <FormLabel>Key Achievements</FormLabel>
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => addAchievement(index)}
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                      </Button>
                                    </div>
                                    
                                    {form.getValues(`experience.${index}.achievements`)?.map((_, achievementIndex) => (
                                      <div 
                                        key={achievementIndex} 
                                        className="flex items-center gap-2"
                                      >
                                        <FormField
                                          control={form.control}
                                          name={`experience.${index}.achievements.${achievementIndex}`}
                                          render={({ field }) => (
                                            <FormItem className="flex-1">
                                              <FormControl>
                                                <Input {...field} placeholder="Describe a specific achievement" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        
                                        <Button 
                                          type="button" 
                                          variant="ghost" 
                                          size="icon" 
                                          onClick={() => removeAchievement(index, achievementIndex)}
                                          className="h-8 w-8"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-end">
                                    <Button 
                                      type="button" 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => removeItem('experience', index)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Remove Experience
                                    </Button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                        
                        {(!form.getValues("experience") || form.getValues("experience")!.length === 0) && (
                          <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-900">
                            <p className="text-gray-500 dark:text-gray-400">
                              No work experience added yet.
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => addItem('experience')}
                              className="mt-4"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Experience
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Education Tab */}
                      <TabsContent value="education" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Education</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addItem('education')}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Education
                          </Button>
                        </div>
                        
                        <Accordion type="multiple" className="w-full">
                          {form.getValues("education")?.map((_, index) => (
                            <AccordionItem key={index} value={`education-${index}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 text-left">
                                  <FileText className="h-4 w-4" />
                                  <span>
                                    {form.getValues(`education.${index}.degree`) || 
                                    form.getValues(`education.${index}.institution`) || 
                                    `Education ${index + 1}`}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 p-2">
                                  <FormField
                                    control={form.control}
                                    name={`education.${index}.institution`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Institution*</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="University or School Name" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`education.${index}.degree`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Degree*</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="Bachelor of Science, High School Diploma, etc." />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name={`education.${index}.field`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Field of Study</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="Computer Science, Business, etc." />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`education.${index}.startDate`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Start Date*</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="MM/YYYY" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <div className="space-y-2">
                                      <FormField
                                        control={form.control}
                                        name={`education.${index}.current`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                                            <FormControl>
                                              <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="h-4 w-4"
                                              />
                                            </FormControl>
                                            <FormLabel>I'm currently studying here</FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                      
                                      {!form.getValues(`education.${index}.current`) && (
                                        <FormField
                                          control={form.control}
                                          name={`education.${index}.endDate`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>End Date</FormLabel>
                                              <FormControl>
                                                <Input {...field} placeholder="MM/YYYY" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name={`education.${index}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            {...field} 
                                            placeholder="Include relevant coursework, honors, activities, etc."
                                            className="min-h-[100px]" 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="flex justify-end">
                                    <Button 
                                      type="button" 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => removeItem('education', index)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Remove Education
                                    </Button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                        
                        {(!form.getValues("education") || form.getValues("education")!.length === 0) && (
                          <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-900">
                            <p className="text-gray-500 dark:text-gray-400">
                              No education added yet.
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => addItem('education')}
                              className="mt-4"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Education
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Skills Tab */}
                      <TabsContent value="skills" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Skills</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addItem('skills')}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Skill
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {form.getValues("skills")?.map((_, index) => (
                            <div 
                              key={index} 
                              className="flex flex-col md:flex-row md:items-end gap-4 border p-4 rounded-md"
                            >
                              <FormField
                                control={form.control}
                                name={`skills.${index}.name`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Skill Name*</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g., JavaScript, Project Management, Graphic Design" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeItem('skills', index)}
                                className="h-10 w-10 shrink-0 self-end"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {(!form.getValues("skills") || form.getValues("skills")!.length === 0) && (
                          <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-900">
                            <p className="text-gray-500 dark:text-gray-400">
                              No skills added yet.
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => addItem('skills')}
                              className="mt-4"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Skill
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Certifications Tab */}
                      <TabsContent value="certifications" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Certifications & Licenses</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addItem('certifications')}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Certification
                          </Button>
                        </div>
                        
                        <Accordion type="multiple" className="w-full">
                          {form.getValues("certifications")?.map((_, index) => (
                            <AccordionItem key={index} value={`certification-${index}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 text-left">
                                  <FileText className="h-4 w-4" />
                                  <span>
                                    {form.getValues(`certifications.${index}.name`) || 
                                    `Certification ${index + 1}`}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 p-2">
                                  <FormField
                                    control={form.control}
                                    name={`certifications.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Certification Name*</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name={`certifications.${index}.issuer`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Issuing Organization</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`certifications.${index}.date`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Issue Date</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="MM/YYYY" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <div className="space-y-2">
                                      <FormField
                                        control={form.control}
                                        name={`certifications.${index}.neverExpires`}
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                                            <FormControl>
                                              <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="h-4 w-4"
                                              />
                                            </FormControl>
                                            <FormLabel>No Expiration</FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                      
                                      {!form.getValues(`certifications.${index}.neverExpires`) && (
                                        <FormField
                                          control={form.control}
                                          name={`certifications.${index}.expiryDate`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Expiry Date</FormLabel>
                                              <FormControl>
                                                <Input {...field} placeholder="MM/YYYY" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end">
                                    <Button 
                                      type="button" 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => removeItem('certifications', index)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Remove Certification
                                    </Button>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                        
                        {(!form.getValues("certifications") || form.getValues("certifications")!.length === 0) && (
                          <div className="text-center p-8 border rounded-md bg-gray-50 dark:bg-gray-900">
                            <p className="text-gray-500 dark:text-gray-400">
                              No certifications added yet.
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => addItem('certifications')}
                              className="mt-4"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Certification
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Navigate between tabs
                        const tabs = ["personal", "experience", "education", "skills", "certifications"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1]);
                        }
                      }}
                      disabled={activeTab === "personal"}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Navigate between tabs
                          const tabs = ["personal", "experience", "education", "skills", "certifications"];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex < tabs.length - 1) {
                            setActiveTab(tabs[currentIndex + 1]);
                          }
                        }}
                        disabled={activeTab === "certifications"}
                      >
                        Next
                      </Button>
                      
                      <Button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Resume
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>

          {/* AI optimization panel */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Resume Optimizer
                </CardTitle>
                <CardDescription>
                  Get AI-powered suggestions to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Target Job Title</FormLabel>
                    <Input 
                      placeholder="e.g. Software Engineer, Marketing Manager" 
                      value={optimizationTarget}
                      onChange={(e) => setOptimizationTarget(e.target.value)}
                    />
                    <FormDescription>
                      Enter the job title you're targeting to get tailored suggestions
                    </FormDescription>
                  </FormItem>
                  
                  <Button 
                    onClick={handleOptimize}
                    disabled={optimizeMutation.isPending || !form.formState.isValid || !optimizationTarget}
                    className="w-full"
                  >
                    {optimizeMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Optimize Resume
                      </>
                    )}
                  </Button>
                </div>
                
                {optimizationSuggestions && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Suggestions</h3>
                    <ScrollArea className="h-96 pr-4">
                      {optimizationSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 border rounded-md mb-3 hover:bg-blue-50">
                          <div className="flex justify-between items-start">
                            <Badge className="mb-2 capitalize">
                              {suggestion.section}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => applySuggestion(suggestion)}
                            >
                              Apply
                            </Button>
                          </div>
                          <p className="text-sm">{suggestion.suggestion}</p>
                          {suggestion.reason && (
                            <p className="text-xs text-muted-foreground mt-1">Why: {suggestion.reason}</p>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}