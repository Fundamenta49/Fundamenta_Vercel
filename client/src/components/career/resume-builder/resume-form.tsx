import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ResumeFormProps } from './types';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

// Form schemas for various sections
const personalInfoSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
});

const jobTitleSchema = z.object({
  jobTitle: z.string().optional(),
});

const experienceSchema = z.object({
  experience: z.array(z.object({
    company: z.string().min(1, { message: 'Company name is required' }),
    position: z.string().min(1, { message: 'Position is required' }),
    startDate: z.string().min(1, { message: 'Start date is required' }),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string().optional()).optional(),
  })),
});

const educationSchema = z.object({
  education: z.array(z.object({
    institution: z.string().min(1, { message: 'Institution name is required' }),
    degree: z.string().min(1, { message: 'Degree is required' }),
    field: z.string().optional(),
    startDate: z.string().min(1, { message: 'Start date is required' }),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
  })),
});

const skillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, { message: 'Skill name is required' }),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  })),
});

const certificationsSchema = z.object({
  certifications: z.array(z.object({
    name: z.string().min(1, { message: 'Certification name is required' }),
    issuer: z.string().optional(),
    date: z.string().optional(),
    expiryDate: z.string().optional(),
    neverExpires: z.boolean().optional(),
  })),
});

export default function ResumeForm({
  formData,
  setFormData,
  currentSection,
  setCurrentSection,
  onNextSection,
  onPrevSection,
}: ResumeFormProps) {
  // Set up form with schema based on current section
  const getFormSchema = () => {
    switch (currentSection) {
      case 'personal':
        return personalInfoSchema.merge(jobTitleSchema);
      case 'experience':
        return experienceSchema;
      case 'education':
        return educationSchema;
      case 'skills':
        return skillsSchema;
      case 'certifications':
        return certificationsSchema;
      default:
        return personalInfoSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: formData,
    mode: 'onChange',
  });

  // Handle submit for each section
  const onSubmit = (data: any) => {
    // Update form data with new values
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    
    // Move to next section
    onNextSection();
  };

  // Helper to add new item to arrays
  const addItem = (field: 'experience' | 'education' | 'skills' | 'certifications') => {
    const current = form.getValues(field) as any[];
    
    let newItem;
    switch (field) {
      case 'experience':
        newItem = {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: [''],
        };
        break;
      case 'education':
        newItem = {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        };
        break;
      case 'skills':
        newItem = {
          name: '',
          level: 'Intermediate',
        };
        break;
      case 'certifications':
        newItem = {
          name: '',
          issuer: '',
          date: '',
          expiryDate: '',
          neverExpires: false,
        };
        break;
    }
    
    // Update field with new empty item
    form.setValue(field, [...current, newItem]);
  };

  // Helper to remove item from arrays
  const removeItem = (field: 'experience' | 'education' | 'skills' | 'certifications', index: number) => {
    const current = form.getValues(field) as any[];
    
    // Don't remove if it's the only item
    if (current.length <= 1) return;
    
    // Update field without the removed item
    form.setValue(field, current.filter((_, i) => i !== index));
  };

  // Helper to add achievement to experience item
  const addAchievement = (index: number) => {
    const experiences = form.getValues('experience') as any[];
    
    // Clone the current achievements or create a new array
    const currentAchievements = [...(experiences[index].achievements || [])];
    
    // Add a new empty achievement
    experiences[index].achievements = [...currentAchievements, ''];
    
    // Update the form
    form.setValue('experience', experiences);
  };

  // Helper to remove achievement from experience item
  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const experiences = form.getValues('experience') as any[];
    
    // Remove the achievement
    experiences[expIndex].achievements = experiences[expIndex].achievements.filter(
      (_: any, i: number) => i !== achievementIndex
    );
    
    // Update the form
    form.setValue('experience', experiences);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        {currentSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personalInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
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
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="personalInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" type="email" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="personalInfo.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
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
                      <Input placeholder="https://yourwebsite.com" {...field} />
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
                      placeholder="Brief summary of your career and key qualifications..." 
                      className="h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Experience Section */}
        {currentSection === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => addItem('experience')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Position
              </Button>
            </div>
            <Separator />
            
            {form.watch('experience')?.map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                {form.watch('experience').length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => removeItem('experience', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
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
                        <FormLabel>Position *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Job Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end gap-2">
                    <div className={`flex-1 ${form.watch(`experience.${index}.current`) ? 'opacity-50' : ''}`}>
                      <FormField
                        control={form.control}
                        name={`experience.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM/YYYY" 
                                {...field} 
                                disabled={form.watch(`experience.${index}.current`)} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`experience.${index}.current`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 mb-1">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue(`experience.${index}.endDate`, '');
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Current Position</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of your role and responsibilities..." 
                          className="h-20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <FormLabel>Key Achievements</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addAchievement(index)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Achievement
                    </Button>
                  </div>
                  
                  {form.watch(`experience.${index}.achievements`)?.map((_, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.achievements.${achievementIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Increased revenue by 20% through implementation of new strategy" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {(form.watch(`experience.${index}.achievements`)?.length || 0) > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeAchievement(index, achievementIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevSection} 
            disabled={currentSection === 'personal'}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button type="submit">
            {currentSection === 'certifications' ? 'Complete' : 'Next'}
            {currentSection !== 'certifications' && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}