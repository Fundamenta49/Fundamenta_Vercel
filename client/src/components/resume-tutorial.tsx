import React from "react";

/**
 * Tutorial component for the resume builder
 * Provides step-by-step instructions on how to use the resume builder
 */
export function ResumeTutorial() {
  return (
    <div className="space-y-4 p-2">
      <h2 className="text-lg font-semibold text-blue-600 mb-3">How to Use the Resume Builder</h2>
      
      <p className="text-sm text-gray-700 mb-4">
        Welcome to our AI-powered Resume Builder! This tool helps you create professional, 
        job-winning resumes with ease. Follow these steps to get the most out of the builder.
      </p>

      <div className="space-y-4">
        <TutorialStep 
          number={1}
          title="Getting Started" 
          description="Choose one of these options to begin building your resume:"
          steps={[
            "Upload an existing resume (PDF, DOCX, or TXT) to import and enhance it",
            "Load our sample resume to see an example you can modify",
            "Start from scratch by manually entering your information"
          ]}
        />

        <TutorialStep 
          number={2}
          title="Edit Your Information" 
          description="Fill in or modify each section of your resume:"
          steps={[
            "Personal Details: Your name, email, and phone number",
            "Professional Summary: A brief overview of your experience and skills",
            "Work Experience: Your work history with achievements and responsibilities",
            "Education: Your academic background and qualifications",
            "Skills: Technical, professional, and soft skills relevant to your target roles",
            "Projects: Notable projects that showcase your abilities (optional)",
            "Certifications: Professional certifications you've earned (optional)"
          ]}
        />

        <TutorialStep 
          number={3}
          title="AI Enhancement Features" 
          description="Take advantage of our AI tools to improve your resume:"
          steps={[
            "AI Content Enhancement: Click the 'Enhance' button next to any section to improve the wording and impact",
            "Resume Analysis: See strengths, weaknesses, and suggestions based on AI analysis of your resume content",
            "Job Targeting: Enter a job description to optimize your resume for specific positions"
          ]}
        />

        <TutorialStep 
          number={4}
          title="Customize Appearance" 
          description="Make your resume visually appealing:"
          steps={[
            "Select a template style that matches your industry and preferences",
            "Preview your resume to see how it will look when downloaded",
            "Make adjustments to content and formatting as needed"
          ]}
        />

        <TutorialStep 
          number={5}
          title="Download & Use" 
          description="Finalize and use your professional resume:"
          steps={[
            "Click the 'Download PDF' button to generate a professionally formatted PDF file",
            "Save the file to your device with a descriptive name (e.g., 'John_Smith_Software_Developer_Resume.pdf')",
            "Use the downloaded file for job applications"
          ]}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 mt-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Pro Tips:</h3>
        <ul className="space-y-1.5">
          <li className="text-sm text-gray-700 flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <span>The Job Targeting tab is powerful for tailoring your resume to specific positions - use it to increase your chances of getting past ATS systems.</span>
          </li>
          <li className="text-sm text-gray-700 flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <span>For best results with the AI enhancement, provide detailed information about your roles and achievements.</span>
          </li>
          <li className="text-sm text-gray-700 flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <span>Use the Resume Guide and Checklist for additional tips and to ensure your resume meets professional standards.</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 rounded-md p-3 mt-2">
        <h3 className="text-sm font-medium text-blue-700 mb-1">Need More Help?</h3>
        <p className="text-xs text-gray-600">
          For additional assistance, check out our Resume Guide which offers detailed 
          advice on resume writing best practices, or use the Resume Checklist to ensure 
          your resume meets professional standards.
        </p>
      </div>
    </div>
  );
}

interface TutorialStepProps {
  number: number;
  title: string;
  description: string;
  steps: string[];
}

function TutorialStep({ number, title, description, steps }: TutorialStepProps) {
  return (
    <div className="pb-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-700 text-sm font-medium">{number}</span>
        </div>
        <h3 className="text-md font-medium text-gray-800">{title}</h3>
      </div>
      
      <div className="ml-10">
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <ul className="space-y-1.5">
          {steps.map((step, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResumeTutorial;