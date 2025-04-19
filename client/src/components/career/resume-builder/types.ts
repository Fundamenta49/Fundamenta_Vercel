// Resume form data types
export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  field?: string;
  description?: string;
}

export interface Skill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
  expiryDate?: string;
  neverExpires?: boolean;
}

export interface PersonalInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  summary?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  jobTitle?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
}

// Component props types
export interface ResumeFormProps {
  formData: ResumeData;
  setFormData: (data: ResumeData) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
}

export interface ResumePreviewProps {
  data: ResumeData;
}

export interface ResumePDFProps {
  data: ResumeData;
}

export interface ResumeOptimizerProps {
  optimizationTarget: string;
  setOptimizationTarget: (target: string) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export interface OptimizationSuggestion {
  section: string;
  suggestion: string;
  reason?: string;
}

// Default resume data for initial state
export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  jobTitle: '',
  experience: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    },
  ],
  education: [
    {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  skills: [
    {
      name: '',
      level: 'Intermediate',
    },
  ],
  certifications: [
    {
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      neverExpires: false,
    },
  ],
};