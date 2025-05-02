export type ProfessionalResourceCategory = 
  'general' | 
  'health' | 
  'mental_health' | 
  'finance' | 
  'legal' | 
  'career' | 
  'education';

export interface ProfessionalResource {
  title: string;
  description: string;
  link?: string;
  externalLink?: string;
}

export const professionalResources: Record<ProfessionalResourceCategory, ProfessionalResource[]> = {
  general: [
    {
      title: "Finding the Right Professional",
      description: "General guidance on how to research, evaluate, and select qualified professionals in any field.",
      link: "/resources/finding-professionals"
    },
    {
      title: "Questions to Ask Before Hiring",
      description: "Important questions to ask when vetting any professional service provider.",
      link: "/resources/professional-questions"
    }
  ],
  
  health: [
    {
      title: "Finding a Primary Care Physician",
      description: "How to find a qualified doctor who meets your healthcare needs.",
      link: "/resources/finding-healthcare-providers"
    },
    {
      title: "Evaluating Medical Information",
      description: "How to assess the credibility of health information and research.",
      link: "/resources/evaluating-medical-information"
    },
    {
      title: "U.S. Department of Health & Human Services",
      description: "Official U.S. government health information and resources.",
      externalLink: "https://www.hhs.gov/health/index.html"
    }
  ],
  
  mental_health: [
    {
      title: "Finding a Therapist",
      description: "How to find and select a mental health professional who's right for you.",
      link: "/resources/finding-therapist"
    },
    {
      title: "Types of Mental Health Professionals",
      description: "Understanding the differences between psychiatrists, psychologists, counselors, and other providers.",
      link: "/resources/mental-health-providers"
    },
    {
      title: "American Psychological Association",
      description: "Find a psychologist referral service.",
      externalLink: "https://locator.apa.org/"
    },
    {
      title: "National Alliance on Mental Illness (NAMI)",
      description: "Support and education for individuals affected by mental illness.",
      externalLink: "https://www.nami.org/help"
    }
  ],
  
  finance: [
    {
      title: "Finding a Financial Advisor",
      description: "How to find a certified financial planner or advisor for your financial needs.",
      link: "/resources/finding-financial-advisors"
    },
    {
      title: "Understanding Financial Credentials",
      description: "Learn about different financial certifications and what they mean.",
      link: "/resources/financial-credentials"
    },
    {
      title: "Certified Financial Planner Board",
      description: "Verify a financial planner's credentials and find certified professionals.",
      externalLink: "https://www.cfp.net/find-a-cfp-professional"
    },
    {
      title: "Consumer Financial Protection Bureau",
      description: "Government agency providing information and tools for financial decisions.",
      externalLink: "https://www.consumerfinance.gov/"
    }
  ],
  
  legal: [
    {
      title: "Finding a Lawyer",
      description: "How to find and select the right lawyer for your legal needs.",
      link: "/resources/finding-attorney"
    },
    {
      title: "Legal Aid Resources",
      description: "Resources for finding free or low-cost legal assistance if you qualify.",
      link: "/resources/legal-aid"
    },
    {
      title: "American Bar Association",
      description: "Find legal resources and lawyer referral services.",
      externalLink: "https://www.americanbar.org/groups/legal_services/flh-home/"
    },
    {
      title: "Legal Services Corporation",
      description: "Find legal aid offices for those who cannot afford legal assistance.",
      externalLink: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help"
    }
  ],
  
  career: [
    {
      title: "Finding a Career Counselor",
      description: "How to find professional guidance for career development and job searching.",
      link: "/resources/career-counseling"
    },
    {
      title: "Professional Certification Guide",
      description: "Understanding industry certifications and their value.",
      link: "/resources/professional-certifications"
    },
    {
      title: "National Career Development Association",
      description: "Find a career development professional.",
      externalLink: "https://www.ncda.org/aws/NCDA/pt/sp/consumer_find"
    }
  ],
  
  education: [
    {
      title: "Finding an Educational Consultant",
      description: "How to find professionals who can help with educational planning and decisions.",
      link: "/resources/educational-consultants"
    },
    {
      title: "Evaluating Educational Programs",
      description: "How to assess the quality and accreditation of educational institutions.",
      link: "/resources/evaluating-education"
    },
    {
      title: "Independent Educational Consultants Association",
      description: "Find qualified educational consultants.",
      externalLink: "https://www.iecaonline.com/find-an-iec/"
    }
  ]
};