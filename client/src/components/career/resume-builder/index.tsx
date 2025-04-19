import React, { useState } from 'react';
import { FileText, Eye, Download, Save, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import ResumeForm from './resume-form';
import ResumePreview from './resume-preview';
import ResumeOptimizer from './resume-optimizer';
import ResumePDF from './resume-pdf';
import { useToast } from '@/hooks/use-toast';

import { ResumeData } from './types';

// Default resume data
const defaultResumeData: ResumeData = {
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

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('edit');
  const [optimizationTarget, setOptimizationTarget] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const { toast } = useToast();

  // Handle form data updates
  const handleUpdateResumeData = (newData: ResumeData) => {
    setResumeData(newData);
  };

  // Mock save function - would connect to backend in production
  const handleSaveResume = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveConfirmed(true);
      
      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully",
      });
      
      // Clear confirmation after a delay
      setTimeout(() => setSaveConfirmed(false), 3000);
    }, 1000);
  };

  // Mock optimization function - would use AI API in production
  const handleOptimizeResume = async (targetJobTitle: string) => {
    if (!targetJobTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a job title for optimization",
      });
      return;
    }
    
    setIsOptimizing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Resume Optimized",
        description: `Your resume has been optimized for ${targetJobTitle} positions`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resume Builder</h2>
          <p className="text-muted-foreground">
            Create a professional resume to showcase your skills and experience
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          
          <Button
            onClick={handleSaveResume}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
          
          {resumeData.personalInfo.name && (
            <PDFDownloadLink
              document={<ResumePDF data={resumeData} />}
              fileName={`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
            >
              {({ loading }) =>
                loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>
      
      {saveConfirmed && (
        <Alert variant="success">
          <AlertTitle>Resume Saved</AlertTitle>
          <AlertDescription>
            Your resume has been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      
      {previewMode ? (
        <ResumePreview resumeData={resumeData} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="w-full">
              <ResumeForm 
                resumeData={resumeData} 
                onUpdateResumeData={handleUpdateResumeData} 
              />
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <ResumeOptimizer
              optimizationTarget={optimizationTarget}
              setOptimizationTarget={setOptimizationTarget}
              onOptimize={() => handleOptimizeResume(optimizationTarget)}
              isOptimizing={isOptimizing}
            />
          </div>
        </div>
      )}
    </div>
  );
}