import { ArrowRight, FileText, UploadCloud, PanelLeft, WandSparkles, Download } from "lucide-react";

export function ResumeTutorial() {
  return (
    <div className="space-y-8 py-2">
      <div>
        <h2 className="text-xl font-semibold mb-2">How to Use the Resume Builder</h2>
        <p className="text-sm text-gray-600">
          Follow these steps to create a professional resume in minutes.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">1</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-blue-500" />
              Upload Your Existing Resume (Optional)
            </h3>
            <p className="text-sm text-gray-600">
              If you already have a resume, upload it to have our AI parse it automatically. We support PDF, DOCX, and TXT formats.
            </p>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 border border-blue-100">
              <strong>Pro tip:</strong> If you don't have a resume yet, you can start from scratch in the "Manual Entry" tab.
            </div>
          </div>
        </div>
        
        <div className="ml-4 pl-4 border-l-2 border-dashed border-gray-200">
          <ArrowRight className="h-4 w-4 text-gray-400 mb-1" />
        </div>
        
        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">2</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium flex items-center gap-2">
              <PanelLeft className="h-5 w-5 text-blue-500" />
              Fill In or Edit Your Information
            </h3>
            <p className="text-sm text-gray-600">
              Use the form to input your personal information, work experience, education, skills, projects, and certifications. Each section is designed to highlight the most important aspects of your professional background.
            </p>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 border border-blue-100">
              <strong>Pro tip:</strong> Use bullet points for your work experiences and start each point with action verbs like "Managed," "Developed," or "Achieved."
            </div>
          </div>
        </div>
        
        <div className="ml-4 pl-4 border-l-2 border-dashed border-gray-200">
          <ArrowRight className="h-4 w-4 text-gray-400 mb-1" />
        </div>
        
        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">3</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium flex items-center gap-2">
              <WandSparkles className="h-5 w-5 text-blue-500" />
              Enhance with AI
            </h3>
            <p className="text-sm text-gray-600">
              For each section, click the "Enhance" button to get AI-powered suggestions that improve your content. Our AI will help you use better phrasing, include relevant keywords, and make your achievements stand out.
            </p>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 border border-blue-100">
              <strong>Pro tip:</strong> You can choose to accept or reject each AI enhancement. Take what works for you and leave the rest.
            </div>
          </div>
        </div>
        
        <div className="ml-4 pl-4 border-l-2 border-dashed border-gray-200">
          <ArrowRight className="h-4 w-4 text-gray-400 mb-1" />
        </div>
        
        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">4</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Target for Specific Jobs
            </h3>
            <p className="text-sm text-gray-600">
              In the "Job Targeting" tab, enter a specific job title and/or paste a job description. Our AI will analyze the requirements and suggest optimizations to your resume that highlight the most relevant skills and experiences.
            </p>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 border border-blue-100">
              <strong>Pro tip:</strong> Always tailor your resume for each job application for the best results. This increases your chances of getting past applicant tracking systems (ATS).
            </div>
          </div>
        </div>
        
        <div className="ml-4 pl-4 border-l-2 border-dashed border-gray-200">
          <ArrowRight className="h-4 w-4 text-gray-400 mb-1" />
        </div>
        
        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">5</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-500" />
              Download Your Resume
            </h3>
            <p className="text-sm text-gray-600">
              When you're satisfied with your resume, select a template style and click "Download PDF" to get a professionally formatted resume ready for job applications.
            </p>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 border border-blue-100">
              <strong>Pro tip:</strong> Try different templates to see which one presents your information in the most appealing way for your industry.
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border mt-4">
        <h3 className="text-sm font-medium mb-2">Need More Help?</h3>
        <p className="text-xs text-gray-600">
          Check out the "Resume Guide" for best practices and the "Resume Checklist" to ensure your resume is complete and professional.
        </p>
      </div>
    </div>
  );
}