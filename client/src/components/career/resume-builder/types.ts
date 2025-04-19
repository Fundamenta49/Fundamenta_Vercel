// Resume Builder Types

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  neverExpires: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  jobTitle: string;
  targetCompany: string;
  industry: string;
}

export interface OptimizationSuggestion {
  section: 'summary' | 'experience' | 'skills' | 'education' | 'overall';
  suggestion: string;
  reason: string;
}

export interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
}

export interface ResumePreviewProps {
  resumeData: ResumeData;
}

export interface ResumeOptimizerProps {
  optimizationTarget: string;
  setOptimizationTarget: (target: string) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export interface ResumePDFProps {
  data: ResumeData;
}