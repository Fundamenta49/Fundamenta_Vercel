// Resume analysis interface
export interface ResumeAnalysis {
  skills: string[];
  experienceLevel: string;
  improvementAreas: string[];
  strengths: string[];
  weaknesses: string[];
}

// Sample analysis to use as fallback
export const sampleAnalysis: ResumeAnalysis = {
  skills: ["JavaScript", "React", "TypeScript", "Node.js", "UI/UX Design", "Project Management"],
  experienceLevel: "Mid-level (3-5 years)",
  improvementAreas: [
    "Add more quantifiable achievements",
    "Improve summary to be more targeted",
    "Add more technical keywords relevant to job descriptions"
  ],
  strengths: [
    "Good technical skill variety",
    "Clear project descriptions",
    "Consistent formatting"
  ],
  weaknesses: [
    "Generic summary section",
    "Limited quantifiable results",
    "Some industry-specific keywords missing"
  ]
};

// Function to analyze a resume
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  try {
    // First try server-side analysis
    const response = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to analyze resume on server");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server analysis failed, using client-side fallback:", error);
    
    // Client-side fallback analysis
    return clientSideAnalysis(resumeText);
  }
};

// Basic client-side analysis as fallback
const clientSideAnalysis = (resumeText: string): ResumeAnalysis => {
  const text = resumeText.toLowerCase();
  
  // Extract potential skills from the resume text
  const skillsKeywords = [
    "javascript", "typescript", "react", "node", "html", "css", "sql", "python", 
    "java", "c#", ".net", "docker", "kubernetes", "aws", "azure", "gcp", 
    "project management", "agile", "scrum", "leadership", "communication", 
    "marketing", "sales", "customer service", "analytics", "data analysis"
  ];
  
  const extractedSkills = skillsKeywords.filter(skill => text.includes(skill));
  
  // Estimate experience level based on content
  let experienceLevel = "Entry-level";
  if (text.includes("senior") || text.includes("lead") || text.includes("manager")) {
    experienceLevel = "Senior-level (5+ years)";
  } else if (text.includes("years of experience") || text.includes("mid-level")) {
    experienceLevel = "Mid-level (3-5 years)";
  }
  
  // Basic improvement suggestions
  const improvementAreas = [];
  
  if (!text.includes("%") && !text.includes("increased") && !text.includes("reduced")) {
    improvementAreas.push("Add quantifiable achievements with metrics");
  }
  
  if (!text.includes("summary") && !text.includes("objective") && !text.includes("profile")) {
    improvementAreas.push("Add a professional summary");
  }
  
  if (extractedSkills.length < 5) {
    improvementAreas.push("Include more relevant skills");
  }
  
  // Very basic strength/weakness analysis
  const strengths = [];
  const weaknesses = [];
  
  if (extractedSkills.length > 5) {
    strengths.push("Good range of skills listed");
  } else {
    weaknesses.push("Limited skill set representation");
  }
  
  if (text.includes("leadership") || text.includes("managed") || text.includes("led")) {
    strengths.push("Leadership experience highlighted");
  }
  
  if (text.length < 500) {
    weaknesses.push("Resume appears short with limited detail");
  }
  
  if (text.includes("responsible for")) {
    weaknesses.push("Uses passive 'responsible for' phrasing instead of action verbs");
  }
  
  return {
    skills: extractedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    experienceLevel,
    improvementAreas: improvementAreas.length > 0 ? improvementAreas : ["Your resume looks good! Consider tailoring it for specific job applications."],
    strengths: strengths.length > 0 ? strengths : ["Consistent formatting", "Good structure"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Consider adding more keywords relevant to your target roles"]
  };
};