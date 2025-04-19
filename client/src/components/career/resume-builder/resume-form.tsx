import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, 
  Trash, 
  ChevronRight, 
  ChevronDown, 
  ChevronsRight 
} from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

import { ResumeData, ResumeFormProps } from './types';

// Form validation schema
const resumeFormSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(6, "Phone number is required"),
    location: z.string().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    summary: z.string().max(500, "Summary should be at most 500 characters").optional().or(z.literal('')),
  }),
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution name is required"),
      degree: z.string().min(1, "Degree is required"),
      field: z.string().optional().or(z.literal('')),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional().or(z.literal('')),
      current: z.boolean().optional(),
      description: z.string().optional().or(z.literal('')),
    })
  ),
  experience: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional().or(z.literal('')),
      current: z.boolean().optional(),
      description: z.string().optional().or(z.literal('')),
      achievements: z.array(z.string()),
    })
  ),
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string().min(1, "Certification name is required"),
      issuer: z.string().optional().or(z.literal('')),
      date: z.string().optional().or(z.literal('')),
      expiryDate: z.string().optional().or(z.literal('')),
      neverExpires: z.boolean().optional(),
    })
  ),
  jobTitle: z.string().optional().or(z.literal('')),
  targetCompany: z.string().optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
});

export default function ResumeForm({ resumeData, onUpdateResumeData }: ResumeFormProps) {
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: resumeData,
    mode: "onChange",
  });
  
  // Add new item to array fields
  const addItem = (fieldName: 'experience' | 'education' | 'skills' | 'certifications') => {
    const currentItems = form.getValues(fieldName) || [];
    
    switch(fieldName) {
      case 'experience': {
        const newItem = { 
          company: '', 
          position: '', 
          startDate: '', 
          endDate: '', 
          current: false, 
          description: '', 
          achievements: [''] 
        };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
      case 'education': {
        const newItem = { 
          institution: '', 
          degree: '', 
          field: '', 
          startDate: '', 
          endDate: '', 
          current: false, 
          description: '' 
        };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
      case 'skills': {
        const newItem = { name: '', level: 'Intermediate' as const };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
      case 'certifications': {
        const newItem = { 
          name: '', 
          issuer: '', 
          date: '', 
          expiryDate: '', 
          neverExpires: false 
        };
        form.setValue(fieldName, [...currentItems, newItem]);
        break;
      }
    }
    
    // Update parent component
    onUpdateResumeData(form.getValues());
  };
  
  // Remove item from array fields
  const removeItem = (fieldName: 'experience' | 'education' | 'skills' | 'certifications', index: number) => {
    const currentItems = form.getValues(fieldName) || [];
    form.setValue(fieldName, currentItems.filter((_, i) => i !== index));
    
    // Update parent component
    onUpdateResumeData(form.getValues());
  };
  
  // Add achievement to experience
  const addAchievement = (expIndex: number) => {
    const experiences = form.getValues('experience') || [];
    if (experiences[expIndex]) {
      const achievements = experiences[expIndex].achievements || [];
      experiences[expIndex].achievements = [...achievements, ''];
      form.setValue('experience', experiences);
      
      // Update parent component
      onUpdateResumeData(form.getValues());
    }
  };
  
  // Remove achievement from experience
  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const experiences = form.getValues('experience') || [];
    if (experiences[expIndex] && experiences[expIndex].achievements) {
      experiences[expIndex].achievements = experiences[expIndex].achievements!.filter((_, i) => i !== achievementIndex);
      form.setValue('experience', experiences);
      
      // Update parent component
      onUpdateResumeData(form.getValues());
    }
  };
  
  // Save form data
  const onSubmit = (data: ResumeData) => {
    onUpdateResumeData(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => onUpdateResumeData(form.getValues())}>
        <Card className="mb-6">
          <TabsList className="w-full grid grid-cols-5 mb-0">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-4 mt-0">
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
                      Keep it concise and highlight your most relevant qualifications and career goals.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Technology, Healthcare" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Company (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="For optimization purposes" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            {/* Work Experience */}
            <TabsContent value="experience" className="space-y-6 mt-0">
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
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-6">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>I currently work here</FormLabel>
                                  </div>
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
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground mb-4">
                    No work experience added yet.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addItem('experience')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Education */}
            <TabsContent value="education" className="space-y-6 mt-0">
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
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-6">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>I'm currently studying here</FormLabel>
                                  </div>
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
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground mb-4">
                    No education added yet.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addItem('education')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Skills */}
            <TabsContent value="skills" className="space-y-6 mt-0">
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
                    className="flex flex-col sm:flex-row sm:items-end gap-4 border p-4 rounded-md"
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
                    
                    <FormField
                      control={form.control}
                      name={`skills.${index}.level`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-40">
                          <FormLabel>Proficiency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => removeItem('skills', index)}
                      className="h-10 w-10 shrink-0 self-end mt-2 sm:mt-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {(!form.getValues("skills") || form.getValues("skills")!.length === 0) && (
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground mb-4">
                    No skills added yet.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addItem('skills')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Certifications */}
            <TabsContent value="certifications" className="space-y-6 mt-0">
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
                                <Input {...field} placeholder="e.g. Microsoft, AWS, CompTIA" />
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
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-6">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>No Expiration</FormLabel>
                                  </div>
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
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground mb-4">
                    No certifications added yet.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addItem('certifications')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              )}
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                // Reset form to default values
                form.reset(defaultResumeData);
                onUpdateResumeData(defaultResumeData);
              }}
            >
              Reset
            </Button>
            
            <Button type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}