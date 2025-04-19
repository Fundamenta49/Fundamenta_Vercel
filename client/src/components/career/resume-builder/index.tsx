import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown, Download, Save, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import components
import ResumeForm from './resume-form';
import ResumePreview from './resume-preview';
import ResumeOptimizer from './resume-optimizer';
import ResumePDF from './resume-pdf';

// Import types
import { ResumeData, defaultResumeData } from './types';

export default function ResumeBuilder() {
  // State for resume data
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [currentSection, setCurrentSection] = useState('personal');
  const [activeTab, setActiveTab] = useState('edit');
  const [optimizationTarget, setOptimizationTarget] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Handle form navigation
  const handleNextSection = () => {
    switch (currentSection) {
      case 'personal':
        setCurrentSection('experience');
        break;
      case 'experience':
        setCurrentSection('education');
        break;
      case 'education':
        setCurrentSection('skills');
        break;
      case 'skills':
        setCurrentSection('certifications');
        break;
      case 'certifications':
        // Last section, show preview
        setActiveTab('preview');
        break;
      default:
        break;
    }
  };

  const handlePrevSection = () => {
    switch (currentSection) {
      case 'experience':
        setCurrentSection('personal');
        break;
      case 'education':
        setCurrentSection('experience');
        break;
      case 'skills':
        setCurrentSection('education');
        break;
      case 'certifications':
        setCurrentSection('skills');
        break;
      default:
        break;
    }
  };

  // Handle resume optimization
  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Resume optimized",
        description: `Your resume has been optimized for ${optimizationTarget} roles.`,
        variant: "success",
      });
    }, 2000);
  };

  // Handle resume save
  const handleSaveResume = () => {
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      
      // Store in localStorage
      try {
        localStorage.setItem('savedResume', JSON.stringify(resumeData));
        toast({
          title: "Resume saved",
          description: "Your resume has been saved successfully.",
        });
      } catch (error) {
        toast({
          title: "Error saving resume",
          description: "There was an error saving your resume. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Resume Builder</h2>
          <p className="text-muted-foreground">
            Create a professional resume in minutes
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveResume}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          
          {activeTab === 'preview' && (
            <PDFDownloadLink 
              document={<ResumePDF data={resumeData} />}
              fileName={`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {({ loading }) => 
                loading ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <ResumeForm 
                formData={resumeData}
                setFormData={setResumeData}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                onNextSection={handleNextSection}
                onPrevSection={handlePrevSection}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <ResumePreview data={resumeData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimize" className="space-y-4 pt-4">
          <ResumeOptimizer 
            optimizationTarget={optimizationTarget}
            setOptimizationTarget={setOptimizationTarget}
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}